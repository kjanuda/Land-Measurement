"use client";

import { useEffect, useRef, useState } from "react";

const SERVICES = [
  {
    id: "land",
    title: "Land Surveying, Mapping and Data Collection",
    description:
      "Leverage geospatial expertise to enhance data precision and project outcomes with state-of-the-art mapping and surveying technologies.",
    pattern: "topo",
    accentDot: true,
  },
  {
    id: "inspection",
    title: "Inspection",
    description:
      "Enhance project safety and compliance with expert inspection services, delivering meticulous oversight to ensure the integrity of your critical infrastructure projects.",
    pattern: "building",
    accentDot: false,
  },
  {
    id: "digital",
    title: "Digital and Data Solutions",
    description:
      "Extend your strategic capabilities with precise geospatial data and integrated enterprise solutions, driving innovation in every project.",
    pattern: "circuit",
    accentDot: false,
  },
  {
    id: "utility",
    title: "Utility Location",
    description:
      "Minimize risks and uncover critical infrastructure data with precise subsurface utility engineering.",
    pattern: "pipe",
    accentDot: false,
  },
];

/* ── SVG background patterns ── */
function TopoPattern() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 280 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <ellipse cx="130" cy="290" rx="110" ry="78" stroke="#4e9fd4" strokeWidth="0.8"/>
      <ellipse cx="130" cy="290" rx="82"  ry="56" stroke="#4e9fd4" strokeWidth="0.8"/>
      <ellipse cx="130" cy="290" rx="55"  ry="35" stroke="#4e9fd4" strokeWidth="0.8"/>
      <ellipse cx="130" cy="290" rx="30"  ry="18" stroke="#4e9fd4" strokeWidth="0.8"/>
      <line x1="0"   y1="160" x2="280" y2="160" stroke="#4e9fd4" strokeWidth="0.5" strokeDasharray="4 6"/>
      <line x1="0"   y1="200" x2="280" y2="200" stroke="#4e9fd4" strokeWidth="0.5" strokeDasharray="4 6"/>
      <line x1="80"  y1="0"   x2="80"  y2="420" stroke="#4e9fd4" strokeWidth="0.5" strokeDasharray="4 6"/>
      <line x1="160" y1="0"   x2="160" y2="420" stroke="#4e9fd4" strokeWidth="0.5" strokeDasharray="4 6"/>
      <text x="58"  y="305" fill="#4e9fd4" fontSize="6" fontFamily="monospace" letterSpacing="0.5">37°45′22″</text>
      <text x="58"  y="313" fill="#4e9fd4" fontSize="6" fontFamily="monospace" letterSpacing="0.5">-122°25′18″</text>
      <line x1="90" y1="290" x2="110" y2="290" stroke="#c8a84b" strokeWidth="1"/>
      <line x1="100" y1="280" x2="100" y2="300" stroke="#c8a84b" strokeWidth="1"/>
      <circle cx="130" cy="290" r="3" fill="#c8a84b"/>
      <circle cx="130" cy="290" r="7" stroke="#c8a84b" strokeWidth="0.8" fill="none"/>
    </svg>
  );
}

function BuildingPattern() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 280 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect x="60"  y="180" width="160" height="240" stroke="#4e9fd4" strokeWidth="0.8"/>
      <rect x="80"  y="140" width="120" height="280" stroke="#4e9fd4" strokeWidth="0.6"/>
      <rect x="100" y="100" width="80"  height="320" stroke="#4e9fd4" strokeWidth="0.6"/>
      {[180,210,240,270,300,330,360].map(y => (
        <line key={y} x1="60" y1={y} x2="220" y2={y} stroke="#4e9fd4" strokeWidth="0.4"/>
      ))}
      {[190,220,250,280,310,340].map(y =>
        [75,105,135,165,195].map(x => (
          <rect key={`${x}-${y}`} x={x} y={y} width="18" height="12" stroke="#4e9fd4" strokeWidth="0.4" fill="none" opacity="0.5"/>
        ))
      )}
      <line x1="60"  y1="180" x2="20"  y2="120" stroke="#4e9fd4" strokeWidth="0.5" strokeDasharray="3 5"/>
      <line x1="220" y1="180" x2="260" y2="120" stroke="#4e9fd4" strokeWidth="0.5" strokeDasharray="3 5"/>
    </svg>
  );
}

