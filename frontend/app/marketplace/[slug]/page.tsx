"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const [qty, setQty] = useState(1);

  return (
    <div className="page-enter" style={{ paddingTop: "calc(var(--nav-height) + 40px)", paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div style={{ marginBottom: 24, display: "flex", gap: 8, alignItems: "center", fontSize: "0.8rem", color: "#475569" }}>
          <Link href="/marketplace" style={{ color: "#00c5e8", textDecoration: "none" }}>Marketplace</Link>
          <span>›</span>
          <span style={{ color: "#94a3b8" }}>{title}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
          {/* Image area */}
          <div className="glass-card" style={{ padding: 32, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 200 200" fill="none" style={{ width: "80%", height: "auto" }}>
              <circle cx="100" cy="100" r="70" fill="rgba(0,197,232,0.05)" stroke="rgba(0,197,232,0.2)" strokeWidth="1.5"/>
              <circle cx="100" cy="100" r="40" fill="rgba(0,197,232,0.08)" stroke="rgba(0,197,232,0.3)" strokeWidth="1"/>
              <circle cx="100" cy="100" r="15" fill="rgba(0,197,232,0.15)"/>
              <text x="100" y="104" textAnchor="middle" fill="#00c5e8" fontSize="9" fontFamily="monospace" fontWeight="700">PRODUCT</text>
            </svg>
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className="badge badge-cyan">In Stock</span>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#f0f6ff" }}>
              {title}
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.8 }}>
              High-quality component designed for professional drone and robotics applications. Fully tested and compatible with the Hello Universe platform.
            </p>

            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.5rem", fontWeight: 700,
              background: "linear-gradient(135deg, #00c5e8, #f5a520)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>₹28,500</div>

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Quantity:</span>
              <div style={{ display: "flex", border: "1px solid rgba(0,197,232,0.2)", borderRadius: 8, overflow: "hidden" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
                  width: 36, height: 36, background: "rgba(0,0,0,0.3)", border: "none", color: "#94a3b8",
                  cursor: "pointer", fontSize: "1.1rem"
                }}>−</button>
                <span style={{
                  width: 48, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, color: "#f0f6ff", background: "rgba(0,0,0,0.2)", fontSize: "0.95rem",
                  fontFamily: "'Space Grotesk', sans-serif"
                }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{
                  width: 36, height: 36, background: "rgba(0,0,0,0.3)", border: "none", color: "#94a3b8",
                  cursor: "pointer", fontSize: "1.1rem"
                }}>+</button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "14px 24px" }}>
                Add to Cart
              </button>
              <Link href="/cart" className="btn-secondary" style={{ padding: "14px 24px" }}>
                View Cart
              </Link>
            </div>

            {/* Specs */}
            <div className="glass-card" style={{ padding: 24, marginTop: 8 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 16 }}>
                Specifications
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Compatibility", "Hello Universe SDK, ArduPilot, PX4"],
                  ["Protocol", "MAVLink 2.0"],
                  ["Weight", "85g"],
                  ["Warranty", "12 months"],
                ].map(([key, val]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid rgba(56,139,253,0.06)" }}>
                    <span style={{ fontSize: "0.8rem", color: "#475569" }}>{key}</span>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
