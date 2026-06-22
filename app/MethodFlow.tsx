"use client";

import { useState } from "react";

export type Stage = { title: string; sub: string };

export default function MethodFlow({ stages, loop }: { stages: Stage[]; loop?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div style={{ marginTop: "22px" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: "6px", overflowX: "auto", padding: "4px 2px 14px" }}>
        {stages.map((s, i) => (
          <div key={s.title} style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            <div onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="card-hover"
              style={{
                width: "152px", minHeight: "118px", background: "var(--surface)",
                border: `1px solid ${hover === i ? "rgba(var(--accent-rgb),0.5)" : "var(--border-subtle)"}`,
                borderRadius: "13px", padding: "14px 13px", transition: "border-color .2s",
              }}>
              <div style={{
                width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.3)",
                color: "var(--accent)", fontSize: "0.82rem", fontWeight: 800, marginBottom: "10px",
                boxShadow: "0 0 14px rgba(var(--accent-rgb),0.2)",
              }}>{i + 1}</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--foreground)", lineHeight: 1.25, marginBottom: "3px" }}>{s.title}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--foreground-subtle)", lineHeight: 1.4 }}>{s.sub}</div>
            </div>
            {i < stages.length - 1 && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-subtle)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </div>
        ))}
      </div>
      {loop && (
        <div style={{
          display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px",
          background: "rgba(var(--accent-rgb),0.06)", border: "1px solid rgba(var(--accent-rgb),0.22)",
          borderRadius: "11px", marginTop: "2px",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          <span style={{ fontSize: "0.84rem", color: "var(--foreground-muted)", fontWeight: 500 }}>{loop}</span>
        </div>
      )}
    </div>
  );
}
