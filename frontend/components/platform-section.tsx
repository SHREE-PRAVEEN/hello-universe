import styles from "./platform-section.module.css";

const FEATURES = [
  {
    icon: "🛰️",
    title: "Real-Time Telemetry",
    desc: "Sub-100ms latency telemetry ingestion from any MAVLink, DDS, or ROS2-compatible robot. Live dashboards with geofencing, altitude graphs, and health monitoring.",
    badge: "badge-blue",
    badgeLabel: "Core",
  },
  {
    icon: "📡",
    title: "Hardware-Agnostic SDK",
    desc: "Universal driver abstraction layer supports 50+ OEM hardware protocols. Plug-and-play integration for Pixhawk, ArduPilot, DJI FlightController, and proprietary stacks.",
    badge: "badge-cyan",
    badgeLabel: "Integration",
  },
  {
    icon: "🏛️",
    title: "DGCA Compliance Engine",
    desc: "Automated NPNT token generation, UIN management, and BVLOS permission workflows. Digital Sky integration with one-click regulatory reporting.",
    badge: "badge-emerald",
    badgeLabel: "Compliance",
  },
  {
    icon: "🤖",
    title: "AI Mission Planner",
    desc: "Intelligent swath planning, obstacle avoidance corridors, and multi-drone choreography. Supports precision agriculture patterns and industrial inspection routes.",
    badge: "badge-violet",
    badgeLabel: "AI/ML",
  },
  {
    icon: "🔒",
    title: "Zero-Trust Security",
    desc: "End-to-end encrypted MAVLink, BCPDS-compliant data pipelines, anti-jamming protocol detection, and hardware-bound authentication for defense-grade deployments.",
    badge: "badge-orange",
    badgeLabel: "Security",
  },
  {
    icon: "🏷️",
    title: "White-Label Ready",
    desc: "Full brand customization — your logo, color scheme, domain, and mobile app. Your customers never know the underlying infrastructure. Ship in days, not months.",
    badge: "badge-blue",
    badgeLabel: "B2B2B",
  },
  {
    icon: "☁️",
    title: "Cloud Photogrammetry",
    desc: "High-throughput 3D point cloud processing, volumetric analysis, and orthomosaic generation. Direct integration with Pix4D, WebODM, and DroneDeploy pipelines.",
    badge: "badge-cyan",
    badgeLabel: "Analytics",
  },
  {
    icon: "🔧",
    title: "Predictive Maintenance",
    desc: "Motor health scoring, battery cycle analytics, and component fatigue prediction using flight log ML models. Reduce unplanned downtime by up to 60%.",
    badge: "badge-violet",
    badgeLabel: "AI/ML",
  },
];

export function PlatformSection() {
  return (
    <section className={`section ${styles.section}`} id="platform">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className="section-label">Platform Capabilities</p>
          <h2 className="section-title">
            Everything your fleet needs,<br />
            <span className="gradient-text">built into one stack</span>
          </h2>
          <p className="section-subtitle">
          Hello Universe packages eight enterprise modules into a single, unified SaaS platform — deployable in under 48 hours on any existing hardware fleet.
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={`glass-card ${styles.card}`}>
              <div className={styles.iconRow}>
                <span className={styles.icon}>{f.icon}</span>
                <span className={`badge ${f.badge}`}>{f.badgeLabel}</span>
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
