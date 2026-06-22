"use client";

import { useEffect, useRef, useState } from "react";

export type Stat = { value: number; suffix?: string; prefix?: string; decimals?: number; label: string };

function useCountUp(target: number, run: boolean, dur = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0, start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return n;
}

function Card({ stat, run }: { stat: Stat; run: boolean }) {
  const n = useCountUp(stat.value, run);
  const shown = (stat.decimals ?? 0) > 0 ? n.toFixed(stat.decimals) : Math.round(n).toLocaleString();
  return (
    <div className="stat-glow card-tier" style={{ background: "var(--surface)", border: "1px solid rgba(var(--accent-rgb),0.25)", borderRadius: "16px", padding: "24px 18px", textAlign: "center", flex: 1, minWidth: "150px" }}>
      <div className="gradient-heading" style={{ fontSize: "2.1rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>
        {stat.prefix ?? ""}{shown}{stat.suffix ?? ""}
      </div>
      <div style={{ fontSize: "0.76rem", color: "var(--foreground-muted)", marginTop: "8px", lineHeight: 1.5 }}>{stat.label}</div>
    </div>
  );
}

export default function StatCounter({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setRun(true)), { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "22px" }}>
      {stats.map((s) => <Card key={s.label} stat={s} run={run} />)}
    </div>
  );
}
