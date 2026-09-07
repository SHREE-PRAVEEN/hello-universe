use axum::{
    extract::{Path, State},
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Json, Redirect},
    Extension,
};
use uuid::Uuid;

use crate::auth::{self, Claims};
use crate::crypto;
use crate::email;
use crate::models::*;
use crate::payu;
use crate::AppState;

pub async fn health(State(state): State<AppState>) -> Result<&'static str, StatusCode> {
    sqlx::query("SELECT 1")
        .execute(&state.db)
        .await
        .map(|_| "ok")
        .map_err(|error| {
            tracing::error!("database health check failed: {}", error);
            StatusCode::SERVICE_UNAVAILABLE
        })
}

// ---------- AUTH ----------

pub async fn signup(
    State(state): State<AppState>,
    Json(payload): Json<SignupRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if payload.password.len() < 8 {
        return Err((StatusCode::BAD_REQUEST, "Password must be at least 8 characters".into()));
    }

    let existing: Option<Uuid> = sqlx::query_scalar("SELECT id FROM users WHERE email = $1")
        .bind(&payload.email)
        .fetch_optional(&state.db)
        .await
        .map_err(internal_err)?;

    if existing.is_some() {
        return Err((StatusCode::CONFLICT, "Email already registered".into()));
    }

    let hash = auth::hash_password(&payload.password).map_err(internal_err)?;

    let user: User = sqlx::query_as(
        r#"INSERT INTO users (name, email, password_hash)
           VALUES ($1, $2, $3)
           RETURNING id, name, email, password_hash, created_at"#,
    )
    .bind(&payload.name)
    .bind(&payload.email)
    .bind(&hash)
    .fetch_one(&state.db)
    .await
    .map_err(internal_err)?;

    let token = auth::create_token(user.id, &user.email, &state.config.jwt_secret).map_err(internal_err)?;

    Ok(Json(AuthResponse {
        token,
        user: PublicUser { id: user.id, name: user.name, email: user.email },
    }))
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let user: User = sqlx::query_as(
        "SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1",
    )
    .bind(&payload.email)
    .fetch_optional(&state.db)
    .await
    .map_err(internal_err)?
    .ok_or((StatusCode::UNAUTHORIZED, "Invalid credentials".to_string()))?;

    if !auth::verify_password(&payload.password, &user.password_hash) {
        return Err((StatusCode::UNAUTHORIZED, "Invalid credentials".into()));
    }

    let token = auth::create_token(user.id, &user.email, &state.config.jwt_secret).map_err(internal_err)?;

    Ok(Json(AuthResponse {
        token,
        user: PublicUser { id: user.id, name: user.name, email: user.email },
    }))
}

pub async fn me(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let user_id = Uuid::parse_str(&claims.sub).map_err(internal_err)?;
    let user: User = sqlx::query_as(
        "SELECT id, name, email, password_hash, created_at FROM users WHERE id = $1",
    )
    .bind(user_id)
    .fetch_one(&state.db)
    .await
    .map_err(internal_err)?;

    Ok(Json(PublicUser { id: user.id, name: user.name, email: user.email }))
}

// ---------- PRODUCTS ----------

pub async fn list_products(State(state): State<AppState>) -> Result<impl IntoResponse, (StatusCode, String)> {
    let products: Vec<Product> = sqlx::query_as(
        "SELECT id, name, slug, category, description, price_inr, is_digital, download_url, image_url, active, created_at
         FROM products WHERE active = true ORDER BY created_at ASC",
    )
    .fetch_all(&state.db)
    .await
    .map_err(internal_err)?;

    Ok(Json(products))
}

pub async fn get_product(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let product: Product = sqlx::query_as(
        "SELECT id, name, slug, category, description, price_inr, is_digital, download_url, image_url, active, created_at
         FROM products WHERE slug = $1 AND active = true",
    )
    .bind(&slug)
    .fetch_optional(&state.db)
    .await
    .map_err(internal_err)?
    .ok_or((StatusCode::NOT_FOUND, "Product not found".to_string()))?;

    Ok(Json(product))
}

// ---------- ORDERS / CHECKOUT ----------

const ORDER_COLUMNS: &str = "id, user_id, product_id, amount_inr, status, delivered, created_at, updated_at,
     payment_method, payu_txnid, payu_mihpayid,
     gateway_payment_id, gateway_pay_address, gateway_pay_currency, gateway_pay_amount,
     crypto_pay_address, crypto_expected_amount, crypto_tx_hash";

