"use client";

import Link from "next/link";
import Image from "next/image";

const metrics = [
  { val: "3.1M",  label: "Parcels indexed" },
  { val: "±0.3m", label: "GPS accuracy" },
  { val: "198",   label: "Districts covered" },
  { val: "Live",  label: "Data sync", green: true },
];

const features = ["Boundary tools", "Multi-layer", "Export GIS"];

export default function LandSurveyHero() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .hero-wrap {
          padding: 28px;
          background: #f0f1f3;
          border-radius: 24px;
          font-family: 'DM Sans', sans-serif;
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 16px;
          overflow: hidden;
          min-height: 460px;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.07),
            0 8px 32px rgba(0,0,0,0.09);
        }

        /* ── Photo panel ── */
        .hero-photo {
          position: relative;
          overflow: hidden;
          min-height: 240px;
        }
        .hero-photo-img {
          object-fit: cover;
          object-position: center;
          transform: scale(1.04);
          transition: transform 9s ease;
        }
        .hero-section:hover .hero-photo-img {
          transform: scale(1.0);
        }
        .hero-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            145deg,
            rgba(8,18,40,0.58) 0%,
            rgba(8,18,40,0.32) 55%,
            rgba(8,18,40,0.52) 100%
          );
          z-index: 1;
        }
        .hero-grid-lines {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 0.07;
          background-image:
            linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px);
          background-size: 38px 38px;
        }

        /* Status badge */
        .status-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 7px;
          padding: 5px 12px;
          font-family: 'DM Mono', monospace;
          font-size: 9.5px;
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
        }
        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #f59e0b;
          animation: blink 1.8s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* Pin */
        .pin-anchor {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }
        .pin-ripple {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(245,158,11,0.55);
          animation: ripple 2.4s ease-out infinite;
          top: 0; left: 0;
        }
        .pin-ripple-2 { animation-delay: 1.1s; opacity: 0.4; }
        @keyframes ripple {
          0%   { transform: scale(0.7); opacity: 0.85; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .pin-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(245,158,11,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .pin-core {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 14px rgba(245,158,11,0.7);
        }

        /* Coords */
        .coords {
          position: absolute;
          bottom: 14px;
          left: 14px;
          z-index: 3;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: rgba(255,255,255,0.35);
          line-height: 1.9;
        }

        /* ── Content panel ── */
        .hero-content {
          background: #ffffff;
          padding: 30px 28px 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hero-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d97706;
          margin-bottom: 10px;
        }

        .hero-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(44px, 4.5vw, 58px);
          line-height: 0.9;
          letter-spacing: 0.02em;
          color: #111827;
          margin-bottom: 13px;
        }
        .hero-headline-accent { color: #d97706; }

        .hero-sub {
          font-size: 12.5px;
          font-weight: 300;
          color: #6b7280;
          line-height: 1.7;
          max-width: 215px;
          margin-bottom: 20px;
        }

        /* Metrics */
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 22px;
        }
        .metric-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 11px;
          padding: 11px 13px 10px;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .metric-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .metric-val {
          font-family: 'DM Mono', monospace;
          font-size: 17px;
          font-weight: 500;
          color: #111827;
          line-height: 1;
        }
        .metric-val-live { color: #16a34a; }
        .metric-label {
          font-size: 10px;
          color: #9ca3af;
          margin-top: 4px;
        }

        /* CTA */
        .cta-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 13px 18px;
          border-radius: 12px;
          background: #111827;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 13px;
          color: #ffffff;
          text-decoration: none;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 4px 18px rgba(17,24,39,0.18);
        }
        .cta-link:hover {
          background: #1f2937;
          box-shadow: 0 6px 28px rgba(17,24,39,0.25);
        }
        .cta-link:active { transform: scale(0.985); }
        .cta-right {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #f59e0b;
          opacity: 0.9;
        }

        .hero-divider {
          border: none;
          border-top: 1px solid #f3f4f6;
          margin: 14px 0 12px;
        }

        .features-row {
          display: flex;
          flex-wrap: wrap;
        }
        .feature-item {
          font-size: 10.5px;
          color: #9ca3af;
          display: flex;
          align-items: center;
        }
        .feature-sep {
          margin: 0 9px;
          color: #d1d5db;
        }

        /* Footer strip */
        .hero-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 14px;
          padding: 0 2px;
        }
        .hero-footer-tag {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #9ca3af;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .hero-footer-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 4px 10px;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          color: #6b7280;
          letter-spacing: 0.1em;
        }
        .footer-live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #16a34a;
          animation: blink 2s ease-in-out infinite;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .hero-wrap { padding: 16px; border-radius: 18px; }
          .hero-section {
            grid-template-columns: 1fr;
            border-radius: 12px;
            min-height: auto;
          }
          .hero-photo { min-height: 220px; }
          .hero-content { padding: 20px 18px 18px; }
          .hero-headline { font-size: 50px; }
          .metric-val { font-size: 15px; }
          .hero-footer { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
        @media (max-width: 380px) {
          .hero-headline { font-size: 44px; }
          .hero-wrap { padding: 12px; }
        }
      `}</style>

      <div className="hero-wrap">
        <section className="hero-section">

          {/* Left — local image from /public/cp.jpg */}
          <div className="hero-photo">
            <Image
              src="/cp1.webp"
              alt="Land survey aerial view"
              fill
              priority
              className="hero-photo-img"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="hero-photo-overlay" />
            <div className="hero-grid-lines" />

            <div className="status-badge">
              <span className="status-dot" />
              Survey active
            </div>

            <div className="pin-anchor">
              <span className="pin-ripple" />
              <span className="pin-ripple pin-ripple-2" />
              <div className="pin-circle">
                <div className="pin-core" />
              </div>
            </div>

            <div className="coords">
              LAT 6.9271° N<br />
              LON 79.8612° E<br />
              ALT 7m ASL
            </div>
          </div>

          {/* Right — content */}
          <div className="hero-content">
            <div>
              <p className="hero-eyebrow">Land survey platform</p>

              <h1 className="hero-headline">
                OPEN<br />
                <span className="hero-headline-accent">LAND</span><br />
                MAP
              </h1>

              <p className="hero-sub">
                Precision boundary mapping and parcel analysis for
                surveyors&nbsp;and planners.
              </p>

              <div className="metrics-grid">
                {metrics.map(({ val, label, green }) => (
                  <div className="metric-card" key={label}>
                    <div className={`metric-val${green ? " metric-val-live" : ""}`}>
                      {val}
                    </div>
                    <div className="metric-label">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link href="/landmap" className="cta-link">
                <span>Open Land Map</span>
                <span className="cta-right">
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  LAUNCH →
                </span>
              </Link>

              <hr className="hero-divider" />

              <div className="features-row">
                {features.map((f, i) => (
                  <span className="feature-item" key={f}>
                    {i > 0 && <span className="feature-sep">·</span>}
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </section>

        <div className="hero-footer">
          <span className="hero-footer-tag">v2.4.1 · GIS Engine</span>
          <div className="hero-footer-badge">
            <span className="footer-live-dot" />
            Data sync active
          </div>
        </div>
      </div>
    </>
  );
}