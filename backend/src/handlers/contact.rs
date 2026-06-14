use actix_web::{post, web, HttpResponse};
use serde::Serialize;
use sqlx::PgPool;
use validator::Validate;

use crate::errors::ApiError;
use crate::models::contact::{ContactResponse, CreateContactPayload};
use crate::services::contact_service;

#[derive(Serialize)]
struct ApiResponse<T: Serialize> {
    success: bool,
    data: T,
    message: String,
}

/// POST /api/v1/contact
///
/// Submit a contact / demo request form.
/// Body: `{ "name": "...", "company": "...", "email": "...", "phone?": "...",
///          "fleet_size?": "...", "inquiry_type": "...", "message?": "..." }`
#[post("/contact")]
pub async fn submit_contact(
    pool: web::Data<PgPool>,
    body: web::Json<CreateContactPayload>,
) -> Result<HttpResponse, ApiError> {
    let payload = body.into_inner();

    payload.validate().map_err(|e| {
        ApiError::BadRequest(format!("Validation error: {e}"))
    })?;

    let submission = contact_service::submit_contact(pool.get_ref(), payload).await?;

    Ok(HttpResponse::Created().json(ApiResponse {
        success: true,
        data: ContactResponse { id: submission.id },
        message: "Request received. Our team will reach out within 24 hours.".to_string(),
    }))
}