function CircuitPattern() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 280 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.16 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <line x1="40"  y1="200" x2="240" y2="200" stroke="#4e9fd4" strokeWidth="0.8"/>
      <line x1="140" y1="100" x2="140" y2="380" stroke="#4e9fd4" strokeWidth="0.8"/>
      <line x1="40"  y1="200" x2="140" y2="100" stroke="#4e9fd4" strokeWidth="0.5" strokeDasharray="3 4"/>
      <line x1="240" y1="200" x2="140" y2="320" stroke="#4e9fd4" strokeWidth="0.5" strokeDasharray="3 4"/>
      <line x1="80"  y1="150" x2="200" y2="270" stroke="#4e9fd4" strokeWidth="0.4" strokeDasharray="2 6"/>
      <line x1="200" y1="150" x2="80"  y2="270" stroke="#4e9fd4" strokeWidth="0.4" strokeDasharray="2 6"/>
      {[[40,200],[240,200],[140,100],[140,320],[80,150],[200,150],[80,270],[200,270]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="4" stroke="#4e9fd4" strokeWidth="0.8" fill="none"/>
      ))}
      <circle cx="140" cy="200" r="8"  stroke="#c8a84b" strokeWidth="1" fill="none"/>
      <circle cx="140" cy="200" r="3"  fill="#c8a84b"/>
      <rect x="20"  y="80"  width="10" height="10" stroke="#4e9fd4" strokeWidth="0.5" fill="none"/>
      <rect x="250" y="80"  width="10" height="10" stroke="#4e9fd4" strokeWidth="0.5" fill="none"/>
      <rect x="20"  y="340" width="10" height="10" stroke="#4e9fd4" strokeWidth="0.5" fill="none"/>
      <rect x="250" y="340" width="10" height="10" stroke="#4e9fd4" strokeWidth="0.5" fill="none"/>
    </svg>
  );
}

function PipePattern() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 280 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M20 300 H120 V220 H200 V320 H260" stroke="#4e9fd4" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M20 300 H120 V220 H200 V320 H260" stroke="#4e9fd4" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.12"/>
      <path d="M60 420 V300"   stroke="#4e9fd4" strokeWidth="1.5" fill="none"/>
      <path d="M200 320 V420"  stroke="#4e9fd4" strokeWidth="1.5" fill="none"/>
      <path d="M140 220 V100"  stroke="#4e9fd4" strokeWidth="1.5" fill="none"/>
      {[[120,300],[200,220],[200,320]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="8"  stroke="#4e9fd4" strokeWidth="1" fill="none"/>
          <circle cx={cx} cy={cy} r="3"  fill="#4e9fd4" opacity="0.5"/>
        </g>
      ))}
      <line x1="15" y1="260" x2="15" y2="380" stroke="#4e9fd4" strokeWidth="0.5"/>
      <line x1="10" y1="260" x2="20" y2="260" stroke="#4e9fd4" strokeWidth="0.5"/>
      <line x1="10" y1="320" x2="20" y2="320" stroke="#4e9fd4" strokeWidth="0.5"/>
      <line x1="10" y1="380" x2="20" y2="380" stroke="#4e9fd4" strokeWidth="0.5"/>
      <text x="24" y="263" fill="#4e9fd4" fontSize="6" fontFamily="monospace">0m</text>
      <text x="24" y="323" fill="#4e9fd4" fontSize="6" fontFamily="monospace">2m</text>
      <text x="24" y="383" fill="#4e9fd4" fontSize="6" fontFamily="monospace">4m</text>
      <circle cx="200" cy="150" r="40" stroke="#4e9fd4" strokeWidth="0.8" fill="none" strokeDasharray="6 4"/>
      <circle cx="200" cy="150" r="25" stroke="#4e9fd4" strokeWidth="0.5" fill="none"/>
      <circle cx="200" cy="150" r="10" stroke="#4e9fd4" strokeWidth="0.5" fill="none"/>
    </svg>
  );
}

const PATTERNS = { topo: TopoPattern, building: BuildingPattern, circuit: CircuitPattern, pipe: PipePattern };

function ServiceCard({ service, index, inView }) {
  const Pattern = PATTERNS[service.pattern];
  return (
    <article
      className={`svc-card svc-card--${service.id}${inView ? " svc-card--visible" : ""}`}
      style={{ "--delay": `${index * 0.12}s` }}
    >
      <div className="svc-card__pattern" aria-hidden="true">
        <Pattern />
      </div>

      <div className="svc-card__rule" aria-hidden="true" />

      <div className="svc-card__body">
        <h2 className="svc-card__title">{service.title}</h2>
        <p className="svc-card__desc">{service.description}</p>
      </div>

      <a href={`#${service.id}`} className="svc-card__link" aria-label={`Learn more about ${service.title}`}>
        <span>Learn More</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </article>
  );
}

