import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Modeling Bivariate Directional Dependence";

const ACCENT = "#a855f7";
const TAG = "Statistics · Senior Thesis";
const TITLE = "Modeling Bivariate Directional Dependence";
const SUB = "Order statistics, concomitants, and a sampling algorithm for which variable drives which.";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "#0a0a0f", padding: 90, position: "relative" }}>
        <div style={{ position: "absolute", top: -120, left: 420, width: 560, height: 560, background: `${ACCENT}33`, borderRadius: 9999, filter: "blur(120px)" }} />
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: ACCENT, fontWeight: 700 }}>{TAG}</div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, color: "#fff", letterSpacing: -2, marginTop: 18, lineHeight: 1.05, maxWidth: 980 }}>{TITLE}</div>
        <div style={{ display: "flex", fontSize: 30, color: "#8888a8", marginTop: 28, maxWidth: 880, lineHeight: 1.4 }}>{SUB}</div>
        <div style={{ display: "flex", fontSize: 23, color: "#4a4a68", marginTop: 42 }}>Wahid Tawsif Ratul · University of Minnesota, Morris</div>
      </div>
    ),
    { ...size },
  );
}
