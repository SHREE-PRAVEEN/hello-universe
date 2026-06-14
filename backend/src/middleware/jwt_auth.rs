use actix_web::{dev::ServiceRequest, Error, HttpMessage};
use actix_web::web;
use uuid::Uuid;

use crate::config::AppConfig;
use crate::errors::ApiError;
use crate::utils::jwt;

/// Authenticated user injected into request extensions after JWT validation.
#[derive(Debug, Clone)]
pub struct AuthUser {
    pub user_id: Uuid,
}

/// Extract and validate JWT from the Authorization header.
/// Call this at the start of any handler that requires authentication.
pub fn extract_auth_user(req: &ServiceRequest) -> Result<AuthUser, Error> {
    let config = req
        .app_data::<web::Data<AppConfig>>()
        .ok_or_else(|| ApiError::Internal("App config not found".to_string()))?;

    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| ApiError::Unauthorized("Missing Authorization header".to_string()))?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| ApiError::Unauthorized("Invalid Authorization format".to_string()))?;

    let claims = jwt::decode_jwt(token, &config.jwt_secret)?;

    Ok(AuthUser {
        user_id: claims.sub,
    })
}

/// Helper to extract auth user from an HttpRequest inside a handler.
pub fn get_auth_user(req: &actix_web::HttpRequest) -> Result<AuthUser, ApiError> {
    let config = req
        .app_data::<web::Data<AppConfig>>()
        .ok_or_else(|| ApiError::Internal("App config not found".to_string()))?;

    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|v| v.to_str().ok())
        .ok_or_else(|| ApiError::Unauthorized("Missing Authorization header".to_string()))?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| ApiError::Unauthorized("Invalid Authorization format".to_string()))?;

    let claims = jwt::decode_jwt(token, &config.jwt_secret)?;

    Ok(AuthUser {
        user_id: claims.sub,
    })
}
