"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./stats-section.module.css";

const STATS = [
  { value: 13, suffix: "B", prefix: "$", label: "Indian Drone Market by 2030", sub: "Projected valuation" },
  { value: 21, suffix: "%", prefix: "", label: "CAGR Growth Rate", sub: "2022 – 2030" },
  { value: 300, suffix: "+", prefix: "", label: "Hardware OEM Partners", sub: "UAVs & AMRs" },
  { value: 99.8, suffix: "%", prefix: "", label: "Fleet Uptime SLA", sub: "Enterprise grade" },
];

function useCountUp(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const steps = 60;
    const step = target / steps;
    let cur = 0;
    let frame = 0;
    const timer = setInterval(() => {
      cur += step;
      frame++;
      setVal(Math.min(cur, target));
      if (frame >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return val;
}

function StatCard({ stat, animate }: { stat: typeof STATS[0]; animate: boolean }) {
  const val = useCountUp(stat.value, 1600, animate);
  const display = stat.value % 1 === 0 ? Math.round(val) : val.toFixed(1);
  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.value}>
        <span className={styles.prefix}>{stat.prefix}</span>
        <span className="gradient-text">{display}</span>
        <span className={styles.suffix}>{stat.suffix}</span>
      </div>
      <div className={styles.label}>{stat.label}</div>
      <div className={styles.sub}>{stat.sub}</div>
    </div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setAnimate(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`section ${styles.section}`} ref={ref}>
      <div className="divider" />
      <div className="container">
        <div className={styles.grid}>
          {STATS.map((s) => <StatCard key={s.label} stat={s} animate={animate} />)}
        </div>
      </div>
      <div className="divider" />
    </section>
  );
}
