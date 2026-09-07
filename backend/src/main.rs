mod auth;
mod config;
mod crypto;
mod crypto_poll;
mod email;
mod handlers;
mod models;
mod payu;

use axum::{
    middleware,
    routing::{get, post},
    Router,
};
use sqlx::postgres::PgPoolOptions;
use tower_http::cors::{Any, CorsLayer};

use config::Config;

#[derive(Clone)]
pub struct AppState {
    pub db: sqlx::PgPool,
    pub config: Config,
    pub http: reqwest::Client,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let config = Config::from_env();

    let db = PgPoolOptions::new()
        .max_connections(config.db_max_connections)
        .min_connections(0)
        .acquire_timeout(std::time::Duration::from_secs(15))
        .connect(&config.database_url)
        .await
        .map_err(|error| anyhow::anyhow!("could not connect to PostgreSQL: {error}"))?;

    let http = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(15))
        .build()?;

    let state = AppState { db, config, http };
    let port = state.config.port;

    // Background poller for self-hosted USDT-TRC20 payments: checks pending
    // orders against TronGrid every ~20s so we don't depend solely on the
    // customer clicking "I've sent it".
    tokio::spawn(crypto_poll::run(state.clone()));

    let protected = Router::new()
        .route("/api/me", get(handlers::me))
        .route("/api/orders", post(handlers::create_order))
        .route("/api/orders", get(handlers::my_orders))
        .route("/api/orders/:id", get(handlers::get_order))
        .route("/api/orders/:id/check-crypto", post(handlers::check_crypto_payment))
        .route_layer(middleware::from_fn_with_state(state.clone(), auth::require_auth));

    let public = Router::new()
        .route("/api/health", get(handlers::health))
        .route("/api/auth/signup", post(handlers::signup))
        .route("/api/auth/login", post(handlers::login))
        .route("/api/products", get(handlers::list_products))
        .route("/api/products/:slug", get(handlers::get_product))
        .route("/api/payu/success", post(handlers::payu_success))
        .route("/api/payu/failure", post(handlers::payu_failure))
        .route("/api/payu/webhook", post(handlers::payu_webhook))
        .route("/api/payments/nowpayments/webhook", post(handlers::nowpayments_webhook));

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .merge(public)
        .merge(protected)
        .layer(cors)
        .with_state(state);

    let address = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&address).await?;
    tracing::info!("Hello Universe backend listening on {}", address);
    axum::serve(listener, app).await?;

    Ok(())
}
