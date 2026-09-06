-- Hello Universe — PostgreSQL schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,          -- 'robotics' | 'ai' | 'software'
    description TEXT NOT NULL,
    price_inr NUMERIC(10, 2) NOT NULL,
    is_digital BOOLEAN NOT NULL DEFAULT true,
    download_url TEXT,               -- if digital, file/link to email on purchase
    image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    amount_inr NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending | success | failed
    delivered BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    payment_method TEXT NOT NULL DEFAULT 'payu', -- payu | nowpayments | usdt_trc20

    -- PayU
    payu_txnid TEXT UNIQUE,
    payu_mihpayid TEXT,

    -- NOWPayments (crypto gateway)
    gateway_payment_id TEXT UNIQUE,
    gateway_pay_address TEXT,
    gateway_pay_currency TEXT,
    gateway_pay_amount NUMERIC(20, 8),

    -- Self-hosted USDT-TRC20
    crypto_pay_address TEXT,
    crypto_expected_amount NUMERIC(20, 6),
    crypto_tx_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_txnid ON orders(payu_txnid);
CREATE INDEX IF NOT EXISTS idx_orders_gateway_payment_id ON orders(gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_pending_crypto ON orders(payment_method, status) WHERE payment_method = 'usdt_trc20';

INSERT INTO products (name, slug, category, description, price_inr, is_digital, download_url, image_url)
VALUES
('HU Vision SDK', 'hu-vision-sdk', 'software', 'Computer vision SDK for object detection, tracking and scene understanding on edge devices.', 4999.00, true, 'https://example.com/downloads/hu-vision-sdk.zip', '/products/vision-sdk.png'),
('HU Autonomy Stack', 'hu-autonomy-stack', 'software', 'Perception-planning-control software stack for mobile robots.', 9999.00, true, 'https://example.com/downloads/hu-autonomy-stack.zip', '/products/autonomy-stack.png'),
('HU Agent Framework', 'hu-agent-framework', 'ai', 'Multimodal AI agent framework for robotics decision-making.', 2999.00, true, 'https://example.com/downloads/hu-agent-framework.zip', '/products/agent-framework.png')
ON CONFLICT DO NOTHING;
