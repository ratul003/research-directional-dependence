import type { ReactNode, CSSProperties } from "react";
import SectionNav from "./SectionNav";
import katex from "katex";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type Block =
  | { type: "cards"; columns?: number; items: { title: string; desc: string; tag?: string }[] }
  | { type: "twocol"; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { type: "steps"; items: { n: string; title: string; desc: string }[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "tags"; items: string[] }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "math"; items: { tex: string; note?: string }[] }
  | { type: "table"; head: string[]; rows: string[][]; caption?: string }
  | { type: "refs"; items: string[] }
  | { type: "logos"; items: { domain: string; label: string }[] }
  | { type: "node"; node: ReactNode };

export type Section = {
  id: string;
  num: string;
  label: string;
  heading: string;
  paras?: string[];
  blocks?: Block[];
};

export type CaseStudyData = {
  accent: string;
  accentRgb: string;
  accentLight: string;
  category: string;
  title: string;
  tagline: string;
  authors?: string;
  affiliation?: string;
  meta: { label: string; value: string }[];
  heroLogos?: { domain: string; label: string }[];
  sections: Section[];
  source?: { label: string; href: string }[];
  related?: { label: string; href: string }[];
};

// ─── Social + logo helpers ───────────────────────────────────────────────────────

const socials = [
  { label: "Portfolio", href: "https://wahid-ratul.vercel.app", path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" },
  { label: "LinkedIn", href: "https://linkedin.com/in/wahidratul112296", path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8.59 22 11 22 14.4V21h-4v-5.86c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z" },
  { label: "GitHub", href: "https://github.com/ratul003", path: "M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" },
  { label: "Medium", href: "https://medium.com/@wahidtratul", path: "M2.5 5.5l1.7 2v9.7l-2 2.3h5.4l-2-2.3V8.4l4.9 11.1h.1l4.3-10.5v8.2l-1.3 1.3v.2h6.4v-.2l-1.3-1.3V6.9l1.3-1.3v-.1h-4.5L13 13.9 9.3 5.5z" },
  { label: "Email", href: "mailto:wahidtratul@gmail.com", path: "" },
];

function LogoStrip({ items }: { items: { domain: string; label: string }[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
      {items.map((it) => (
        <div key={it.label} style={{
          display: "inline-flex", alignItems: "center", gap: "9px",
          background: "var(--surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "10px", padding: "8px 14px",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://www.google.com/s2/favicons?domain=${it.domain}&sz=64`} alt={it.label} width={18} height={18} style={{ borderRadius: "4px" }} />
          <span style={{ fontSize: "0.84rem", color: "var(--foreground-muted)", fontWeight: 500 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Math ──────────────────────────────────────────────────────────────────────

function TeX({ tex, display = true }: { tex: string; display?: boolean }) {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: false });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export function InlineTeX({ tex }: { tex: string }) {
  return <TeX tex={tex} display={false} />;
}

// ─── Primitives ────────────────────────────────────────────────────────────────

function Label({ children }: { children: ReactNode }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.15em", color: "var(--accent)", marginBottom: "14px",
    }}>
      <span style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: "var(--accent)", display: "inline-block",
        boxShadow: "0 0 8px rgba(var(--accent-rgb),0.6)",
      }} />
      {children}
    </div>
  );
}

function Body({ children }: { children: ReactNode }) {
  return (
    <p style={{ fontSize: "1rem", color: "var(--foreground-muted)", lineHeight: 1.85, maxWidth: "700px", marginBottom: "14px" }}>
      {children}
    </p>
  );
}

// ─── Block components ────────────────────────────────────────────────────────────

function Cards({ items, columns = 3 }: { items: { title: string; desc: string; tag?: string }[]; columns?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${columns >= 3 ? 240 : 280}px, 1fr))`, gap: "14px", marginTop: "20px" }}>
      {items.map((it) => (
        <div key={it.title} className="card-hover card-tier" style={{
          background: "var(--surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "16px", padding: "22px 22px",
        }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "10px", letterSpacing: "-0.01em" }}>{it.title}</h3>
          <p style={{ fontSize: "0.88rem", color: "var(--foreground-muted)", lineHeight: 1.7 }}>{it.desc}</p>
          {it.tag && (
            <span style={{
              display: "inline-block", marginTop: "14px",
              background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.28)",
              borderRadius: "6px", padding: "3px 11px", fontSize: "0.72rem", color: "var(--accent)", fontWeight: 600,
            }}>{it.tag}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function TwoCol({ left, right }: { left: { title: string; items: string[] }; right: { title: string; items: string[] } }) {
  const Col = ({ title, items, tone }: { title: string; items: string[]; tone: "accent" | "muted" }) => (
    <div className="card-hover card-tier" style={{
      background: "var(--surface)", border: "1px solid var(--border-subtle)",
      borderRadius: "16px", padding: "24px", flex: 1, minWidth: "260px",
    }}>
      <div style={{
        fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em",
        color: tone === "accent" ? "var(--accent)" : "var(--foreground-subtle)", marginBottom: "16px",
      }}>{title}</div>
      {items.map((it) => (
        <div key={it} style={{ display: "flex", gap: "10px", padding: "8px 0", borderBottom: "1px solid var(--border-subtle)" }}>
          <span style={{ color: "var(--accent)", flexShrink: 0 }}>-</span>
          <span style={{ fontSize: "0.88rem", color: "var(--foreground-muted)", lineHeight: 1.6 }}>{it}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "20px" }}>
      <Col title={left.title} items={left.items} tone="accent" />
      <Col title={right.title} items={right.items} tone="muted" />
    </div>
  );
}

function Steps({ items }: { items: { n: string; title: string; desc: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
      {items.map((it) => (
        <div key={it.n} className="card-hover" style={{
          display: "flex", gap: "16px", alignItems: "flex-start",
          background: "var(--surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "14px", padding: "18px 20px",
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
            background: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.82rem", fontWeight: 800, color: "var(--accent)",
            boxShadow: "0 0 14px rgba(var(--accent-rgb),0.25)",
          }}>{it.n}</div>
          <div>
            <h3 style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "5px" }}>{it.title}</h3>
            <p style={{ fontSize: "0.86rem", color: "var(--foreground-muted)", lineHeight: 1.65 }}>{it.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`, gap: "14px", marginTop: "20px" }}>
      {items.map((it) => (
        <div key={it.label} className="stat-glow card-tier" style={{
          background: "var(--surface)", border: "1px solid rgba(var(--accent-rgb),0.25)",
          borderRadius: "16px", padding: "24px 20px", textAlign: "center",
        }}>
          <div className="gradient-heading" style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{it.value}</div>
          <div style={{ fontSize: "0.76rem", color: "var(--foreground-muted)", marginTop: "8px", lineHeight: 1.5 }}>{it.label}</div>
        </div>
      ))}
    </div>
  );
}

function Tags({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "20px" }}>
      {items.map((t) => (
        <span key={t} style={{
          background: "rgba(var(--accent-rgb),0.08)", border: "1px solid rgba(var(--accent-rgb),0.22)",
          borderRadius: "8px", padding: "6px 14px", fontSize: "0.82rem", color: "var(--accent-light)", fontWeight: 500,
        }}>{t}</span>
      ))}
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "2px", maxWidth: "700px" }}>
      {items.map((it) => (
        <div key={it} style={{ display: "flex", gap: "12px", padding: "9px 0", borderBottom: "1px solid var(--border-subtle)" }}>
          <span style={{ color: "var(--accent)", flexShrink: 0, fontWeight: 700 }}>›</span>
          <span style={{ fontSize: "0.92rem", color: "var(--foreground-muted)", lineHeight: 1.65 }}>{it}</span>
        </div>
      ))}
    </div>
  );
}

