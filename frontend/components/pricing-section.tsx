"use client";
import { useState } from "react";
import styles from "./pricing-section.module.css";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    desc: "For small OEMs and pilot programs",
    priceMonthly: 15000,
    priceAnnual: 12000,
    highlight: false,
    features: [
      "Up to 10 robot connections",
      "Basic telemetry dashboard",
      "DGCA compliance workflows",
      "Email support",
      "5 user seats",
      "1 mission zone",
    ],
    cta: "Get Started",
    note: "14-day free trial",
  },
  {
    id: "professional",
    name: "Professional",
    desc: "For growing fleets and enterprise OEMs",
    priceMonthly: 45000,
    priceAnnual: 36000,
    highlight: true,
    features: [
      "Up to 50 robot connections",
      "Real-time telemetry & replay",
      "AI mission planner",
      "White-label branding",
      "Priority support (4h SLA)",
      "25 user seats",
      "Unlimited mission zones",
      "API access & webhooks",
    ],
    cta: "Start Free Trial",
    note: "Most popular plan",
  },
  {
    id: "scale",
    name: "Scale",
    desc: "For large fleets and defense integrators",
    priceMonthly: 85000,
    priceAnnual: 68000,
    highlight: false,
    features: [
      "Unlimited robot connections",
      "All Professional features",
      "3D photogrammetry cloud",
      "Predictive maintenance AI",
      "BCPDS defense compliance",
      "Unlimited user seats",
      "Custom ERP integrations",
      "99.9% SLA guarantee",
    ],
    cta: "Contact Sales",
    note: "Volume discounts available",
  },
  {
    id: "oem",
    name: "OEM White-Label",
    desc: "For hardware manufacturers as distribution channel",
    priceMonthly: 0,
    priceAnnual: 0,
    highlight: false,
    features: [
      "Full platform white-labeling",
      "Your domain & mobile app",
      "Revenue share model",
      "Partner onboarding support",
      "Co-marketing materials",
      "Dedicated account manager",
      "API partner ecosystem",
      "Custom SLAs & DPAs",
    ],
    cta: "Become a Partner",
    note: "B2B2B partnership",
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 100 });

  const formatPrice = (plan: typeof PLANS[0]) => {
    if (plan.priceMonthly === 0) return "Custom";
    const price = annual ? plan.priceAnnual : plan.priceMonthly;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <section className={`section ${styles.section} reveal-up`} id="pricing" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className="section-label">Pricing</p>
          <h2 className="section-title">
            Transparent pricing for<br />
            <span className="gradient-text">every stage of growth</span>
          </h2>
          <p className="section-subtitle">
            All plans include DGCA compliance, real-time telemetry, and our hardware-agnostic SDK. Scale as your fleet grows.
          </p>

          {/* Toggle */}
          <div className={styles.toggle}>
            <span className={`${styles.toggleLabel} ${!annual ? styles.toggleActive : ""}`}>Monthly</span>
            <button
              className={styles.toggleSwitch}
              onClick={() => setAnnual(!annual)}
              id="pricing-toggle"
              aria-label="Toggle annual pricing"
            >
              <span className={`${styles.toggleKnob} ${annual ? styles.toggleKnobRight : ""}`} />
            </button>
            <span className={`${styles.toggleLabel} ${annual ? styles.toggleActive : ""}`}>
              Annual
              <span className={styles.saveBadge}>Save 20%</span>
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`glass-card ${styles.card} ${p.highlight ? styles.highlight : ""} reveal-child`}
              id={`pricing-${p.id}`}
            >
              {p.highlight && (
                <div className={styles.popularBadge}>
                  <span className="badge badge-blue">⭐ Most Popular</span>
                </div>
              )}
              <div className={styles.planName}>{p.name}</div>
              <div className={styles.planDesc}>{p.desc}</div>
              <div className={styles.priceRow}>
                <span className={`${styles.price} ${p.highlight ? "gradient-text" : ""}`}>{formatPrice(p)}</span>
                <span className={styles.period}>{p.priceMonthly > 0 ? "/month" : ""}</span>
              </div>
              <ul className={styles.features}>
                {p.features.map((f) => (
                  <li key={f} className={styles.feature}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="7" fill="rgba(16,185,129,0.15)"/>
                      <path d="M4 7l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={`#${p.id}-cta`}
                id={`pricing-${p.id}-cta`}
                className={p.highlight ? "btn-primary" : "btn-secondary"}
                style={{ width: "100%", justifyContent: "center", marginTop: "auto" }}
              >
                {p.cta}
              </a>
              <p className={styles.note}>{p.note}</p>
            </div>
          ))}
        </div>

        {/* Enterprise note */}
        <div className={styles.enterpriseNote}>
          <span>🇮🇳</span>
          <span>GST-ready invoicing · PLI-scheme compatible · DPIIT-recognized startup pricing available</span>
        </div>
      </div>
    </section>
  );
}
