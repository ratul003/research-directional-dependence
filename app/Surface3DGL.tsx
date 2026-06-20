"use client";

import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useMemo, useState } from "react";
import * as THREE from "three";

const STOPS = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
function viridis(t: number): [number, number, number] {
  t = Math.max(0, Math.min(1, t));
  const s = t * (STOPS.length - 1), i = Math.floor(s), f = s - i;
  const a = STOPS[i], b = STOPS[Math.min(i + 1, STOPS.length - 1)];
  return [(a[0] + (b[0] - a[0]) * f) / 255, (a[1] + (b[1] - a[1]) * f) / 255, (a[2] + (b[2] - a[2]) * f) / 255];
}

function SurfaceMesh({
  z, xRange, yRange, xLabel, yLabel, zLabel, zDecimals, zSuffix,
}: {
  z: number[][]; xRange: [number, number]; yRange: [number, number];
  xLabel: string; yLabel: string; zLabel: string; zDecimals: number; zSuffix: string;
}) {
  const G = z.length;
  let zmin = Infinity, zmax = -Infinity;
  for (const row of z) for (const v of row) { if (v < zmin) zmin = v; if (v > zmax) zmax = v; }
  const zr = zmax - zmin || 1;

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(2.2, 2.2, G - 1, G - 1);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    for (let k = 0; k < pos.count; k++) {
      const ix = k % G, iy = Math.floor(k / G);
      const t = (z[ix][iy] - zmin) / zr;
      pos.setZ(k, t * 1.25);
      const c = viridis(t);
      colors.push(c[0], c[1], c[2]);
    }
    pos.needsUpdate = true;
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [z, G, zmin, zr]);

  const [hover, setHover] = useState<{ p: THREE.Vector3; i: number; j: number } | null>(null);

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!e.uv) return;
    const i = Math.round(e.uv.x * (G - 1));
    const j = Math.round(e.uv.y * (G - 1));
    setHover({ p: e.point.clone(), i, j });
  };

  const fmt = (idx: number, lo: number, hi: number) => (lo + (idx / (G - 1)) * (hi - lo)).toFixed(1);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh geometry={geo} onPointerMove={onMove} onPointerOut={() => setHover(null)}>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.55} metalness={0.1} />
      </mesh>
      <lineSegments>
        <wireframeGeometry args={[geo]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </lineSegments>
      {hover && (
        <Html position={hover.p} style={{ pointerEvents: "none", transform: "translate(12px,-50%)" }}>
          <div style={{
            background: "rgba(10,10,15,0.95)", border: "1px solid var(--accent)", borderRadius: "8px",
            padding: "7px 10px", fontSize: "0.72rem", color: "#e8e8f0", whiteSpace: "nowrap",
            boxShadow: "0 4px 18px rgba(0,0,0,0.5)", fontFamily: "var(--font-inter), sans-serif",
          }}>
            <div><span style={{ color: "#8888a8" }}>{xLabel}</span> {fmt(hover.i, xRange[0], xRange[1])} · <span style={{ color: "#8888a8" }}>{yLabel}</span> {fmt(hover.j, yRange[0], yRange[1])}</div>
            <div style={{ color: "var(--accent-light)", fontWeight: 700, marginTop: "2px" }}>{zLabel} = {z[hover.i][hover.j].toFixed(zDecimals)}{zSuffix}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Surface3DGL({
  z, xRange, yRange, xLabel = "x", yLabel = "y", zLabel = "z", zDecimals = 2, zSuffix = "", height = 340,
}: {
  z: number[][]; xRange: [number, number]; yRange: [number, number];
  xLabel?: string; yLabel?: string; zLabel?: string; zDecimals?: number; zSuffix?: string; height?: number;
}) {
  let zmin = Infinity, zmax = -Infinity;
  for (const row of z) for (const v of row) { if (v < zmin) zmin = v; if (v > zmax) zmax = v; }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ height, borderRadius: "12px", border: "1px solid var(--border-subtle)", overflow: "hidden", background: "var(--background)", touchAction: "none" }}>
        <Canvas camera={{ position: [2.6, 2.1, 2.6], fov: 38 }} dpr={[1, 2]}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 3]} intensity={1.1} />
          <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#a5b4fc" />
          <SurfaceMesh z={z} xRange={xRange} yRange={yRange} xLabel={xLabel} yLabel={yLabel} zLabel={zLabel} zDecimals={zDecimals} zSuffix={zSuffix} />
          <OrbitControls enablePan={false} enableZoom minPolarAngle={0.2} maxPolarAngle={1.5} target={[0, 0.3, 0]} />
        </Canvas>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
        <span style={{ fontSize: "0.66rem", color: "var(--foreground-subtle)" }}>{zmin.toFixed(zDecimals)}{zSuffix}</span>
        <div style={{ flex: 1, height: "8px", borderRadius: "4px", background: "linear-gradient(90deg, rgb(68,1,84), rgb(59,82,139), rgb(33,145,140), rgb(94,201,98), rgb(253,231,37))" }} />
        <span style={{ fontSize: "0.66rem", color: "var(--foreground-subtle)" }}>{zmax.toFixed(zDecimals)}{zSuffix}</span>
        <span style={{ fontSize: "0.66rem", color: "var(--foreground-subtle)", marginLeft: "4px" }}>· drag to orbit · scroll to zoom · hover for values</span>
      </div>
    </div>
  );
}
