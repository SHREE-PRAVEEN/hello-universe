use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use sqlx::postgres::PgRow;
use sqlx::{FromRow, Row};
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
}

impl FromRow<'_, PgRow> for User {
    fn from_row(row: &PgRow) -> Result<Self, sqlx::Error> {
        Ok(Self {
            id: row.try_get("id")?,
            name: row.try_get("name")?,
            email: row.try_get("email")?,
            password_hash: row.try_get("password_hash")?,
            created_at: row.try_get("created_at")?,
        })
    }
}

#[derive(Debug, Deserialize)]
pub struct SignupRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: PublicUser,
}

#[derive(Debug, Serialize)]
pub struct PublicUser {
    pub id: Uuid,
    pub name: String,
    pub email: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct Product {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub category: String,
    pub description: String,
    pub price_inr: Decimal,
    pub is_digital: bool,
    pub download_url: Option<String>,
    pub image_url: Option<String>,
    pub active: bool,
    pub created_at: DateTime<Utc>,
}

impl FromRow<'_, PgRow> for Product {
    fn from_row(row: &PgRow) -> Result<Self, sqlx::Error> {
        Ok(Self {
            id: row.try_get("id")?,
            name: row.try_get("name")?,
            slug: row.try_get("slug")?,
            category: row.try_get("category")?,
            description: row.try_get("description")?,
            price_inr: row.try_get("price_inr")?,
            is_digital: row.try_get("is_digital")?,
            download_url: row.try_get("download_url")?,
            image_url: row.try_get("image_url")?,
            active: row.try_get("active")?,
            created_at: row.try_get("created_at")?,
        })
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateOrderRequest {
    pub product_id: Uuid,
    pub payment_method: PaymentMethod,
}

#[derive(Debug, Deserialize, Serialize, Clone, Copy, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum PaymentMethod {
    Payu,
    Nowpayments,
    UsdtTrc20,
}

impl PaymentMethod {
    pub fn as_str(&self) -> &'static str {
        match self {
            PaymentMethod::Payu => "payu",
            PaymentMethod::Nowpayments => "nowpayments",
            PaymentMethod::UsdtTrc20 => "usdt_trc20",
        }
    }
}

#[derive(Debug, Serialize)]
pub struct Order {
    pub id: Uuid,
    pub user_id: Uuid,
    pub product_id: Uuid,
    pub amount_inr: Decimal,
    pub status: String,
    pub delivered: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,

    pub payment_method: String,

    pub payu_txnid: Option<String>,
    pub payu_mihpayid: Option<String>,

    pub gateway_payment_id: Option<String>,
    pub gateway_pay_address: Option<String>,
    pub gateway_pay_currency: Option<String>,
    pub gateway_pay_amount: Option<Decimal>,

    pub crypto_pay_address: Option<String>,
    pub crypto_expected_amount: Option<Decimal>,
    pub crypto_tx_hash: Option<String>,
}

impl FromRow<'_, PgRow> for Order {
    fn from_row(row: &PgRow) -> Result<Self, sqlx::Error> {
        Ok(Self {
            id: row.try_get("id")?,
            user_id: row.try_get("user_id")?,
            product_id: row.try_get("product_id")?,
            amount_inr: row.try_get("amount_inr")?,
            status: row.try_get("status")?,
            delivered: row.try_get("delivered")?,
            created_at: row.try_get("created_at")?,
            updated_at: row.try_get("updated_at")?,
            payment_method: row.try_get("payment_method")?,
            payu_txnid: row.try_get("payu_txnid")?,
            payu_mihpayid: row.try_get("payu_mihpayid")?,
            gateway_payment_id: row.try_get("gateway_payment_id")?,
            gateway_pay_address: row.try_get("gateway_pay_address")?,
            gateway_pay_currency: row.try_get("gateway_pay_currency")?,
            gateway_pay_amount: row.try_get("gateway_pay_amount")?,
            crypto_pay_address: row.try_get("crypto_pay_address")?,
            crypto_expected_amount: row.try_get("crypto_expected_amount")?,
            crypto_tx_hash: row.try_get("crypto_tx_hash")?,
        })
    }
}

/// What we hand back to the frontend right after creating an order —
/// shape differs by payment method, so most fields are optional.
#[derive(Debug, Serialize)]
pub struct CreateOrderResponse {
    pub order_id: Uuid,
    pub payment_method: PaymentMethod,

    /// Present when payment_method == payu
    pub payu: Option<PayUPaymentParams>,

    /// Present when payment_method == nowpayments or usdt_trc20
    pub crypto: Option<CryptoPaymentInfo>,
}

#[derive(Debug, Serialize)]
pub struct CryptoPaymentInfo {
    pub pay_address: String,
    pub pay_amount: String,
    pub pay_currency: String,
    /// For self-hosted USDT-TRC20 only: how long the quoted amount stays valid.
    pub expires_in_seconds: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct PayUPaymentParams {
    pub key: String,
    pub txnid: String,
    pub amount: String,
    pub productinfo: String,
    pub firstname: String,
    pub email: String,
    pub phone: String,
    pub surl: String,
    pub furl: String,
    pub hash: String,
    pub action_url: String,
}

/// Fields PayU posts back on success/failure callback (subset).
#[derive(Debug, Deserialize)]
pub struct PayUCallback {
    pub txnid: String,
    pub status: String,
    pub amount: String,
    pub productinfo: String,
    pub firstname: String,
    pub email: String,
    pub mihpayid: Option<String>,
    pub hash: String,
}

// ---------- NOWPayments (crypto gateway) ----------

#[derive(Debug, Serialize)]
pub struct NowPaymentsCreateRequest {
    pub price_amount: f64,
    pub price_currency: String,
    pub pay_currency: String,
    pub order_id: String,
    pub ipn_callback_url: String,
}

#[derive(Debug, Deserialize)]
pub struct NowPaymentsCreateResponse {
    pub payment_id: String,
    pub pay_address: String,
    pub pay_amount: f64,
    pub pay_currency: String,
    #[serde(default)]
    pub payment_status: Option<String>,
}

/// NOWPayments IPN (instant payment notification) webhook body.
/// `payment_status` moves: waiting -> confirming -> confirmed -> finished
/// (or -> failed / expired / refunded). We treat `finished` and `confirmed`
/// as paid.
#[derive(Debug, Deserialize)]
pub struct NowPaymentsIpn {
    pub payment_id: u64,
    pub payment_status: String,
    pub order_id: String,
    pub pay_address: String,
    pub pay_amount: f64,
    pub pay_currency: String,
}
