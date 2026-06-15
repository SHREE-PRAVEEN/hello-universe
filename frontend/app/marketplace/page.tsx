"use client";
import { useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

const CATEGORIES = ["All", "Sensors", "Flight Controllers", "Batteries", "Frames", "Accessories"];

const MOCK_PRODUCTS = [
  { id: "1", slug: "pixhawk-6x-autopilot", name: "Pixhawk 6X Autopilot", category: "Flight Controllers", price: "₹28,500", stock: 24, tags: ["MAVLink", "ArduPilot"], color: "#00c5e8", rating: 4.8 },
  { id: "2", slug: "lidar-sensor-module", name: "LiDAR Sensor Module L1", category: "Sensors", price: "₹45,000", stock: 12, tags: ["LiDAR", "Mapping"], color: "#3b82f6", rating: 4.6 },
  { id: "3", slug: "agri-spray-nozzle-kit", name: "Agricultural Spray Nozzle Kit", category: "Accessories", price: "₹8,200", stock: 56, tags: ["Agriculture", "Spray"], color: "#10b981", rating: 4.9 },
  { id: "4", slug: "hex-carbon-frame-650mm", name: "Hexacopter Carbon Frame 650mm", category: "Frames", price: "₹18,900", stock: 8, tags: ["Frame", "Carbon"], color: "#f5a520", rating: 4.5 },
  { id: "5", slug: "smart-battery-6s-22000mah", name: "Smart Battery 6S 22000mAh", category: "Batteries", price: "₹32,500", stock: 15, tags: ["Battery", "Smart"], color: "#f43f5e", rating: 4.7 },
  { id: "6", slug: "multispectral-camera-ms600", name: "Multispectral Camera MS600", category: "Sensors", price: "₹1,85,000", stock: 5, tags: ["NDVI", "Multispectral"], color: "#6366f1", rating: 4.8 },
  { id: "7", slug: "rtk-gps-module", name: "RTK GPS Module Pro", category: "Sensors", price: "₹42,000", stock: 18, tags: ["GPS", "RTK", "Precision"], color: "#3b82f6", rating: 4.9 },
  { id: "8", slug: "companion-computer-board", name: "Companion Computer Board", category: "Flight Controllers", price: "₹15,600", stock: 30, tags: ["Compute", "Edge AI"], color: "#00c5e8", rating: 4.4 },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const sectionRef = useScrollReveal<HTMLDivElement>({ stagger: 80 });

  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="page-enter">
      <section className="page-hero">
        <div className="container page-content">
          <p className="section-label">Marketplace</p>
          <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            Hardware components for<br />
            <span className="gradient-text">your autonomous fleet</span>
          </h1>
          <p className="section-subtitle">
            Curated selection of sensors, flight controllers, batteries, and accessories — all tested and compatible with Hello Universe.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="search-bar">
            <input className="search-input" placeholder="Search products..." value={search}
              onChange={(e) => setSearch(e.target.value)} id="marketplace-search" />
            {CATEGORIES.map((c) => (
              <button key={c} className={`filter-btn ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          <div className="card-grid reveal-up" ref={sectionRef} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {filtered.map((product) => (
              <Link href={`/marketplace/${product.slug}`} key={product.id} className="glass-card reveal-child"
                style={{ textDecoration: "none", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Visual */}
                <div style={{ padding: "28px 24px", background: `${product.color}05`, borderBottom: `1px solid ${product.color}20`, position: "relative" }}>
                  <svg viewBox="0 0 200 100" fill="none" style={{ width: "100%", height: "auto" }}>
                    <rect width="200" height="100" fill={`${product.color}04`} rx="6"/>
                    <circle cx="100" cy="50" r="30" fill="none" stroke={`${product.color}25`} strokeWidth="1.5"/>
                    <circle cx="100" cy="50" r="15" fill={`${product.color}15`} stroke={`${product.color}40`} strokeWidth="1"/>
                    <text x="100" y="54" textAnchor="middle" fill={`${product.color}90`} fontSize="8" fontFamily="monospace" fontWeight="600">
                      {product.category.slice(0, 3).toUpperCase()}
                    </text>
                  </svg>
                  {product.stock < 10 && (
                    <span style={{
                      position: "absolute", top: 12, right: 12,
                      fontSize: "0.65rem", padding: "2px 8px", borderRadius: 99,
                      background: "rgba(244,63,94,0.15)", color: "#f43f5e",
                      border: "1px solid rgba(244,63,94,0.3)", fontWeight: 700,
                    }}>Low Stock</span>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#f0f6ff" }}>
                    {product.name}
                  </h3>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {product.tags.map(t => (
                      <span key={t} style={{
                        fontSize: "0.65rem", padding: "2px 8px", borderRadius: 99,
                        background: "rgba(59,130,246,0.08)", color: "#64748b",
                        border: "1px solid rgba(59,130,246,0.15)"
                      }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(56,139,253,0.08)" }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700,
                      background: "linear-gradient(135deg, #00c5e8, #f5a520)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>{product.price}</span>
                    <span style={{ fontSize: "0.75rem", color: "#f5a520" }}>★ {product.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
