use sha2::{Digest, Sha512};

use crate::config::Config;
use crate::models::{PayUCallback, PayUPaymentParams};

/// PayU request hash sequence (standard hosted checkout flow):
/// sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
pub fn build_request_hash(
    salt: &str,
    key: &str,
    txnid: &str,
    amount: &str,
    productinfo: &str,
    firstname: &str,
    email: &str,
) -> String {
    let raw = format!(
        "{key}|{txnid}|{amount}|{productinfo}|{firstname}|{email}|||||||||||{salt}",
        key = key,
        txnid = txnid,
        amount = amount,
        productinfo = productinfo,
        firstname = firstname,
        email = email,
        salt = salt,
    );
    let mut hasher = Sha512::new();
    hasher.update(raw.as_bytes());
    hex::encode(hasher.finalize())
}

/// PayU response hash sequence (reverse order) used to verify a callback is genuine:
/// sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
pub fn build_response_hash(salt: &str, key: &str, callback: &PayUCallback) -> String {
    let raw = format!(
        "{salt}|{status}||||||{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}",
        salt = salt,
        status = callback.status,
        email = callback.email,
        firstname = callback.firstname,
        productinfo = callback.productinfo,
        amount = callback.amount,
        txnid = callback.txnid,
        key = key,
    );
    let mut hasher = Sha512::new();
    hasher.update(raw.as_bytes());
    hex::encode(hasher.finalize())
}

pub fn verify_callback(config: &Config, callback: &PayUCallback) -> bool {
    let expected = build_response_hash(&config.payu_merchant_salt, &config.payu_merchant_key, callback);
    expected.eq_ignore_ascii_case(&callback.hash)
}

pub fn build_payment_params(
    config: &Config,
    txnid: &str,
    amount: &str,
    productinfo: &str,
    firstname: &str,
    email: &str,
    phone: &str,
) -> PayUPaymentParams {
    let hash = build_request_hash(
        &config.payu_merchant_salt,
        &config.payu_merchant_key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
    );

    PayUPaymentParams {
        key: config.payu_merchant_key.clone(),
        txnid: txnid.to_string(),
        amount: amount.to_string(),
        productinfo: productinfo.to_string(),
        firstname: firstname.to_string(),
        email: email.to_string(),
        phone: phone.to_string(),
        surl: config.payu_success_url.clone(),
        furl: config.payu_failure_url.clone(),
        hash,
        action_url: config.payu_base_url.clone(),
    }
}

/// NOTE: PayU documents different hash sequences for different products/APIs
/// (hosted checkout vs S2S vs Payment Links). Confirm the exact sequence and
/// endpoint with your live PayU merchant dashboard before going to production.
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hash_is_deterministic() {
        let h1 = build_request_hash("salt", "key", "txn1", "100.00", "Product", "John", "j@x.com");
        let h2 = build_request_hash("salt", "key", "txn1", "100.00", "Product", "John", "j@x.com");
        assert_eq!(h1, h2);
        assert_eq!(h1.len(), 128);
    }
}
