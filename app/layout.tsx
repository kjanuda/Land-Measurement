import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import NavBar from "./src/components/NavBar";
import Footer from "./src/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Viewport ─────────────────────────────────────────────────────────────────
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
  metadataBase: new URL("https://geologicx.netlify.app"),

  title: {
    default: "GeoLogicX | Land Surveying & GIS Solutions Sri Lanka",
    template: "%s | GeoLogicX",
  },

  description:
    "GeoLogicX is Sri Lanka's leading land surveying and geospatial technology company. We offer GPS land measurement, GIS mapping, satellite mapping, and digital survey solutions across Hambantota and Southern Province.",

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

  authors: [{ name: "Januda J Kodithuwakku" }],
  creator: "Januda J Kodithuwakku",
  publisher: "GeoLogicX",

  alternates: {
    canonical: "https://geologicx.netlify.app",
    languages: {
      "en-US": "https://geologicx.netlify.app",
    },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/icons/favicon.ico" },
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/favicon.svg",
      },
    ],
  },

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
    // site: "@geologicx",
    // creator: "@januda_j",
  },

  verification: {
    google: "google01a98f4cbe16d4f9",
  },

  applicationName: "GeoLogicX",
  category: "technology",
  referrer: "origin-when-cross-origin",
  manifest: "/icons/site.webmanifest",
};

// ─── GA Measurement ID ────────────────────────────────────────────────────────
const GA_ID = "G-0M0BWFLLDD";

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
        {/* ── JSON-LD Structured Data (LocalBusiness) ───────────────────── */}
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
              logo: "https://geologicx.netlify.app/icons/favicon.svg",
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
                // "https://www.facebook.com/geologicx",
                // "https://www.linkedin.com/company/geologicx",
              ],
            }),
          }}
        />

        {/* ── Preconnect for performance ─────────────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Preconnect to Google Analytics domains for faster script load */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>

      <body className="min-h-full flex flex-col">
        <NavBar />

        <main className="flex-1" id="main-content" role="main">
          {children}
        </main>

        <Footer />

        {/* ── Google Analytics 4 ────────────────────────────────────────────
            strategy="afterInteractive" loads GA only after the page is
            interactive — doesn't block rendering or hurt Core Web Vitals.   */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}