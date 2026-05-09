import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavBar from "./src/components/NavBar";
import Footer from "./src/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap", // prevents invisible text during font load (CLS fix)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Viewport (separated from metadata — Next.js 14+ best practice) ──────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  // Base URL for resolving relative image/asset paths in metadata
  metadataBase: new URL("https://geologicx.netlify.app"),

  // ── Titles ──────────────────────────────────────────────────────────────────
  title: {
    default: "GeoLogicX | Land Surveying & GIS Solutions Sri Lanka",
    template: "%s | GeoLogicX",
  },

  // ── Core description (keep 150–160 chars for Google snippets) ───────────────
  description:
    "GeoLogicX is Sri Lanka's leading land surveying and geospatial technology company. We offer GPS land measurement, GIS mapping, satellite mapping, and digital survey solutions across Hambantota and Southern Province.",

  // ── Keywords (supplementary — not a ranking factor, but good for context) ───
  keywords: [
    "GeoLogicX",
    "Land Survey Sri Lanka",
    "GPS Land Measurement",
    "GIS Mapping",
    "Survey Company Sri Lanka",
    "Digital Survey System",
    "Land Area Calculator",
    "Satellite Mapping",
    "Hambantota Surveyor",
    "Southern Province Surveyor",
    "Hambantota Land Survey",
    "Beliatta Surveyor",
    "Januda Janandith",
    "Januda J Kodithuwakku",
    "Geospatial Technology Sri Lanka",
    "Drone Survey Sri Lanka",
    "Cadastral Survey",
    "Topographic Survey",
  ],

  // ── Authorship ───────────────────────────────────────────────────────────────
  authors: [{ name: "Januda J Kodithuwakku" }],
  creator: "Januda J Kodithuwakku",
  publisher: "GeoLogicX",

  // ── Canonical URL (prevents duplicate content penalty) ───────────────────────
  alternates: {
    canonical: "https://geologicx.netlify.app",
    languages: {
      "en-US": "https://geologicx.netlify.app",
      // Add Sinhala/Tamil alternates here when ready:
      // "si": "https://geologicx.netlify.app/si",
    },
  },

  // ── Robots ───────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1, // allows Google to show full snippets
    },
  },

  // ── Icons ────────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },

  // ── Open Graph (Facebook, LinkedIn, WhatsApp previews) ───────────────────────
  openGraph: {
    title: "GeoLogicX | Land Surveying & GIS Solutions Sri Lanka",
    description:
      "Advanced GPS land surveying and GIS mapping solutions across Sri Lanka. Serving Hambantota, Southern Province and beyond.",
    url: "https://geologicx.netlify.app",
    siteName: "GeoLogicX",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "GeoLogicX – Land Surveying & GIS Solutions Sri Lanka",
        type: "image/jpeg",
      },
    ],
  },

  // ── Twitter / X Card ─────────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "GeoLogicX | Land Surveying & GIS Solutions Sri Lanka",
    description:
      "Professional GPS land surveying and GIS solutions across Sri Lanka. Accurate. Digital. Reliable.",
    images: [
      {
        url: "/banner.jpg",
        alt: "GeoLogicX – Land Surveying & GIS Solutions Sri Lanka",
      },
    ],
    // Add your Twitter/X handle when you have one:
    // site: "@geologicx",
    // creator: "@januda_j",
  },

  // ── Google Search Console verification ───────────────────────────────────────
  // Use the token string only — no .html extension
  verification: {
    google: "google01a98f4cbe16d4f9",
    // Add Bing when you verify on Bing Webmaster Tools:
    // other: { "msvalidate.01": "YOUR_BING_TOKEN" },
  },

  // ── App / PWA metadata ───────────────────────────────────────────────────────
  applicationName: "GeoLogicX",
  category: "technology",
  referrer: "origin-when-cross-origin",

  // ── Manifest (create /public/site.webmanifest for PWA support) ──────────────
  manifest: "/site.webmanifest",

  // ── Structured data hint (add JSON-LD separately in page.tsx — see below) ───
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* ── JSON-LD Structured Data (LocalBusiness schema) ─────────────────
            Helps Google show rich results: address, phone, map, reviews, etc.
            Move this to individual page.tsx files for page-specific schemas.  */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://geologicx.netlify.app/#organization",
              name: "GeoLogicX",
              description:
                "Sri Lanka's leading GPS land surveying and GIS mapping company serving Hambantota and Southern Province.",
              url: "https://geologicx.netlify.app",
              logo: "https://geologicx.netlify.app/logo.png",
              image: "https://geologicx.netlify.app/banner.jpg",
              founder: {
                "@type": "Person",
                name: "Januda J Kodithuwakku",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Beliatta",
                addressRegion: "Southern Province",
                addressCountry: "LK",
              },
              geo: {
                "@type": "GeoCoordinates",
                // ⚠️ Replace with your actual coordinates:
                latitude: "6.0367",
                longitude: "80.7214",
              },
              areaServed: [
                {
                  "@type": "State",
                  name: "Southern Province, Sri Lanka",
                },
                {
                  "@type": "Country",
                  name: "Sri Lanka",
                },
              ],
              serviceType: [
                "GPS Land Surveying",
                "GIS Mapping",
                "Satellite Mapping",
                "Topographic Survey",
                "Cadastral Survey",
                "Digital Survey Solutions",
              ],
              sameAs: [
                // Add your social profile URLs here:
                // "https://www.facebook.com/geologicx",
                // "https://www.linkedin.com/company/geologicx",
              ],
            }),
          }}
        />

        {/* ── Preconnect for performance (improves LCP & FID) ─────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body className="min-h-full flex flex-col">
        <NavBar />

        <main className="flex-1" id="main-content" role="main">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}