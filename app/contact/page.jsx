"use client";

import { useState } from "react";

const surveyTypes = [
  "Boundary Survey",
  "Topographic Survey",
  "Land Title Survey",
  "Construction Survey",
  "GPS/GNSS Survey",
  "Other",
];

export default function ContactSection() {
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name:        form.elements.namedItem("name").value,
      email:       form.elements.namedItem("email").value,
      phone:       form.elements.namedItem("phone").value,
      surveyType:  form.elements.namedItem("surveyType").value,
      location:    form.elements.namedItem("location").value,
      area:        form.elements.namedItem("area").value,
      message:     form.elements.namedItem("message").value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to send");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .contact-section {
          padding: 72px 24px;
          background: #ffffff;
          font-family: 'DM Sans', sans-serif;
          scroll-margin-top: 80px;
        }
        .contact-inner {
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 40px;
          align-items: start;
        }
        .contact-left {}
        .contact-tag {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d97706;
          margin-bottom: 12px;
        }
        .contact-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(38px, 4vw, 52px);
          line-height: 0.92;
          letter-spacing: 0.02em;
          color: #000000;
          margin-bottom: 16px;
        }
        .contact-heading span { color: #d97706; }
        .contact-desc {
          font-size: 13px;
          font-weight: 300;
          color: #6b7280;
          line-height: 1.75;
          margin-bottom: 28px;
          max-width: 280px;
        }
        .contact-info-list { display: flex; flex-direction: column; gap: 12px; }
        .contact-info-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12.5px;
          color: #374151;
        }
        .contact-info-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: #fff; border: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: #d97706;
        }

        /* Form card */
        .form-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 32px 30px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 8px 28px rgba(0,0,0,0.08);
        }
        .form-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        .form-subtitle {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 22px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label {
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 10px 13px;
          border-radius: 9px;
          border: 1.5px solid #e5e7eb;
          background: #f9fafb;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #111827;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          appearance: none;
          -webkit-appearance: none;
        }
        .form-input::placeholder, .form-textarea::placeholder { color: #c1c8d0; }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #d97706;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
        }
        .form-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 13px center;
          padding-right: 36px;
          cursor: pointer;
        }
        .form-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

        .submit-btn {
          width: 100%;
          margin-top: 16px;
          padding: 13px 20px;
          border-radius: 12px;
          border: none;
          background: #111827;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 13.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 4px 18px rgba(17,24,39,0.16);
        }
        .submit-btn:hover:not(:disabled) { background: #1f2937; box-shadow: 0 6px 24px rgba(17,24,39,0.22); }
        .submit-btn:active:not(:disabled) { transform: scale(0.985); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .submit-btn-accent { color: #f59e0b; font-family: 'DM Mono', monospace; font-size: 11px; opacity: 0.85; }

        /* Spinner */
        .spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success / Error banners */
        .form-banner {
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 12.5px;
          display: flex;
          align-items: flex-start;
          gap: 9px;
        }
        .form-banner-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }
        .form-banner-error   { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
        .banner-icon { flex-shrink: 0; margin-top: 1px; }

        @media (max-width: 680px) {
          .contact-inner { grid-template-columns: 1fr; gap: 28px; }
          .form-grid { grid-template-columns: 1fr; }
          .form-card { padding: 24px 20px; }
          .contact-section { padding: 52px 16px; }
        }
      `}</style>

      <section id="contact" className="contact-section">
        <div className="contact-inner">

          {/* Left info */}
          <div className="contact-left">
            <p className="contact-tag">Survey request</p>
            <h2 className="contact-heading">
              GET YOUR<br /><span>LAND</span><br />SURVEYED
            </h2>
            <p className="contact-desc">
              Fill in the form and our survey team will get back to you within
              one business day with a quote and timeline.
            </p>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>+94 11 234 5678</span>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>janudakodi@gmail.com</span>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="form-card">
            <p className="form-title">Survey Request Form</p>
            <p className="form-subtitle">All fields marked are required</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name *</label>
                  <input id="name" name="name" type="text" className="form-input" placeholder="John Silva" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" className="form-input" placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" className="form-input" placeholder="+94 77 000 0000" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="surveyType">Survey Type *</label>
                  <select id="surveyType" name="surveyType" className="form-select" required defaultValue="">
                    <option value="" disabled>Select type…</option>
                    {surveyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="location">Location / Address *</label>
                  <input id="location" name="location" type="text" className="form-input" placeholder="Galle Road, Colombo 03" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="area">Approx. Area (perches)</label>
                  <input id="area" name="area" type="text" className="form-input" placeholder="e.g. 20 perches" />
                </div>
                <div className="form-group full">
                  <label className="form-label" htmlFor="message">Additional Notes</label>
                  <textarea id="message" name="message" className="form-textarea" placeholder="Describe any special requirements, access issues, or deadlines…" />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={status === "sending"}>
                {status === "sending" ? (
                  <><span className="spinner" />Sending…</>
                ) : (
                  <>
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Survey Request
                    <span className="submit-btn-accent">→</span>
                  </>
                )}
              </button>
            </form>

            {status === "success" && (
              <div className="form-banner form-banner-success">
                <svg className="banner-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Your survey request was sent successfully! We'll be in touch within one business day.</span>
              </div>
            )}

            {status === "error" && (
              <div className="form-banner form-banner-error">
                <svg className="banner-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMsg || "Failed to send. Please try again."}</span>
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}