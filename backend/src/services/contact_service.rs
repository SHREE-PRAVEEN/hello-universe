use sqlx::PgPool;

use crate::errors::ApiError;
use crate::models::contact::{ContactSubmission, CreateContactPayload};

/// Insert a new contact / demo request form submission.
pub async fn submit_contact(
    pool: &PgPool,
    payload: CreateContactPayload,
) -> Result<ContactSubmission, ApiError> {
    let submission: ContactSubmission = sqlx::query_as(
        r#"
        INSERT INTO contact_submissions (full_name, company, email, phone, fleet_size, inquiry_type, message)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, full_name, company, email, phone, fleet_size, inquiry_type, message, created_at
        "#,
    )
    .bind(&payload.name)
    .bind(&payload.company)
    .bind(&payload.email)
    .bind(&payload.phone)
    .bind(&payload.fleet_size)
    .bind(&payload.inquiry_type)
    .bind(&payload.message)
    .fetch_one(pool)
    .await?;

    Ok(submission)
}
