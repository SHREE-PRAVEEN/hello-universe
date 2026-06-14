use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;
use uuid::Uuid;

/// Represents a row from the `plans` table (migration 026).
#[derive(Debug, Clone, Serialize, FromRow)]
pub struct Plan {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub price_monthly: Option<bigdecimal::BigDecimal>,
    pub price_yearly: Option<bigdecimal::BigDecimal>,
    pub currency: String,
    pub max_projects: Option<i32>,
    pub max_storage_gb: Option<i32>,
    pub max_collaborators: Option<i32>,
    pub features: serde_json::Value,
    pub is_active: bool,
    pub is_public: bool,
    pub sort_order: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

