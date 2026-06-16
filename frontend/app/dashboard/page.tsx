"use client";
import { useState } from "react";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

const TABS = ["Overview", "Orders", "Courses", "Saved Items"];

const MOCK_ORDERS = [
  { id: "ORD-2024-001", date: "2024-12-15", total: "₹74,500", status: "Delivered", items: 3, color: "#10b981" },
  { id: "ORD-2024-002", date: "2024-12-28", total: "₹1,85,000", status: "Processing", items: 1, color: "#f5a520" },
  { id: "ORD-2025-001", date: "2025-01-10", total: "₹32,500", status: "Shipped", items: 2, color: "#3b82f6" },
];

export default function DashboardPage() {
  const [tab, setTab] = useState("Overview");
  const sectionRef = useScrollReveal<HTMLDivElement>({ stagger: 80 });

  return (
    <div className="page-enter" style={{ paddingTop: "calc(var(--nav-height) + 40px)", paddingBottom: 80 }}>
      <div className="container">
        <h1 className="section-title" style={{ fontSize: "2rem", marginBottom: 8 }}>
          Welcome back, <span className="gradient-text">Pilot</span>
        </h1>
        <p style={{ color: "#64748b", marginBottom: 32 }}>Manage your fleet, orders, and learning progress</p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t} className={`filter-btn ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {tab === "Overview" && (
          <div ref={sectionRef} className="reveal-up">
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Active Subscriptions", value: "2", icon: "📦", color: "#00c5e8" },
                { label: "Total Orders", value: "3", icon: "🛒", color: "#f5a520" },
                { label: "Courses Enrolled", value: "4", icon: "📚", color: "#3b82f6" },
                { label: "Saved Items", value: "7", icon: "💾", color: "#10b981" },
              ].map((s) => (
                <div key={s.label} className="glass-card reveal-child" style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${s.color}12`, border: `1px solid ${s.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem",
                  }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "0.75rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Activity chart */}
            <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 16 }}>
                Activity Overview
              </h3>
              <svg viewBox="0 0 700 120" fill="none" style={{ width: "100%", height: "auto" }}>
                <defs>
                  <linearGradient id="dash-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,197,232,0.2)"/>
                    <stop offset="100%" stopColor="rgba(0,197,232,0)"/>
                  </linearGradient>
                </defs>
                {Array.from({ length: 12 }).map((_, i) => (
                  <g key={i}>
                    <rect x={i * 58 + 8} y={120 - (30 + Math.random() * 70)} width="42" height={30 + Math.random() * 70}
                      rx="4" fill={`rgba(0,197,232,${0.15 + Math.random() * 0.2})`}/>
                    <text x={i * 58 + 29} y="118" textAnchor="middle" fill="#334155" fontSize="7" fontFamily="monospace">
                      {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i]}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Recent orders */}
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 16 }}>
              Recent Orders
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="glass-card" style={{
                  padding: "18px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", fontWeight: 600, color: "#00c5e8", minWidth: 140 }}>
                    {order.id}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#475569", minWidth: 90 }}>{order.date}</span>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{order.items} items</span>
                  <span style={{ marginLeft: "auto", fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#f0f6ff" }}>
                    {order.total}
                  </span>
                  <span className="badge" style={{
                    background: `${order.color}18`, color: order.color, border: `1px solid ${order.color}40`
                  }}>{order.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Orders" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="glass-card" style={{
                  padding: "24px 28px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", fontWeight: 600, color: "#00c5e8" }}>
                    {order.id}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#475569" }}>{order.date}</span>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{order.items} items</span>
                  <span style={{ marginLeft: "auto", fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#f0f6ff" }}>
                    {order.total}
                  </span>
                  <span className="badge" style={{
                    background: `${order.color}18`, color: order.color, border: `1px solid ${order.color}40`
                  }}>{order.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(tab === "Courses" || tab === "Saved Items") && (
          <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{tab === "Courses" ? "📚" : "💾"}</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 8 }}>
              {tab === "Courses" ? "Your enrolled courses will appear here" : "Your saved items will appear here"}
            </h3>
            <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Start exploring to add content</p>
          </div>
        )}
      </div>
    </div>
  );
}
