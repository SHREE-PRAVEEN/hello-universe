use hmac::{Hmac, Mac};
use serde::Deserialize;
use serde_json::Value;
use sha2::Sha512;

use crate::config::Config;
use crate::models::{NowPaymentsCreateRequest, NowPaymentsCreateResponse};

type HmacSha512 = Hmac<Sha512>;

/// Fetches the current USDT price in INR from CoinGecko's public API
/// (no key required). USDT trades close to $1, but not exactly, so we
/// still look it up rather than assuming parity.
pub async fn fetch_usdt_inr_rate(client: &reqwest::Client) -> anyhow::Result<f64> {
    #[derive(Deserialize)]
    struct CoinGeckoResponse {
        tether: CoinGeckoInr,
    }
    #[derive(Deserialize)]
    struct CoinGeckoInr {
        inr: f64,
    }

    let resp: CoinGeckoResponse = client
        .get("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=inr")
        .send()
        .await?
        .error_for_status()?
        .json()
        .await?;

    Ok(resp.tether.inr)
}

/// Converts an INR price to a USDT amount, adding a small unique fractional
/// "nonce" (derived from the order id) so concurrent self-hosted-wallet
/// orders can be told apart on-chain by amount alone, since a single shared
/// wallet address has no per-order memo field on Tron/USDT-TRC20.
pub fn usdt_amount_with_nonce(price_inr: rust_decimal::Decimal, usdt_inr_rate: f64, nonce_source: &uuid::Uuid) -> f64 {
    let base = price_inr
        .to_string()
        .parse::<f64>()
        .unwrap_or(0.0)
        / usdt_inr_rate;

    // Use a few bytes of the order UUID to derive a stable 4-decimal nonce
    // in [0.0001, 0.0999], so the amount is unique per order without
    // meaningfully changing the price paid.
    let bytes = nonce_source.as_bytes();
    let nonce_units = 1 + (u16::from(bytes[0]) + u16::from(bytes[1])) % 99;
    let nonce = (nonce_units as f64) / 10_000.0;

    ((base + nonce) * 1_000_000.0).round() / 1_000_000.0
}

// ---------- NOWPayments gateway ----------

pub async fn nowpayments_create_payment(
    client: &reqwest::Client,
    config: &Config,
    price_amount_inr: f64,
    order_id: &str,
) -> anyhow::Result<NowPaymentsCreateResponse> {
    let body = NowPaymentsCreateRequest {
        price_amount: price_amount_inr,
        price_currency: "inr".to_string(),
        pay_currency: "usdttrc20".to_string(),
        order_id: order_id.to_string(),
        ipn_callback_url: format!("{}/api/payments/nowpayments/webhook", config.backend_public_url),
    };

    let resp = client
        .post(format!("{}/payment", config.nowpayments_base_url))
        .header("x-api-key", &config.nowpayments_api_key)
        .json(&body)
        .send()
        .await?;

    if !resp.status().is_success() {
        let status = resp.status();
        let text = resp.text().await.unwrap_or_default();
        anyhow::bail!("NOWPayments create payment failed ({status}): {text}");
    }

    Ok(resp.json().await?)
}

/// Verifies the `x-nowpayments-sig` header: HMAC-SHA512 of the JSON body
/// with keys sorted alphabetically, keyed with the IPN secret.
/// See https://documenter.getpostman.com/view/7907941/S1a32n38 (IPN section).
pub fn verify_nowpayments_signature(ipn_secret: &str, raw_body: &[u8], signature_hex: &str) -> bool {
    let Ok(value) = serde_json::from_slice::<Value>(raw_body) else {
        return false;
    };
    let sorted = sort_json_keys(&value);
    let Ok(canonical) = serde_json::to_string(&sorted) else {
        return false;
    };

    let Ok(mut mac) = HmacSha512::new_from_slice(ipn_secret.as_bytes()) else {
        return false;
    };
    mac.update(canonical.as_bytes());
    let expected = hex::encode(mac.finalize().into_bytes());

    expected.eq_ignore_ascii_case(signature_hex)
}

fn sort_json_keys(value: &Value) -> Value {
    match value {
        Value::Object(map) => {
            let mut sorted = serde_json::Map::new();
            let mut keys: Vec<&String> = map.keys().collect();
            keys.sort();
            for k in keys {
                sorted.insert(k.clone(), sort_json_keys(&map[k]));
            }
            Value::Object(sorted)
        }
        Value::Array(arr) => Value::Array(arr.iter().map(sort_json_keys).collect()),
        other => other.clone(),
    }
}

// ---------- Self-hosted USDT-TRC20 (direct on-chain verification) ----------

#[derive(Debug, Deserialize)]
struct TronGridTrc20Response {
    #[serde(default)]
    data: Vec<TronGridTransfer>,
}

#[derive(Debug, Deserialize)]
struct TronGridTransfer {
    transaction_id: String,
    to: String,
    value: String, // smallest unit, as a string
    block_timestamp: i64, // ms since epoch
    token_info: TronGridTokenInfo,
}

#[derive(Debug, Deserialize)]
struct TronGridTokenInfo {
    decimals: u32,
}

/// Polls TronGrid for incoming USDT-TRC20 transfers to our wallet and looks
/// for one matching `expected_amount` (within a small tolerance, since exact
/// float equality is unreliable) that landed after `since_unix_ms`.
/// Returns the matching transaction hash if found.
pub async fn find_matching_trc20_payment(
    client: &reqwest::Client,
    config: &Config,
    expected_amount: f64,
    since_unix_ms: i64,
) -> anyhow::Result<Option<String>> {
    if config.usdt_trc20_wallet_address.is_empty() {
        return Ok(None);
    }

    let url = format!(
        "{}/v1/accounts/{}/transactions/trc20",
        config.trongrid_base_url, config.usdt_trc20_wallet_address
    );

    let mut req = client.get(&url).query(&[
        ("contract_address", config.usdt_trc20_contract_address.as_str()),
        ("only_to", "true"),
        ("limit", "50"),
        ("order_by", "block_timestamp,desc"),
    ]);

    if !config.trongrid_api_key.is_empty() {
        req = req.header("TRON-PRO-API-KEY", &config.trongrid_api_key);
    }

    let resp: TronGridTrc20Response = req.send().await?.error_for_status()?.json().await?;

    const TOLERANCE: f64 = 0.0005; // USDT

    for tx in resp.data {
        if tx.block_timestamp < since_unix_ms {
            continue;
        }
        if !tx.to.eq_ignore_ascii_case(&config.usdt_trc20_wallet_address) {
            continue;
        }
        let divisor = 10f64.powi(tx.token_info.decimals as i32);
        let Ok(raw) = tx.value.parse::<f64>() else { continue };
        let amount = raw / divisor;

        if (amount - expected_amount).abs() <= TOLERANCE {
            return Ok(Some(tx.transaction_id));
        }
    }

    Ok(None)
}
