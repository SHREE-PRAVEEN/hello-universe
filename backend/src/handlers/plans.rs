use actix_web::{get, web, HttpResponse};
use serde::Serialize;
use sqlx::PgPool;

use crate::errors::ApiError;
use crate::services::plan_service;

#[derive(Serialize)]
struct ApiResponse<T: Serialize> {
    success: bool,
    data: T,
}

/// GET /api/v1/plans
///
/// Returns all active, publicly visible subscription plans.
#[get("/plans")]
pub async fn list_plans(pool: web::Data<PgPool>) -> Result<HttpResponse, ApiError> {
    let plans = plan_service::list_plans(pool.get_ref()).await?;

    Ok(HttpResponse::Ok().json(ApiResponse {
        success: true,
        data: plans,
    }))
}
