"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

const navLinks = [
  { label: "Platform", href: "/#platform", isSection: true },
  { label: "Courses", href: "/courses", isSection: false },
  { label: "Solutions", href: "/solutions", isSection: false },
  { label: "Marketplace", href: "/marketplace", isSection: false },
  { label: "Guides", href: "/guides", isSection: false },
  { label: "Pricing", href: "/#pricing", isSection: true },
];

/* ── Hello Universe logo SVG ── compass rose + arc rings */
function HULogo({ size = 36 }: { size?: number }) {
  const arcCount = 12;
  const arcGaps = Array.from({ length: arcCount }, (_, i) => i);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Hello Universe logo"
    >
      <defs>
        <linearGradient id="nav-compass-grad" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#152d5e"/>
          <stop offset="1" stopColor="#0a1a3a"/>
        </linearGradient>
        <radialGradient id="nav-sphere-grad" cx="45%" cy="38%" r="55%" fx="40%" fy="32%">
          <stop stopColor="#ffffff"/>
          <stop offset="0.45" stopColor="#d4edf8"/>
          <stop offset="1" stopColor="#6aafd0"/>
        </radialGradient>
        <clipPath id="clip-top">
          <rect x="0" y="0" width="200" height="100" />
        </clipPath>
        <clipPath id="clip-bottom">
          <rect x="0" y="100" width="200" height="100" />
        </clipPath>
      </defs>

      {/* ── Cyan arcs (top half) ── */}
      {arcGaps.map((i) => {
        const r = 92 - i * 4.5;
        return (
          <circle
            key={`ct${i}`}
            cx="100"
            cy="100"
            r={r}
            stroke="#00ccee"
            strokeWidth="2"
            fill="none"
            opacity={0.3 + (i / arcCount) * 0.55}
            clipPath="url(#clip-top)"
          />
        );
      })}

      {/* ── Gold arcs (bottom half) ── */}
      {arcGaps.map((i) => {
        const r = 92 - i * 4.5;
        return (
          <circle
            key={`gb${i}`}
            cx="100"
            cy="100"
            r={r}
            stroke="#f5a520"
            strokeWidth="2"
            fill="none"
            opacity={0.3 + (i / arcCount) * 0.55}
            clipPath="url(#clip-bottom)"
          />
        );
      })}

      {/* ── Outer compass ring ── */}
      <circle cx="100" cy="100" r="44" fill="none" stroke="#1a4a8a" strokeWidth="2.5" opacity="0.6"/>
      {/* ── Compass background ── */}
      <circle cx="100" cy="100" r="42" fill="url(#nav-compass-grad)" stroke="#1e5dbd" strokeWidth="1.5"/>

      {/* ── Fine tick marks (36 marks every 10°) ── */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10) * (Math.PI / 180);
        const isMajor = i % 3 === 0;
        const r1 = 41;
        const r2 = isMajor ? 37 : 39;
        const x1 = 100 + r1 * Math.sin(angle);
        const y1 = 100 - r1 * Math.cos(angle);
        const x2 = 100 + r2 * Math.sin(angle);
        const y2 = 100 - r2 * Math.cos(angle);
        return (
          <line
            key={`tk${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={isMajor ? "1.2" : "0.7"}
          />
        );
      })}

      {/* ── Compass rose – 4 cardinal points ── */}
      <polygon points="100,58 96,90 104,90" fill="#00c5e8" opacity="0.95"/>
      <polygon points="100,58 98,70 102,70" fill="#f5a520" opacity="0.85"/>
      <polygon points="100,142 96,110 104,110" fill="#00c5e8" opacity="0.85"/>
      <polygon points="100,142 98,130 102,130" fill="#1e5dbd" opacity="0.7"/>
      <polygon points="142,100 110,96 110,104" fill="#00c5e8" opacity="0.9"/>
      <polygon points="142,100 130,98 130,102" fill="#1a4a8a" opacity="0.6"/>
      <polygon points="58,100 90,96 90,104" fill="#00c5e8" opacity="0.9"/>
      <polygon points="58,100 70,98 70,102" fill="#1a4a8a" opacity="0.6"/>

      {/* ── Intercardinal points ── */}
      <polygon points="100,68 96,92 104,92" fill="#1e5dbd" opacity="0.5" transform="rotate(45 100 100)"/>
      <polygon points="100,68 96,92 104,92" fill="#1e5dbd" opacity="0.45" transform="rotate(-45 100 100)"/>
      <polygon points="100,132 96,108 104,108" fill="#1a4a8a" opacity="0.45" transform="rotate(45 100 100)"/>
      <polygon points="100,132 96,108 104,108" fill="#1a4a8a" opacity="0.4" transform="rotate(-45 100 100)"/>

      {/* ── Cross-hair lines ── */}
      <line x1="100" y1="60" x2="100" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
      <line x1="100" y1="120" x2="100" y2="140" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
      <line x1="60" y1="100" x2="80" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
      <line x1="120" y1="100" x2="140" y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>

      {/* ── Center globe sphere ── */}
      <circle cx="100" cy="100" r="18" fill="url(#nav-sphere-grad)"/>
      <circle cx="100" cy="100" r="18" fill="none" stroke="#1e5dbd" strokeWidth="1" opacity="0.4"/>

      {/* Globe lines */}
      <ellipse cx="100" cy="93" rx="16" ry="4.5" stroke="#1e5dbd" strokeWidth="1.2" fill="none" opacity="0.45"/>
      <ellipse cx="100" cy="100" rx="18" ry="5.5" stroke="#1e5dbd" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="107" rx="16" ry="4.5" stroke="#1e5dbd" strokeWidth="1.2" fill="none" opacity="0.45"/>
      <ellipse cx="100" cy="100" rx="7" ry="18" stroke="#1e5dbd" strokeWidth="1" fill="none" opacity="0.35"/>
      <ellipse cx="100" cy="100" rx="13" ry="18" stroke="#1e5dbd" strokeWidth="0.8" fill="none" opacity="0.25"/>

      {/* ── Subtle glow ── */}
      <circle cx="100" cy="100" r="46" fill="none" stroke="#00c5e8" strokeWidth="0.8" opacity="0.15"/>
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>
            <HULogo size={40} />
          </span>
          <span className={styles.logoText}>
            Hello <span className={styles.logoAccent}>Universe</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className={styles.links}>
          {navLinks.map((l) => (
            <li key={l.label}>
              {l.isSection ? (
                <a href={l.href} className={`${styles.link} ${isActive(l.href) ? styles.linkActive : ""}`}>
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className={`${styles.link} ${isActive(l.href) ? styles.linkActive : ""}`}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={styles.actions}>
          <a href="/#contact" className="btn-secondary" style={{fontSize:"0.85rem", padding:"9px 20px"}}>
            Contact Sales
          </a>
          <a href="/#demo" className="btn-primary" style={{fontSize:"0.85rem", padding:"9px 20px"}}>
            Request Demo
          </a>
          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="nav-hamburger"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.open1 : ""}`}/>
            <span className={`${styles.bar} ${menuOpen ? styles.open2 : ""}`}/>
            <span className={`${styles.bar} ${menuOpen ? styles.open3 : ""}`}/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileOpen : ""}`}>
        {navLinks.map((l) => (
          l.isSection ? (
            <a key={l.label} href={l.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ) : (
            <Link key={l.label} href={l.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          )
        ))}
        <div className={styles.mobileCtas}>
          <a href="/#contact" className="btn-secondary" onClick={() => setMenuOpen(false)}>Contact Sales</a>
          <a href="/#demo" className="btn-primary" onClick={() => setMenuOpen(false)}>Request Demo</a>
        </div>
      </div>
    </nav>
  );
}
