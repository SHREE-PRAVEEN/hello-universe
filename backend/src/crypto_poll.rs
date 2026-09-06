use std::time::Duration;

use crate::crypto;
use crate::handlers::deliver_product;
use crate::models::Order;
use crate::AppState;

const ORDER_COLUMNS: &str = "id, user_id, product_id, amount_inr, status, delivered, created_at, updated_at,
     payment_method, payu_txnid, payu_mihpayid,
     gateway_payment_id, gateway_pay_address, gateway_pay_currency, gateway_pay_amount,
     crypto_pay_address, crypto_expected_amount, crypto_tx_hash";

/// Runs forever, checking pending self-hosted USDT-TRC20 orders every 20s.
/// Orders older than 1 hour are marked failed (the quoted amount/rate is stale).
pub async fn run(state: AppState) {
    let mut interval = tokio::time::interval(Duration::from_secs(20));
    loop {
        interval.tick().await;

        let pending: Result<Vec<Order>, _> = sqlx::query_as(&format!(
            "SELECT {ORDER_COLUMNS} FROM orders
             WHERE payment_method = 'usdt_trc20' AND status = 'pending'
             AND created_at > now() - interval '1 hour'"
        ))
        .fetch_all(&state.db)
        .await;

        match pending {
            Ok(orders) => {
                for order in orders {
                    check_single_order(&state, &order).await;
                }
            }
            Err(e) => tracing::error!("crypto poller: failed to load pending orders: {}", e),
        }

        // Expire stale pending USDT-TRC20 orders so the amount quote can't be
        // reused indefinitely (USDT/INR rate drifts over time).
        let _ = sqlx::query(
            "UPDATE orders SET status = 'failed', updated_at = now()
             WHERE payment_method = 'usdt_trc20' AND status = 'pending'
             AND created_at <= now() - interval '1 hour'",
        )
        .execute(&state.db)
        .await;
    }
}

/// Checks a single pending USDT-TRC20 order against TronGrid and, if a
/// matching on-chain transfer is found, marks it paid and delivers the
/// product. Safe to call concurrently — the UPDATE only affects rows still
/// `pending`, so a race between the poller and a manual check is harmless.
pub async fn check_single_order(state: &AppState, order: &Order) {
    let Some(expected) = order.crypto_expected_amount else { return };
    let Ok(expected_f64) = expected.to_string().parse::<f64>() else { return };

    let since_unix_ms = order.created_at.timestamp_millis() - 5 * 60 * 1000; // 5 min slack

    match crypto::find_matching_trc20_payment(&state.http, &state.config, expected_f64, since_unix_ms).await {
        Ok(Some(tx_hash)) => {
            let updated: Option<(uuid::Uuid, uuid::Uuid, uuid::Uuid)> = sqlx::query_as(
                r#"UPDATE orders SET status = 'success', crypto_tx_hash = $1, updated_at = now()
                   WHERE id = $2 AND status = 'pending'
                   RETURNING id, user_id, product_id"#,
            )
            .bind(&tx_hash)
            .bind(order.id)
            .fetch_optional(&state.db)
            .await
            .unwrap_or(None);

            if let Some((order_id, user_id, product_id)) = updated {
                deliver_product(state, order_id, user_id, product_id).await;
            }
        }
        Ok(None) => {}
        Err(e) => tracing::warn!("TronGrid check failed for order {}: {}", order.id, e),
    }
}
