"use client";

import { useRef, useState } from "react";

// Perceptually-uniform viridis colormap → color encodes the z value.
const STOPS = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
function viridis(t: number): string {
  t = Math.max(0, Math.min(1, t));
  const s = t * (STOPS.length - 1);
  const i = Math.floor(s), f = s - i;
  const a = STOPS[i], b = STOPS[Math.min(i + 1, STOPS.length - 1)];
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
}

export default function Surface3D({
  z, xRange, yRange, xLabel = "x", yLabel = "y", zLabel = "z",
  zDecimals = 2, zSuffix = "", height = 320,
}: {
  z: number[][]; xRange: [number, number]; yRange: [number, number];
  xLabel?: string; yLabel?: string; zLabel?: string; zDecimals?: number; zSuffix?: string; height?: number;
}) {
  const [yaw, setYaw] = useState(-0.7);
  const [pitch, setPitch] = useState(1.0);
  const [hover, setHover] = useState<{ i: number; j: number; px: number; py: number } | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const wrap = useRef<HTMLDivElement>(null);

  const G = z.length;
  let zmin = Infinity, zmax = -Infinity;
  for (const row of z) for (const v of row) { if (v < zmin) zmin = v; if (v > zmax) zmax = v; }
  const zr = zmax - zmin || 1;

  const W = 360, H = height, cx = W / 2, cy = H / 2 + 28, scale = 150, zScale = 95;
  const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const project = (i: number, j: number) => {
    const x = i / (G - 1) - 0.5, y = j / (G - 1) - 0.5, zz = (z[i][j] - zmin) / zr - 0.5;
    const x1 = x * cyw - y * syw, y1 = x * syw + y * cyw;
    const y2 = y1 * cp - zz * sp, z2 = y1 * sp + zz * cp;
    return { sx: cx + x1 * scale, sy: cy - z2 * zScale, depth: y2 };
  };

  type Quad = { pts: string; depth: number; t: number; i: number; j: number };
  const quads: Quad[] = [];
  for (let i = 0; i < G - 1; i++) {
    for (let j = 0; j < G - 1; j++) {
      const a = project(i, j), b = project(i + 1, j), c = project(i + 1, j + 1), d = project(i, j + 1);
      const avg = (z[i][j] + z[i + 1][j] + z[i + 1][j + 1] + z[i][j + 1]) / 4;
      quads.push({
        pts: `${a.sx.toFixed(1)},${a.sy.toFixed(1)} ${b.sx.toFixed(1)},${b.sy.toFixed(1)} ${c.sx.toFixed(1)},${c.sy.toFixed(1)} ${d.sx.toFixed(1)},${d.sy.toFixed(1)}`,
        depth: (a.depth + b.depth + c.depth + d.depth) / 4,
        t: (avg - zmin) / zr, i, j,
      });
    }
  }
  quads.sort((p, q) => p.depth - q.depth);

  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY }; setHover(null); (e.currentTarget as Element).setPointerCapture(e.pointerId); };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
    setYaw((v) => v + dx * 0.01);
    setPitch((v) => Math.max(0.25, Math.min(1.45, v + dy * 0.008)));
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = () => { drag.current = null; };

  const hoverCell = (i: number, j: number, e: React.MouseEvent) => {
    if (drag.current) return;
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ i, j, px: e.clientX - rect.left, py: e.clientY - rect.top });
  };

  const fmt = (v: number, lo: number, hi: number) => (lo + (v / (G - 1)) * (hi - lo)).toFixed(zDecimals === 0 ? 1 : 1);

  return (
    <div ref={wrap} style={{ userSelect: "none", position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={() => { onUp(); setHover(null); }}
        style={{ width: "100%", height: "auto", background: "var(--background)", borderRadius: "12px", border: "1px solid var(--border-subtle)", cursor: "grab", touchAction: "none" }}>
        {quads.map((q, k) => {
          const isHover = hover && hover.i === q.i && hover.j === q.j;
          return (
            <polygon key={k} points={q.pts} fill={viridis(q.t)}
              stroke={isHover ? "#ffffff" : "rgba(255,255,255,0.18)"} strokeWidth={isHover ? 1.4 : 0.4}
              onMouseMove={(e) => hoverCell(q.i, q.j, e)} />
          );
        })}
        <text x={W - 8} y={H - 8} textAnchor="end" fontSize="9" fill="var(--foreground-subtle)">{xLabel} · {yLabel}</text>
        <text x={8} y={16} fontSize="9" fill="var(--foreground-subtle)">{zLabel}</text>
      </svg>

      {/* colour legend */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
        <span style={{ fontSize: "0.66rem", color: "var(--foreground-subtle)" }}>{zmin.toFixed(zDecimals)}{zSuffix}</span>
        <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "linear-gradient(90deg, rgb(68,1,84), rgb(59,82,139), rgb(33,145,140), rgb(94,201,98), rgb(253,231,37))" }} />
        <span style={{ fontSize: "0.66rem", color: "var(--foreground-subtle)" }}>{zmax.toFixed(zDecimals)}{zSuffix}</span>
        <span style={{ fontSize: "0.66rem", color: "var(--foreground-subtle)", marginLeft: "4px" }}>· drag to rotate</span>
      </div>

      {hover && (
        <div style={{
          position: "absolute", left: Math.min(hover.px + 12, W - 10), top: hover.py + 12, pointerEvents: "none",
          background: "rgba(10,10,15,0.95)", border: "1px solid var(--accent)", borderRadius: "8px",
          padding: "7px 10px", fontSize: "0.72rem", color: "var(--foreground)", whiteSpace: "nowrap", zIndex: 5,
          boxShadow: "0 4px 18px rgba(0,0,0,0.5)",
        }}>
          <div><span style={{ color: "var(--foreground-subtle)" }}>{xLabel}</span> {fmt(hover.i, xRange[0], xRange[1])} · <span style={{ color: "var(--foreground-subtle)" }}>{yLabel}</span> {fmt(hover.j, yRange[0], yRange[1])}</div>
          <div style={{ color: "var(--accent-light)", fontWeight: 700, marginTop: "2px" }}>{zLabel} = {z[hover.i][hover.j].toFixed(zDecimals)}{zSuffix}</div>
        </div>
      )}
    </div>
  );
}
