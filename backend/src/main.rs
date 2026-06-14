mod config;
mod db;
mod errors;
mod handlers;
mod middleware;
mod models;
mod services;
mod utils;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use tracing::info;
use tracing_actix_web::TracingLogger;

use crate::config::AppConfig;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Load .env file (silently ignore if not present)
    dotenvy::dotenv().ok();

    // Initialize structured logging
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new("info")),
        )
        .init();

    // Load configuration
    let config = AppConfig::from_env();
    let bind_addr = format!("{}:{}", config.server_host, config.server_port);

    info!("Starting Hello Universe backend v{}", env!("CARGO_PKG_VERSION"));
    info!("Connecting to database...");

    // Initialize database pool and run migrations
    let pool = db::init_pool(&config.database_url).await;

    info!("Server listening on http://{bind_addr}");

    // Start HTTP server
    HttpServer::new(move || {
        // CORS — allow the Next.js frontend
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_origin("http://127.0.0.1:3000")
            .allowed_methods(vec!["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
            .allowed_headers(vec![
                actix_web::http::header::AUTHORIZATION,
                actix_web::http::header::CONTENT_TYPE,
                actix_web::http::header::ACCEPT,
            ])
            .supports_credentials()
            .max_age(3600);

        App::new()
            // Middleware
            .wrap(TracingLogger::default())
            .wrap(cors)
            // Shared state
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(config.clone()))
            // JSON config — increase payload limit to 1MB
            .app_data(web::JsonConfig::default().limit(1_048_576))
            // Routes — all under /api/v1
            .service(
                web::scope("/api/v1")
                    .service(handlers::health::health_check)
                    .service(handlers::auth::register)
                    .service(handlers::auth::login)
                    .service(handlers::plans::list_plans)
                    .service(handlers::contact::submit_contact),
            )
    })
    .bind(&bind_addr)?
    .run()
    .await
}
