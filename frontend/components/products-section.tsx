import Image from "next/image";
import styles from "./products-section.module.css";

const PRODUCTS = [
  {
    id: "orbitops-core",
    name: "Hello Universe Core",
    tagline: "Fleet Command Center",
    price: "₹45,000",
    period: "/month",
    image: "/product_fleet_dashboard.png",
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
    image: "/product_agriculture.png",
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
    cta: "Request Demo",
    ctaStyle: "secondary",
  },
  {
    id: "orbitops-defense",
    name: "Hello Universe Defense",
    tagline: "Tactical Operations Stack",
    price: "Custom",
    period: "",
    image: "/product_defense.png",
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
    cta: "Contact Sales",
    ctaStyle: "secondary",
  },
  {
    id: "orbitops-enterprise",
    name: "Hello Universe Enterprise",
    tagline: "Industrial Inspection & Infrastructure",
    price: "₹85,000",
    period: "/month",
    image: "/product_enterprise.png",
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
    cta: "Request Demo",
    ctaStyle: "secondary",
  },
];

export function ProductsSection() {
  return (
    <section className={`section ${styles.section}`} id="products">
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
            <div key={p.id} className={`glass-card ${styles.card}`} id={p.id}>
              {/* Image */}
              <div className={styles.imageWrapper}>
                <Image
                  src={p.image}
                  alt={p.name}
                  width={600}
                  height={338}
                  className={styles.image}
                />
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