/// Creates a pending order, then branches by payment method:
/// - PayU: returns signed hosted-checkout params for the frontend to auto-submit.
/// - NOWPayments: asks the gateway to create a payment, returns its deposit address/amount.
/// - Self-hosted USDT-TRC20: quotes a unique USDT amount against our own wallet address.
pub async fn create_order(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Json(payload): Json<CreateOrderRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let user_id = Uuid::parse_str(&claims.sub).map_err(internal_err)?;

    let user: User = sqlx::query_as(
        "SELECT id, name, email, password_hash, created_at FROM users WHERE id = $1",
    )
    .bind(user_id)
    .fetch_one(&state.db)
    .await
    .map_err(internal_err)?;

    let product: Product = sqlx::query_as(
        "SELECT id, name, slug, category, description, price_inr, is_digital, download_url, image_url, active, created_at
         FROM products WHERE id = $1 AND active = true",
    )
    .bind(payload.product_id)
    .fetch_optional(&state.db)
    .await
    .map_err(internal_err)?
    .ok_or((StatusCode::NOT_FOUND, "Product not found".to_string()))?;

    let order_id = Uuid::new_v4();

    match payload.payment_method {
        PaymentMethod::Payu => {
            let txnid = format!("HU{}", Uuid::new_v4().simple());
            let amount_str = format!("{:.2}", product.price_inr);

            sqlx::query(
                r#"INSERT INTO orders (id, user_id, product_id, amount_inr, status, payment_method, payu_txnid)
                   VALUES ($1, $2, $3, $4, 'pending', 'payu', $5)"#,
            )
            .bind(order_id)
            .bind(user.id)
            .bind(product.id)
            .bind(product.price_inr)
            .bind(&txnid)
            .execute(&state.db)
            .await
            .map_err(internal_err)?;

            let params = payu::build_payment_params(
                &state.config,
                &txnid,
                &amount_str,
                &product.name,
                &user.name,
                &user.email,
                "9999999999",
            );

            Ok(Json(CreateOrderResponse {
                order_id,
                payment_method: PaymentMethod::Payu,
                payu: Some(params),
                crypto: None,
            }))
        }

        PaymentMethod::Nowpayments => {
            let price_inr: f64 = product.price_inr.to_string().parse().unwrap_or(0.0);

            let gw = crypto::nowpayments_create_payment(&state.http, &state.config, price_inr, &order_id.to_string())
                .await
                .map_err(internal_err)?;

            sqlx::query(
                r#"INSERT INTO orders
                   (id, user_id, product_id, amount_inr, status, payment_method,
                    gateway_payment_id, gateway_pay_address, gateway_pay_currency, gateway_pay_amount)
                   VALUES ($1, $2, $3, $4, 'pending', 'nowpayments', $5, $6, $7, $8)"#,
            )
            .bind(order_id)
            .bind(user.id)
            .bind(product.id)
            .bind(product.price_inr)
            .bind(&gw.payment_id)
            .bind(&gw.pay_address)
            .bind(&gw.pay_currency)
            .bind(rust_decimal::Decimal::try_from(gw.pay_amount).unwrap_or_default())
            .execute(&state.db)
            .await
            .map_err(internal_err)?;

            Ok(Json(CreateOrderResponse {
                order_id,
                payment_method: PaymentMethod::Nowpayments,
                payu: None,
                crypto: Some(CryptoPaymentInfo {
                    pay_address: gw.pay_address,
                    pay_amount: format!("{:.6}", gw.pay_amount),
                    pay_currency: gw.pay_currency,
                    expires_in_seconds: None,
                }),
            }))
        }

        PaymentMethod::UsdtTrc20 => {
            if state.config.usdt_trc20_wallet_address.is_empty() {
                return Err((StatusCode::SERVICE_UNAVAILABLE, "Direct USDT payments are not configured".into()));
            }

            let rate = crypto::fetch_usdt_inr_rate(&state.http).await.map_err(internal_err)?;
            let amount = crypto::usdt_amount_with_nonce(product.price_inr, rate, &order_id);

            sqlx::query(
                r#"INSERT INTO orders
                   (id, user_id, product_id, amount_inr, status, payment_method,
                    crypto_pay_address, crypto_expected_amount)
                   VALUES ($1, $2, $3, $4, 'pending', 'usdt_trc20', $5, $6)"#,
            )
            .bind(order_id)
            .bind(user.id)
            .bind(product.id)
            .bind(product.price_inr)
            .bind(&state.config.usdt_trc20_wallet_address)
            .bind(rust_decimal::Decimal::try_from(amount).unwrap_or_default())
            .execute(&state.db)
            .await
            .map_err(internal_err)?;

            Ok(Json(CreateOrderResponse {
                order_id,
                payment_method: PaymentMethod::UsdtTrc20,
                payu: None,
                crypto: Some(CryptoPaymentInfo {
                    pay_address: state.config.usdt_trc20_wallet_address.clone(),
                    pay_amount: format!("{:.6}", amount),
                    pay_currency: "USDT (TRC-20)".to_string(),
                    expires_in_seconds: Some(3600),
                }),
            }))
        }
    }
}

