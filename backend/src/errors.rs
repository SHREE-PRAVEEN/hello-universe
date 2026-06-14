use actix_web::{HttpResponse, ResponseError};
use serde::Serialize;
use std::fmt;

/// Unified API error type for consistent JSON error responses.
#[derive(Debug)]
pub enum ApiError {
    /// 400 — Bad request / validation error
    BadRequest(String),
    /// 401 — Authentication required or failed
    Unauthorized(String),
    /// 403 — Insufficient permissions
    Forbidden(String),
    /// 404 — Resource not found
    NotFound(String),
    /// 409 — Conflict (e.g. duplicate email)
    Conflict(String),
    /// 500 — Internal server error
    Internal(String),
}

#[derive(Serialize)]
struct ErrorResponse {
    success: bool,
    message: String,
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ApiError::BadRequest(msg) => write!(f, "Bad Request: {msg}"),
            ApiError::Unauthorized(msg) => write!(f, "Unauthorized: {msg}"),
            ApiError::Forbidden(msg) => write!(f, "Forbidden: {msg}"),
            ApiError::NotFound(msg) => write!(f, "Not Found: {msg}"),
            ApiError::Conflict(msg) => write!(f, "Conflict: {msg}"),
            ApiError::Internal(msg) => write!(f, "Internal Error: {msg}"),
        }
    }
}

impl ResponseError for ApiError {
    fn error_response(&self) -> HttpResponse {
        let (status, message) = match self {
            ApiError::BadRequest(msg) => {
                (actix_web::http::StatusCode::BAD_REQUEST, msg.clone())
            }
            ApiError::Unauthorized(msg) => {
                (actix_web::http::StatusCode::UNAUTHORIZED, msg.clone())
            }
            ApiError::Forbidden(msg) => {
                (actix_web::http::StatusCode::FORBIDDEN, msg.clone())
            }
            ApiError::NotFound(msg) => {
                (actix_web::http::StatusCode::NOT_FOUND, msg.clone())
            }
            ApiError::Conflict(msg) => {
                (actix_web::http::StatusCode::CONFLICT, msg.clone())
            }
            ApiError::Internal(msg) => {
                tracing::error!("Internal error: {msg}");
                (
                    actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
                    "An internal error occurred".to_string(),
                )
            }
        };

        HttpResponse::build(status).json(ErrorResponse {
            success: false,
            message,
        })
    }
}

// Convenient conversions from common error types

impl From<sqlx::Error> for ApiError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => {
                ApiError::NotFound("Resource not found".to_string())
            }
            sqlx::Error::Database(ref db_err) => {
                // PostgreSQL unique_violation error code
                if db_err.code().as_deref() == Some("23505") {
                    ApiError::Conflict("A record with that value already exists".to_string())
                } else {
                    ApiError::Internal(format!("Database error: {err}"))
                }
            }
            _ => ApiError::Internal(format!("Database error: {err}")),
        }
    }
}

impl From<jsonwebtoken::errors::Error> for ApiError {
    fn from(err: jsonwebtoken::errors::Error) -> Self {
        ApiError::Unauthorized(format!("Invalid token: {err}"))
    }
}

impl From<argon2::password_hash::Error> for ApiError {
    fn from(err: argon2::password_hash::Error) -> Self {
        ApiError::Internal(format!("Password hashing error: {err}"))
    }
}
