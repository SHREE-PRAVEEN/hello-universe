use std::env;

#[derive(Clone)]
pub struct Config {
    pub database_url: String,
    pub port: u16,
    pub db_max_connections: u32,
    pub jwt_secret: String,
    pub payu_merchant_key: String,
    pub payu_merchant_salt: String,
    pub payu_base_url: String,
    pub payu_success_url: String,
    pub payu_failure_url: String,
    pub smtp_host: String,
    pub smtp_port: u16,
    pub smtp_user: String,
    pub smtp_pass: String,
    pub smtp_from: String,
    pub frontend_url: String,
    pub backend_public_url: String,

    // NOWPayments (crypto payment gateway)
    pub nowpayments_api_key: String,
    pub nowpayments_ipn_secret: String,
    pub nowpayments_base_url: String,

    // Self-hosted USDT-TRC20
    pub usdt_trc20_wallet_address: String,
    pub trongrid_api_key: String,
    pub trongrid_base_url: String,
    pub usdt_trc20_contract_address: String,
}

impl Config {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();
        Self {
            database_url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
            port: env::var("PORT").ok().and_then(|v| v.parse().ok()).unwrap_or(8080),
            db_max_connections: env::var("DB_MAX_CONNECTIONS")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(10),
            jwt_secret: env::var("JWT_SECRET").unwrap_or_else(|_| "change_me_dev_secret".into()),
            payu_merchant_key: env::var("PAYU_MERCHANT_KEY").unwrap_or_default(),
            payu_merchant_salt: env::var("PAYU_MERCHANT_SALT").unwrap_or_default(),
            payu_base_url: env::var("PAYU_BASE_URL")
                .unwrap_or_else(|_| "https://test.payu.in/_payment".into()),
            payu_success_url: env::var("PAYU_SUCCESS_URL")
                .unwrap_or_else(|_| "http://localhost:8080/api/payu/success".into()),
            payu_failure_url: env::var("PAYU_FAILURE_URL")
                .unwrap_or_else(|_| "http://localhost:8080/api/payu/failure".into()),
            smtp_host: env::var("SMTP_HOST").unwrap_or_else(|_| "smtp.gmail.com".into()),
            smtp_port: env::var("SMTP_PORT").ok().and_then(|v| v.parse().ok()).unwrap_or(587),
            smtp_user: env::var("SMTP_USER").unwrap_or_default(),
            smtp_pass: env::var("SMTP_PASS").unwrap_or_default(),
            smtp_from: env::var("SMTP_FROM").unwrap_or_else(|_| "no-reply@hellouniverse.dev".into()),
            frontend_url: env::var("FRONTEND_URL").unwrap_or_else(|_| "http://localhost:3000".into()),
            backend_public_url: env::var("BACKEND_PUBLIC_URL")
                .unwrap_or_else(|_| "http://localhost:8080".into()),

            nowpayments_api_key: env::var("NOWPAYMENTS_API_KEY").unwrap_or_default(),
            nowpayments_ipn_secret: env::var("NOWPAYMENTS_IPN_SECRET").unwrap_or_default(),
            nowpayments_base_url: env::var("NOWPAYMENTS_BASE_URL")
                .unwrap_or_else(|_| "https://api.nowpayments.io/v1".into()),

            usdt_trc20_wallet_address: env::var("USDT_TRC20_WALLET_ADDRESS").unwrap_or_default(),
            trongrid_api_key: env::var("TRONGRID_API_KEY").unwrap_or_default(),
            trongrid_base_url: env::var("TRONGRID_BASE_URL")
                .unwrap_or_else(|_| "https://api.trongrid.io".into()),
            // USDT's official TRC-20 contract on Tron mainnet.
            usdt_trc20_contract_address: env::var("USDT_TRC20_CONTRACT_ADDRESS")
                .unwrap_or_else(|_| "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t".into()),
        }
    }
}
