import styles from "./about-section.module.css";

const PILLARS = [
  {
    icon: "🚀",
    title: "Built for Bharat",
    desc: "Designed ground-up for Indian regulatory frameworks — Digital Sky, NPNT, DGCA approvals, and PLI scheme compatibility baked in from day one.",
  },
  {
    icon: "🔌",
    title: "True Hardware Agnosticism",
    desc: "We don't compete with your hardware. Our universal driver layer integrates with any MAVLink, ROS2, DDS, or proprietary SDK without lock-in.",
  },
  {
    icon: "📦",
    title: "B2B2B Distribution Engine",
    desc: "Every OEM partner becomes a revenue channel. Your hardware, our software, your brand. We power the stack invisibly so you own the customer relationship.",
  },
  {
    icon: "🛡️",
    title: "Defense-Grade Security",
    desc: "Zero-trust by default. AES-256 encrypted telemetry, hardware-bound authentication, and air-gapped deployment options for defense and critical infrastructure.",
  },
];

const TEAM = [
  { name: "Arjun Mehta", role: "CEO & Co-founder", bg: "linear-gradient(135deg,#1e3a5f,#2a1f5f)" },
  { name: "Priya Nair", role: "CTO & Co-founder", bg: "linear-gradient(135deg,#1e5f3a,#1f5f5a)" },
  { name: "Rahul Singh", role: "VP Engineering", bg: "linear-gradient(135deg,#5f1e3a,#5f2a1f)" },
  { name: "Deepa Krishnan", role: "Head of Compliance", bg: "linear-gradient(135deg,#3a5f1e,#5f5a1f)" },
];

export function AboutSection() {
  return (
    <section className={`section ${styles.section}`} id="about">
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className="section-label">About Hello Universe</p>
          <h2 className="section-title">
            India&apos;s autonomous future deserves<br />
            <span className="gradient-text">enterprise-grade software</span>
          </h2>
        </div>

        {/* Story block */}
        <div className={`glass-card ${styles.storyCard}`}>
          <div className={styles.storyContent}>
            <div className={styles.storyText}>
              <h3 className={styles.storyTitle}>The Problem We&apos;re Solving</h3>
              <p>
                India has over 300 hardware OEMs building incredible UAVs and AMRs — yet the software infrastructure
                to manage, deploy, and scale these robots has been an afterthought. End-users face a fragmented landscape
                of incompatible systems, cumbersome compliance workflows, and zero fleet interoperability.
              </p>
              <p>
                Hello Universe was founded to resolve this systemic failure. We are the middleware layer that transforms
                India&apos;s hardware output into fully software-enabled, enterprise-ready autonomous systems —
                without requiring any OEM to abandon their existing hardware investments.
              </p>
              <div className={styles.storyStats}>
                <div className={styles.storyStat}>
                  <span className={styles.storyStatNum} style={{ color: "#06b6d4" }}>2022</span>
                  <span className={styles.storyStatLabel}>Founded in Bengaluru</span>
                </div>
                <div className={styles.storyStat}>
                  <span className={styles.storyStatNum} style={{ color: "#3b82f6" }}>DPIIT</span>
                  <span className={styles.storyStatLabel}>Recognized Startup</span>
                </div>
                <div className={styles.storyStat}>
                  <span className={styles.storyStatNum} style={{ color: "#8b5cf6" }}>iDEX</span>
                  <span className={styles.storyStatLabel}>Defence Accelerator</span>
                </div>
              </div>
            </div>
            <div className={styles.storyVisual}>
              <div className={styles.indiaMap}>
                <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.mapSvg}>
                  <path d="M100 10 L140 30 L165 60 L175 100 L165 140 L140 170 L100 190 L70 180 L45 155 L35 120 L40 85 L60 55 L85 30 Z"
                    fill="rgba(0,197,232,0.06)" stroke="rgba(0,197,232,0.35)" strokeWidth="1.5"/>
                  {/* Drone nodes */}
                  {[
                    [80, 60], [120, 50], [55, 100], [140, 95], [100, 120], [75, 150], [125, 155],
                  ].map(([cx, cy], i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="5" fill="rgba(0,197,232,0.8)" className={styles.droneNode}
                        style={{ animationDelay: `${i * 0.4}s` }}/>
                      <circle cx={cx} cy={cy} r="10" fill="none" stroke="rgba(0,197,232,0.3)"
                        strokeWidth="1" className={styles.droneRing} style={{ animationDelay: `${i * 0.4}s` }}/>
                    </g>
                  ))}
                  {/* Connection lines */}
                  <line x1="80" y1="60" x2="120" y2="50" stroke="rgba(59,130,246,0.3)" strokeWidth="0.8" strokeDasharray="3,3"/>
                  <line x1="80" y1="60" x2="100" y2="120" stroke="rgba(59,130,246,0.3)" strokeWidth="0.8" strokeDasharray="3,3"/>
                  <line x1="120" y1="50" x2="140" y2="95" stroke="rgba(59,130,246,0.3)" strokeWidth="0.8" strokeDasharray="3,3"/>
                  <line x1="100" y1="120" x2="75" y2="150" stroke="rgba(59,130,246,0.3)" strokeWidth="0.8" strokeDasharray="3,3"/>
                  <line x1="100" y1="120" x2="125" y2="155" stroke="rgba(59,130,246,0.3)" strokeWidth="0.8" strokeDasharray="3,3"/>
                  <line x1="55" y1="100" x2="100" y2="120" stroke="rgba(59,130,246,0.3)" strokeWidth="0.8" strokeDasharray="3,3"/>
                  <line x1="140" y1="95" x2="100" y2="120" stroke="rgba(59,130,246,0.3)" strokeWidth="0.8" strokeDasharray="3,3"/>
                </svg>
                <div className={styles.mapLabel}>India Fleet Network</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className={styles.pillars}>
          {PILLARS.map((p) => (
            <div key={p.title} className={`glass-card ${styles.pillar}`}>
              <span className={styles.pillarIcon}>{p.icon}</span>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarDesc}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className={styles.teamSection}>
          <h3 className={styles.teamTitle}>Leadership Team</h3>
          <div className={styles.teamGrid}>
            {TEAM.map((m) => (
              <div key={m.name} className={`glass-card ${styles.teamCard}`}>
                <div className={styles.avatar} style={{ background: m.bg }}>
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className={styles.memberName}>{m.name}</div>
                <div className={styles.memberRole}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
