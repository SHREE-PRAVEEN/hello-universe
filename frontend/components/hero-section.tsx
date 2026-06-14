"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./hero-section.module.css";

const ROTATING_WORDS = ["Drones", "AMRs", "UAVs", "Fleets", "Swarms"];

export function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 350);
    }, 2500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <section className={styles.hero} id="home">
      {/* Animated background */}
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
        <div className={styles.gridOverlay} />
      </div>

      <div className={`container ${styles.content}`}>
        {/* Top badge */}
        <div className={styles.badge}>
          <span className="badge badge-cyan">
            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>
            India&apos;s First Hardware-Agnostic RobOps Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          One Platform to<br />
          Operate All Your{" "}
          <span
            className={`gradient-text ${styles.rotatingWord} ${visible ? styles.wordVisible : styles.wordHidden}`}
          >
            {ROTATING_WORDS[wordIdx]}
          </span>
        </h1>

        {/* Sub */}
        <p className={styles.sub}>
          Hello Universe is the enterprise-grade B2B2B SaaS middleware that transforms every Indian hardware OEM into a
          fully software-enabled fleet operator — with real-time telemetry, DGCA compliance, and AI-driven mission planning.
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <a href="#demo" className="btn-primary" id="hero-request-demo" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Request Free Demo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#platform" className="btn-secondary" id="hero-see-platform" style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Explore Platform
          </a>
        </div>

        {/* Trust strip */}
        <div className={styles.trust}>
          <span className={styles.trustLabel}>Trusted by India&apos;s leading OEMs</span>
          <div className={styles.trustLogos}>
            {["Garuda Aerospace", "ideaForge", "Asteria Aerospace", "Marut Drones", "General Aeronautics"].map((name) => (
              <span key={name} className={styles.trustLogo}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className={styles.imageWrapper}>
        <div className={styles.imageGlow} />
        <Image
          src="/hero_robops.png"
          alt="Hello Universe fleet management dashboard"
          width={1200}
          height={675}
          className={styles.heroImage}
          priority
        />
        {/* Floating cards */}
        <div className={`${styles.floatCard} ${styles.floatCard1}`}>
          <div className={styles.dot} style={{ background: "#10b981" }} />
          <div>
            <div className={styles.cardTitle}>Fleet Status</div>
            <div className={styles.cardValue}>142 Active Drones</div>
          </div>
        </div>
        <div className={`${styles.floatCard} ${styles.floatCard2}`}>
          <div className={styles.dot} style={{ background: "#3b82f6" }} />
          <div>
            <div className={styles.cardTitle}>Compliance</div>
            <div className={styles.cardValue}>DGCA Approved ✓</div>
          </div>
        </div>
        <div className={`${styles.floatCard} ${styles.floatCard3}`}>
          <div className={styles.dot} style={{ background: "#f59e0b" }} />
          <div>
            <div className={styles.cardTitle}>Mission Success</div>
            <div className={styles.cardValue}>99.8% Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}
