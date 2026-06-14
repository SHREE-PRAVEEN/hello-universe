use actix_web::{post, web, HttpResponse};
use serde::Serialize;
use sqlx::PgPool;
use validator::Validate;

use crate::config::AppConfig;
use crate::errors::ApiError;
use crate::models::user::{AuthResponse, CreateUserPayload, LoginPayload};
use crate::services::auth_service;

#[derive(Serialize)]
struct ApiResponse<T: Serialize> {
    success: bool,
    data: T,
}

/// POST /api/v1/auth/register
///
/// Register a new user account.
/// Body: `{ "name": "...", "email": "...", "password": "..." }`
#[post("/auth/register")]
pub async fn register(
    pool: web::Data<PgPool>,
    config: web::Data<AppConfig>,
    body: web::Json<CreateUserPayload>,
) -> Result<HttpResponse, ApiError> {
    let payload = body.into_inner();

    // Validate input
    payload.validate().map_err(|e| {
        ApiError::BadRequest(format!("Validation error: {e}"))
    })?;

    let auth_response = auth_service::register(pool.get_ref(), config.get_ref(), payload).await?;

    Ok(HttpResponse::Created().json(ApiResponse {
        success: true,
        data: auth_response,
    }))
}

/// POST /api/v1/auth/login
///
/// Log in with email and password.
/// Body: `{ "email": "...", "password": "..." }`
#[post("/auth/login")]
pub async fn login(
    pool: web::Data<PgPool>,
    config: web::Data<AppConfig>,
    body: web::Json<LoginPayload>,
) -> Result<HttpResponse, ApiError> {
    let payload = body.into_inner();

    payload.validate().map_err(|e| {
        ApiError::BadRequest(format!("Validation error: {e}"))
    })?;

    let auth_response = auth_service::login(pool.get_ref(), config.get_ref(), payload).await?;

    Ok(HttpResponse::Ok().json(ApiResponse {
        success: true,
        data: auth_response,
    }))
}
