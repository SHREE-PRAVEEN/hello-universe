use actix_web::{get, web, HttpResponse};
use sqlx::PgPool;
use serde::Serialize;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    version: String,
    database: String,
}

/// GET /api/v1/health
///
/// Health check endpoint. Verifies database connectivity.
#[get("/health")]
pub async fn health_check(pool: web::Data<PgPool>) -> HttpResponse {
    let db_status = match sqlx::query("SELECT 1").execute(pool.get_ref()).await {
        Ok(_) => "connected".to_string(),
        Err(e) => format!("error: {e}"),
    };

    let status = if db_status == "connected" { "ok" } else { "degraded" };

    HttpResponse::Ok().json(HealthResponse {
        status: status.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        database: db_status,
    })
}
