-- -------------------------------------------------------
-- CONTACT SUBMISSIONS (demo request forms from landing page)
-- -------------------------------------------------------
CREATE TABLE contact_submissions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name       VARCHAR(200) NOT NULL,
    company         VARCHAR(200) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    phone           VARCHAR(50),
    fleet_size      VARCHAR(50),
    inquiry_type    VARCHAR(100) NOT NULL,
    message         TEXT,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMPTZ,
    assigned_to     UUID REFERENCES users(id),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookup by email and inquiry type
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_type ON contact_submissions(inquiry_type);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);
