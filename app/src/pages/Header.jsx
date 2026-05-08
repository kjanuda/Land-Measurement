"use client";

import { useEffect, useState, useRef } from "react";

export default function HeroHeader() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Disable parallax on mobile — battery/perf savings + avoids jank on iOS
    if (isMobile) return;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          setScrollY(-rect.top);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  const bgY = isMobile ? 0 : scrollY * 0.42;
  const textY = isMobile ? 0 : scrollY * 0.18;
  const statsY = isMobile ? 0 : scrollY * 0.1;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        /* ─────────────────────────────────────
           BASE HERO
        ───────────────────────────────────── */
        .hero {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          display: flex;
          align-items: center;
          background: #070e17;
          /* Touch-action: pan-y lets iOS scroll without fighting the component */
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
        }

        /* BG image — extra tall for parallax travel on desktop */
        .hero__bg {
          position: absolute;
          top: -25%;
          left: 0; right: 0;
          height: 150%;
          background-image: url('/svr2.jpg');
          background-size: cover;
          background-position: center 35%;
          will-change: transform;
          z-index: 0;
          transition: opacity 1.4s ease;
          opacity: 0;
        }
        .hero__bg.loaded { opacity: 1; }

        /* On mobile: reset parallax geometry so it fills cleanly */
        @media (max-width: 768px) {
          .hero__bg {
            top: 0; height: 100%;
            background-attachment: scroll; /* avoid fixed bg iOS bug */
            will-change: auto;
          }
        }

        /* Gradient overlays */
        .hero__gradient {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(to top,
              rgba(4,10,18,0.97) 0%,
              rgba(4,10,18,0.75) 38%,
              rgba(4,10,18,0.25) 65%,
              rgba(4,10,18,0.08) 100%
            ),
            linear-gradient(105deg,
              rgba(4,10,18,0.80) 0%,
              rgba(4,10,18,0.35) 50%,
              transparent 100%
            );
        }

        /* Stronger bottom fade on mobile for legibility */
        @media (max-width: 768px) {
          .hero__gradient {
            background:
              linear-gradient(to top,
                rgba(4,10,18,0.99) 0%,
                rgba(4,10,18,0.88) 40%,
                rgba(4,10,18,0.42) 70%,
                rgba(4,10,18,0.12) 100%
              );
          }
        }

        /* Grain */
        .hero__grain {
          position: absolute; inset: 0; z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; opacity: 0.3;
        }

        /* Gold top bar */
        .hero__topbar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px; z-index: 10;
          background: linear-gradient(90deg,
            #b49a4a 0%, #e2c97e 45%, #b49a4a 75%, transparent 100%
          );
        }

        /* Corner meta labels */
        .hero__coord {
          position: absolute; z-index: 8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem; font-weight: 300;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(180,155,90,0.48);
          opacity: 0;
          transition: opacity 1s ease 1.6s;
        }
        .hero__coord.visible { opacity: 1; }
        .hero__coord--tl { top: 22px; left: 28px; }
        .hero__coord--tr { top: 22px; right: 28px; text-align: right; line-height: 1.8; }

        /* Hide coords on small screens */
        @media (max-width: 600px) {
          .hero__coord--tl,
          .hero__coord--tr { display: none; }
        }

        /* ─────────────────────────────────────
           MAIN CONTENT
        ───────────────────────────────────── */
        .hero__content {
          position: relative; z-index: 10;
          width: 100%; max-width: 1200px;
          margin: 0 auto;
          padding: 0 56px;
          will-change: transform;
          display: flex;
          flex-direction: column;
        }

        /* Eyebrow */
        .hero__eyebrow {
          display: inline-flex; align-items: center; gap: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: #c8a84b;
          margin-bottom: 20px;
          opacity: 0; transform: translateX(-18px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        .hero__eyebrow.visible { opacity: 1; transform: translateX(0); }
        .hero__eyebrow::before {
          content: '';
          display: block; width: 30px; height: 1px;
          background: #c8a84b; flex-shrink: 0;
        }

        /* Headline */
        .hero__headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 6.5vw, 5.8rem);
          font-weight: 900; line-height: 1.0;
          color: #f5f0e8; letter-spacing: -0.02em;
        }
        .hero__headline-line {
          display: block;
          opacity: 0; transform: translateY(48px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1),
                      transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .hero__headline-line:nth-child(1) { transition-delay: 0.28s; }
        .hero__headline-line:nth-child(2) { transition-delay: 0.44s; }
        .hero__headline-line.visible { opacity: 1; transform: translateY(0); }
        .hero__headline em { font-style: italic; color: #c8a84b; font-weight: 700; }

        /* Divider */
        .hero__sep {
          display: flex; align-items: center; gap: 12px;
          margin: 24px 0 20px;
          opacity: 0; transition: opacity 0.8s ease 0.65s;
        }
        .hero__sep.visible { opacity: 1; }
        .hero__sep-line {
          width: 0; height: 1px;
          background: rgba(200,168,75,0.45);
          transition: width 1.2s cubic-bezier(0.16,1,0.3,1) 0.75s;
        }
        .hero__sep-line.visible { width: 90px; }
        .hero__sep-diamond {
          width: 5px; height: 5px;
          border: 1px solid #c8a84b;
          transform: rotate(45deg); flex-shrink: 0;
        }

        /* Sub copy */
        .hero__sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.05rem, 2vw, 1.38rem);
          font-weight: 300; font-style: italic;
          color: rgba(220,210,185,0.80);
          letter-spacing: 0.03em; line-height: 1.6;
          max-width: 520px;
          opacity: 0; transform: translateY(12px);
          transition: opacity 0.7s ease 0.82s, transform 0.7s ease 0.82s;
        }
        .hero__sub.visible { opacity: 1; transform: translateY(0); }

        /* CTA row */
        .hero__cta-row {
          display: flex; align-items: center;
          flex-wrap: wrap; gap: 20px;
          margin-top: 34px;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.6s ease 1s, transform 0.6s ease 1s;
        }
        .hero__cta-row.visible { opacity: 1; transform: translateY(0); }

        /* Primary button */
        .hero__btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 34px;
          background: #c8a84b; color: #0b1620;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500; font-size: 0.8rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none; border: none; cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px));
          transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease;
          box-shadow: 0 4px 28px rgba(200,168,75,0.3);
          white-space: nowrap;
          /* Ensure 44px+ touch target */
          min-height: 48px;
          -webkit-user-select: none; user-select: none;
        }
        .hero__btn-primary:hover  { background: #e2c97e; box-shadow: 0 6px 36px rgba(200,168,75,0.5); }
        .hero__btn-primary:active { transform: scale(0.97); }
        .hero__btn-primary svg    { transition: transform 0.25s ease; }
        .hero__btn-primary:hover svg { transform: translateX(4px); }

        /* Secondary link */
        .hero__btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.76rem; font-weight: 400;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(200,185,145,0.7); text-decoration: none;
          border-bottom: 1px solid rgba(200,168,75,0.28); padding-bottom: 2px;
          transition: color 0.25s ease, border-color 0.25s ease;
          white-space: nowrap;
          min-height: 44px; display: inline-flex; align-items: flex-end;
        }
        .hero__btn-secondary:hover { color: #c8a84b; border-color: #c8a84b; }

        /* ─────────────────────────────────────
           STATS — desktop: absolute right-center
        ───────────────────────────────────── */
        .hero__stats-desktop {
          position: absolute;
          right: 56px;
          top: 50%;
          z-index: 10;
          display: flex; flex-direction: column; gap: 32px;
          will-change: transform;
          opacity: 0;
          transition: opacity 0.9s ease 1.2s;
        }
        .hero__stats-desktop.visible { opacity: 1; }

        .hero__stat {
          text-align: right;
          padding-right: 18px;
          border-right: 1px solid rgba(200,168,75,0.3);
          position: relative;
        }
        .hero__stat::after {
          content: '';
          position: absolute; right: -1px; top: 0;
          width: 1px; height: 0;
          background: #c8a84b;
          transition: height 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .hero__stats-desktop.visible .hero__stat::after { height: 100%; }
        .hero__stat:nth-child(1)::after { transition-delay: 1.3s; }
        .hero__stat:nth-child(2)::after { transition-delay: 1.5s; }
        .hero__stat:nth-child(3)::after { transition-delay: 1.7s; }

        .hero__stat-num {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.7rem, 2.8vw, 2.4rem);
          font-weight: 700; color: #c8a84b; line-height: 1;
        }
        .hero__stat-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(200,185,145,0.48); margin-top: 5px;
        }

        /* ─────────────────────────────────────
           STATS — mobile: horizontal strip at bottom
           Appears INSIDE hero__content on mobile
        ───────────────────────────────────── */
        .hero__stats-mobile {
          display: none; /* hidden on desktop */
        }

        /* Scroll cue */
        .hero__scroll {
          position: absolute; bottom: 28px; left: 50%;
          transform: translateX(-50%); z-index: 10;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          opacity: 0; transition: opacity 0.6s ease 1.6s;
          pointer-events: none;
        }
        .hero__scroll.visible { opacity: 0.4; }
        .hero__scroll-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.55rem; letter-spacing: 0.3em;
          text-transform: uppercase; color: #c8a84b;
        }
        .hero__scroll-line {
          width: 1px; height: 30px;
          background: linear-gradient(to bottom, #c8a84b, transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1);   transform-origin: top; }
          50%       { opacity: 1;   transform: scaleY(1.2); transform-origin: top; }
        }

        /* ═══════════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ═══════════════════════════════════════ */

        /* ── Tablet ── */
        @media (max-width: 1024px) {
          .hero__content { padding: 0 40px; }
          .hero__stats-desktop { right: 40px; gap: 24px; }
          .hero__coord--tr { display: none; }
        }

        /* ── Mobile (≤768px) ── */
        @media (max-width: 768px) {
          .hero {
            /* Align content toward bottom third for cinematic feel */
            align-items: flex-end;
          }

          .hero__content {
            padding: 0 20px 80px; /* bottom pad clears scroll cue */
            max-width: 100%;
          }

          /* Hide desktop stats panel */
          .hero__stats-desktop { display: none !important; }

          /* Show mobile stats strip */
          .hero__stats-mobile {
            display: flex;
            align-items: flex-start;
            gap: 0;
            margin-top: 28px;
            opacity: 0;
            transition: opacity 0.9s ease 1.2s;
            /* Horizontal scroll fallback if too many stats */
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .hero__stats-mobile::-webkit-scrollbar { display: none; }
          .hero__stats-mobile.visible { opacity: 1; }

          .hero__stat-mobile {
            flex: 1 0 auto;
            min-width: 80px;
            padding: 0 16px 0 0;
            border-left: 1px solid rgba(200,168,75,0.28);
            padding-left: 14px;
          }
          .hero__stat-mobile:first-child {
            border-left: none;
            padding-left: 0;
          }
          .hero__stat-mobile .hero__stat-num {
            font-size: clamp(1.5rem, 6vw, 2rem);
          }
          .hero__stat-mobile .hero__stat-label {
            font-size: 0.57rem;
          }

          .hero__headline {
            font-size: clamp(2.4rem, 9.5vw, 3.6rem);
          }

          .hero__eyebrow {
            font-size: 0.62rem;
            letter-spacing: 0.28em;
            margin-bottom: 16px;
          }

          .hero__sub {
            max-width: 100%;
            font-size: clamp(1rem, 3.5vw, 1.15rem);
          }

          .hero__sep { margin: 18px 0 16px; }

          .hero__cta-row {
            gap: 16px;
            margin-top: 26px;
          }

          .hero__scroll { display: none; }
        }

        /* ── Small mobile (≤480px) ── */
        @media (max-width: 480px) {
          .hero__content { padding: 0 18px 70px; }

          .hero__headline {
            font-size: clamp(2.1rem, 10.5vw, 2.8rem);
          }

          .hero__eyebrow::before { width: 22px; }

          .hero__sep { margin: 16px 0 14px; }
          .hero__sep-line.visible { width: 70px; }

          .hero__cta-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            margin-top: 22px;
          }

          .hero__btn-primary {
            width: 100%;
            justify-content: center;
            padding: 16px 28px;
          }

          /* Keep secondary link on small mobile but full width */
          .hero__btn-secondary {
            align-items: center;
            border-bottom: none;
            border-top: 1px solid rgba(200,168,75,0.2);
            padding-top: 14px;
            padding-bottom: 0;
          }

          .hero__stats-mobile {
            gap: 0;
            margin-top: 22px;
          }

          .hero__stat-mobile {
            min-width: 70px;
            padding-left: 12px;
            padding-right: 12px;
          }
        }

        /* ── Landscape mobile (short screens) ── */
        @media (max-width: 768px) and (max-height: 500px) {
          .hero { min-height: 420px; }
          .hero__content { padding-bottom: 36px; }
          .hero__eyebrow { margin-bottom: 10px; }
          .hero__sep { margin: 12px 0 10px; }
          .hero__cta-row { margin-top: 16px; }
          .hero__stats-mobile { margin-top: 18px; }

          .hero__headline {
            font-size: clamp(1.8rem, 7vw, 2.6rem);
          }
          .hero__sub { font-size: 0.95rem; }
        }

        /* ── Accessibility: reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .hero__bg,
          .hero__headline-line,
          .hero__eyebrow,
          .hero__sep,
          .hero__sep-line,
          .hero__sub,
          .hero__cta-row,
          .hero__stats-desktop,
          .hero__stats-mobile,
          .hero__coord,
          .hero__scroll {
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .hero__sep-line.visible { width: 90px; }
          .hero__stat::after { height: 100% !important; }
        }

        /* ── High contrast mode support ── */
        @media (forced-colors: active) {
          .hero__btn-primary {
            clip-path: none;
            border: 2px solid ButtonText;
          }
        }
      `}</style>

      <section
        className="hero"
        ref={heroRef}
        role="banner"
        aria-label="Hero — Precision Geospatial & Survey Solutions"
      >
        <div className="hero__topbar" aria-hidden="true" />

        {/* Parallax background */}
        <div
          className={`hero__bg${loaded ? " loaded" : ""}`}
          style={!isMobile ? { transform: `translateY(${bgY}px)` } : undefined}
          role="img"
          aria-label="Aerial survey photography"
        />
        <div className="hero__gradient" aria-hidden="true" />
        <div className="hero__grain"   aria-hidden="true" />

        {/* Corner metadata */}
        <div className={`hero__coord hero__coord--tl${loaded ? " visible" : ""}`} aria-hidden="true">
          N 38°54′17″ · W 77°02′06″
        </div>
        <div className={`hero__coord hero__coord--tr${loaded ? " visible" : ""}`} aria-hidden="true">
          Established 1954<br />Licensed · Insured
        </div>

        {/* Desktop stats panel */}
        <div
          className={`hero__stats-desktop${loaded ? " visible" : ""}`}
          style={{ transform: `translateY(calc(-50% + ${statsY}px))` }}
          aria-hidden="true"
        >
          {[
            { num: "70+",  label: "Years of Service" },
            { num: "50",   label: "States Licensed" },
            { num: "10K+", label: "Projects Completed" },
          ].map((s) => (
            <div className="hero__stat" key={s.label}>
              <span className="hero__stat-num">{s.num}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main text content */}
        <div
          className="hero__content"
          style={!isMobile ? { transform: `translateY(${textY}px)` } : undefined}
        >
          <p className={`hero__eyebrow${loaded ? " visible" : ""}`}>
            Geospatial &amp; Survey Solutions
          </p>

          <h1 className="hero__headline">
            <span className={`hero__headline-line${loaded ? " visible" : ""}`}>
              Precision That
            </span>
            <span className={`hero__headline-line${loaded ? " visible" : ""}`}>
              <em>Moves</em> the Earth.
            </span>
          </h1>

          <div className={`hero__sep${loaded ? " visible" : ""}`} aria-hidden="true">
            <div className={`hero__sep-line${loaded ? " visible" : ""}`} />
            <div className="hero__sep-diamond" />
          </div>

          <p className={`hero__sub${loaded ? " visible" : ""}`}>
            Strategic geospatial data &amp; professional surveying services —
            delivering the ground truth your public projects depend on.
          </p>

          <div className={`hero__cta-row${loaded ? " visible" : ""}`}>
            <a href="#services" className="hero__btn-primary">
              Our Services
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#contact" className="hero__btn-secondary">
              Request a Survey
            </a>
          </div>

          {/* Mobile stats strip — inside content flow */}
          <div
            className={`hero__stats-mobile${loaded ? " visible" : ""}`}
            aria-label="Company statistics"
          >
            {[
              { num: "70+",  label: "Years of Service" },
              { num: "50",   label: "States Licensed" },
              { num: "10K+", label: "Projects Completed" },
            ].map((s) => (
              <div className="hero__stat-mobile" key={s.label}>
                <span className="hero__stat-num">{s.num}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue — desktop only */}
        <div className={`hero__scroll${loaded ? " visible" : ""}`} aria-hidden="true">
          <span className="hero__scroll-label">Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>
    </>
  );
}

