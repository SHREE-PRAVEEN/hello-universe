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
    ensure_user_profile_columns(&db).await?;

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

async fn ensure_user_profile_columns(db: &sqlx::PgPool) -> anyhow::Result<()> {
    // Create UUID extension if it doesn't exist
    sqlx::query("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
        .execute(db)
        .await?;

    // Create users table if it doesn't exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            phone TEXT NOT NULL DEFAULT '',
            address TEXT NOT NULL DEFAULT '',
            profession TEXT NOT NULL DEFAULT 'other'
                CHECK (profession IN ('student', 'working', 'creator', 'other')),
            verified BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
        "#,
    )
    .execute(db)
    .await?;

    // Add verified column to existing tables if needed
    sqlx::query("ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN NOT NULL DEFAULT true;")
        .execute(db)
        .await?;

    // Create products table if it doesn't exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            price_inr NUMERIC(10, 2) NOT NULL,
            is_digital BOOLEAN NOT NULL DEFAULT true,
            download_url TEXT,
            image_url TEXT,
            active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
        "#,
    )
    .execute(db)
    .await?;

    // Create orders table if it doesn't exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id),
            product_id UUID NOT NULL REFERENCES products(id),
            amount_inr NUMERIC(10, 2) NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            delivered BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            payment_method TEXT NOT NULL DEFAULT 'payu',
            payu_txnid TEXT UNIQUE,
            payu_mihpayid TEXT,
            gateway_payment_id TEXT UNIQUE,
            gateway_pay_address TEXT,
            gateway_pay_currency TEXT,
            gateway_pay_amount NUMERIC(20, 8),
            crypto_pay_address TEXT,
            crypto_expected_amount NUMERIC(20, 6),
            crypto_tx_hash TEXT
        )
        "#,
    )
    .execute(db)
    .await?;

    // Create indexes
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)")
        .execute(db)
        .await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_orders_txnid ON orders(payu_txnid)")
        .execute(db)
        .await?;
    sqlx::query("CREATE INDEX IF NOT EXISTS idx_orders_gateway_payment_id ON orders(gateway_payment_id)")
        .execute(db)
        .await?;
    sqlx::query(
        "CREATE INDEX IF NOT EXISTS idx_orders_pending_crypto ON orders(payment_method, status) WHERE payment_method = 'usdt_trc20'"
    )
    .execute(db)
    .await?;

    // Insert seed products if they don't exist
    sqlx::query(
        r#"
        INSERT INTO products (name, slug, category, description, price_inr, is_digital, download_url, image_url)
        VALUES
        ('HU Vision SDK', 'hu-vision-sdk', 'software', 'Computer vision SDK for object detection, tracking and scene understanding on edge devices.', 4999.00, true, 'https://example.com/downloads/hu-vision-sdk.zip', '/products/vision-sdk.png'),
        ('HU Autonomy Stack', 'hu-autonomy-stack', 'software', 'Perception-planning-control software stack for mobile robots.', 9999.00, true, 'https://example.com/downloads/hu-autonomy-stack.zip', '/products/autonomy-stack.png'),
        ('HU Agent Framework', 'hu-agent-framework', 'ai', 'Multimodal AI agent framework for robotics decision-making.', 2999.00, true, 'https://example.com/downloads/hu-agent-framework.zip', '/products/agent-framework.png')
        ON CONFLICT DO NOTHING
        "#,
    )
    .execute(db)
    .await?;

    Ok(())
}
