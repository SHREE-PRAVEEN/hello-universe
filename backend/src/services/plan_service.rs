use sqlx::PgPool;

use crate::errors::ApiError;
use crate::models::plan::Plan;

/// Fetch all active, publicly visible plans ordered by sort_order.
pub async fn list_plans(pool: &PgPool) -> Result<Vec<Plan>, ApiError> {
    let plans: Vec<Plan> = sqlx::query_as(
        r#"
        SELECT id, name, slug, description,
               price_monthly, price_yearly, currency,
               max_projects, max_storage_gb, max_collaborators,
               features, is_active, is_public, sort_order,
               created_at, updated_at
        FROM plans
        WHERE is_active = TRUE AND is_public = TRUE
        ORDER BY sort_order ASC, created_at ASC
        "#,
    )
    .fetch_all(pool)
    .await?;

    Ok(plans)
}