function Callout({ text }: { text: string }) {
  return (
    <div style={{
      marginTop: "22px", padding: "20px 24px", borderRadius: "14px",
      background: "rgba(var(--accent-rgb),0.06)", borderLeft: "3px solid var(--accent)",
      fontSize: "1.02rem", color: "var(--foreground)", lineHeight: 1.7, fontWeight: 500, maxWidth: "740px",
    }}>{text}</div>
  );
}

function MathBlock({ items }: { items: { tex: string; note?: string }[] }) {
  return (
    <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {items.map((m, i) => (
        <div key={i} style={{
          background: "var(--surface)", border: "1px solid var(--border-subtle)",
          borderRadius: "12px", padding: "18px 22px", overflowX: "auto",
        }}>
          <div style={{ color: "var(--foreground)", fontSize: "1.05rem" }}><TeX tex={m.tex} /></div>
          {m.note && <div style={{ fontSize: "0.78rem", color: "var(--foreground-subtle)", marginTop: "10px", lineHeight: 1.6 }}>{m.note}</div>}
        </div>
      ))}
    </div>
  );
}

function Table({ head, rows, caption }: { head: string[]; rows: string[][]; caption?: string }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ overflowX: "auto", border: "1px solid var(--border-subtle)", borderRadius: "12px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "440px" }}>
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} style={{
                  textAlign: "left", padding: "12px 16px", color: "var(--accent-light)",
                  fontWeight: 700, fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em",
                  borderBottom: "1px solid var(--border)", background: "rgba(var(--accent-rgb),0.06)",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((c, ci) => (
                  <td key={ci} style={{
                    padding: "11px 16px", color: ci === 0 ? "var(--foreground)" : "var(--foreground-muted)",
                    borderBottom: "1px solid var(--border-subtle)", fontWeight: ci === 0 ? 600 : 400,
                    fontVariantNumeric: "tabular-nums",
                  }}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <p style={{ fontSize: "0.78rem", color: "var(--foreground-subtle)", marginTop: "10px", fontStyle: "italic" }}>{caption}</p>}
    </div>
  );
}

function Refs({ items }: { items: string[] }) {
  return (
    <ol style={{ marginTop: "16px", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
      {items.map((r, i) => (
        <li key={i} style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", lineHeight: 1.6, paddingLeft: "6px" }}>{r}</li>
      ))}
    </ol>
  );
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "cards": return <Cards items={block.items} columns={block.columns} />;
    case "twocol": return <TwoCol left={block.left} right={block.right} />;
    case "steps": return <Steps items={block.items} />;
    case "stats": return <Stats items={block.items} />;
    case "tags": return <Tags items={block.items} />;
    case "list": return <List items={block.items} />;
    case "callout": return <Callout text={block.text} />;
    case "math": return <MathBlock items={block.items} />;
    case "table": return <Table head={block.head} rows={block.rows} caption={block.caption} />;
    case "refs": return <Refs items={block.items} />;
    case "logos": return <LogoStrip items={block.items} />;
    case "node": return <>{block.node}</>;
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CaseStudy({ data }: { data: CaseStudyData }) {
  const rootStyle = {
    "--accent": data.accent,
    "--accent-rgb": data.accentRgb,
    "--accent-light": data.accentLight,
  } as CSSProperties;

  return (
    <div style={rootStyle}>
      <SectionNav />
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: "56px",
        borderBottom: "1px solid var(--border-subtle)", background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <a className="nav-name" href="https://wahid-ratul.vercel.app" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--foreground)", textDecoration: "none" }}>
              Wahid Tawsif Ratul
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ color: "var(--foreground-subtle)", display: "inline-flex" }}>
                  {s.label === "Email" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                  )}
                </a>
              ))}
            </div>
          </div>
          <a href="https://wahid-ratul.vercel.app/#research" style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", textDecoration: "none" }}>
            ← All research
          </a>
        </div>
      </nav>

      <header className="hero-section" style={{ padding: "130px 24px 70px", position: "relative", overflow: "hidden", isolation: "isolate" }}>
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: -1, backgroundImage: "url(/hero.jpg)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.4 }} />
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(90deg, #0a0a0f 0%, rgba(10,10,15,0.80) 46%, rgba(10,10,15,0.40) 100%), linear-gradient(180deg, rgba(10,10,15,0.30) 0%, rgba(10,10,15,0.92) 100%)" }} />
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative" }}>
          <Label>{data.category}</Label>
          <h1 className="gradient-heading rise-in" style={{ fontSize: "clamp(2.1rem, 5.5vw, 3.7rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.07, marginBottom: "20px", maxWidth: "920px" }}>
            {data.title}
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.18rem)", color: "var(--foreground-muted)", lineHeight: 1.7, maxWidth: "700px", marginBottom: data.authors ? "18px" : "30px" }}>
            {data.tagline}
          </p>
          {data.authors && (
            <p style={{ fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "4px", fontWeight: 500 }}>{data.authors}</p>
          )}
          {data.affiliation && (
            <p style={{ fontSize: "0.84rem", color: "var(--foreground-subtle)", marginBottom: data.heroLogos ? "18px" : "26px" }}>{data.affiliation}</p>
          )}
          {data.heroLogos && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", marginBottom: "26px" }}>
              {data.heroLogos.map((l) => (
                <div key={l.label} style={{ display: "inline-flex", alignItems: "center", gap: "8px", opacity: 0.9 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://www.google.com/s2/favicons?domain=${l.domain}&sz=64`} alt={l.label} width={20} height={20} style={{ borderRadius: "4px" }} />
                  <span style={{ fontSize: "0.8rem", color: "var(--foreground-subtle)" }}>{l.label}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {data.meta.map((m) => (
              <div key={m.label} style={{ background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "10px 16px" }}>
                <div style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--foreground-subtle)", marginBottom: "3px" }}>{m.label}</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--foreground)" }}>{m.value}</div>
              </div>
            ))}
          </div>
          {data.source && data.source.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "22px" }}>
              {data.source.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: "7px",
                  background: "rgba(var(--accent-rgb),0.12)", border: "1px solid rgba(var(--accent-rgb),0.3)",
                  borderRadius: "999px", padding: "9px 18px", fontSize: "0.84rem", fontWeight: 600,
                  color: "var(--accent-light)", textDecoration: "none",
                }}>{s.label} ↗</a>
              ))}
            </div>
          )}
        </div>
      </header>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        <div className="divider-gradient" />
      </div>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        {data.sections.map((s) => (
          <section key={s.id} id={s.id} data-rail={s.label} style={{ padding: "60px 0", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "18px" }}>
              <span className="gradient-accent" style={{ fontSize: "0.85rem", fontWeight: 800, fontFamily: "ui-monospace, monospace" }}>{s.num}</span>
              <Label>{s.label}</Label>
            </div>
            <h2 className="gradient-heading" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "20px", maxWidth: "780px" }}>
              {s.heading}
            </h2>
            {s.paras?.map((p, i) => <Body key={i}>{p}</Body>)}
            {s.blocks?.map((b, i) => <RenderBlock key={i} block={b} />)}
          </section>
        ))}
      </main>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
        <div className="divider-gradient" />
      </div>
      <footer style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px 64px", display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "5px" }}>Wahid Tawsif Ratul</p>
          <p style={{ fontSize: "0.8rem", color: "var(--foreground-subtle)" }}>© 2026 · Data Scientist · Product Manager</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
              style={{ color: "var(--foreground-subtle)", display: "inline-flex" }}>
              {s.label === "Email" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              )}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
