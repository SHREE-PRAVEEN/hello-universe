import styles from "./footer.module.css";

const LINKS = {
  Platform: ["Fleet Telemetry", "Mission Planner", "DGCA Compliance", "White-Label SDK", "API Reference"],
  Products: ["Hello Universe Core", "Hello Universe Agri", "Hello Universe Defense", "Hello Universe Enterprise"],
  Verticals: ["Agriculture", "Defense & Military", "Enterprise & Infrastructure"],
  Company: ["About Us", "Blog", "Careers", "Press Kit", "Contact"],
};

/* ── Hello Universe mini-logo (compass rose variant) ── */
function HULogoMini() {
  return (
    <svg width="28" height="28" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cyan arcs top */}
      {[14, 10, 6, 2].map((gap, i) => (
        <path key={`c${i}`}
          d={`M ${18 + gap * 1.6},60 A ${42 - gap * 1.6},${42 - gap * 1.6} 0 0 1 ${102 - gap * 1.6},60`}
          stroke="#00c5e8" strokeWidth="2.5" strokeLinecap="round" opacity={0.55 + i * 0.12} fill="none"/>
      ))}
      {/* Gold arcs bottom */}
      {[14, 10, 6, 2].map((gap, i) => (
        <path key={`g${i}`}
          d={`M ${18 + gap * 1.6},60 A ${42 - gap * 1.6},${42 - gap * 1.6} 0 0 0 ${102 - gap * 1.6},60`}
          stroke="#f5a520" strokeWidth="2.5" strokeLinecap="round" opacity={0.55 + i * 0.12} fill="none"/>
      ))}
      {/* Compass circle */}
      <circle cx="60" cy="60" r="28" fill="#0d2455" stroke="#1e5dbd" strokeWidth="1.5"/>
      {/* Compass points */}
      <polygon points="60,32 56,54 64,54" fill="#00c5e8" opacity="0.9"/>
      <polygon points="60,88 56,66 64,66" fill="#1e5dbd" opacity="0.8"/>
      <polygon points="88,60 66,56 66,64" fill="#f5a520" opacity="0.9"/>
      <polygon points="32,60 54,56 54,64" fill="#f5a520" opacity="0.7"/>
      {/* Center sphere */}
      <circle cx="60" cy="60" r="13" fill="white" opacity="0.95"/>
      <ellipse cx="60" cy="58" rx="13" ry="4" stroke="#1e5dbd" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <ellipse cx="60" cy="64" rx="11" ry="3" stroke="#1e5dbd" strokeWidth="1" fill="none" opacity="0.35"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="divider" />
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>
            <HULogoMini />
            <span className={styles.logoText}>
              Hello <span style={{ color: "#00c5e8" }}>Universe</span>
            </span>
          </div>
          <p className={styles.tagline}>
            India&apos;s hardware-agnostic RobOps &amp; Fleet Management platform. Powering the autonomous future of Bharat.
          </p>
          <div className={styles.badges}>
            <span className="badge badge-blue">DPIIT Recognized</span>
            <span className="badge badge-cyan">iDEX Partner</span>
            <span className="badge badge-emerald">ISO 27001</span>
          </div>
          <div className={styles.socials}>
            {["LinkedIn", "Twitter", "GitHub", "YouTube"].map((s) => (
              <a key={s} href="#" className={styles.social} aria-label={s}>{s[0]}</a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section} className={styles.col}>
            <h4 className={styles.colTitle}>{section}</h4>
            <ul className={styles.colLinks}>
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className={styles.colLink}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="divider" />
      <div className={`container ${styles.bottom}`}>
        <span>© 2024 Hello Universe Technologies Pvt. Ltd. · Bengaluru, India · CIN: U72900KA2022PTC1XXXXX</span>
        <div className={styles.bottomLinks}>
          <a href="#" className={styles.bottomLink}>Privacy Policy</a>
          <a href="#" className={styles.bottomLink}>Terms of Service</a>
          <a href="#" className={styles.bottomLink}>Security</a>
          <a href="#" className={styles.bottomLink}>DPDP Compliance</a>
        </div>
      </div>
    </footer>
  );
}
