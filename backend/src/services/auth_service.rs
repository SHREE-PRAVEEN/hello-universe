use chrono::{Duration, Utc};
use sqlx::PgPool;
use uuid::Uuid;

use crate::config::AppConfig;
use crate::errors::ApiError;
use crate::models::user::{AuthResponse, CreateUserPayload, LoginPayload, User, UserPublic};
use crate::utils::{jwt, password};

/// Register a new user account.
pub async fn register(
    pool: &PgPool,
    config: &AppConfig,
    payload: CreateUserPayload,
) -> Result<AuthResponse, ApiError> {
    // Check if email already exists
    let existing: Option<(Uuid,)> = sqlx::query_as(
        "SELECT id FROM users WHERE email = $1 LIMIT 1"
    )
    .bind(&payload.email)
    .fetch_optional(pool)
    .await?;

    if existing.is_some() {
        return Err(ApiError::Conflict("Email already registered".to_string()));
    }

    // Check if username already exists
    let existing_username: Option<(Uuid,)> = sqlx::query_as(
        "SELECT id FROM users WHERE username = $1 LIMIT 1"
    )
    .bind(&payload.name)
    .fetch_optional(pool)
    .await?;

    if existing_username.is_some() {
        return Err(ApiError::Conflict("Username already taken".to_string()));
    }

    // Hash the password
    let password_hash = password::hash_password(&payload.password)?;

    // Insert the user
    let user: User = sqlx::query_as(
        r#"
        INSERT INTO users (username, email, password_hash, display_name, status)
        VALUES ($1, $2, $3, $4, 'active')
        RETURNING id, username, email, email_verified_at, password_hash,
                  display_name, avatar_url, bio, website_url, location,
                  status::text, is_superadmin, last_login_at,
                  created_at, updated_at
        "#,
    )
    .bind(&payload.name)
    .bind(&payload.email)
    .bind(&password_hash)
    .bind(&payload.name) // display_name defaults to username
    .fetch_one(pool)
    .await?;

    // Create a session
    let refresh_token = Uuid::new_v4().to_string();
    let refresh_hash = password::hash_password(&refresh_token)?;
    let expires_at = Utc::now() + Duration::days(30);

    sqlx::query(
        r#"
        INSERT INTO sessions (user_id, refresh_token, expires_at)
        VALUES ($1, $2, $3)
        "#,
    )
    .bind(user.id)
    .bind(&refresh_hash)
    .bind(expires_at)
    .execute(pool)
    .await?;

    // Generate JWT
    let token = jwt::encode_jwt(user.id, &config.jwt_secret, config.jwt_expiry_hours)?;

    Ok(AuthResponse {
        user: UserPublic::from(user),
        token,
    })
}

/// Log in an existing user.
pub async fn login(
    pool: &PgPool,
    config: &AppConfig,
    payload: LoginPayload,
) -> Result<AuthResponse, ApiError> {
    // Find user by email
    let user: User = sqlx::query_as(
        r#"
        SELECT id, username, email, email_verified_at, password_hash,
               display_name, avatar_url, bio, website_url, location,
               status::text, is_superadmin, last_login_at,
               created_at, updated_at
        FROM users
        WHERE email = $1 AND deleted_at IS NULL
        LIMIT 1
        "#,
    )
    .bind(&payload.email)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| ApiError::Unauthorized("Invalid email or password".to_string()))?;

    // Verify password
    let valid = password::verify_password(&payload.password, &user.password_hash)?;
    if !valid {
        return Err(ApiError::Unauthorized("Invalid email or password".to_string()));
    }

    // Check if user is active
    if user.status != "active" {
        return Err(ApiError::Forbidden(format!(
            "Account is {}", user.status
        )));
    }

    // Update last login
    sqlx::query("UPDATE users SET last_login_at = NOW() WHERE id = $1")
        .bind(user.id)
        .execute(pool)
        .await?;

    // Create a new session
    let refresh_token = Uuid::new_v4().to_string();
    let refresh_hash = password::hash_password(&refresh_token)?;
    let expires_at = Utc::now() + Duration::days(30);

    sqlx::query(
        r#"
        INSERT INTO sessions (user_id, refresh_token, expires_at)
        VALUES ($1, $2, $3)
        "#,
    )
    .bind(user.id)
    .bind(&refresh_hash)
    .bind(expires_at)
    .execute(pool)
    .await?;

    // Generate JWT
    let token = jwt::encode_jwt(user.id, &config.jwt_secret, config.jwt_expiry_hours)?;

    Ok(AuthResponse {
        user: UserPublic::from(user),
        token,
    })
}
