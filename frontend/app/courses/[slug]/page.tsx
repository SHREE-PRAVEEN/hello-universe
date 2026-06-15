"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useScrollReveal } from "@/lib/use-scroll-reveal";

const MOCK_COURSE = {
  title: "Drone Operations 101",
  description: "Master the fundamentals of UAV operations including pre-flight checks, flight planning, and DGCA regulatory compliance. This comprehensive course is designed for beginners entering the drone industry.",
  level: "Beginner",
  tags: ["UAV", "DGCA", "Operations"],
  lessons: [
    { id: "1", title: "Introduction to UAV Systems", order: 1, duration: "25 min", completed: true },
    { id: "2", title: "DGCA Regulatory Framework", order: 2, duration: "35 min", completed: true },
    { id: "3", title: "Pre-Flight Safety Checks", order: 3, duration: "20 min", completed: false },
    { id: "4", title: "Flight Planning Fundamentals", order: 4, duration: "40 min", completed: false },
    { id: "5", title: "Weather Assessment & NOTAM", order: 5, duration: "30 min", completed: false },
    { id: "6", title: "MAVLink Telemetry Basics", order: 6, duration: "35 min", completed: false },
    { id: "7", title: "Emergency Procedures", order: 7, duration: "25 min", completed: false },
    { id: "8", title: "Mission Logging & Compliance", order: 8, duration: "30 min", completed: false },
    { id: "9", title: "Fleet Communication Protocols", order: 9, duration: "20 min", completed: false },
    { id: "10", title: "Certification & Next Steps", order: 10, duration: "15 min", completed: false },
  ],
};

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const sectionRef = useScrollReveal<HTMLDivElement>({ stagger: 60 });
  const completedCount = MOCK_COURSE.lessons.filter(l => l.completed).length;
  const progress = Math.round((completedCount / MOCK_COURSE.lessons.length) * 100);

  return (
    <div className="page-enter" style={{ paddingTop: "calc(var(--nav-height) + 40px)" }}>
      <div className="container" style={{ maxWidth: 900, paddingBottom: 80 }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 24, display: "flex", gap: 8, alignItems: "center", fontSize: "0.8rem", color: "#475569" }}>
          <Link href="/courses" style={{ color: "#00c5e8", textDecoration: "none" }}>Courses</Link>
          <span>›</span>
          <span style={{ color: "#94a3b8" }}>{slug.replace(/-/g, " ")}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <span className="badge badge-cyan">{MOCK_COURSE.level}</span>
            {MOCK_COURSE.tags.map(t => (
              <span key={t} className="badge badge-blue">{t}</span>
            ))}
          </div>
          <h1 className="section-title" style={{ fontSize: "2.2rem", marginBottom: 16 }}>{MOCK_COURSE.title}</h1>
          <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.8, maxWidth: 700 }}>
            {MOCK_COURSE.description}
          </p>
        </div>

        {/* Progress */}
        <div className="glass-card" style={{ padding: "24px 28px", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f0f6ff" }}>Your Progress</span>
            <span className="gradient-text" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: "rgba(0,197,232,0.1)", overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`, height: "100%", borderRadius: 99,
              background: "linear-gradient(90deg, #00c5e8, #f5a520)",
              transition: "width 0.6s ease"
            }} />
          </div>
          <div style={{ marginTop: 8, fontSize: "0.75rem", color: "#475569" }}>
            {completedCount} of {MOCK_COURSE.lessons.length} lessons completed
          </div>
        </div>

        {/* Lessons list */}
        <div ref={sectionRef} className="reveal-up">
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 20, color: "#f0f6ff" }}>
            Course Lessons
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MOCK_COURSE.lessons.map((lesson) => (
              <div key={lesson.id} className="glass-card reveal-child" style={{
                padding: "18px 24px", display: "flex", alignItems: "center", gap: 16,
                cursor: "pointer", borderColor: lesson.completed ? "rgba(16,185,129,0.3)" : undefined,
              }}>
                {/* Number */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: lesson.completed ? "rgba(16,185,129,0.15)" : "rgba(0,197,232,0.08)",
                  border: `1px solid ${lesson.completed ? "rgba(16,185,129,0.3)" : "rgba(0,197,232,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", fontWeight: 700,
                  color: lesson.completed ? "#10b981" : "#00c5e8", flexShrink: 0,
                }}>
                  {lesson.completed ? "✓" : lesson.order}
                </div>

                {/* Title */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f0f6ff" }}>{lesson.title}</div>
                </div>

                {/* Duration */}
                <span style={{ fontSize: "0.75rem", color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                  {lesson.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
