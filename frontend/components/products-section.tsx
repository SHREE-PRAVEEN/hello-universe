"use client";
import styles from "./products-section.module.css";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

/* ── SVG illustrations for each product ── */
function FleetDashboardIllustration() {
  return (
    <svg viewBox="0 0 400 200" fill="none" className={styles.illustration}>
      <rect width="400" height="200" fill="#061220" rx="8"/>
      <rect x="10" y="10" width="380" height="24" fill="rgba(0,197,232,0.06)" rx="4"/>
      <circle cx="24" cy="22" r="4" fill="#f43f5e" opacity="0.8"/>
      <circle cx="38" cy="22" r="4" fill="#f5a520" opacity="0.8"/>
      <circle cx="52" cy="22" r="4" fill="#10b981" opacity="0.8"/>
      {/* Stats */}
      {[[20,50,90,40],[120,50,90,40],[220,50,90,40],[320,50,70,40]].map(([x,y,w,h],i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="rgba(0,197,232,0.05)" rx="4" stroke="rgba(0,197,232,0.15)" strokeWidth="0.5"/>
          <rect x={x+8} y={y+8} width={30} height={6} fill="rgba(0,197,232,0.3)" rx="2"/>
          <rect x={x+8} y={y+20} width={50} height={4} fill="rgba(148,163,184,0.2)" rx="1"/>
        </g>
      ))}
      {/* Chart */}
      <rect x="20" y="100" width="230" height="90" fill="rgba(0,197,232,0.03)" rx="4" stroke="rgba(0,197,232,0.1)" strokeWidth="0.5"/>
      <path d="M30,170 C60,160 90,130 120,145 C150,160 180,120 210,135 C225,140 240,120 240,125" stroke="#00c5e8" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M30,170 C60,160 90,130 120,145 C150,160 180,120 210,135 C225,140 240,120 240,125 L240,180 L30,180 Z" fill="rgba(0,197,232,0.08)"/>
      {/* Map */}
      <rect x="260" y="100" width="130" height="90" fill="rgba(0,197,232,0.03)" rx="4" stroke="rgba(0,197,232,0.1)" strokeWidth="0.5"/>
      {[[285,130],[320,120],[300,150],[340,160],[310,140]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="rgba(0,197,232,0.6)" className={styles.blink} style={{ animationDelay: `${i*0.3}s` }}/>
      ))}
    </svg>
  );
}

function AgricultureIllustration() {
  return (
    <svg viewBox="0 0 400 200" fill="none" className={styles.illustration}>
      <rect width="400" height="200" fill="#051a0a" rx="8"/>
      {/* Field rows */}
      {Array.from({length:8}).map((_,i) => (
        <line key={i} x1="30" y1={40+i*20} x2="370" y2={40+i*20} stroke="rgba(16,185,129,0.1)" strokeWidth="1"/>
      ))}
      {/* Drone path */}
      <path d="M50,60 L350,60 L350,80 L50,80 L50,100 L350,100 L350,120 L50,120 L50,140 L350,140" stroke="rgba(16,185,129,0.4)" strokeWidth="1" strokeDasharray="4,4" fill="none"/>
      {/* Drone */}
      <g className={styles.droneAnim}>
        <circle cx="200" cy="100" r="8" fill="rgba(16,185,129,0.3)" stroke="#10b981" strokeWidth="1.5"/>
        <line x1="192" y1="100" x2="208" y2="100" stroke="#10b981" strokeWidth="1"/>
        <line x1="200" y1="92" x2="200" y2="108" stroke="#10b981" strokeWidth="1"/>
      </g>
      {/* Spray particles */}
      {Array.from({length:12}).map((_,i) => (
        <circle key={i} cx={180+Math.random()*40} cy={110+Math.random()*20} r="1" fill="rgba(16,185,129,0.4)" className={styles.spray} style={{animationDelay:`${i*0.15}s`}}/>
      ))}
      {/* NDVI overlay */}
      <rect x="20" y="160" width="120" height="30" fill="rgba(16,185,129,0.06)" rx="4" stroke="rgba(16,185,129,0.2)" strokeWidth="0.5"/>
      <text x="32" y="178" fill="rgba(16,185,129,0.7)" fontSize="9" fontFamily="monospace">NDVI: 0.72 ●</text>
    </svg>
  );
}

