"use client";
import { useState } from "react";
import styles from "./contact-section.module.css";

const INQUIRY_TYPES = ["OEM Partnership", "Enterprise Demo", "Defense Inquiry", "General Inquiry"];

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [type, setType] = useState(INQUIRY_TYPES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section className={`section ${styles.section}`} id="contact">
      <div className="container">
        <div className={styles.grid}>
          {/* Left */}
          <div className={styles.left}>
            <p className="section-label">Contact & Demo</p>
            <h2 className="section-title" style={{ maxWidth: "480px" }}>
              Let&apos;s build India&apos;s autonomous<br />
              <span className="gradient-text">infrastructure together</span>
            </h2>
            <p className="section-subtitle" style={{ maxWidth: "400px", marginTop: "8px" }}>
              Whether you&apos;re an OEM looking for a white-label software partner, an enterprise operator needing fleet management, or a defense integrator — we&apos;re ready.
            </p>

            {/* Contact details */}
            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <div>
                  <div className={styles.contactLabel}>Headquarters</div>
                  <div className={styles.contactValue}>Bengaluru, Karnataka, India</div>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>✉️</span>
                <div>
                  <div className={styles.contactLabel}>Sales</div>
                  <div className={styles.contactValue}>sales@hellouniv.in</div>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>🛡️</span>
                <div>
                  <div className={styles.contactLabel}>Defense & Government</div>
                  <div className={styles.contactValue}>defense@hellouniv.in</div>
                </div>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <div>
                  <div className={styles.contactLabel}>Phone</div>
                  <div className={styles.contactValue}>+91 80 4567 8900</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right – Form */}
          <div id="demo" className={`glass-card ${styles.formCard}`}>
            {sent ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✅</div>
                <h3>Request Received!</h3>
                <p>Our team will reach out within 24 hours. For urgent inquiries, call us directly.</p>
                <button className="btn-primary" onClick={() => setSent(false)} id="contact-send-another">
                  Send Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className={styles.formTitle}>Request a Demo</h3>

                {/* Inquiry type */}
                <div className={styles.typeRow}>
                  {INQUIRY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.typeBtn} ${type === t ? styles.typeActive : ""}`}
                      onClick={() => setType(t)}
                      id={`contact-type-${t.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-name">Full Name</label>
                    <input id="contact-name" className={styles.input} type="text" placeholder="Arjun Mehta" required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-company">Company</label>
                    <input id="contact-company" className={styles.input} type="text" placeholder="Garuda Aerospace" required />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-email">Work Email</label>
                    <input id="contact-email" className={styles.input} type="email" placeholder="arjun@company.in" required />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-phone">Phone</label>
                    <input id="contact-phone" className={styles.input} type="tel" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-fleet">Fleet Size</label>
                  <select id="contact-fleet" className={styles.input}>
                    <option>1–10 robots</option>
                    <option>11–50 robots</option>
                    <option>51–200 robots</option>
                    <option>200+ robots</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    className={`${styles.input} ${styles.textarea}`}
                    placeholder="Tell us about your fleet, use case, and any specific requirements..."
                    rows={4}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px" }} id="contact-submit">
                  Submit Request
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <p className={styles.formNote}>By submitting, you agree to our Privacy Policy. No spam, ever.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
