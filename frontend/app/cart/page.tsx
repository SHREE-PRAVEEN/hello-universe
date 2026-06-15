"use client";
import { useState } from "react";
import Link from "next/link";

const MOCK_CART = [
  { id: "1", name: "Pixhawk 6X Autopilot", price: 28500, quantity: 1, color: "#00c5e8" },
  { id: "2", name: "LiDAR Sensor Module L1", price: 45000, quantity: 1, color: "#3b82f6" },
  { id: "3", name: "Smart Battery 6S 22000mAh", price: 32500, quantity: 2, color: "#f43f5e" },
];

export default function CartPage() {
  const [items, setItems] = useState(MOCK_CART);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const gst = Math.round(subtotal * 0.18);

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter(i => i.quantity > 0));
  };

  return (
    <div className="page-enter" style={{ paddingTop: "calc(var(--nav-height) + 40px)", paddingBottom: 80 }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title" style={{ fontSize: "2rem", marginBottom: 32 }}>
          Your <span className="gradient-text">Cart</span>
        </h1>

        {items.length === 0 ? (
          <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🛒</div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 8 }}>
              Your cart is empty
            </h3>
            <p style={{ color: "#64748b", marginBottom: 24 }}>Browse our marketplace to add components</p>
            <Link href="/marketplace" className="btn-primary">Browse Marketplace</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div key={item.id} className="glass-card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                  {/* Icon */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${item.color}12`, border: `1px solid ${item.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="6" fill="none" stroke={item.color} strokeWidth="1.5"/>
                      <circle cx="10" cy="10" r="2" fill={item.color}/>
                    </svg>
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f0f6ff" }}>{item.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: 2 }}>₹{item.price.toLocaleString("en-IN")} each</div>
                  </div>

                  {/* Quantity */}
                  <div style={{ display: "flex", border: "1px solid rgba(0,197,232,0.2)", borderRadius: 6, overflow: "hidden" }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{
                      width: 30, height: 30, background: "rgba(0,0,0,0.3)", border: "none",
                      color: "#94a3b8", cursor: "pointer", fontSize: "0.9rem"
                    }}>−</button>
                    <span style={{
                      width: 36, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, color: "#f0f6ff", background: "rgba(0,0,0,0.2)", fontSize: "0.85rem",
                    }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{
                      width: 30, height: 30, background: "rgba(0,0,0,0.3)", border: "none",
                      color: "#94a3b8", cursor: "pointer", fontSize: "0.9rem"
                    }}>+</button>
                  </div>

                  {/* Total */}
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", fontWeight: 700,
                    color: "#f0f6ff", minWidth: 100, textAlign: "right"
                  }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass-card" style={{ padding: 28, position: "sticky", top: 100 }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#f0f6ff", marginBottom: 20 }}>
                Order Summary
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>Subtotal</span>
                  <span style={{ color: "#94a3b8", fontWeight: 600 }}>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>GST (18%)</span>
                  <span style={{ color: "#94a3b8", fontWeight: 600 }}>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#64748b" }}>Shipping</span>
                  <span style={{ color: "#10b981", fontWeight: 600 }}>Free</span>
                </div>
                <div className="divider" />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f0f6ff" }}>Total</span>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", fontWeight: 700,
                    background: "linear-gradient(135deg, #00c5e8, #f5a520)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>₹{(subtotal + gst).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20, padding: "14px" }}>
                Proceed to Checkout
              </button>
              <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#334155", marginTop: 8 }}>
                Secure checkout · GST invoice included
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
