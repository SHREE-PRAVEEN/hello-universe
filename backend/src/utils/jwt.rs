use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::errors::ApiError;

/// JWT claims payload.
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    /// Subject — the user's UUID
    pub sub: Uuid,
    /// Expiration time (as UTC timestamp)
    pub exp: i64,
    /// Issued at (as UTC timestamp)
    pub iat: i64,
}

/// Encode a JWT for the given user ID.
pub fn encode_jwt(user_id: Uuid, secret: &str, expiry_hours: i64) -> Result<String, ApiError> {
    let now = Utc::now();
    let exp = now + Duration::hours(expiry_hours);

    let claims = Claims {
        sub: user_id,
        iat: now.timestamp(),
        exp: exp.timestamp(),
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_bytes()),
    )?;

    Ok(token)
}

/// Decode and validate a JWT, returning the claims.
pub fn decode_jwt(token: &str, secret: &str) -> Result<Claims, ApiError> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )?;

    Ok(token_data.claims)
}