function DefenseIllustration() {
  return (
    <svg viewBox="0 0 400 200" fill="none" className={styles.illustration}>
      <rect width="400" height="200" fill="#0d0a02" rx="8"/>
      {/* Radar circles */}
      {[30,60,90].map((r) => (
        <circle key={r} cx="200" cy="100" r={r} stroke="rgba(245,165,32,0.12)" strokeWidth="0.5" fill="none"/>
      ))}
      <line x1="200" y1="10" x2="200" y2="190" stroke="rgba(245,165,32,0.06)" strokeWidth="0.5"/>
      <line x1="110" y1="100" x2="290" y2="100" stroke="rgba(245,165,32,0.06)" strokeWidth="0.5"/>
      {/* Sweep line */}
      <line x1="200" y1="100" x2="280" y2="40" stroke="rgba(245,165,32,0.4)" strokeWidth="1" className={styles.sweep}/>
      {/* Targets */}
      {[[160,70],[240,60],[170,130],[260,120],[220,150]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="3" fill="rgba(245,165,32,0.6)" className={styles.blink} style={{animationDelay:`${i*0.4}s`}}/>
          <circle cx={cx} cy={cy} r="6" fill="none" stroke="rgba(245,165,32,0.2)" strokeWidth="0.5"/>
        </g>
      ))}
      {/* Status bar */}
      <rect x="20" y="170" width="140" height="20" fill="rgba(245,165,32,0.06)" rx="3" stroke="rgba(245,165,32,0.2)" strokeWidth="0.5"/>
      <text x="30" y="184" fill="rgba(245,165,32,0.6)" fontSize="8" fontFamily="monospace">🔒 AES-256 ENCRYPTED</text>
    </svg>
  );
}

function EnterpriseIllustration() {
  return (
    <svg viewBox="0 0 400 200" fill="none" className={styles.illustration}>
      <rect width="400" height="200" fill="#06061a" rx="8"/>
      {/* 3D wireframe */}
      <polygon points="100,50 300,50 350,100 250,150 50,150 0,100" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="0.5"/>
      <polygon points="100,50 300,50 350,100 250,150 50,150 0,100" fill="rgba(99,102,241,0.03)"/>
      {/* Vertical lines for depth */}
      {[100,150,200,250,300].map((x,i) => (
        <line key={i} x1={x} y1={50+i*5} x2={x-25} y2={100+i*5} stroke="rgba(99,102,241,0.1)" strokeWidth="0.5"/>
      ))}
      {/* Data streams */}
      {Array.from({length:6}).map((_,i) => (
        <line key={i} x1={60+i*60} y1={40} x2={60+i*60} y2={170} stroke="rgba(99,102,241,0.06)" strokeWidth="12" strokeLinecap="round"/>
      ))}
      {/* Point cloud dots */}
      {Array.from({length:30}).map((_,i) => (
        <circle key={i} cx={50+Math.random()*300} cy={40+Math.random()*120} r="1.5" fill={`rgba(99,102,241,${0.2+Math.random()*0.4})`} className={styles.blink} style={{animationDelay:`${i*0.1}s`}}/>
      ))}
      {/* Status */}
      <rect x="20" y="165" width="160" height="25" fill="rgba(99,102,241,0.06)" rx="4" stroke="rgba(99,102,241,0.2)" strokeWidth="0.5"/>
      <text x="32" y="182" fill="rgba(99,102,241,0.7)" fontSize="9" fontFamily="monospace">📊 10TB+ Daily Processing</text>
    </svg>
  );
}

