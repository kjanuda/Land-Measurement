"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Services",   href: "#services"   },
  { label: "Projects",   href: "#projects"   },
  { label: "About",      href: "#about"      },
  { label: "Technology", href: "#technology" },
  { label: "Contact",    href: "contact"    },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeLink,  setActiveLink]  = useState("");
  const [loaded,      setLoaded]      = useState(false);
  const menuRef = useRef(null);

  /* ── entrance ── */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* ── scroll state ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close menu on outside click ── */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* ── lock body scroll when menu is open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        /* ─── WRAPPER ─── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 1000;
          /* FIX: always show a dark gradient so text is legible over hero images */
          background: linear-gradient(180deg,
            rgba(4, 10, 18, 0.82) 0%,
            rgba(4, 10, 18, 0.0) 100%
          );
          transition: background 0.45s ease, backdrop-filter 0.45s ease,
                      box-shadow 0.45s ease, padding 0.35s ease;
          padding: 0;
          /* entrance */
          opacity: 0; transform: translateY(-8px);
        }
        .nav.loaded {
          opacity: 1; transform: translateY(0);
          transition: opacity 0.6s ease 0.05s, transform 0.6s ease 0.05s,
                      background 0.45s ease, backdrop-filter 0.45s ease,
                      box-shadow 0.45s ease, padding 0.35s ease;
        }
        .nav.scrolled {
          background: rgba(5, 11, 20, 0.88);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          box-shadow: 0 1px 0 rgba(200, 168, 75, 0.12),
                      0 8px 32px rgba(0, 0, 0, 0.45);
        }

        /* Gold top line */
        .nav__topline {
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg,
            #b49a4a 0%, #e2c97e 45%, #b49a4a 75%, transparent 100%
          );
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s;
          pointer-events: none;
        }
        .nav.loaded .nav__topline { transform: scaleX(1); }

        /* ─── INNER ─── */
        .nav__inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 56px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          transition: height 0.35s ease;
        }
        .nav.scrolled .nav__inner { height: 62px; }

        /* ─── LOGO ─── */
        .nav__logo {
          display: flex; align-items: baseline; gap: 10px;
          text-decoration: none; flex-shrink: 0;
          opacity: 0; transform: translateX(-12px);
          transition: opacity 0.55s ease 0.2s, transform 0.55s ease 0.2s;
        }
        .nav.loaded .nav__logo { opacity: 1; transform: translateX(0); }

        .nav__logo-mark {
          font-family: 'Playfair Display', serif;
          font-size: 1.55rem; font-weight: 900;
          color: #c8a84b; letter-spacing: -0.03em;
          line-height: 1;
          transition: color 0.2s ease;
        }
        .nav__logo:hover .nav__logo-mark { color: #e2c97e; }

        .nav__logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.55rem; font-weight: 400;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(200, 185, 145, 0.6);
          padding-bottom: 2px;
          transition: color 0.2s ease;
        }
        .nav__logo:hover .nav__logo-sub { color: rgba(200,185,145,0.85); }

        /* ─── DESKTOP LINKS ─── */
        .nav__links {
          display: flex; align-items: center; gap: 2px;
          list-style: none;
        }

        .nav__link {
          position: relative;
        }

        .nav__link a {
          display: block;
          padding: 8px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem; font-weight: 400;
          letter-spacing: 0.2em; text-transform: uppercase;
          /* FIX: increased opacity from 0.65 to 0.9 for better readability */
          color: rgba(220, 205, 165, 0.9);
          text-decoration: none;
          transition: color 0.22s ease;
          white-space: nowrap;
          opacity: 0; transform: translateY(-6px);
          /* FIX: subtle text shadow for contrast over bright backgrounds */
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        .nav.loaded .nav__link a {
          opacity: 1; transform: translateY(0);
        }
        /* stagger each link */
        .nav.loaded .nav__link:nth-child(1) a { transition: opacity .5s ease .35s, transform .5s ease .35s, color .22s ease; }
        .nav.loaded .nav__link:nth-child(2) a { transition: opacity .5s ease .42s, transform .5s ease .42s, color .22s ease; }
        .nav.loaded .nav__link:nth-child(3) a { transition: opacity .5s ease .49s, transform .5s ease .49s, color .22s ease; }
        .nav.loaded .nav__link:nth-child(4) a { transition: opacity .5s ease .56s, transform .5s ease .56s, color .22s ease; }
        .nav.loaded .nav__link:nth-child(5) a { transition: opacity .5s ease .63s, transform .5s ease .63s, color .22s ease; }

        .nav__link a:hover,
        .nav__link a.active { color: #c8a84b; }

        /* underline indicator */
        .nav__link a::after {
          content: '';
          position: absolute; left: 16px; right: 16px;
          bottom: 0; height: 1px;
          background: #c8a84b;
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .nav__link a:hover::after,
        .nav__link a.active::after { transform: scaleX(1); }

        /* ─── CTA BUTTON ─── */
        .nav__cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 24px;
          background: transparent;
          border: 1px solid rgba(200, 168, 75, 0.55);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #c8a84b;
          text-decoration: none; cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px));
          transition: background 0.22s ease, color 0.22s ease, border-color 0.22s ease,
                      box-shadow 0.22s ease, transform 0.15s ease;
          white-space: nowrap; flex-shrink: 0;
          opacity: 0; transform: translateX(12px);
          /* FIX: text shadow for readability */
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        .nav.loaded .nav__cta {
          opacity: 1; transform: translateX(0);
          transition: opacity 0.55s ease 0.7s, transform 0.55s ease 0.7s,
                      background 0.22s ease, color 0.22s ease,
                      border-color 0.22s ease, box-shadow 0.22s ease;
        }
        .nav__cta:hover {
          background: rgba(200,168,75,0.12);
          border-color: #c8a84b;
          box-shadow: 0 0 20px rgba(200,168,75,0.2);
        }
        .nav__cta:active { transform: scale(0.97); }

        /* ─── HAMBURGER ─── */
        .nav__burger {
          display: none;
          flex-direction: column; justify-content: center;
          gap: 5px; width: 36px; height: 36px;
          background: none; border: none; cursor: pointer;
          padding: 4px; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .nav__burger-bar {
          display: block; width: 100%; height: 1.5px;
          background: #c8a84b;
          transform-origin: center;
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
        }
        .nav__burger.open .nav__burger-bar:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        .nav__burger.open .nav__burger-bar:nth-child(2) {
          opacity: 0; transform: scaleX(0);
        }
        .nav__burger.open .nav__burger-bar:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }
        /* short middle bar at rest */
        .nav__burger-bar:nth-child(2) { width: 70%; }
        .nav__burger.open .nav__burger-bar:nth-child(2) { width: 100%; }

        /* ─── MOBILE MENU ─── */
        .nav__mobile {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(4, 10, 18, 0.97);
          display: flex; flex-direction: column;
          padding: 100px 32px 48px;
          opacity: 0; pointer-events: none;
          transform: translateX(100%);
          transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1);
          overflow-y: auto;
        }
        .nav__mobile.open {
          opacity: 1; pointer-events: all;
          transform: translateX(0);
        }

        /* grain on mobile menu */
        .nav__mobile::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.25; pointer-events: none; z-index: 0;
        }

        .nav__mobile-links {
          list-style: none;
          display: flex; flex-direction: column; gap: 2px;
          position: relative; z-index: 1;
        }

        .nav__mobile-link a {
          display: flex; align-items: baseline; gap: 16px;
          padding: 18px 0;
          border-bottom: 1px solid rgba(200,168,75,0.1);
          text-decoration: none;
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 6vw, 2.4rem);
          font-weight: 700; color: rgba(240,230,200,0.75);
          letter-spacing: -0.01em;
          transition: color 0.2s ease, padding-left 0.2s ease;
          opacity: 0; transform: translateX(20px);
        }
        .nav__mobile.open .nav__mobile-link a {
          opacity: 1; transform: translateX(0);
        }
        .nav__mobile-link:nth-child(1) a { transition-delay: 0.07s; }
        .nav__mobile-link:nth-child(2) a { transition-delay: 0.12s; }
        .nav__mobile-link:nth-child(3) a { transition-delay: 0.17s; }
        .nav__mobile-link:nth-child(4) a { transition-delay: 0.22s; }
        .nav__mobile-link:nth-child(5) a { transition-delay: 0.27s; }

        .nav__mobile-link a:hover { color: #c8a84b; padding-left: 8px; }

        .nav__mobile-link-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem; letter-spacing: 0.22em;
          color: rgba(200,168,75,0.4); font-weight: 400;
          font-style: normal; padding-bottom: 4px;
        }

        .nav__mobile-cta {
          margin-top: 40px;
          position: relative; z-index: 1;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.4s ease 0.35s, transform 0.4s ease 0.35s;
        }
        .nav__mobile.open .nav__mobile-cta {
          opacity: 1; transform: translateY(0);
        }

        .nav__mobile-cta a {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 16px 32px;
          background: #c8a84b; color: #0b1620;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500; font-size: 0.8rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px));
          transition: background 0.22s ease;
        }
        .nav__mobile-cta a:hover { background: #e2c97e; }

        .nav__mobile-meta {
          margin-top: auto; padding-top: 40px;
          position: relative; z-index: 1;
          opacity: 0; transition: opacity 0.4s ease 0.42s;
        }
        .nav__mobile.open .nav__mobile-meta { opacity: 1; }

        .nav__mobile-meta p {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(200,168,75,0.35);
          line-height: 1.8;
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .nav__inner { padding: 0 40px; }
        }

        @media (max-width: 860px) {
          .nav__links, .nav__cta { display: none; }
          .nav__burger { display: flex; }
        }

        @media (max-width: 600px) {
          .nav__inner { padding: 0 20px; }
        }

        /* ─── reduced motion ─── */
        @media (prefers-reduced-motion: reduce) {
          .nav, .nav__logo, .nav__link a, .nav__cta,
          .nav__mobile, .nav__mobile-link a, .nav__mobile-cta,
          .nav__mobile-meta, .nav__topline {
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .nav__topline { transform: scaleX(1); }
        }
      `}</style>

      <nav
        className={`nav${loaded ? " loaded" : ""}${scrolled ? " scrolled" : ""}`}
        ref={menuRef}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav__topline" aria-hidden="true" />

        <div className="nav__inner">
          {/* Logo */}
          <Link href="/" className="nav__logo" aria-label="Tetra Tech — Home">
            <span className="nav__logo-mark">GeoLogicX</span>
            <span className="nav__logo-sub">Geospatial</span>
          </Link>

          {/* Desktop links */}
          <ul className="nav__links" role="list">
            {NAV_LINKS.map((link) => (
              <li className="nav__link" key={link.href}>
                <Link
                  href={link.href}
                  className={activeLink === link.href ? "active" : ""}
                  onClick={() => setActiveLink(link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Burger */}
          <Link href="contact" className="nav__cta">
            Request Survey
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1.5 6h9M7 2.5l3.5 3.5L7 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>

          <button
            className={`nav__burger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="nav__burger-bar" aria-hidden="true" />
            <span className="nav__burger-bar" aria-hidden="true" />
            <span className="nav__burger-bar" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        id="mobile-menu"
        className={`nav__mobile${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <ul className="nav__mobile-links" role="list">
          {NAV_LINKS.map((link, i) => (
            <li className="nav__mobile-link" key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav__mobile-link-num">0{i + 1}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav__mobile-cta">
          <Link href="contact" onClick={() => setMenuOpen(false)}>
            Request a Survey
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="nav__mobile-meta" aria-hidden="true">
          <p>N 38°54′17″ · W 77°02′06″</p>
          <p>Licensed · Insured · Est. 1954</p>
        </div>
      </div>
    </>
  );
}