// ---------- PAYU CALLBACKS ----------

pub async fn payu_success(
    State(state): State<AppState>,
    axum::extract::Form(callback): axum::extract::Form<PayUCallback>,
) -> impl IntoResponse {
    handle_payu_callback(state, callback, true).await
}

pub async fn payu_failure(
    State(state): State<AppState>,
    axum::extract::Form(callback): axum::extract::Form<PayUCallback>,
) -> impl IntoResponse {
    handle_payu_callback(state, callback, false).await
}

async fn handle_payu_callback(state: AppState, callback: PayUCallback, expected_success: bool) -> impl IntoResponse {
    let verified = payu::verify_callback(&state.config, &callback);
    let is_success = expected_success && verified && callback.status == "success";

    let new_status = if is_success { "success" } else { "failed" };

    let updated: Option<(Uuid, Uuid, Uuid)> = sqlx::query_as(
        r#"UPDATE orders SET status = $1, payu_mihpayid = $2, updated_at = now()
           WHERE payu_txnid = $3
           RETURNING id, user_id, product_id"#,
    )
    .bind(new_status)
    .bind(&callback.mihpayid)
    .bind(&callback.txnid)
    .fetch_optional(&state.db)
    .await
    .unwrap_or(None);

    if let Some((order_id, user_id, product_id)) = updated {
        if is_success {
            deliver_product(&state, order_id, user_id, product_id).await;
        }
    }

    let redirect_path = if is_success { "/checkout/success" } else { "/checkout/failed" };
    Redirect::to(&format!("{}{}", state.config.frontend_url, redirect_path))
}

/// PayU can also send an async server-to-server webhook (recommended in addition
/// to the browser surl/furl redirect, since users can close the browser mid-flow).
pub async fn payu_webhook(
    State(state): State<AppState>,
    axum::extract::Form(callback): axum::extract::Form<PayUCallback>,
) -> impl IntoResponse {
    handle_payu_callback(state, callback, true).await;
    StatusCode::OK
}

// ---------- NOWPAYMENTS WEBHOOK ----------

/// NOWPayments posts IPN updates as the payment moves through its lifecycle.
/// We verify the HMAC-SHA512 signature against the raw body before trusting it.
pub async fn nowpayments_webhook(
    State(state): State<AppState>,
    headers: HeaderMap,
    body: axum::body::Bytes,
) -> impl IntoResponse {
    let signature = headers
        .get("x-nowpayments-sig")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    if !crypto::verify_nowpayments_signature(&state.config.nowpayments_ipn_secret, &body, signature) {
        tracing::warn!("rejected NOWPayments webhook with invalid signature");
        return StatusCode::UNAUTHORIZED;
    }

    let Ok(ipn) = serde_json::from_slice::<NowPaymentsIpn>(&body) else {
        return StatusCode::BAD_REQUEST;
    };

    let is_paid = matches!(ipn.payment_status.as_str(), "finished" | "confirmed");
    let is_terminal_failure = matches!(ipn.payment_status.as_str(), "failed" | "expired" | "refunded");

    if is_paid || is_terminal_failure {
        let new_status = if is_paid { "success" } else { "failed" };

        let updated: Option<(Uuid, Uuid, Uuid)> = sqlx::query_as(
            r#"UPDATE orders SET status = $1, updated_at = now()
               WHERE gateway_payment_id = $2 AND status = 'pending'
               RETURNING id, user_id, product_id"#,
        )
        .bind(new_status)
        .bind(ipn.payment_id.to_string())
        .fetch_optional(&state.db)
        .await
        .unwrap_or(None);

        if let (Some((order_id, user_id, product_id)), true) = (updated, is_paid) {
            deliver_product(&state, order_id, user_id, product_id).await;
        }
    }

    StatusCode::OK
}

