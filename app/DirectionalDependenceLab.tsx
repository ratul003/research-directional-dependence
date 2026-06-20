"use client";

import { useMemo, useState } from "react";

// Deterministic PRNG so SSR and first client render agree (no hydration mismatch).
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
  const ma = mean(a), mb = mean(b);
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) { const x = a[i] - ma, y = b[i] - mb; num += x * y; da += x * x; db += y * y; }
  return num / Math.sqrt(da * db);
}

const N = 300;

const STOPS = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
function viridis(t: number): string {
  t = Math.max(0, Math.min(1, t));
  const s = t * (STOPS.length - 1), i = Math.floor(s), f = s - i;
  const a = STOPS[i], b = STOPS[Math.min(i + 1, STOPS.length - 1)];
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
}

export default function DirectionalDependenceLab() {
  const [a1, setA1] = useState(2.0);
  const [a2, setA2] = useState(0.5);
  const [b1, setB1] = useState(2.4);
  const [b2, setB2] = useState(-1.6);
  const [dist, setDist] = useState<"uniform" | "normal">("uniform");
  const [seed, setSeed] = useState(7);
  const [hi, setHi] = useState<number | null>(null);

  const { pts, rY, rX, dr } = useMemo(() => {
    const rnd = mulberry32(seed * 2654435761);
    const draw = () => {
      if (dist === "uniform") return rnd();
      // Box-Muller for standard normal
      let u = 0, v = 0;
      while (u === 0) u = rnd();
      while (v === 0) v = rnd();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < N; i++) {
      const U = draw(), V = draw();
      pts.push({ x: a1 * U + a2 * V, y: b1 * U + b2 * V });
    }
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    // Y order statistics vs Y concomitants (ordered by X)
    const concY = [...pts].sort((p, q) => p.x - q.x).map((p) => p.y);
    const sortedY = [...ys].sort((m, n) => m - n);
    const rY = pearson(sortedY, concY);
    // X order statistics vs X concomitants (ordered by Y)
    const concX = [...pts].sort((p, q) => p.y - q.y).map((p) => p.x);
    const sortedX = [...xs].sort((m, n) => m - n);
    const rX = pearson(sortedX, concX);
    return { pts, rY, rX, dr: rX - rY };
  }, [a1, a2, b1, b2, dist, seed]);

  // verdict (Sungur's ordering criterion): smaller |r| side is the one whose order is disrupted -> it is the response
  const absY = Math.abs(rY), absX = Math.abs(rX);
  const gap = Math.abs(absY - absX);
  let verdict = "Inconclusive, the two sides are ≈ equal";
  let driver: "x" | "y" | "none" = "none";
  if (gap >= 0.05) { if (absY < absX) { verdict = "X → Y  (X drives Y)"; driver = "x"; } else { verdict = "Y → X  (Y drives X)"; driver = "y"; } }

  // scatter scaling
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
  const W = 300, H = 300, pad = 10;
  const sx = (x: number) => pad + ((x - xmin) / (xmax - xmin || 1)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - ymin) / (ymax - ymin || 1)) * (H - 2 * pad);

  const Slider = ({ label, val, set, min, max, step }: { label: string; val: number; set: (n: number) => void; min: number; max: number; step: number }) => (
    <label style={{ display: "block", marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "5px" }}>
        <span style={{ color: "var(--foreground-muted)" }} dangerouslySetInnerHTML={{ __html: label }} />
        <span style={{ color: "var(--accent-light)", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{val.toFixed(2)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => set(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)" }} />
    </label>
  );

  const Bar = ({ label, val, sub }: { label: string; val: number; sub: string }) => (
    <div style={{ flex: 1, minWidth: "120px" }}>
      <div style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--foreground-subtle)", marginBottom: "6px" }} dangerouslySetInnerHTML={{ __html: label }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <div className="gradient-heading" style={{ fontSize: "1.7rem", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{val.toFixed(3)}</div>
      </div>
      <div style={{ height: "6px", borderRadius: "3px", background: "var(--surface-elevated)", marginTop: "8px", overflow: "hidden" }}>
        <div style={{ width: `${Math.abs(val) * 100}%`, height: "100%", background: "var(--accent)", boxShadow: "0 0 8px rgba(var(--accent-rgb),0.6)" }} />
      </div>
      <div style={{ fontSize: "0.68rem", color: "var(--foreground-subtle)", marginTop: "6px" }}>{sub}</div>
    </div>
  );

  return (
    <div className="lab-grid card-tier" style={{
      marginTop: "22px", background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "18px", padding: "24px",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
          {(["uniform", "normal"] as const).map((d) => (
            <button key={d} onClick={() => setDist(d)} style={{
              flex: 1, padding: "9px 0", borderRadius: "9px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
              textTransform: "capitalize",
              background: dist === d ? "rgba(var(--accent-rgb),0.16)" : "transparent",
              border: `1px solid ${dist === d ? "var(--accent)" : "var(--border)"}`,
              color: dist === d ? "var(--accent-light)" : "var(--foreground-muted)",
            }}>{d} (U,V)</button>
          ))}
        </div>
        <Slider label="&alpha;&#8321; (U &rarr; X)" val={a1} set={setA1} min={0.1} max={5} step={0.1} />
        <Slider label="&alpha;&#8322; (V &rarr; X)" val={a2} set={setA2} min={0.1} max={5} step={0.1} />
        <Slider label="&beta;&#8321; (U &rarr; Y)" val={b1} set={setB1} min={0.1} max={5} step={0.1} />
        <Slider label="&beta;&#8322; (V &rarr; Y)" val={b2} set={setB2} min={-5} max={-0.1} step={0.1} />
        <button onClick={() => setSeed((s) => s + 1)} style={{
          width: "100%", marginTop: "6px", padding: "10px 0", borderRadius: "9px", cursor: "pointer",
          background: "transparent", border: "1px dashed var(--border)", color: "var(--foreground-muted)", fontSize: "0.8rem", fontWeight: 600,
        }}>↻ Resample {N} points</button>
        <p style={{ fontSize: "0.7rem", color: "var(--foreground-subtle)", marginTop: "12px", lineHeight: 1.5 }}>
          Constraints from the paper: &alpha;&#8321; &gt; &alpha;&#8322; &gt; 0, &beta;&#8321; &gt; 0, &beta;&#8322; &lt; 0.
        </p>
      </div>

      <div style={{ minWidth: 0 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", background: "var(--background)", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
          {pts.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={hi === i ? 4.5 : 2.3}
              fill={viridis((p.x - xmin) / (xmax - xmin || 1))}
              stroke={hi === i ? "#fff" : "none"} strokeWidth={hi === i ? 1.2 : 0}
              opacity={hi === null || hi === i ? 0.85 : 0.4}
              onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(null)} />
          ))}
          {hi !== null && (
            <g pointerEvents="none">
              <rect x={Math.min(sx(pts[hi].x) + 6, W - 96)} y={Math.max(sy(pts[hi].y) - 30, 2)} width={90} height={26} rx={5} fill="rgba(10,10,15,0.95)" stroke="var(--accent)" strokeWidth={0.7} />
              <text x={Math.min(sx(pts[hi].x) + 11, W - 91)} y={Math.max(sy(pts[hi].y) - 18, 14)} fontSize="8.5" fill="#e8e8f0">X = {pts[hi].x.toFixed(2)}</text>
              <text x={Math.min(sx(pts[hi].x) + 11, W - 91)} y={Math.max(sy(pts[hi].y) - 8, 24)} fontSize="8.5" fill="#e8e8f0">Y = {pts[hi].y.toFixed(2)}</text>
            </g>
          )}
          <text x={W / 2} y={H - 1} textAnchor="middle" fontSize="9" fill="var(--foreground-subtle)">X (coloured by value)</text>
          <text x={3} y={12} fontSize="9" fill="var(--foreground-subtle)">Y</text>
        </svg>
        <div style={{ display: "flex", gap: "18px", marginTop: "16px" }}>
          <Bar label="|r| &mdash; Y side" val={rY} sub="r(Y order stats, Y concomitants)" />
          <Bar label="|r| &mdash; X side" val={rX} sub="r(X order stats, X concomitants)" />
        </div>
        <div style={{
          marginTop: "16px", padding: "14px 16px", borderRadius: "11px",
          background: driver === "none" ? "var(--surface-elevated)" : "rgba(var(--accent-rgb),0.1)",
          border: `1px solid ${driver === "none" ? "var(--border)" : "rgba(var(--accent-rgb),0.35)"}`,
        }}>
          <div style={{ fontSize: "0.66rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-subtle)", marginBottom: "5px" }}>
            &Delta;r = {dr.toFixed(3)} &nbsp;·&nbsp; verdict
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: driver === "none" ? "var(--foreground-muted)" : "var(--accent-light)" }}>{verdict}</div>
        </div>
      </div>
    </div>
  );
}
