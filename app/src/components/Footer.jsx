"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SERVICES = [
  "Boundary Surveys",
  "Topographic Surveys",
  "ALTA/NSPS Surveys",
  "Construction Staking",
  "Aerial LiDAR",
  "GIS Mapping",
];

const COMPANY = [
  { label: "About Us",    href: "#about"      },
  { label: "Our Team",    href: "#team"        },
  { label: "Projects",    href: "#projects"    },
  { label: "Technology",  href: "#technology"  },
  { label: "Careers",     href: "#careers"     },
];

const LEGAL = [
  { label: "Privacy Policy",    href: "#privacy"    },
  { label: "Terms of Service",  href: "#terms"      },
  { label: "Licensing",         href: "#licensing"  },
];

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const [email,   setEmail]   = useState("");
  const [subbed,  setSubbed]  = useState(false);
  const footerRef = useRef(null);

  /* ── Intersection Observer entrance ── */
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSub = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubbed(true);
    setEmail("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Cormorant+Garamond:ital,wght@1,300&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        /* ─── FOOTER SHELL ─── */
        .footer {
          position: relative;
          background: #040a12;
          overflow: hidden;
          color: #f5f0e8;
        }

        /* Grain overlay */
        .footer::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.22; pointer-events: none; z-index: 0;
        }

        /* Subtle radial glow bottom-left */
        .footer::after {
          content: '';
          position: absolute;
          bottom: -120px; left: -80px;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,168,75,0.055) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        /* Gold top accent */
        .footer__topline {
          height: 2px;
          background: linear-gradient(90deg,
            transparent 0%, #b49a4a 25%, #e2c97e 55%, #b49a4a 80%, transparent 100%
          );
        }

        /* ─── CTA BAND ─── */
        .footer__cta-band {
          position: relative; z-index: 1;
          border-bottom: 1px solid rgba(200,168,75,0.1);
          padding: 72px 0;
        }
        .footer__cta-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 56px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 40px; flex-wrap: wrap;
        }

        .footer__cta-text {
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s;
        }
        .footer.visible .footer__cta-text { opacity: 1; transform: translateY(0); }

        .footer__cta-eyebrow {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem; font-weight: 500;
          letter-spacing: 0.38em; text-transform: uppercase;
          color: #c8a84b; margin-bottom: 14px;
        }
        .footer__cta-eyebrow::before {
          content: '';
          display: block; width: 24px; height: 1px;
          background: #c8a84b; flex-shrink: 0;
        }

        .footer__cta-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.8rem);
          font-weight: 900; color: #f5f0e8;
          letter-spacing: -0.02em; line-height: 1.1;
        }
        .footer__cta-headline em {
          font-style: italic; color: #c8a84b; font-weight: 700;
        }

        .footer__cta-sub {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; font-style: italic; font-weight: 300;
          color: rgba(220,210,185,0.65); margin-top: 10px;
          letter-spacing: 0.03em;
        }

        .footer__cta-actions {
          display: flex; gap: 16px; flex-wrap: wrap; align-items: center;
          flex-shrink: 0;
          opacity: 0; transform: translateX(20px);
          transition: opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s;
        }
        .footer.visible .footer__cta-actions { opacity: 1; transform: translateX(0); }

        /* Primary button */
        .footer__btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 15px 32px;
          background: #c8a84b; color: #0b1620;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500; font-size: 0.78rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 9px 100%, 0 calc(100% - 9px));
          transition: background 0.22s ease, box-shadow 0.22s ease, transform 0.15s ease;
          box-shadow: 0 4px 24px rgba(200,168,75,0.28);
          white-space: nowrap;
        }
        .footer__btn-primary:hover { background: #e2c97e; box-shadow: 0 6px 32px rgba(200,168,75,0.45); }
        .footer__btn-primary:active { transform: scale(0.97); }

        /* Secondary button */
        .footer__btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          background: transparent;
          border: 1px solid rgba(200,168,75,0.35);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 400;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(200,185,145,0.7); text-decoration: none;
          clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 7px 100%, 0 calc(100% - 7px));
          transition: color 0.22s ease, border-color 0.22s ease, background 0.22s ease;
          white-space: nowrap;
        }
        .footer__btn-secondary:hover {
          color: #c8a84b; border-color: #c8a84b;
          background: rgba(200,168,75,0.05);
        }

        /* ─── MAIN GRID ─── */
        .footer__main {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto; padding: 0 56px;
        }

        .footer__grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1.3fr;
          gap: 56px 48px;
          padding: 64px 0 56px;
          border-bottom: 1px solid rgba(200,168,75,0.1);
        }

        /* ─── BRAND COL ─── */
        .footer__brand {
          opacity: 0; transform: translateY(18px);
          transition: opacity 0.75s ease 0.15s, transform 0.75s ease 0.15s;
        }
        .footer.visible .footer__brand { opacity: 1; transform: translateY(0); }

        .footer__logo {
          display: flex; align-items: baseline; gap: 10px;
          text-decoration: none; margin-bottom: 18px;
        }
        .footer__logo-mark {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem; font-weight: 900;
          color: #c8a84b; letter-spacing: -0.03em; line-height: 1;
        }
        .footer__logo-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.55rem; font-weight: 400;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(200,185,145,0.45); padding-bottom: 2px;
        }

        .footer__brand-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 300;
          color: rgba(200,185,145,0.5); line-height: 1.75;
          max-width: 280px; margin-bottom: 28px;
        }

        /* Certifications / badges */
        .footer__badges {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .footer__badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          border: 1px solid rgba(200,168,75,0.2);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem; font-weight: 400;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(200,168,75,0.55);
        }
        .footer__badge::before {
          content: '';
          width: 4px; height: 4px;
          border: 1px solid #c8a84b;
          transform: rotate(45deg); flex-shrink: 0;
          opacity: 0.7;
        }

        /* ─── LINK COL ─── */
        .footer__col {
          opacity: 0; transform: translateY(18px);
        }
        .footer.visible .footer__col:nth-child(2) { opacity: 1; transform: translateY(0); transition: opacity .75s ease .25s, transform .75s ease .25s; }
        .footer.visible .footer__col:nth-child(3) { opacity: 1; transform: translateY(0); transition: opacity .75s ease .35s, transform .75s ease .35s; }
        .footer.visible .footer__col:nth-child(4) { opacity: 1; transform: translateY(0); transition: opacity .75s ease .45s, transform .75s ease .45s; }

        .footer__col-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem; font-weight: 500;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: rgba(200,168,75,0.65); margin-bottom: 22px;
          display: flex; align-items: center; gap: 10px;
        }
        .footer__col-title::after {
          content: '';
          flex: 1; height: 1px;
          background: rgba(200,168,75,0.15);
        }

        .footer__col-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }

        .footer__col-list a,
        .footer__col-list span {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem; font-weight: 300;
          color: rgba(200,185,145,0.5);
          text-decoration: none;
          transition: color 0.2s ease, padding-left 0.2s ease;
          display: block;
          letter-spacing: 0.03em;
        }
        .footer__col-list a:hover {
          color: #c8a84b; padding-left: 6px;
        }

        /* ─── NEWSLETTER ─── */
        .footer__newsletter-note {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 300;
          color: rgba(200,185,145,0.45);
          line-height: 1.6; margin-bottom: 20px;
        }

        .footer__newsletter-form {
          display: flex; flex-direction: column; gap: 10px;
        }

        .footer__input-wrap {
          position: relative;
          display: flex;
        }
        .footer__input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(200,168,75,0.04);
          border: 1px solid rgba(200,168,75,0.2);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem; font-weight: 300;
          color: #f5f0e8;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
        }
        .footer__input::placeholder { color: rgba(200,185,145,0.3); }
        .footer__input:focus {
          border-color: rgba(200,168,75,0.45);
          background: rgba(200,168,75,0.07);
        }

        .footer__sub-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 20px;
          background: rgba(200,168,75,0.12);
          border: 1px solid rgba(200,168,75,0.3);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #c8a84b; cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
          transition: background 0.22s ease, border-color 0.22s ease;
          white-space: nowrap;
        }
        .footer__sub-btn:hover {
          background: rgba(200,168,75,0.22); border-color: #c8a84b;
        }

        .footer__sub-success {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.9rem; font-style: italic; font-weight: 300;
          color: #c8a84b; letter-spacing: 0.05em;
          padding: 10px 0;
        }

        /* ─── CONTACT STRIP ─── */
        .footer__contact-strip {
          display: flex; align-items: center; gap: 32px;
          flex-wrap: wrap; margin-top: 20px;
        }
        .footer__contact-item {
          display: flex; align-items: center; gap: 8px;
        }
        .footer__contact-icon {
          width: 28px; height: 28px;
          border: 1px solid rgba(200,168,75,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .footer__contact-icon svg { color: rgba(200,168,75,0.6); }
        .footer__contact-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem; font-weight: 300;
          color: rgba(200,185,145,0.5); letter-spacing: 0.04em;
        }
        a.footer__contact-label:hover { color: #c8a84b; }
        a.footer__contact-label { text-decoration: none; transition: color 0.2s ease; }

        /* ─── BOTTOM BAR ─── */
        .footer__bottom {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto; padding: 0 56px;
        }
        .footer__bottom-inner {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          padding: 28px 0;
          opacity: 0; transform: translateY(10px);
          transition: opacity 0.7s ease 0.6s, transform 0.7s ease 0.6s;
        }
        .footer.visible .footer__bottom-inner { opacity: 1; transform: translateY(0); }

        .footer__copy {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem; font-weight: 300;
          letter-spacing: 0.1em; color: rgba(200,185,145,0.3);
        }
        .footer__copy span { color: rgba(200,168,75,0.4); }

        .footer__legal {
          display: flex; gap: 24px; list-style: none;
        }
        .footer__legal a {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem; font-weight: 300;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(200,185,145,0.28); text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer__legal a:hover { color: rgba(200,168,75,0.6); }

        .footer__coord-bottom {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem; font-weight: 300;
          letter-spacing: 0.22em; color: rgba(200,168,75,0.22);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .footer__cta-inner { padding: 0 40px; }
          .footer__main, .footer__bottom { padding: 0 40px; }
          .footer__grid { grid-template-columns: 1fr 1fr; gap: 40px 40px; }
        }

        @media (max-width: 768px) {
          .footer__cta-inner { padding: 0 24px; flex-direction: column; align-items: flex-start; }
          .footer__cta-band { padding: 52px 0; }
          .footer__main, .footer__bottom { padding: 0 24px; }
          .footer__grid { grid-template-columns: 1fr 1fr; gap: 36px 28px; padding: 48px 0 40px; }
          .footer__brand { grid-column: 1 / -1; }
          .footer__bottom-inner { flex-direction: column; align-items: flex-start; gap: 12px; }
          .footer__coord-bottom { display: none; }
        }

        @media (max-width: 480px) {
          .footer__grid { grid-template-columns: 1fr; }
          .footer__cta-actions { flex-direction: column; align-items: flex-start; width: 100%; }
          .footer__btn-primary, .footer__btn-secondary {
            width: 100%; justify-content: center; clip-path: none;
          }
          .footer__legal { gap: 16px; flex-wrap: wrap; }
        }

        @media (prefers-reduced-motion: reduce) {
          .footer__cta-text, .footer__cta-actions,
          .footer__brand, .footer__col,
          .footer__bottom-inner {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <footer
        ref={footerRef}
        className={`footer${visible ? " visible" : ""}`}
        role="contentinfo"
      >
        <div className="footer__topline" aria-hidden="true" />

        {/* ── CTA Band ── */}
        <div className="footer__cta-band">
          <div className="footer__cta-inner">
            <div className="footer__cta-text">
              <p className="footer__cta-eyebrow">Ready to Begin?</p>
              <h2 className="footer__cta-headline">
                Start Your <em>Next</em> Project
              </h2>
              <p className="footer__cta-sub">
                Talk to a licensed surveyor — no obligation, no delay.
              </p>
            </div>
            <div className="footer__cta-actions">
              <Link href="#contact" className="footer__btn-primary">
                Request a Survey
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="#projects" className="footer__btn-secondary">
                View Projects
              </Link>
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="footer__main">
          <div className="footer__grid">

            {/* Brand */}
            <div className="footer__brand">
              <Link href="/" className="footer__logo" aria-label="Januda J Kodithuwakku — Home">
                <span className="footer__logo-mark">GeoLogicX</span>
                <span className="footer__logo-sub"></span>
              </Link>
              <p className="footer__brand-desc">
                Local geospatial consulting, survey design and project strategy
                for clients across Hambantota and the Asia-Pacific region.
              </p>
              <div className="footer__badges">
                {["Licensed", "NSPS Member", "ISO 9001", "50 States"].map((b) => (
                  <span className="footer__badge" key={b}>{b}</span>
                ))}
              </div>
              {/* Contact strip */}
              <div className="footer__contact-strip" style={{ marginTop: 24 }}>
                <div className="footer__contact-item">
                  <div className="footer__contact-icon">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 1 1 7 3a1.5 1.5 0 0 1 0 3z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="footer__contact-label">Hambantota, Sri Lanka</span>
                </div>
                <div className="footer__contact-item">
                  <div className="footer__contact-icon">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 2h3l1.5 3.5-1.5 1a8 8 0 0 0 3.5 3.5l1-1.5L13 10v3a1 1 0 0 1-1 1C5.373 14 0 8.627 0 3a1 1 0 0 1 1-1z" fill="currentColor"/>
                    </svg>
                  </div>
                  <a href="tel:+94773007426" className="footer__contact-label">+94 77 300 7426</a>
                </div>
                <div className="footer__contact-item">
                  <div className="footer__contact-icon">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                      <path d="M1 4l6 4.5L13 4" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <a href="mailto:janudakodi@gmail.com" className="footer__contact-label">janudakodi@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="footer__col">
              <h3 className="footer__col-title">Services</h3>
              <ul className="footer__col-list" role="list">
                {SERVICES.map((s) => (
                  <li key={s}><a href="#services">{s}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="footer__col">
              <h3 className="footer__col-title">Company</h3>
              <ul className="footer__col-list" role="list">
                {COMPANY.map((c) => (
                  <li key={c.label}><Link href={c.href}>{c.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer__col">
              <h3 className="footer__col-title">Stay Informed</h3>
              <p className="footer__newsletter-note">
                Industry insights, regulatory updates, and project highlights
                delivered monthly.
              </p>
              {subbed ? (
                <p className="footer__sub-success">✦ You're on the list. Thank you.</p>
              ) : (
                <form className="footer__newsletter-form" onSubmit={handleSub} noValidate>
                  <div className="footer__input-wrap">
                    <input
                      type="email"
                      className="footer__input"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="Email address for newsletter"
                      required
                    />
                  </div>
                  <button type="submit" className="footer__sub-btn">
                    Subscribe
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M1.5 6h9M7 2.5l3.5 3.5L7 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="footer__bottom">
          <div className="footer__bottom-inner">
            <p className="footer__copy">
              © {new Date().getFullYear()} <span>GeoLogicX
</span>. All rights reserved.
              Project, Idea &amp; Design by <a href="https://kjanuda.netlify.app/" target="_blank" rel="noreferrer" className="footer__contact-label">Januda J</a>
            </p>
            <ul className="footer__legal" role="list">
              {LEGAL.map((l) => (
                <li key={l.label}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
            <span className="footer__coord-bottom" aria-hidden="true">
              Hambantota, Sri Lanka
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}