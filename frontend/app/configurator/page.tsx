"use client";
import { useState } from "react";

const USE_CASES = [
  "Agriculture / Crop Spraying",
  "Industrial Inspection",
  "Defense / Surveillance",
  "Delivery / Logistics",
  "Mapping / Photogrammetry",
  "Entertainment / FPV",
];

const RECOMMENDATIONS = [
  {
    name: "Hello Universe Agri-Drone Kit",
    desc: "Optimized for agricultural spraying with 16L tank, RTK GPS, and swath planning integration.",
    price: "₹3,85,000",
    match: 95,
    features: ["16L spray tank", "RTK GPS", "HU SDK integrated", "Weather API"],
    color: "#10b981",
  },
  {
    name: "Hello Universe Industrial Scout",
    desc: "Compact inspection drone with thermal + RGB cameras, BVLOS capable, and cloud photogrammetry.",
    price: "₹5,20,000",
    match: 82,
    features: ["Thermal camera", "4K RGB", "BVLOS ready", "3D mapping"],
    color: "#3b82f6",
  },
  {
    name: "Hello Universe Fleet Starter",
    desc: "Entry-level fleet-ready drone with MAVLink telemetry, DGCA compliance module, and mission planning.",
    price: "₹2,15,000",
    match: 70,
    features: ["MAVLink 2.0", "DGCA module", "45min flight time", "5km range"],
    color: "#00c5e8",
  },
];

export default function ConfiguratorPage() {
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(500000);
  const [useCase, setUseCase] = useState("");
  const [fleetSize, setFleetSize] = useState("1-5");
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    setShowResults(true);
    setStep(4);
  };

  return (
    <div className="page-enter" style={{ paddingTop: "calc(var(--nav-height) + 40px)", paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p className="section-label">Robot Configurator</p>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
            Find the perfect robot for<br />
            <span className="gradient-text">your mission</span>
          </h1>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Answer a few questions and our AI will recommend the ideal configuration for your use case and budget.
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40, justifyContent: "center" }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{
              width: s === step ? 48 : 32, height: 6, borderRadius: 99,
              background: s <= step ? "linear-gradient(90deg, #00c5e8, #f5a520)" : "rgba(0,197,232,0.1)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {!showResults ? (
          <div className="glass-card" style={{ padding: 40, minHeight: 300 }}>
            {step === 1 && (
              <div style={{ animation: "pageSlideIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 8 }}>
                  What&apos;s your primary use case?
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 24 }}>Select the application that best matches your needs</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                  {USE_CASES.map((uc) => (
                    <button key={uc} onClick={() => { setUseCase(uc); setStep(2); }}
                      className={`glass-card`}
                      style={{
                        padding: "18px 20px", textAlign: "left", cursor: "pointer",
                        border: useCase === uc ? "1px solid rgba(0,197,232,0.5)" : undefined,
                        background: useCase === uc ? "rgba(0,197,232,0.06)" : undefined,
                        fontSize: "0.9rem", fontWeight: 600, color: "#f0f6ff", fontFamily: "'Inter', sans-serif",
                      }}>
                      {uc}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div style={{ animation: "pageSlideIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 8 }}>
                  What&apos;s your budget?
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 32 }}>Drag the slider to set your budget range</p>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.5rem", fontWeight: 700,
                    background: "linear-gradient(135deg, #00c5e8, #f5a520)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>₹{budget.toLocaleString("en-IN")}</span>
                </div>
                <input type="range" min={100000} max={2000000} step={50000} value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#00c5e8", marginBottom: 8 }} id="budget-slider"/>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#475569", marginBottom: 32 }}>
                  <span>₹1,00,000</span>
                  <span>₹20,00,000</span>
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button className="btn-primary" onClick={() => setStep(3)}>Next</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ animation: "pageSlideIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 8 }}>
                  Fleet size?
                </h2>
                <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 24 }}>How many robots do you plan to operate?</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 32 }}>
                  {["1-5", "6-20", "21-50", "50+"].map((size) => (
                    <button key={size} onClick={() => setFleetSize(size)} className="glass-card"
                      style={{
                        padding: "18px 20px", textAlign: "center", cursor: "pointer",
                        border: fleetSize === size ? "1px solid rgba(0,197,232,0.5)" : undefined,
                        background: fleetSize === size ? "rgba(0,197,232,0.06)" : undefined,
                        fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#f0f6ff",
                      }}>
                      {size} <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 400 }}>robots</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                  <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
                  <button className="btn-primary" onClick={handleSubmit}>Get Recommendations</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ animation: "pageSlideIn 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span className="badge badge-cyan" style={{ marginBottom: 8 }}>AI Recommendation</span>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#f0f6ff" }}>
                Based on your requirements
              </h2>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                {useCase} · Budget ₹{budget.toLocaleString("en-IN")} · {fleetSize} robots
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {RECOMMENDATIONS.map((rec, i) => (
                <div key={rec.name} className="glass-card" style={{
                  padding: 28, display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start",
                  borderColor: i === 0 ? `${rec.color}50` : undefined,
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#f0f6ff" }}>
                        {rec.name}
                      </h3>
                      {i === 0 && <span className="badge badge-cyan">Best Match</span>}
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7, marginBottom: 16 }}>{rec.desc}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {rec.features.map(f => (
                        <span key={f} style={{
                          fontSize: "0.7rem", padding: "3px 10px", borderRadius: 99,
                          background: `${rec.color}10`, color: rec.color,
                          border: `1px solid ${rec.color}30`, fontWeight: 600,
                        }}>{f}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700,
                      background: `linear-gradient(135deg, ${rec.color}, #f5a520)`,
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      marginBottom: 4,
                    }}>{rec.price}</div>
                    <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: 12 }}>per unit</div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 14px", borderRadius: 99,
                      background: `${rec.color}12`, border: `1px solid ${rec.color}30`,
                    }}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, color: rec.color }}>
                        {rec.match}%
                      </span>
                      <span style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase" }}>match</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button className="btn-secondary" onClick={() => { setShowResults(false); setStep(1); }} style={{ marginRight: 12 }}>
                Start Over
              </button>
              <a href="/#demo" className="btn-primary" style={{ padding: "14px 32px" }}>
                Request Quote
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
