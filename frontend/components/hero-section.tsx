"use client";
import { useEffect, useRef, useState } from "react";
import { Particles } from "./particles";
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
        <div className={styles.gradientMesh} />
        <div className={styles.gridOverlay} />
        <Particles count={50} />
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
          <span className={styles.cursor}>|</span>
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

      {/* Animated Dashboard Mockup */}
      <div className={styles.dashboardWrapper}>
        <div className={styles.dashboardGlow} />
        <div className={styles.dashboard}>
          {/* Top bar */}
          <div className={styles.dashTopBar}>
            <div className={styles.dashDots}>
              <span style={{ background: "#f43f5e" }} />
              <span style={{ background: "#f5a520" }} />
              <span style={{ background: "#10b981" }} />
            </div>
            <span className={styles.dashUrl}>app.hellouniv.in/fleet-ops</span>
            <div className={styles.dashStatus}>
              <span className={styles.statusDot} />
              Live
            </div>
          </div>

          {/* Dashboard body */}
          <div className={styles.dashBody}>
            {/* Sidebar */}
            <div className={styles.dashSidebar}>
              {["⊞ Dashboard", "🛰️ Fleet", "📡 Telemetry", "📋 Missions", "⚙️ Settings"].map((item, i) => (
                <div key={item} className={`${styles.sideItem} ${i === 0 ? styles.sideItemActive : ""}`}>
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className={styles.dashMain}>
              {/* Stats row */}
              <div className={`animate-stagger ${styles.dashStats}`}>
                {[
                  { label: "Active Drones", value: "142", color: "#10b981" },
                  { label: "Missions Today", value: "38", color: "#3b82f6" },
                  { label: "Uptime", value: "99.8%", color: "#f5a520" },
                  { label: "Compliance", value: "DGCA ✓", color: "#00c5e8" },
                ].map((s) => (
                  <div key={s.label} className={styles.dashStatCard}>
                    <div className={styles.dashStatValue} style={{ color: s.color }}>{s.value}</div>
                    <div className={styles.dashStatLabel}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div className={styles.dashChart}>
                <div className={styles.chartTitle}>Fleet Telemetry — 24h</div>
                <svg viewBox="0 0 600 120" className={styles.chartSvg}>
                  <defs>
                    <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0,197,232,0.3)" />
                      <stop offset="100%" stopColor="rgba(0,197,232,0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,80 C50,70 100,40 150,55 C200,70 250,20 300,35 C350,50 400,15 450,25 C500,35 550,10 600,20"
                    fill="none" stroke="#00c5e8" strokeWidth="2"
                    className={styles.chartLine}
                  />
                  <path
                    d="M0,80 C50,70 100,40 150,55 C200,70 250,20 300,35 C350,50 400,15 450,25 C500,35 550,10 600,20 L600,120 L0,120 Z"
                    fill="url(#chart-grad)" className={styles.chartArea}
                  />
                  {/* Data points */}
                  {[[0,80],[150,55],[300,35],[450,25],[600,20]].map(([cx,cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="3" fill="#00c5e8" className={styles.chartDot} style={{ animationDelay: `${i * 0.2}s` }}/>
                  ))}
                </svg>
              </div>

              {/* Map area */}
              <div className={styles.dashMap}>
                <div className={styles.chartTitle}>Live Fleet Map</div>
                <div className={styles.mapGrid}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={styles.dronePin} style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: `${15 + Math.random() * 70}%`,
                      animationDelay: `${i * 0.3}s`
                    }}>
                      <div className={styles.dronePinDot} />
                      <div className={styles.dronePinRing} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

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
