"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function TetraTechBanner() {
  const sectionRef = useRef(null);
  const imgRef     = useRef(null);
  const [offset, setOffset]   = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef(null);

  /* ── Parallax on scroll ── */
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!sectionRef.current) return;
        const rect   = sectionRef.current.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        setOffset(center * 0.18);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Entrance animation on first view ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:wght@600;700&display=swap');

        .tt-banner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 72px 80px;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          background: #ffffff;
        }

        /* ── LEFT CONTENT ── */
        .tt-content {
          position: relative; z-index: 1;
          flex: 0 0 auto;
          max-width: 440px;
        }

        .tt-eyebrow {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #1a6bb5;
          margin-bottom: 16px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 0.55s ease 0.05s, transform 0.55s ease 0.05s;
        }

        .tt-heading {
          font-family: 'Source Serif 4', serif;
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 700;
          line-height: 1.18;
          color: #0f2d6e;
          margin: 0 0 20px;
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.6s ease 0.12s, transform 0.6s ease 0.12s;
        }

        .tt-body {
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.7;
          color: #3d4f6b;
          margin: 0 0 36px;
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.6s ease 0.22s, transform 0.6s ease 0.22s;
        }

        .tt-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          background: #1557a0;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 500;
          border: none;
          border-radius: 6px;
          text-decoration: none;
          cursor: pointer;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 18px rgba(21, 87, 160, 0.28);
          opacity: 0; transform: translateY(14px);
          transition:
            opacity 0.55s ease 0.34s,
            transform 0.55s ease 0.34s,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }
        .tt-btn:hover {
          background: #0e4080;
          box-shadow: 0 6px 24px rgba(21,87,160,0.38);
        }
        .tt-btn:active { transform: scale(0.97); }

        .tt-btn svg {
          transition: transform 0.2s ease;
        }
        .tt-btn:hover svg { transform: translateX(3px); }

        /* ── VISIBLE STATE ── */
        .tt-banner.visible .tt-eyebrow,
        .tt-banner.visible .tt-heading,
        .tt-banner.visible .tt-body,
        .tt-banner.visible .tt-btn { opacity: 1; transform: translateY(0); }

        /* ── RIGHT IMAGE ── */
        .tt-image-wrap {
          position: relative; z-index: 1;
          flex: 0 0 auto;
          width: min(48%, 540px);
          overflow: hidden;
          border-radius: 4px;
          background: #ffffff;
          opacity: 0; transform: translateX(28px) scale(0.98);
          transition: opacity 0.75s ease 0.18s, transform 0.75s ease 0.18s;
        }
        .tt-banner.visible .tt-image-wrap {
          opacity: 1; transform: translateX(0) scale(1);
        }

        .tt-image-inner {
          height: calc(100% + 60px);
          width: 100%;
          will-change: transform;
          background: #ffffff;
        }

        .tt-image-inner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          display: block;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .tt-banner {
            flex-direction: column;
            padding: 56px 40px;
            text-align: center;
            align-items: center;
            background: #ffffff;
          }
          .tt-content { max-width: 100%; }
          .tt-image-wrap { width: min(100%, 420px); background: #ffffff; }
          .tt-btn { margin: 0 auto; }
        }

        @media (max-width: 560px) {
          .tt-banner { padding: 48px 24px; background: #ffffff; }
          .tt-heading { font-size: 1.85rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .tt-eyebrow, .tt-heading, .tt-body, .tt-btn, .tt-image-wrap {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .tt-image-inner { transform: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className={`tt-banner${visible ? " visible" : ""}`}
        aria-label="Stay connected with Tetra Tech"
      >
        {/* ── Left: Text ── */}
        <div className="tt-content">
          <span className="tt-eyebrow">Newsletter</span>

          <h2 className="tt-heading">
            Stay connected with<br />Tetra Tech
          </h2>

          <p className="tt-body">
            Read the latest issue of our Tetra Tech™ newsletter and get future
            editions straight to your inbox.
          </p>

          <a href="#signup" className="tt-btn">
            Sign up
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* ── Right: Parallax Image ── */}
        <div className="tt-image-wrap">
          <div
            ref={imgRef}
            className="tt-image-inner"
            style={{ transform: `translateY(${offset}px)` }}
          >
            <Image
              src="/Tetraverse_BannerGraphic.jpg"
              alt="TetraVerse illustrated cityscape with mountains and water"
              width={600}
              height={440}
              priority
              quality={90}
            />
          </div>
        </div>
      </section>
    </>
  );
}