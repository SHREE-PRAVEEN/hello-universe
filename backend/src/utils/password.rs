use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};

use crate::errors::ApiError;

/// Hash a plain-text password using Argon2id.
pub fn hash_password(password: &str) -> Result<String, ApiError> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| ApiError::Internal(format!("Password hashing failed: {e}")))?;
    Ok(hash.to_string())
}

/// Verify a plain-text password against a stored hash.
pub fn verify_password(password: &str, hash: &str) -> Result<bool, ApiError> {
    let parsed_hash = PasswordHash::new(hash)
        .map_err(|e| ApiError::Internal(format!("Invalid password hash: {e}")))?;
    let result = Argon2::default().verify_password(password.as_bytes(), &parsed_hash);
    Ok(result.is_ok())
}
