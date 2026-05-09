"use client";

import { useEffect, useRef, useState } from "react";

const TECHNOLOGIES = [
  {
    id: "gps",
    title: "Advanced GPS & GNSS",
    description:
      "Sub-meter accuracy positioning systems using real-time kinematic (RTK) technology, delivering precise boundary measurements for land surveying.",
    icon: "📡",
  },
  {
    id: "lidar",
    title: "LiDAR & Remote Sensing",
    description:
      "High-resolution 3D mapping through airborne and terrestrial LiDAR, capturing detailed topographic data for comprehensive land analysis.",
    icon: "🛰️",
  },
  {
    id: "photogrammetry",
    title: "Photogrammetry & Imagery",
    description:
      "Aerial drone-based photography and orthomosaic generation, creating geo-referenced visual records of survey areas with pixel-level precision.",
    icon: "🎥",
  },
  {
    id: "cloud",
    title: "Cloud-Based Data Management",
    description:
      "Secure, scalable infrastructure for storing, processing, and sharing geospatial data with real-time collaboration capabilities.",
    icon: "☁️",
  },
  {
    id: "ml",
    title: "Machine Learning & AI",
    description:
      "Intelligent algorithms for automated feature detection, land classification, and predictive analytics on geospatial datasets.",
    icon: "🤖",
  },
  {
    id: "webgis",
    title: "Web-GIS Platform",
    description:
      "Interactive online mapping interface for visualizing, analyzing, and exporting survey data with customizable layers and reporting tools.",
    icon: "🗺️",
  },
];

function TechCard({ tech, index, inView }) {
  return (
    <article
      className={`tech-card${inView ? " tech-card--visible" : ""}`}
      style={{ "--delay": `${index * 0.1}s` }}
    >
      <div className="tech-card__icon">{tech.icon}</div>
      
      <div className="tech-card__body">
        <h3 className="tech-card__title">{tech.title}</h3>
        <p className="tech-card__desc">{tech.description}</p>
      </div>

      <a href={`#${tech.id}`} className="tech-card__link" aria-label={`Learn more about ${tech.title}`}>
        <span>Explore</span>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </article>
  );
}

export default function TechnologySection() {
  const [inView, setInView] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

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

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (headerRef.current) headerObserver.observe(headerRef.current);
    return () => headerObserver.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        /* ─── SECTION WRAPPER ─── */
        .tech-section {
          width: 100%;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 80px 40px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ─── HEADER ─── */
        .tech-header {
          margin-bottom: 56px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .tech-header__eyebrow {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: #1a3a5c;
          margin-bottom: 12px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .tech-header__eyebrow.visible {
          opacity: 1; transform: translateY(0);
        }

        .tech-header__title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: #0d1f35;
          letter-spacing: -0.01em;
          line-height: 1.1;
          margin-bottom: 16px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s;
        }
        .tech-header__title.visible { opacity: 1; transform: translateY(0); }

        .tech-header__subtitle {
          font-size: 1.05rem;
          font-weight: 300;
          color: #475569;
          line-height: 1.6;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
        }
        .tech-header__subtitle.visible { opacity: 1; transform: translateY(0); }

        .tech-header__rule {
          margin-top: 24px;
          height: 3px;
          width: 0;
          background: linear-gradient(90deg, #c8a84b, #e2c97e, #c8a84b);
          margin-left: auto;
          margin-right: auto;
          transition: width 1s cubic-bezier(0.16,1,0.3,1) 0.2s;
        }
        .tech-header__rule.visible { width: 72px; }

        /* ─── CARD GRID ─── */
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          align-items: stretch;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* ─── CARD ─── */
        .tech-card {
          position: relative;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(200, 168, 75, 0.2);
          border-radius: 16px;
          padding: 40px 28px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 360px;
          cursor: pointer;
          overflow: hidden;
          
          opacity: 0;
          transform: translateY(32px);
          transition:
            opacity 0.75s cubic-bezier(0.16,1,0.3,1) var(--delay, 0s),
            transform 0.75s cubic-bezier(0.16,1,0.3,1) var(--delay, 0s),
            background 0.35s ease,
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .tech-card--visible {
          opacity: 1; transform: translateY(0);
        }

        .tech-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #c8a84b, #e2c97e, transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        .tech-card:hover {
          background: linear-gradient(135deg, #fef5e7 0%, #f8fafc 100%);
          border-color: rgba(200, 168, 75, 0.5);
          box-shadow: 0 12px 32px rgba(200, 168, 75, 0.1);
        }

        .tech-card:hover::before {
          transform: scaleX(1);
        }

        .tech-card__icon {
          font-size: 3rem;
          margin-bottom: 16px;
          display: inline-block;
        }

        .tech-card__body {
          position: relative;
          z-index: 1;
          flex: 1;
        }

        .tech-card__title {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #0d1f35;
          line-height: 1.2;
          margin-bottom: 12px;
          letter-spacing: -0.01em;
        }

        .tech-card__desc {
          font-size: 0.95rem;
          font-weight: 300;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .tech-card__link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #c8a84b;
          text-decoration: none;
          border-bottom: 2px solid rgba(200, 168, 75, 0.3);
          padding-bottom: 4px;
          transition:
            color 0.25s ease,
            border-color 0.25s ease;
        }

        .tech-card__link:hover {
          color: #e2c97e;
          border-color: #e2c97e;
        }

        .tech-card__link svg {
          transition: transform 0.25s ease;
        }

        .tech-card__link:hover svg {
          transform: translateX(3px);
        }

        /* ═══════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════ */

        @media (max-width: 1024px) {
          .tech-section { padding: 64px 32px; }
          .tech-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          .tech-card { min-height: 320px; }
        }

        @media (max-width: 640px) {
          .tech-section { padding: 48px 16px; }
          .tech-header { margin-bottom: 40px; }
          .tech-header__title { font-size: clamp(1.5rem, 5vw, 2rem); }
          .tech-header__subtitle { font-size: 0.95rem; }
          .tech-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .tech-card {
            min-height: 280px;
            padding: 24px 20px;
          }
          .tech-card__icon { font-size: 2rem; }
          .tech-card__title { font-size: 1.15rem; }
          .tech-card__desc { font-size: 0.85rem; }
        }
      `}</style>

      <section className="tech-section" id="technology">
        <div className="tech-header" ref={headerRef}>
          <div className={`tech-header__eyebrow${headerVisible ? " visible" : ""}`}>
            Cutting-Edge Solutions
          </div>
          <h2 className={`tech-header__title${headerVisible ? " visible" : ""}`}>
            Technology Stack
          </h2>
          <p className={`tech-header__subtitle${headerVisible ? " visible" : ""}`}>
            Powered by the latest innovations in geospatial technology and cloud computing
          </p>
          <div className={`tech-header__rule${headerVisible ? " visible" : ""}`} />
        </div>

        <div className="tech-grid" ref={sectionRef}>
          {TECHNOLOGIES.map((tech, index) => (
            <TechCard key={tech.id} tech={tech} index={index} inView={inView} />
          ))}
        </div>
      </section>
    </>
  );
}
