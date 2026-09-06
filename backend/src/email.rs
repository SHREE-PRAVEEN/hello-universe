use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};

use crate::config::Config;

pub fn send_software_email(
    config: &Config,
    to_email: &str,
    to_name: &str,
    product_name: &str,
    download_url: &str,
) -> anyhow::Result<()> {
    let body = format!(
        "Hi {to_name},\n\n\
        Thank you for your purchase from Hello Universe!\n\n\
        Product: {product_name}\n\
        Download link: {download_url}\n\n\
        If you have any issues accessing your software, just reply to this email.\n\n\
        — Hello Universe\n\
        Robotics & Artificial Intelligence",
        to_name = to_name,
        product_name = product_name,
        download_url = download_url,
    );

    let email = Message::builder()
        .from(config.smtp_from.parse()?)
        .to(format!("{} <{}>", to_name, to_email).parse()?)
        .subject(format!("Your Hello Universe purchase: {}", product_name))
        .header(ContentType::TEXT_PLAIN)
        .body(body)?;

    let creds = Credentials::new(config.smtp_user.clone(), config.smtp_pass.clone());

    let mailer = SmtpTransport::starttls_relay(&config.smtp_host)?
        .port(config.smtp_port)
        .credentials(creds)
        .build();

    mailer.send(&email)?;
    Ok(())
}