const PRODUCTS = [
  {
    id: "orbitops-core",
    name: "Hello Universe Core",
    tagline: "Fleet Command Center",
    price: "₹14,000",
    period: "/month",
    Illustration: FleetDashboardIllustration,
    badge: "Most Popular",
    badgeClass: "badge-blue",
    description:
      "The unified operations hub for managing multi-robot fleets. Real-time telemetry, mission control, and DGCA compliance in a single white-label dashboard.",
    features: [
      "Up to 50 concurrent robot connections",
      "Real-time MAVLink/DDS telemetry",
      "DGCA Digital Sky integration",
      "Live map & geofencing",
      "Mission recording & replay",
      "Role-based access control",
    ],
    cta: "Start Free Trial",
    ctaStyle: "primary",
  },
  {
    id: "orbitops-agri",
    name: "Hello Universe Agri",
    tagline: "Precision Agriculture Suite",
    price: "₹28,000",
    period: "/month",
    Illustration: AgricultureIllustration,
    badge: "Agriculture",
    badgeClass: "badge-emerald",
    description:
      "Purpose-built for Indian agri-drone operators. Low-bandwidth optimized, automated swath planning, and seamless integration with digital agriculture platforms.",
    features: [
      "Automated spray route planning",
      "Multispectral NDVI mapping",
      "Offline-first low-bandwidth mode",
      "Regional language UI support",
      "Weather & wind API integration",
      "Farmer portal with reports",
    ],
    cta: "Comming soon",
    ctaStyle: "secondary",
  },
  {
    id: "orbitops-defense",
    name: "Hello Universe Defense",
    tagline: "Tactical Operations Stack",
    price: "Custom",
    period: "",
    Illustration: DefenseIllustration,
    badge: "Defense",
    badgeClass: "badge-orange",
    description:
      "BCPDS-compliant, zero-trust architecture for border surveillance, ISR, and swarm logistics. Encrypted end-to-end with anti-jamming protocol detection.",
    features: [
      "Encrypted MAVLink telemetry",
      "BCPDS / MIL-STD compliance",
      "Anti-jamming & spoofing alerts",
      "Swarm coordination engine",
      "Air-gapped deployment option",
      "24×7 dedicated support",
    ],
    cta: "Comming Soon",
    ctaStyle: "secondary",
  },
  {
    id: "orbitops-enterprise",
    name: "Hello Universe Enterprise",
    tagline: "Industrial Inspection & Infrastructure",
    price: "₹85,000",
    period: "/month",
    Illustration: EnterpriseIllustration,
    badge: "Enterprise",
    badgeClass: "badge-violet",
    description:
      "High-throughput data pipelines, BVLOS mission planning, 3D photogrammetry cloud, and predictive maintenance for oil & gas, mining, and infrastructure.",
    features: [
      "Unlimited fleet scale",
      "3D photogrammetry & volumetrics",
      "BVLOS mission planning & filing",
      "Predictive maintenance AI",
      "Custom ERP/GIS integrations",
      "White-label mobile app",
    ],
    cta: "Comming Soon",
    ctaStyle: "secondary",
  },
];

export function ProductsSection() {
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 120 });

  return (
    <section className={`section ${styles.section} reveal-up`} id="products" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <p className="section-label">Product Suite</p>
          <h2 className="section-title">
            Vertical-specialized modules for<br />
            <span className="gradient-text">every autonomous mission</span>
          </h2>
          <p className="section-subtitle">
            Choose a purpose-built product or combine modules for a custom stack. All products are white-label ready and interoperable.
          </p>
        </div>

        {/* Products grid */}
        <div className={styles.grid}>
          {PRODUCTS.map((p) => (
            <div key={p.id} className={`glass-card ${styles.card} reveal-child`} id={p.id}>
              {/* SVG Illustration */}
              <div className={styles.imageWrapper}>
                <p.Illustration />
                <span className={`badge ${p.badgeClass} ${styles.imageBadge}`}>{p.badge}</span>
              </div>

              {/* Body */}
              <div className={styles.body}>
                <div className={styles.nameRow}>
                  <div>
                    <h3 className={styles.name}>{p.name}</h3>
                    <p className={styles.tagline}>{p.tagline}</p>
                  </div>
                  <div className={styles.priceBox}>
                    <span className={styles.price}>{p.price}</span>
                    <span className={styles.period}>{p.period}</span>
                  </div>
                </div>

                <p className={styles.desc}>{p.description}</p>

                <ul className={styles.features}>
                  {p.features.map((f) => (
                    <li key={f} className={styles.feature}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.checkIcon}>
                        <circle cx="7" cy="7" r="7" fill="rgba(16,185,129,0.15)"/>
                        <path d="M4 7l2 2 4-4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`#${p.id}-cta`}
                  className={p.ctaStyle === "primary" ? "btn-primary" : "btn-secondary"}
                  style={{ width: "100%", justifyContent: "center", marginTop: "auto" }}
                  id={`${p.id}-cta`}
                >
                  {p.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
