"use client";

import dynamic from "next/dynamic";

const LandMap = dynamic(
  () => import("../src/components/LandMap.jsx"),
  { ssr: false }
);

export default function LandMapPage() {
  return (
    <main className="w-full h-screen">
      <LandMap />
    </main>
  );
}
