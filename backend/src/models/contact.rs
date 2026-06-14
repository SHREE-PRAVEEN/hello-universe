use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

/// Represents a row from the `contact_submissions` table (migration 047).
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct ContactSubmission {
    pub id: Uuid,
    pub full_name: String,
    pub company: String,
    pub email: String,
    pub phone: Option<String>,
    pub fleet_size: Option<String>,
    pub inquiry_type: String,
    pub message: Option<String>,
    pub created_at: DateTime<Utc>,
}

/// Payload for contact / demo request form submission.
#[derive(Debug, Deserialize, Validate)]
pub struct CreateContactPayload {
    #[validate(length(min = 1, max = 200, message = "Name is required"))]
    pub name: String,

    #[validate(length(min = 1, max = 200, message = "Company is required"))]
    pub company: String,

    #[validate(email(message = "Invalid email address"))]
    pub email: String,

    pub phone: Option<String>,

    pub fleet_size: Option<String>,

    #[validate(length(min = 1, message = "Inquiry type is required"))]
    pub inquiry_type: String,

    pub message: Option<String>,
}

/// Response after successful contact submission.
#[derive(Debug, Serialize)]
pub struct ContactResponse {
    pub id: Uuid,
}
