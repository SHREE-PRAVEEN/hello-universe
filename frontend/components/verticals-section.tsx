"use client";
import { useState } from "react";
import styles from "./verticals-section.module.css";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

const VERTICALS = [
  {
    id: "agriculture",
    icon: "🌾",
    label: "Agriculture",
    color: "#10b981",
    colorBg: "rgba(16,185,129,0.08)",
    borderColor: "rgba(16,185,129,0.3)",
    applications: ["Precision crop spraying", "Multispectral crop health monitoring", "Yield prediction AI", "Automated swath planning"],
    oems: ["Garuda Aerospace", "Paras Aerospace", "Marut Drones", "Multiplex Drones", "Thanos Technologies", "Fopple Technologies"],
    requirements: [
      "Low-bandwidth operability for rural areas",
      "Simplified UI for non-technical operators",
      "Automated swath planning with terrain mapping",
      "Integration with digital agriculture platforms",
    ],
    stat: "60%",
    statLabel: "Spray efficiency increase",
  },
  {
    id: "defense",
    icon: "🛡️",
    label: "Defense & Military",
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.08)",
    borderColor: "rgba(245,158,11,0.3)",
    applications: ["Border surveillance", "Loitering munitions support", "High-altitude reconnaissance", "Swarm logistics coordination"],
    oems: ["ideaForge", "NewSpace Research & Technologies", "Zen Technologies", "Adani Defence", "Throttle Aerospace", "Kadet Defence Systems"],
    requirements: [
      "Zero-trust security architecture",
      "BCPDS compliance framework",
      "Encrypted MAVLink telemetry channels",
      "Anti-jamming protocol detection",
      "Swarm coordination algorithms",
    ],
    stat: "AES-256",
    statLabel: "End-to-end encryption",
  },
  {
    id: "enterprise",
    icon: "🏗️",
    label: "Enterprise & Infrastructure",
    color: "#6366f1",
    colorBg: "rgba(99,102,241,0.08)",
    borderColor: "rgba(99,102,241,0.3)",
    applications: ["Oil & gas inspection", "Mining volumetrics", "3D photogrammetry", "Disaster management response"],
    oems: ["Asteria Aerospace", "General Aeronautics", "Aeroarc", "Omnipresent Robot Technologies", "Redwing Labs"],
    requirements: [
      "High-throughput data pipelines",
      "Cloud photogrammetry integration",
      "BVLOS mission planning & regulatory filing",
      "Predictive maintenance algorithms",
    ],
    stat: "10TB+",
    statLabel: "Daily data processed",
  },
];

export function VerticalsSection() {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const v = VERTICALS[active];
  const sectionRef = useScrollReveal<HTMLElement>();

  const handleTabClick = (i: number) => {
    if (i === active) return;
    setTransitioning(true);
    setTimeout(() => {
      setActive(i);
      setTransitioning(false);
    }, 200);
  };

  return (
    <section className={`section ${styles.section} reveal-up`} id="verticals" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className="section-label">Target Verticals</p>
          <h2 className="section-title">
            Built for India&apos;s three highest-growth<br />
            <span className="gradient-text">autonomous system markets</span>
          </h2>
          <p className="section-subtitle">
            Each vertical comes with purpose-tuned features, pre-integrated OEM partnerships, and compliance frameworks specific to that sector.
          </p>
        </div>

        {/* Tab navigation */}
        <div className={styles.tabs}>
          {VERTICALS.map((vert, i) => (
            <button
              key={vert.id}
              className={`${styles.tab} ${active === i ? styles.tabActive : ""}`}
              style={active === i ? { borderColor: vert.color, color: vert.color } : {}}
              onClick={() => handleTabClick(i)}
              id={`vertical-tab-${vert.id}`}
            >
              <span>{vert.icon}</span>
              {vert.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          className={`${styles.panel} ${transitioning ? styles.panelOut : styles.panelIn}`}
          style={{ borderColor: v.borderColor, background: v.colorBg }}
        >
          <div className={styles.panelGrid}>
            {/* Applications */}
            <div className={styles.panelBlock}>
              <h3 className={styles.blockTitle} style={{ color: v.color }}>Dominant Applications</h3>
              <ul className={styles.list}>
                {v.applications.map((a) => (
                  <li key={a} className={styles.listItem}>
                    <span className={styles.dot} style={{ background: v.color }} />
                    {a}
                  </li>
                ))}
              </ul>
              <div className={styles.statBox} style={{ borderColor: v.borderColor }}>
                <span className={styles.statNum} style={{ color: v.color }}>{v.stat}</span>
                <span className={styles.statLabel}>{v.statLabel}</span>
              </div>
            </div>

            {/* OEMs */}
            <div className={styles.panelBlock}>
              <h3 className={styles.blockTitle} style={{ color: v.color }}>Representative Indian OEMs</h3>
              <div className={styles.oemGrid}>
                {v.oems.map((o) => (
                  <span key={o} className={styles.oemTag} style={{ borderColor: v.borderColor, color: "#94a3b8" }}>{o}</span>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className={styles.panelBlock}>
              <h3 className={styles.blockTitle} style={{ color: v.color }}>Software Requirements</h3>
              <ul className={styles.list}>
                {v.requirements.map((r) => (
                  <li key={r} className={styles.listItem}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="7" cy="7" r="7" fill="rgba(59,130,246,0.15)"/>
                      <path d="M4 7l2 2 4-4" stroke={v.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
