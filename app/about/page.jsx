"use client";

import { useState } from "react";

const stats = [
  { value: "18+",    label: "Years in Practice"   },
  { value: "1,400+", label: "Surveys Completed"   },
  { value: "9",      label: "Licensed Surveyors"  },
  { value: "26",     label: "Districts Covered"   },
];

const values = [
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Precision First",
    desc: "Every measurement is verified twice. We stake our reputation on accuracy that stands up in court and in the field.",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "On-Time Delivery",
    desc: "Deadlines matter in property transactions. We plan rigorously so your survey arrives when you need it — not after.",
  },
  {
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Client Partnership",
    desc: "We explain findings in plain language, keep you updated throughout, and remain available long after the report is filed.",
  },
];

const team = [
  { initials: "JK", name: "Januda J Kodithuwakku", role: "Project Lead",      credential: "Projected by", color: "#d97706", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80" },
  { initials: "HN", name: "Heshan Nanayakkara",    role: "Senior Surveyor",   credential: "Licensed Surveyor", color: "#374151", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80" },
  { initials: "RN", name: "Ruwan Niroshan",        role: "GPS / GNSS Specialist", credential: "Licensed · 8 yrs",  color: "#111827", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80" },
];

const equipment = [
  {
    label: "Total Station",
    sub: "Leica TS16 · ±1″ angular precision",
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    label: "GPS / GNSS Receiver",
    sub: "Trimble R10 · RTK capable",
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
  },
  {
    label: "Digital Level",
    sub: "Sokkia SDL50 · ±0.3 mm / km",
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

/* ── Unsplash images ── */
const IMG_HERO  = "https://images.unsplash.com/photo-1628158088936-68ccaaa400dc?auto=format&fit=crop&w=1400&q=80";
const IMG_A     = "https://images.unsplash.com/photo-1628158145409-9e222b56cc0b?auto=format&fit=crop&w=800&q=80";
const IMG_B     = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80";
const IMG_C     = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80";
const IMG_EQUIP = "https://images.unsplash.com/photo-1548625361-58a9d5fe7e0e?auto=format&fit=crop&w=800&q=80";

/* ── Adjust this ONE variable to match your navbar height ── */
const NAVBAR_H = 0; /* px */

export default function AboutSection() {
  const [activeVal, setActiveVal] = useState(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        /* ─── global ─── */
        .about-section {
          background: #f0f1f3;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
        }

        /* ─── HERO ─── */
        /*
         * The hero sits BELOW a fixed/sticky navbar.
         * padding-top pushes the photo area down so it isn't hidden
         * under the navbar.  The inner content uses justify-content:flex-end
         * so the heading/text cluster at the BOTTOM of the visible area,
         * well away from the navbar.
         */
        .about-hero {
          position: relative;
          height: calc(100vh - ${NAVBAR_H}px);   /* full viewport minus navbar */
          max-height: 620px;                      /* cap on large screens        */
          min-height: 480px;                      /* floor on small screens      */
          overflow: hidden;
          margin-top: ${NAVBAR_H}px;              /* push hero below fixed navbar */
        }
        .hero-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center 38%;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to right,
            rgba(17,24,39,0.45) 0%,
            rgba(17,24,39,0.20) 52%,
            rgba(17,24,39,0.00) 100%
          );
        }
        /* Content anchored to bottom-left of hero */
        .hero-content {
          position: absolute;
          inset: 0;
          max-width: 1120px;
          width: 100%;
          margin: 0 auto;
          padding: 0 48px 52px;          /* side padding + bottom offset */
          display: flex;
          flex-direction: column;
          justify-content: flex-end;    /* ← text sits at the BOTTOM    */
          align-items: flex-start;
        }
        .about-tag {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.20em;
          text-transform: uppercase; color: #f59e0b;
          margin-bottom: 10px;
        }
        .about-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(44px, 5.5vw, 72px);
          line-height: 0.88; letter-spacing: 0.02em;
          color: #fff; margin-bottom: 16px;
          text-shadow: 0 2px 12px rgba(0,0,0,0.30);
        }
        .about-heading span { color: #d97706; }
        .about-lead {
          font-size: 13.5px; font-weight: 400;
          color: rgba(255,255,255,0.90);
          line-height: 1.8; max-width: 380px;
          margin-bottom: 24px;
          text-shadow: 0 1px 6px rgba(0,0,0,0.35);
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 999px; padding: 6px 14px;
          font-family: 'DM Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.12em;
          color: #fde68a; text-transform: uppercase;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #d97706; flex-shrink: 0;
          animation: bpulse 2s ease-in-out infinite;
        }
        @keyframes bpulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.8); }
        }

        /* ─── STATS ─── */
        .stats-strip { background: #ffffff; border-bottom: 1px solid #e5e7eb; }
        .stats-inner {
          max-width: 1120px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(4,1fr);
        }
        .stat-item {
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: 30px 16px;
          border-right: 1px solid #e5e7eb;
        }
        .stat-item:last-child { border-right: none; }
        .stat-value {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px; line-height: 1;
          color: #d97706; letter-spacing: 0.03em;
        }
        .stat-label { font-size: 11px; color: #9ca3af; margin-top: 5px; letter-spacing: 0.04em; }

        /* ─── SHARED helpers ─── */
        .section-tag {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.18em;
          text-transform: uppercase; color: #d97706;
          margin-bottom: 10px;
        }
        .section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 3.5vw, 46px);
          line-height: 0.9; letter-spacing: 0.02em;
          color: #111827; margin-bottom: 8px;
        }
        .section-heading span { color: #d97706; }
        .section-desc {
          font-size: 12.5px; font-weight: 300; color: #6b7280;
          line-height: 1.8; margin-bottom: 22px;
        }

        /* ─── PHOTO MOSAIC + VALUES ─── */
        .mid-section {
          padding: 68px 48px;
          max-width: 1120px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1.35fr;
          gap: 52px; align-items: start;
        }
        .photo-mosaic {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 220px 160px;
          gap: 8px;
        }
        .mosaic-img { border-radius: 12px; overflow: hidden; }
        .mosaic-img img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform 0.4s ease;
        }
        .mosaic-img:hover img { transform: scale(1.05); }
        .mosaic-img.wide { grid-column: 1 / -1; }

        /* values cards */
        .values-cards { display: flex; flex-direction: column; gap: 10px; }
        .value-card {
          background: #fff; border-radius: 14px;
          padding: 18px 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 3px 10px rgba(0,0,0,0.05);
          cursor: pointer; border: 1.5px solid transparent;
          transition: border-color 0.2s, transform 0.15s;
        }
        .value-card:hover { transform: translateY(-1px); }
        .value-card.active {
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.08);
        }
        .value-card-header { display: flex; align-items: center; gap: 12px; }
        .value-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: #fef3c7; border: 1px solid #fde68a;
          display: flex; align-items: center; justify-content: center;
          color: #d97706; flex-shrink: 0;
        }
        .value-card.active .value-icon { background: #111827; border-color: #111827; color: #d97706; }
        .value-title { font-size: 13px; font-weight: 600; color: #111827; }
        .value-desc {
          font-size: 12px; font-weight: 300; color: #6b7280;
          line-height: 1.75; max-height: 0; overflow: hidden;
          transition: max-height 0.3s, opacity 0.25s, margin-top 0.2s;
          opacity: 0; margin-top: 0;
        }
        .value-card.active .value-desc { max-height: 80px; opacity: 1; margin-top: 10px; }

        /* ─── FULL-WIDTH PHOTO QUOTE ─── */
        .photo-quote-row { position: relative; height: 320px; overflow: hidden; }
        .photo-quote-row img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center 55%;
        }
        .photo-quote-overlay {
          position: absolute; inset: 0;
          background: rgba(17,24,39,0.52);
          display: flex; align-items: center; justify-content: center;
        }
        .photo-quote-box { text-align: center; padding: 0 24px; }
        .photo-quote-box blockquote {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(22px, 3vw, 34px);
          letter-spacing: 0.04em; color: #fff;
          margin: 0 0 10px; line-height: 1.1;
        }
        .photo-quote-box blockquote span { color: #d97706; }
        .photo-quote-box cite {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(255,255,255,0.50);
          font-style: normal;
        }

        /* ─── TEAM ─── */
        .team-section {
          padding: 68px 48px;
          max-width: 1120px; margin: 0 auto;
        }
        .team-header {
          display: flex; align-items: flex-end;
          justify-content: space-between; margin-bottom: 32px;
          flex-wrap: wrap; gap: 12px;
        }
        .team-cta-link {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #d97706; text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.15s; padding-bottom: 1px;
        }
        .team-cta-link:hover { border-color: #d97706; }
        .team-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .team-card {
          background: #fff; border: 1.5px solid #e5e7eb;
          border-radius: 16px; padding: 26px 20px 20px;
          display: flex; flex-direction: column; align-items: flex-start;
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .team-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); transform: translateY(-2px); }
        .team-avatar {
          width: 50px; height: 50px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 19px; letter-spacing: 0.04em;
          color: #fff; margin-bottom: 14px; flex-shrink: 0;
          background-size: cover; background-position: center;
          overflow: hidden;
        }
        .team-name { font-size: 13.5px; font-weight: 600; color: #111827; margin-bottom: 2px; }
        .team-role  { font-size: 12px; color: #6b7280; margin-bottom: 12px; }
        .team-credential {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #d97706; background: #fef3c7;
          border: 1px solid #fde68a; border-radius: 999px; padding: 3px 10px;
        }

        /* ─── EQUIPMENT ─── */
        .equip-section {
          background: #fff; border-top: 1px solid #e5e7eb;
          padding: 60px 48px;
        }
        .equip-inner {
          max-width: 1120px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1.8fr;
          gap: 52px; align-items: center;
        }
        .equip-img-wrap {
          border-radius: 16px; overflow: hidden;
          height: 260px; position: relative;
        }
        .equip-img-wrap img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.4s ease;
        }
        .equip-img-wrap:hover img { transform: scale(1.04); }
        .equip-img-badge {
          position: absolute; bottom: 12px; left: 12px;
          background: rgba(17,24,39,0.78);
          border-radius: 8px; padding: 6px 12px;
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.12em;
          text-transform: uppercase; color: #fde68a;
        }
        .equip-list { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
        .equip-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px; background: #f9fafb;
          border: 1.5px solid #e5e7eb; border-radius: 12px;
          transition: border-color 0.18s;
        }
        .equip-item:hover { border-color: #d97706; }
        .equip-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: #fef3c7; border: 1px solid #fde68a;
          display: flex; align-items: center; justify-content: center;
          color: #d97706; flex-shrink: 0;
        }
        .equip-text { font-size: 12.5px; font-weight: 500; color: #111827; }
        .equip-sub  { font-size: 10.5px; color: #9ca3af; font-family: 'DM Mono', monospace; margin-top: 1px; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 768px) {
          .about-hero { margin-top: 60px; }
          .hero-content { padding: 0 20px 40px; }
          .stats-inner { grid-template-columns: repeat(2,1fr); }
          .stat-item { border-right: none; border-bottom: 1px solid #e5e7eb; }
          .stat-item:nth-child(odd) { border-right: 1px solid #e5e7eb; }
          .stat-item:last-child,
          .stat-item:nth-last-child(2) { border-bottom: none; }
          .mid-section  { grid-template-columns: 1fr; gap: 28px; padding: 44px 20px; }
          .photo-mosaic { grid-template-rows: 160px 120px; }
          .team-section { padding: 44px 20px; }
          .team-grid    { grid-template-columns: 1fr; }
          .equip-section { padding: 44px 20px; }
          .equip-inner  { grid-template-columns: 1fr; gap: 28px; }
          .equip-img-wrap { height: 200px; }
          .photo-quote-row { height: 240px; }
        }
      `}</style>

      <section id="about" className="about-section">

        {/* ── HERO ── */}
        <div className="about-hero">
          <img className="hero-img" src={IMG_HERO} alt="Surveyor using a total station in the field" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="about-tag">About Us</p>
            <h2 className="about-heading">
              BUILT ON<br /><span>TRUST,</span><br />BUILT ON<br />LAND
            </h2>
            <p className="about-lead">
              Since 2006, our licensed team has mapped Sri Lanka's land with precision
              instruments and an uncompromising commitment to accuracy that clients
              and courts rely on.
            </p>
            <div className="hero-badge">
              <span className="badge-dot" />
              Registered · Survey Department of Sri Lanka
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="stats-strip">
          <div className="stats-inner">
            {stats.map((s) => (
              <div className="stat-item" key={s.label}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PHOTO MOSAIC + VALUES ── */}
        <div className="mid-section">
          <div className="photo-mosaic">
            <div className="mosaic-img wide">
              <img src={IMG_A} alt="Surveyor working with GNSS equipment outdoors" />
            </div>
            <div className="mosaic-img">
              <img src={IMG_B} alt="Construction site survey" />
            </div>
            <div className="mosaic-img">
              <img src={IMG_C} alt="Topographic fieldwork" />
            </div>
          </div>

          <div>
            <p className="section-tag">Our Values</p>
            <h2 className="section-heading">HOW WE<br /><span>WORK</span></h2>
            <p className="section-desc">
              Three principles shape every survey — from a 10-perch residential
              plot to a large-scale construction corridor.
            </p>
            <div className="values-cards">
              {values.map((v, i) => (
                <div
                  key={v.title}
                  className={`value-card${activeVal === i ? " active" : ""}`}
                  onClick={() => setActiveVal(i)}
                >
                  <div className="value-card-header">
                    <div className="value-icon">{v.icon}</div>
                    <span className="value-title">{v.title}</span>
                  </div>
                  <p className="value-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FULL-WIDTH PHOTO QUOTE ── */}
        <div className="photo-quote-row">
          <img src={IMG_A} alt="Land survey team at work in the field" />
          <div className="photo-quote-overlay">
            <div className="photo-quote-box">
              <blockquote>
                EVERY BOUNDARY TELLS A <span>STORY.</span><br />WE TELL IT ACCURATELY.
              </blockquote>
              <cite>Januda Perera · Principal Surveyor</cite>
            </div>
          </div>
        </div>

        {/* ── TEAM ── */}
        <div className="team-section">
          <div className="team-header">
            <div>
              <p className="section-tag">The People</p>
              <h2 className="section-heading">MEET THE<br /><span>TEAM</span></h2>
            </div>
            <a href="#contact" className="team-cta-link">Request a Survey →</a>
          </div>
          <div className="team-grid">
            {team.map((m) => (
              <div className="team-card" key={m.name}>
                <div className="team-avatar" style={m.image ? { backgroundImage: `url(${m.image})`, background: `url(${m.image})` } : { background: m.color }}>
                  {!m.image && m.initials}
                </div>
                <p className="team-name">{m.name}</p>
                <p className="team-role">{m.role}</p>
                <span className="team-credential">{m.credential}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── EQUIPMENT ── */}
        <div className="equip-section">
          <div className="equip-inner">
            <div className="equip-img-wrap">
              <img src={IMG_EQUIP} alt="Survey-grade total station on tripod in field" />
              <span className="equip-img-badge">Survey-Grade Instruments</span>
            </div>
            <div>
              <p className="section-tag">Equipment</p>
              <h2 className="section-heading">TOOLS WE<br /><span>TRUST</span></h2>
              <div className="equip-list">
                {equipment.map((eq) => (
                  <div className="equip-item" key={eq.label}>
                    <div className="equip-icon">{eq.icon}</div>
                    <div>
                      <p className="equip-text">{eq.label}</p>
                      <p className="equip-sub">{eq.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}