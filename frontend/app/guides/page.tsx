"use client";
import { useState } from "react";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

const MOCK_GUIDES = [
  { id: "1", slug: "build-your-first-drone", title: "Build Your First Drone", description: "Step-by-step guide to assembling a quadcopter from scratch with Pixhawk, brushless motors, and ESCs.", tags: ["Beginner", "Quadcopter", "Assembly"], difficulty: "Easy", time: "4 hours", color: "#10b981" },
  { id: "2", slug: "custom-mavlink-telemetry", title: "Custom MAVLink Telemetry Setup", description: "Configure custom MAVLink messages for real-time sensor data streaming to your Hello Universe dashboard.", tags: ["MAVLink", "Telemetry", "Advanced"], difficulty: "Hard", time: "2 hours", color: "#f43f5e" },
  { id: "3", slug: "agri-drone-spray-system", title: "Agricultural Spray System Integration", description: "Wire and configure a precision spray system for agricultural drones including nozzle calibration and flow rate setup.", tags: ["Agriculture", "Spray", "Hardware"], difficulty: "Medium", time: "3 hours", color: "#f5a520" },
  { id: "4", slug: "ros2-hello-universe-bridge", title: "ROS2 to Hello Universe Bridge", description: "Create a bridge node between ROS2 and Hello Universe SDK for seamless robot fleet integration.", tags: ["ROS2", "SDK", "Programming"], difficulty: "Hard", time: "3 hours", color: "#6366f1" },
  { id: "5", slug: "battery-management-system", title: "Smart Battery Management System", description: "Build a battery monitoring system with voltage, current, and temperature sensors connected to flight controller.", tags: ["Battery", "Electronics", "Safety"], difficulty: "Medium", time: "2 hours", color: "#3b82f6" },
  { id: "6", slug: "fpv-camera-gimbal-mount", title: "FPV Camera & Gimbal Mount", description: "Design and 3D-print a custom gimbal mount for inspection cameras on industrial drones.", tags: ["FPV", "3D Print", "Camera"], difficulty: "Medium", time: "5 hours", color: "#00c5e8" },
];

export default function GuidesPage() {
  const [search, setSearch] = useState("");
  const sectionRef = useScrollReveal<HTMLDivElement>({ stagger: 100 });

  const filtered = MOCK_GUIDES.filter((g) =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter">
      <section className="page-hero">
        <div className="container page-content">
          <p className="section-label">DIY Guides</p>
          <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            Hands-on guides for<br />
            <span className="gradient-text">building & configuring robots</span>
          </h1>
          <p className="section-subtitle">
            Step-by-step tutorials with wiring diagrams, code snippets, and hardware configurations.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="search-bar">
            <input className="search-input" placeholder="Search guides..." value={search}
              onChange={(e) => setSearch(e.target.value)} id="guides-search" />
          </div>

          <div className="card-grid reveal-up" ref={sectionRef}>
            {filtered.map((guide) => (
              <div key={guide.id} className="glass-card reveal-child"
                style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}>
                {/* Header */}
                <div style={{ padding: "24px 24px 16px", borderBottom: `2px solid ${guide.color}20` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span className="badge" style={{
                      background: `${guide.color}18`, color: guide.color, border: `1px solid ${guide.color}40`
                    }}>{guide.difficulty}</span>
                    <span style={{ fontSize: "0.75rem", color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                      ⏱ {guide.time}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#f0f6ff", lineHeight: 1.3 }}>
                    {guide.title}
                  </h3>
                </div>

                {/* Body */}
                <div style={{ padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7, flex: 1 }}>
                    {guide.description}
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {guide.tags.map(t => (
                      <span key={t} style={{
                        fontSize: "0.65rem", padding: "2px 8px", borderRadius: 99,
                        background: "rgba(59,130,246,0.08)", color: "#64748b",
                        border: "1px solid rgba(59,130,246,0.15)"
                      }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ paddingTop: 12, borderTop: "1px solid rgba(56,139,253,0.08)", marginTop: "auto" }}>
                    <span style={{ color: guide.color, fontWeight: 700, fontSize: "0.85rem" }}>Read Guide →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
