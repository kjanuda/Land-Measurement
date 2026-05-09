import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavBar from "./src/components/NavBar";
import Footer from "./src/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://geologicx.netlify.app"),

  title: {
    default: "GeoLogicX | Land Surveying & GIS Solutions Sri Lanka",
    template: "%s | GeoLogicX",
  },

  description:
    "GeoLogicX is a Sri Lankan land surveying and geospatial technology company providing GPS land measurement, GIS mapping, satellite mapping and digital survey solutions.",

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
    "Januda Janandith",
    "Januda",
    "Januda J Kodithuwakku",
    "Southern Province Surveyor",
    "Hambantota Land Survey",
    "Beliatta Surveyor",
  ],

  authors: [
    {
      name: "Januda J Kodithuwakku",
    },
  ],

  creator: "Januda J Kodithuwakku",

  publisher: "GeoLogicX",

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    title: "GeoLogicX | Land Surveying & GIS Solutions",
    description:
      "Advanced GPS land surveying and GIS mapping solutions in Sri Lanka.",

    url: "https://geologicx.netlify.app",

    siteName: "GeoLogicX",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "GeoLogicX Land Survey Platform",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "GeoLogicX",
    description:
      "Professional GPS land surveying and GIS solutions platform.",
    images: ["/banner.jpg"],
  },
};

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
      <body className="min-h-full flex flex-col">
        <NavBar />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}