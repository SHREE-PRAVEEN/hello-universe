"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./courses.module.css";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

const MOCK_COURSES = [
  {
    id: "1", slug: "drone-operations-101", title: "Drone Operations 101",
    description: "Master the fundamentals of UAV operations including pre-flight checks, flight planning, and DGCA regulatory compliance.",
    level: "Beginner", tags: ["UAV", "DGCA", "Operations"], lessons: 12, duration: "6 hours",
    color: "#00c5e8",
  },
  {
    id: "2", slug: "advanced-fleet-management", title: "Advanced Fleet Management",
    description: "Learn enterprise-grade fleet orchestration including swarm coordination, mission scheduling, and telemetry management.",
    level: "Advanced", tags: ["Fleet", "Swarm", "Enterprise"], lessons: 18, duration: "10 hours",
    color: "#f5a520",
  },
  {
    id: "3", slug: "precision-agriculture-drones", title: "Precision Agriculture with Drones",
    description: "Deep dive into agri-drone applications including multispectral imaging, NDVI analysis, and automated spray route planning.",
    level: "Intermediate", tags: ["Agriculture", "NDVI", "Spray"], lessons: 15, duration: "8 hours",
    color: "#10b981",
  },
  {
    id: "4", slug: "ros2-integration-workshop", title: "ROS2 Integration Workshop",
    description: "Hands-on workshop to integrate ROS2-based robots with Hello Universe telemetry and mission planning modules.",
    level: "Advanced", tags: ["ROS2", "SDK", "Integration"], lessons: 10, duration: "5 hours",
    color: "#6366f1",
  },
  {
    id: "5", slug: "dgca-compliance-masterclass", title: "DGCA Compliance Masterclass",
    description: "Complete guide to DGCA regulations, NPNT compliance, Digital Sky registration, and BVLOS permissions for drone operators.",
    level: "Intermediate", tags: ["DGCA", "NPNT", "Compliance"], lessons: 8, duration: "4 hours",
    color: "#f43f5e",
  },
  {
    id: "6", slug: "mavlink-protocol-deep-dive", title: "MAVLink Protocol Deep Dive",
    description: "Technical deep dive into MAVLink protocol implementation, custom message types, and telemetry data pipelines.",
    level: "Advanced", tags: ["MAVLink", "Protocol", "Telemetry"], lessons: 14, duration: "7 hours",
    color: "#3b82f6",
  },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const sectionRef = useScrollReveal<HTMLDivElement>({ stagger: 100 });

  const filtered = MOCK_COURSES.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchLevel = level === "All" || c.level === level;
    return matchSearch && matchLevel;
  });

  return (
    <div className="page-enter">
      <section className="page-hero">
        <div className={styles.heroBg}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
        </div>
        <div className="container page-content">
          <p className="section-label">Learning Hub</p>
          <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)" }}>
            Master the future of<br />
            <span className="gradient-text">autonomous systems</span>
          </h1>
          <p className="section-subtitle">
            Industry-leading courses designed by drone engineers, fleet operators, and DGCA compliance experts.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Search & filters */}
          <div className="search-bar">
            <input
              className="search-input"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="courses-search"
            />
            {LEVELS.map((l) => (
              <button
                key={l}
                className={`filter-btn ${level === l ? "active" : ""}`}
                onClick={() => setLevel(l)}
                id={`filter-${l.toLowerCase()}`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="card-grid reveal-up" ref={sectionRef}>
            {filtered.map((course) => (
              <Link href={`/courses/${course.slug}`} key={course.id} className={`glass-card ${styles.card} reveal-child`} style={{ textDecoration: "none" }}>
                {/* Visual header */}
                <div className={styles.cardVisual} style={{ borderBottom: `2px solid ${course.color}` }}>
                  <svg viewBox="0 0 320 120" fill="none" className={styles.cardSvg}>
                    <rect width="320" height="120" fill={`${course.color}08`}/>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <circle key={i} cx={40 + i * 55} cy={60} r={8 + Math.random() * 12}
                        fill="none" stroke={`${course.color}30`} strokeWidth="1"/>
                    ))}
                    <text x="20" y="30" fill={`${course.color}80`} fontSize="11" fontFamily="'Space Grotesk', sans-serif" fontWeight="700">
                      {course.lessons} LESSONS
                    </text>
                    <text x="20" y="105" fill={`${course.color}50`} fontSize="9" fontFamily="monospace">
                      {course.duration}
                    </text>
                  </svg>
                  <span className={`badge ${styles.levelBadge}`} style={{
                    background: `${course.color}18`,
                    color: course.color,
                    borderColor: `${course.color}40`,
                  }}>
                    {course.level}
                  </span>
                </div>

                {/* Body */}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{course.title}</h3>
                  <p className={styles.cardDesc}>{course.description}</p>
                  <div className={styles.tags}>
                    {course.tags.map((t) => (
                      <span key={t} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                  <div className={styles.cardFooter}>
                    <span style={{ color: course.color, fontWeight: 700, fontSize: "0.85rem" }}>
                      Start Learning →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className={styles.empty}>
              <p>No courses found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