// ---------- SELF-HOSTED USDT-TRC20: MANUAL CHECK ----------

/// The frontend calls this after the customer clicks "I've sent it", so they
/// don't have to wait for the background poller. Also runs automatically
/// every ~20s in a background task (see main.rs / crypto_poll.rs).
pub async fn check_crypto_payment(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Path(order_id): Path<Uuid>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let user_id = Uuid::parse_str(&claims.sub).map_err(internal_err)?;

    let order: Order = sqlx::query_as(&format!(
        "SELECT {ORDER_COLUMNS} FROM orders WHERE id = $1 AND user_id = $2"
    ))
    .bind(order_id)
    .bind(user_id)
    .fetch_optional(&state.db)
    .await
    .map_err(internal_err)?
    .ok_or((StatusCode::NOT_FOUND, "Order not found".to_string()))?;

    if order.payment_method != "usdt_trc20" || order.status != "pending" {
        return Ok(Json(order));
    }

    crate::crypto_poll::check_single_order(&state, &order).await;

    let refreshed: Order = sqlx::query_as(&format!("SELECT {ORDER_COLUMNS} FROM orders WHERE id = $1"))
        .bind(order_id)
        .fetch_one(&state.db)
        .await
        .map_err(internal_err)?;

    Ok(Json(refreshed))
}

// ---------- ORDER HISTORY ----------

pub async fn my_orders(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let user_id = Uuid::parse_str(&claims.sub).map_err(internal_err)?;
    let orders: Vec<Order> = sqlx::query_as(&format!(
        "SELECT {ORDER_COLUMNS} FROM orders WHERE user_id = $1 ORDER BY created_at DESC"
    ))
    .bind(user_id)
    .fetch_all(&state.db)
    .await
    .map_err(internal_err)?;

    Ok(Json(orders))
}

pub async fn get_order(
    State(state): State<AppState>,
    Extension(claims): Extension<Claims>,
    Path(order_id): Path<Uuid>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let user_id = Uuid::parse_str(&claims.sub).map_err(internal_err)?;
    let order: Order = sqlx::query_as(&format!(
        "SELECT {ORDER_COLUMNS} FROM orders WHERE id = $1 AND user_id = $2"
    ))
    .bind(order_id)
    .bind(user_id)
    .fetch_optional(&state.db)
    .await
    .map_err(internal_err)?
    .ok_or((StatusCode::NOT_FOUND, "Order not found".to_string()))?;

    Ok(Json(order))
}

// ---------- SHARED DELIVERY LOGIC ----------

/// Emails the purchased product's download link and marks the order delivered.
/// Shared by all three payment paths (PayU redirect, NOWPayments webhook,
/// self-hosted USDT-TRC20 poller/manual check).
pub async fn deliver_product(state: &AppState, order_id: Uuid, user_id: Uuid, product_id: Uuid) {
    let product: Option<Product> = sqlx::query_as(
        "SELECT id, name, slug, category, description, price_inr, is_digital, download_url, image_url, active, created_at
         FROM products WHERE id = $1",
    )
    .bind(product_id)
    .fetch_optional(&state.db)
    .await
    .unwrap_or(None);

    let user: Option<User> = sqlx::query_as(
        "SELECT id, name, email, password_hash, created_at FROM users WHERE id = $1",
    )
    .bind(user_id)
    .fetch_optional(&state.db)
    .await
    .unwrap_or(None);

    if let (Some(product), Some(user)) = (product, user) {
        if let Some(download_url) = &product.download_url {
            let sent = email::send_software_email(&state.config, &user.email, &user.name, &product.name, download_url);
            match sent {
                Ok(_) => {
                    let _ = sqlx::query("UPDATE orders SET delivered = true WHERE id = $1")
                        .bind(order_id)
                        .execute(&state.db)
                        .await;
                }
                Err(e) => tracing::error!("email delivery failed: {}", e),
            }
        }
    }
}

fn internal_err<E: std::fmt::Display>(e: E) -> (StatusCode, String) {
    tracing::error!("internal error: {}", e);
    (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error".to_string())
}
