use chrono::{DateTime, Utc};
use sqlx::FromRow;
use uuid::Uuid;

/// Represents a row from the `sessions` table (migration 005).
#[derive(Debug, Clone, FromRow)]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub refresh_token: String,
    pub user_agent: Option<String>,
    pub ip_address: Option<std::net::IpAddr>,
    pub device_id: Option<String>,
    pub is_revoked: bool,
    pub last_used_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}
