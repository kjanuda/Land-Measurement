"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Services",   href: "#services"   },
  { label: "Projects",   href: "#projects"   },
  { label: "About",      href: "/about"      },
  { label: "Technology", href: "/technology" },
  { label: "Contact",    href: "/contact"    },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [loaded,     setLoaded]     = useState(false);

  // FIX: separate refs — nav bar + mobile overlay are siblings, not nested
  const navRef    = useRef(null);
  const mobileRef = useRef(null);

  /* ── entrance ── */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* ── scroll → scrolled state ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── active section on scroll ── */
  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll("[id]");
      let current = "";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) current = "#" + s.id;
      });
      setActiveLink(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close menu on outside click ── */
  // FIX: checks BOTH refs so tapping inside the overlay doesn't close it
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      const inNav    = navRef.current    && navRef.current.contains(e.target);
      const inMobile = mobileRef.current && mobileRef.current.contains(e.target);
      if (!inNav && !inMobile) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* ── lock body scroll when menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Unified handler: anchor links smooth-scroll, page links just close menu
  const handleLinkClick = (href) => {
    setActiveLink(href);
    setMenuOpen(false);
    if (href.startsWith("#")) {
      // small delay lets the mobile slide-out animation start before scroll
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: linear-gradient(180deg, rgba(4,10,18,.82) 0%, rgba(4,10,18,0) 100%);
          transition: background .45s, backdrop-filter .45s, box-shadow .45s;
          opacity: 0; transform: translateY(-8px);
        }
        .nav.loaded {
          opacity: 1; transform: translateY(0);
          transition: opacity .6s ease .05s, transform .6s ease .05s,
                      background .45s, backdrop-filter .45s, box-shadow .45s;
        }
        .nav.scrolled {
          background: rgba(5,11,20,.92);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          box-shadow: 0 1px 0 rgba(200,168,75,.12), 0 8px 32px rgba(0,0,0,.45);
        }
        .nav__topline {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #b49a4a 0%, #e2c97e 45%, #b49a4a 75%, transparent 100%);
          transform-origin: left; transform: scaleX(0);
          transition: transform .8s cubic-bezier(.16,1,.3,1) .3s;
          pointer-events: none;
        }
        .nav.loaded .nav__topline { transform: scaleX(1); }

        .nav__inner {
          max-width: 1200px; margin: 0 auto; padding: 0 56px; height: 72px;
          display: flex; align-items: center; justify-content: space-between; gap: 32px;
          transition: height .35s;
        }
        .nav.scrolled .nav__inner { height: 62px; }

        .nav__logo {
          display: flex; align-items: baseline; gap: 10px;
          text-decoration: none; flex-shrink: 0;
          opacity: 0; transform: translateX(-12px);
          transition: opacity .55s ease .2s, transform .55s ease .2s;
        }
        .nav.loaded .nav__logo { opacity: 1; transform: translateX(0); }
        .nav__logo-mark {
          font-family: 'Playfair Display', serif;
          font-size: 1.55rem; font-weight: 900;
          color: #c8a84b; letter-spacing: -.03em; line-height: 1; transition: color .2s;
        }
        .nav__logo:hover .nav__logo-mark { color: #e2c97e; }
        .nav__logo-sub {
          font-family: 'DM Sans', sans-serif; font-size: .55rem; font-weight: 400;
          letter-spacing: .28em; text-transform: uppercase; color: rgba(200,185,145,.6);
          padding-bottom: 2px; transition: color .2s;
        }
        .nav__logo:hover .nav__logo-sub { color: rgba(200,185,145,.85); }

        .nav__links { display: flex; align-items: center; gap: 2px; list-style: none; }
        .nav__link  { position: relative; }
        .nav__link a {
          display: block; padding: 8px 16px;
          font-family: 'DM Sans', sans-serif; font-size: .72rem; font-weight: 400;
          letter-spacing: .2em; text-transform: uppercase;
          color: rgba(220,205,165,.9); text-decoration: none;
          text-shadow: 0 1px 4px rgba(0,0,0,.5); white-space: nowrap;
          opacity: 0; transform: translateY(-6px); transition: color .22s;
        }
        .nav.loaded .nav__link a { opacity: 1; transform: translateY(0); }
        .nav.loaded .nav__link:nth-child(1) a { transition: opacity .5s ease .35s, transform .5s ease .35s, color .22s; }
        .nav.loaded .nav__link:nth-child(2) a { transition: opacity .5s ease .42s, transform .5s ease .42s, color .22s; }
        .nav.loaded .nav__link:nth-child(3) a { transition: opacity .5s ease .49s, transform .5s ease .49s, color .22s; }
        .nav.loaded .nav__link:nth-child(4) a { transition: opacity .5s ease .56s, transform .5s ease .56s, color .22s; }
        .nav.loaded .nav__link:nth-child(5) a { transition: opacity .5s ease .63s, transform .5s ease .63s, color .22s; }
        .nav__link a:hover, .nav__link a.active { color: #c8a84b; }
        .nav__link a::after {
          content: ''; position: absolute; left: 16px; right: 16px;
          bottom: 0; height: 1px; background: #c8a84b;
          transform: scaleX(0); transform-origin: left;
          transition: transform .3s cubic-bezier(.16,1,.3,1);
        }
        .nav__link a:hover::after, .nav__link a.active::after { transform: scaleX(1); }

        .nav__cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 24px; background: transparent;
          border: 1px solid rgba(200,168,75,.55);
          font-family: 'DM Sans', sans-serif; font-size: .68rem; font-weight: 500;
          letter-spacing: .2em; text-transform: uppercase; color: #c8a84b;
          text-decoration: none; text-shadow: 0 1px 4px rgba(0,0,0,.4);
          clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px));
          white-space: nowrap; flex-shrink: 0;
          opacity: 0; transform: translateX(12px);
          transition: opacity .55s ease .7s, transform .55s ease .7s,
                      background .22s, border-color .22s, box-shadow .22s;
        }
        .nav.loaded .nav__cta { opacity: 1; transform: translateX(0); }
        .nav__cta:hover { background: rgba(200,168,75,.12); border-color: #c8a84b; box-shadow: 0 0 20px rgba(200,168,75,.2); }
        .nav__cta:active { transform: scale(.97); }

        .nav__burger {
          display: none; flex-direction: column; justify-content: center;
          gap: 5px; width: 36px; height: 36px;
          background: none; border: none; cursor: pointer;
          padding: 4px; flex-shrink: 0; -webkit-tap-highlight-color: transparent;
        }
        .nav__burger-bar {
          display: block; width: 100%; height: 1.5px; background: #c8a84b;
          transform-origin: center; transition: transform .3s, opacity .3s, width .3s;
        }
        .nav__burger-bar:nth-child(2) { width: 70%; }
        .nav__burger.open .nav__burger-bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .nav__burger.open .nav__burger-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav__burger.open .nav__burger-bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* FIX: z-index 1001 — above nav (1000) so burger click registers */
        .nav__mobile {
          position: fixed; inset: 0; z-index: 1001;
          background: rgba(4,10,18,.98);
          display: flex; flex-direction: column;
          padding: 88px 24px 48px;
          opacity: 0; pointer-events: none; transform: translateX(100%);
          transition: opacity .35s, transform .4s cubic-bezier(.16,1,.3,1);
          overflow-y: auto; -webkit-overflow-scrolling: touch;
        }
        .nav__mobile.open { opacity: 1; pointer-events: all; transform: translateX(0); }

        .nav__mobile-links { list-style: none; display: flex; flex-direction: column; position: relative; z-index: 1; }

        /* FIX: single class for both <button> and <a> so they look identical */
        .nav__mobile-item {
          display: flex; align-items: baseline; gap: 16px;
          width: 100%; padding: 18px 0;
          border: none; border-bottom: 1px solid rgba(200,168,75,.1);
          background: transparent; text-align: left;
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 6vw, 2.4rem); font-weight: 700;
          color: rgba(240,230,200,.75); letter-spacing: -.01em;
          text-decoration: none; cursor: pointer;
          opacity: 0; transform: translateX(20px);
          transition: color .25s, padding-left .25s, opacity .4s, transform .4s;
          -webkit-tap-highlight-color: transparent; position: relative;
        }
        .nav__mobile.open .nav__mobile-item { opacity: 1; transform: translateX(0); }
        .nav__mobile-link:nth-child(1) .nav__mobile-item { transition-delay: .07s; }
        .nav__mobile-link:nth-child(2) .nav__mobile-item { transition-delay: .12s; }
        .nav__mobile-link:nth-child(3) .nav__mobile-item { transition-delay: .17s; }
        .nav__mobile-link:nth-child(4) .nav__mobile-item { transition-delay: .22s; }
        .nav__mobile-link:nth-child(5) .nav__mobile-item { transition-delay: .27s; }
        .nav__mobile-item:hover { color: #c8a84b; padding-left: 12px; }
        .nav__mobile-item.active {
          color: #c8a84b; padding-left: 9px;
          border-bottom-color: rgba(200,168,75,.3);
          border-left: 3px solid #c8a84b;
        }

        .nav__mobile-num {
          font-family: 'DM Sans', sans-serif; font-size: .6rem; letter-spacing: .22em;
          color: rgba(200,168,75,.4); font-weight: 400; padding-bottom: 4px; pointer-events: none;
        }

        .nav__mobile-cta {
          margin-top: 40px; position: relative; z-index: 1;
          opacity: 0; transform: translateY(10px);
          transition: opacity .4s ease .35s, transform .4s ease .35s;
        }
        .nav__mobile.open .nav__mobile-cta { opacity: 1; transform: translateY(0); }
        .nav__mobile-cta a {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; background: #c8a84b; color: #0b1620;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: .75rem;
          letter-spacing: .18em; text-transform: uppercase; text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          transition: background .25s, transform .15s; -webkit-tap-highlight-color: transparent;
        }
        .nav__mobile-cta a:hover { background: #e2c97e; }
        .nav__mobile-cta a:active { transform: scale(.98); }

        .nav__mobile-meta {
          margin-top: auto; padding-top: 40px; position: relative; z-index: 1;
          opacity: 0; transition: opacity .4s ease .42s;
        }
        .nav__mobile.open .nav__mobile-meta { opacity: 1; }
        .nav__mobile-meta p {
          font-family: 'DM Sans', sans-serif; font-size: .6rem; letter-spacing: .22em;
          text-transform: uppercase; color: rgba(200,168,75,.35); line-height: 1.8;
        }

        @media (max-width: 1024px) { .nav__inner { padding: 0 40px; } }
        @media (max-width: 860px)  { .nav__links, .nav__cta { display: none; } .nav__burger { display: flex; } }
        @media (max-width: 600px) {
          .nav__inner { padding: 0 16px; height: 56px; }
          .nav.scrolled .nav__inner { height: 56px; }
          .nav__logo-mark { font-size: 1.2rem; }
          .nav__logo-sub  { font-size: .45rem; }
          .nav__burger    { gap: 4px; width: 32px; height: 32px; }
          .nav__burger-bar { height: 1px; }
          .nav__mobile    { padding: 72px 16px 32px; }
          .nav__mobile-item { padding: 16px 0; font-size: clamp(1.3rem, 5vw, 2rem); gap: 12px; min-height: 48px; align-items: center; }
          .nav__mobile-item.active { border-left-width: 2px; }
          .nav__mobile-num { min-width: 20px; }
          .nav__mobile-cta { margin-top: 32px; }
          .nav__mobile-cta a { width: 100%; padding: 13px 20px; font-size: .7rem; justify-content: center; }
          .nav__mobile-meta p { font-size: .55rem; }
        }
        @media (max-width: 380px) {
          .nav__mobile { padding: 64px 12px 24px; }
          .nav__mobile-item { font-size: 1.1rem; padding: 14px 0; }
          .nav__mobile-cta a { padding: 12px 16px; font-size: .65rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nav, .nav__logo, .nav__link a, .nav__cta, .nav__mobile,
          .nav__mobile-item, .nav__mobile-cta, .nav__mobile-meta, .nav__topline {
            transition: none !important; animation: none !important;
            opacity: 1 !important; transform: none !important;
          }
          .nav__topline { transform: scaleX(1); }
        }
      `}</style>

      {/* ── NAV BAR ── */}
      <nav
        ref={navRef}
        className={`nav${loaded ? " loaded" : ""}${scrolled ? " scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav__topline" aria-hidden="true" />
        <div className="nav__inner">

          <Link href="/" className="nav__logo" aria-label="GeoLogicX — Home">
            <span className="nav__logo-mark">GeoLogicX</span>
            <span className="nav__logo-sub">Geospatial</span>
          </Link>

          <ul className="nav__links" role="list">
            {NAV_LINKS.map((link) => (
              <li className="nav__link" key={link.href}>
                <Link
                  href={link.href}
                  className={activeLink === link.href ? "active" : ""}
                  onClick={(e) => {
                    if (link.href.startsWith("#")) e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Link href="/contact" className="nav__cta">
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

      {/* ── MOBILE OVERLAY — sibling to <nav>, NOT nested inside it ── */}
      <div
        id="mobile-menu"
        ref={mobileRef}
        className={`nav__mobile${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <ul className="nav__mobile-links" role="list">
          {NAV_LINKS.map((link, i) => (
            <li className="nav__mobile-link" key={link.href}>
              {link.href.startsWith("#") ? (
                // Anchor → <button> (no routing, just scroll)
                <button
                  className={`nav__mobile-item${activeLink === link.href ? " active" : ""}`}
                  onClick={() => handleLinkClick(link.href)}
                >
                  <span className="nav__mobile-num" aria-hidden="true">0{i + 1}</span>
                  {link.label}
                </button>
              ) : (
                // Page → Next.js <Link>
                <Link
                  href={link.href}
                  className={`nav__mobile-item${activeLink === link.href ? " active" : ""}`}
                  onClick={() => handleLinkClick(link.href)}
                >
                  <span className="nav__mobile-num" aria-hidden="true">0{i + 1}</span>
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="nav__mobile-cta">
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
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