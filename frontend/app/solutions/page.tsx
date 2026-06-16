"use client";
import { useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

const CATEGORIES = ["All", "Agriculture", "Defense", "Enterprise", "Logistics", "Energy"];

const MOCK_SOLUTIONS = [
  { id: "1", slug: "precision-crop-monitoring", title: "Precision Crop Monitoring", category: "Agriculture", problemDescription: "Traditional crop monitoring is labor-intensive, covers limited area, and misses early signs of disease, nutrient deficiency, or pest damage.", estimatedCost: "₹2,80,000/year", tags: ["NDVI", "Multispectral", "AI"], color: "#10b981" },
  { id: "2", slug: "border-surveillance-system", title: "Autonomous Border Surveillance", category: "Defense", problemDescription: "Manual border patrolling covers limited terrain, exposes personnel to danger, and lacks 24/7 real-time visibility across remote stretches.", estimatedCost: "Custom", tags: ["Surveillance", "AI", "Encrypted"], color: "#f59e0b" },
  { id: "3", slug: "industrial-pipeline-inspection", title: "Industrial Pipeline Inspection", category: "Enterprise", problemDescription: "Manual pipeline inspection requires shutdowns, rope-access teams, and still misses corrosion or micro-fractures in hard-to-reach sections.", estimatedCost: "₹12,00,000/year", tags: ["Photogrammetry", "AI", "BVLOS"], color: "#6366f1" },
  { id: "4", slug: "warehouse-amr-fleet", title: "Warehouse AMR Fleet Management", category: "Logistics", problemDescription: "Disconnected AMR fleets from multiple vendors create coordination chaos, reducing throughput and increasing collision risks.", estimatedCost: "₹6,50,000/year", tags: ["AMR", "Fleet", "Real-time"], color: "#3b82f6" },
  { id: "5", slug: "solar-farm-inspection", title: "Solar Farm Drone Inspection", category: "Energy", problemDescription: "Manual thermal inspection of solar panels is slow, expensive, and misses hotspots that degrade efficiency over time.", estimatedCost: "₹4,20,000/year", tags: ["Thermal", "Energy", "Automated"], color: "#f43f5e" },
  { id: "6", slug: "smart-spraying-optimization", title: "Smart Spraying Optimization", category: "Agriculture", problemDescription: "Blanket spraying wastes chemicals, harms soil health, and increases operational costs for large-scale farming operations.", estimatedCost: "₹1,80,000/year", tags: ["Spray", "AI", "Precision"], color: "#10b981" },
];

export default function SolutionsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const sectionRef = useScrollReveal<HTMLDivElement>({ stagger: 100 });

  const filtered = MOCK_SOLUTIONS.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || s.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="page-enter">
      <section className="page-hero">
        <div className="container page-content">
          <p className="section-label">Solutions Hub</p>
          <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            End-to-end autonomous<br />
            <span className="gradient-text">solutions for every vertical</span>
          </h1>
          <p className="section-subtitle">
            Pre-built solution architectures combining Hello Universe modules with proven hardware configurations.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="search-bar">
            <input className="search-input" placeholder="Search solutions..." value={search}
              onChange={(e) => setSearch(e.target.value)} id="solutions-search" />
            {CATEGORIES.map((c) => (
              <button key={c} className={`filter-btn ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          <div className="card-grid reveal-up" ref={sectionRef}>
            {filtered.map((sol) => (
              <Link href={`/solutions/${sol.slug}`} key={sol.id} className="glass-card reveal-child"
                style={{ textDecoration: "none", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* Color bar */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${sol.color}, transparent)` }} />
                <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="badge" style={{
                      background: `${sol.color}18`, color: sol.color, border: `1px solid ${sol.color}40`
                    }}>{sol.category}</span>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", fontWeight: 700, color: sol.color }}>
                      {sol.estimatedCost}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#f0f6ff" }}>
                    {sol.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7, flex: 1 }}>
                    {sol.problemDescription}
                  </p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {sol.tags.map((t) => (
                      <span key={t} style={{
                        fontSize: "0.7rem", padding: "3px 10px", borderRadius: 99,
                        background: "rgba(59,130,246,0.08)", color: "#64748b",
                        border: "1px solid rgba(59,130,246,0.15)"
                      }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ paddingTop: 12, borderTop: "1px solid rgba(56,139,253,0.08)", marginTop: "auto" }}>
                    <span style={{ color: sol.color, fontWeight: 700, fontSize: "0.85rem" }}>View Solution →</span>
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