export default function ServicesSection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setInView(true); 
          observer.disconnect(); 
        } 
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        /* ─── SECTION WRAPPER ─── */
        .svc-section {
          width: 100%;
          background: #f8fafc; /* ← Light background for gap visibility */
          padding: 72px 40px 80px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ─── HEADER ─── */
        .svc-header {
          margin-bottom: 40px;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }
        .svc-header__eyebrow {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: #1a3a5c;
          margin-bottom: 10px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .svc-header__eyebrow.visible {
          opacity: 1; transform: translateY(0);
        }
        .svc-header__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 900;
          color: #0d1f35;
          letter-spacing: -0.01em;
          line-height: 1.1;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .svc-header__title.visible { opacity: 1; transform: translateY(0); }
        .svc-header__rule {
          margin-top: 14px;
          width: 0;
          height: 3px;
          background: #c8a84b;
          transition: width 1s cubic-bezier(0.16,1,0.3,1) 0.2s;
        }
        .svc-header__rule.visible { width: 56px; }

        /* ─── CARD GRID ─── */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px; /* ← GAP ADDED */
          align-items: stretch;
          max-width: 1400px;
          margin: 0 auto; /* ← Center grid */
        }

        /* ─── CARD ─── */
        .svc-card {
          position: relative;
          background: #0d2744;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 440px;
          cursor: pointer;
          
          /* ← NEW: Gap-friendly styling */
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          
          /* entrance animation */
          opacity: 0;
          transform: translateY(32px);
          transition:
            opacity 0.75s cubic-bezier(0.16,1,0.3,1) var(--delay, 0s),
            transform 0.75s cubic-bezier(0.16,1,0.3,1) var(--delay, 0s),
            background 0.35s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }
        .svc-card--visible {
          opacity: 1; transform: translateY(0);
        }
        .svc-card:hover {
          background: #102f52;
          z-index: 2;
          border-color: rgba(200,168,75,0.4);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }

        /* ← REMOVED: Old border dividers (now using gap) */
        /* .svc-card + .svc-card { border-left: ... } */

        /* background pattern layer */
        .svc-card__pattern {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .svc-card:hover .svc-card__pattern { opacity: 1.4; }

        /* gold top rule */
        .svc-card__rule {
          position: absolute;
          top: 0; left: 28px;
          width: 36px; height: 2px;
          background: #c8a84b;
          transition: width 0.4s ease;
        }
        .svc-card:hover .svc-card__rule { width: 56px; }

        /* card body */
        .svc-card__body {
          position: relative; z-index: 2;
          padding: 48px 24px 24px; /* ← Adjusted padding */
          flex: 1;
        }

        .svc-card__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.15rem, 1.6vw, 1.45rem);
          font-weight: 700;
          color: #f0ebe0;
          line-height: 1.22;
          margin-bottom: 20px;
          letter-spacing: -0.01em;
        }

        .svc-card__desc {
          font-size: 0.875rem;
          font-weight: 300;
          color: rgba(210,220,235,0.72);
          line-height: 1.65;
        }

        /* learn more link */
        .svc-card__link {
          position: relative; z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 24px 36px; /* ← Adjusted margin */
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c8a84b;
          text-decoration: none;
          border-bottom: 1px solid rgba(200,168,75,0.35);
          padding-bottom: 2px;
          opacity: 0;
          transition:
            opacity 0.3s ease,
            color 0.25s ease,
            border-color 0.25s ease;
        }
        .svc-card:hover .svc-card__link { opacity: 1; }
        .svc-card__link:hover { color: #e2c97e; border-color: #e2c97e; }
        .svc-card__link svg { transition: transform 0.25s ease; }
        .svc-card__link:hover svg { transform: translateX(4px); }

        /* ═══════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════ */

        /* ── Tablet: 2 columns ── */
        @media (max-width: 1024px) {
          .svc-section { padding: 56px 32px 64px; }
          .svc-grid { 
            grid-template-columns: repeat(2, 1fr); 
            gap: 20px; /* ← Tablet gap */
          }
          .svc-card { min-height: 380px; }
          /* ← All old borders removed - gap handles spacing */
        }

        /* ── Mobile: 1 column ── */
        @media (max-width: 640px) {
          .svc-section { padding: 48px 16px 56px; }

          .svc-grid {
            grid-template-columns: 1fr;
            gap: 16px; /* ← Mobile gap */
          }

          .svc-card {
            min-height: 300px;
          }

          .svc-card__link { opacity: 1; }

          .svc-card__body { padding: 44px 22px 16px; }
          .svc-card__link { margin: 0 22px 28px; }
          .svc-card__rule { left: 22px; }

          .svc-card__title { font-size: 1.2rem; }
          .svc-card__desc  { font-size: 0.85rem; }
        }

        /* ── Very small mobile ── */
        @media (max-width: 380px) {
          .svc-section { padding: 40px 12px 48px; }
          .svc-card__body { padding: 40px 18px 14px; }
          .svc-card__link { margin: 0 18px 24px; }
          .svc-card__rule { left: 18px; }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .svc-card,
          .svc-header__eyebrow,
          .svc-header__title,
          .svc-header__rule {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .svc-header__rule.visible { width: 56px; }
          .svc-card__link { opacity: 1 !important; }
        }
      `}</style>

      <section
        className="svc-section"
        id="services"
        ref={sectionRef}
        aria-labelledby="svc-heading"
      >
        <header className="svc-header">
          <p className={`svc-header__eyebrow${inView ? " visible" : ""}`}>What We Do</p>
          <h2
            id="svc-heading"
            className={`svc-header__title${inView ? " visible" : ""}`}
          >
            Services
          </h2>
          <div className={`svc-header__rule${inView ? " visible" : ""}`} />
        </header>

        <div className="svc-grid" role="list">
          {SERVICES.map((svc, i) => (
            <div key={svc.id} role="listitem">
              <ServiceCard service={svc} index={i} inView={inView} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}