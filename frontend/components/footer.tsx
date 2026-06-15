"use client";
import styles from "./footer.module.css";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import Link from "next/link";

const LINKS = {
  Platform: [
    { label: "Fleet Telemetry", href: "/#platform" },
    { label: "Mission Planner", href: "/#platform" },
    { label: "DGCA Compliance", href: "/#platform" },
    { label: "White-Label SDK", href: "/#platform" },
    { label: "API Reference", href: "/#platform" },
  ],
  Products: [
    { label: "Hello Universe Core", href: "/#products" },
    { label: "Hello Universe Agri", href: "/#products" },
    { label: "Hello Universe Defense", href: "/#products" },
    { label: "Hello Universe Enterprise", href: "/#products" },
  ],
  Learn: [
    { label: "Courses", href: "/courses" },
    { label: "Solutions", href: "/solutions" },
    { label: "DIY Guides", href: "/guides" },
    { label: "Marketplace", href: "/marketplace" },
  ],
  Company: [
    { label: "About Us", href: "/#about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "/#contact" },
  ],
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
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <footer className={`${styles.footer} reveal-fade`} ref={sectionRef}>
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
            {[
              { label: "LinkedIn", icon: "Li" },
              { label: "Twitter", icon: "𝕏" },
              { label: "GitHub", icon: "GH" },
              { label: "YouTube", icon: "YT" },
            ].map((s) => (
              <a key={s.label} href="#" className={styles.social} aria-label={s.label}>{s.icon}</a>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section} className={styles.col}>
            <h4 className={styles.colTitle}>{section}</h4>
            <ul className={styles.colLinks}>
              {links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={styles.colLink}>{l.label}</Link>
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
