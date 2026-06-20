"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

const Surface3DGL = dynamic(() => import("./Surface3DGL"), {
  ssr: false,
  loading: () => <div style={{ height: 340, borderRadius: 12, border: "1px solid var(--border-subtle)", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--foreground-subtle)", fontSize: "0.8rem" }}>Rendering surface…</div>,
});

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function mean(a: number[]) { return a.reduce((s, v) => s + v, 0) / a.length; }
function pearson(a: number[], b: number[]) {
  const ma = mean(a), mb = mean(b); let n = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) { const x = a[i] - ma, y = b[i] - mb; n += x * y; da += x * x; db += y * y; }
  return n / Math.sqrt(da * db);
}

// Δr(Δα, Δβ) directional-dependence surface, simulated live (the paper's Figure 4).
export default function DDSurface() {
  const z = useMemo(() => {
    const G = 16, n = 110;
    const grid: number[][] = [];
    for (let i = 0; i < G; i++) {
      const da = (i / (G - 1)) * 40;          // Δα ∈ [0, 40]
      const row: number[] = [];
      for (let j = 0; j < G; j++) {
        const db = (j / (G - 1)) * 50;        // Δβ ∈ [0, 50]
        const a1 = 0.5 + da, a2 = 0.5, b1 = db / 2 + 0.2, b2 = -db / 2 - 0.2;
        const rnd = mulberry32(((i + 1) * 73856093) ^ ((j + 1) * 19349663));
        const pts: { x: number; y: number }[] = [];
        for (let k = 0; k < n; k++) { const U = rnd(), V = rnd(); pts.push({ x: a1 * U + a2 * V, y: b1 * U + b2 * V }); }
        const ys = pts.map((p) => p.y), xs = pts.map((p) => p.x);
        const concY = [...pts].sort((p, q) => p.x - q.x).map((p) => p.y);
        const rY = pearson([...ys].sort((m, o) => m - o), concY);
        const concX = [...pts].sort((p, q) => p.y - q.y).map((p) => p.x);
        const rX = pearson([...xs].sort((m, o) => m - o), concX);
        row.push(rY - rX); // Δr = r(X→Y) − r(Y→X)
      }
      grid.push(row);
    }
    return grid;
  }, []);

  return <Surface3DGL z={z} xRange={[0, 40]} yRange={[0, 50]} xLabel="Δα" yLabel="Δβ" zLabel="Δr" zDecimals={3} />;
}
