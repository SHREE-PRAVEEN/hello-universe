"use client";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SolutionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="page-enter" style={{ paddingTop: "calc(var(--nav-height) + 40px)", paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: 24, display: "flex", gap: 8, alignItems: "center", fontSize: "0.8rem", color: "#475569" }}>
          <Link href="/solutions" style={{ color: "#00c5e8", textDecoration: "none" }}>Solutions</Link>
          <span>›</span>
          <span style={{ color: "#94a3b8" }}>{title}</span>
        </div>

        <div style={{ marginBottom: 40 }}>
          <span className="badge badge-cyan" style={{ marginBottom: 12, display: "inline-flex" }}>Solution Architecture</span>
          <h1 className="section-title" style={{ fontSize: "2.2rem", marginBottom: 16 }}>{title}</h1>
          <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.8, maxWidth: 700 }}>
            A comprehensive solution architecture combining Hello Universe platform modules with proven hardware configurations for maximum operational efficiency.
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="glass-card" style={{ padding: 32, marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 20 }}>
            Solution Architecture
          </h2>
          <svg viewBox="0 0 700 200" fill="none" style={{ width: "100%", height: "auto" }}>
            <rect width="700" height="200" fill="rgba(0,197,232,0.02)" rx="12"/>
            {/* Boxes */}
            {[
              { x: 20, label: "Hardware OEMs", color: "#f5a520" },
              { x: 190, label: "HU SDK Layer", color: "#00c5e8" },
              { x: 360, label: "HU Cloud", color: "#3b82f6" },
              { x: 530, label: "End User App", color: "#10b981" },
            ].map((box, i) => (
              <g key={i}>
                <rect x={box.x} y="60" width="150" height="80" rx="10" fill="rgba(0,0,0,0.3)"
                  stroke={`${box.color}40`} strokeWidth="1"/>
                <text x={box.x + 75} y="105" textAnchor="middle" fill={box.color} fontSize="11"
                  fontFamily="'Space Grotesk', sans-serif" fontWeight="600">{box.label}</text>
                {i < 3 && (
                  <line x1={box.x + 150} y1="100" x2={box.x + 190} y2="100"
                    stroke="rgba(0,197,232,0.3)" strokeWidth="1.5" strokeDasharray="4,4"
                    markerEnd="url(#arrowhead)"/>
                )}
              </g>
            ))}
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="rgba(0,197,232,0.4)"/>
              </marker>
            </defs>
          </svg>
        </div>

        {/* Key benefits */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { icon: "⚡", title: "48h Deployment", desc: "Go live in under 2 days" },
            { icon: "🔒", title: "Enterprise Security", desc: "AES-256 encryption" },
            { icon: "📊", title: "Real-time Analytics", desc: "Sub-100ms telemetry" },
            { icon: "🔌", title: "Hardware Agnostic", desc: "Works with any OEM" },
          ].map((b) => (
            <div key={b.title} className="glass-card" style={{ padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{b.icon}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{b.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <a href="/#demo" className="btn-primary" style={{ padding: "14px 36px", fontSize: "1rem" }}>
            Get This Solution
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
