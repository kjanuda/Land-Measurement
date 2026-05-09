"use client";

import HeroHeader from "./src/pages/Header";
import Service from "./src/components/Services";
import Ft from "./src/components/ft";
import Industry from "./src/components/industry";
import ContactSection from "./src/components/Contactsection";

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      
      {/* Hero Section */}
      <section className="w-full">
        <HeroHeader />
      </section>

      {/* Services */}
      <section id="services" className="mt-10">
        <Service />
      </section>

      {/* Features */}
      <section className="flex justify-center mt-12 bg-white">
        <Ft />
      </section>

      {/* Industry */}
      <section className="mt-12">
        <Industry />
      </section>

      {/* Contact Section */}
      

    </main>
  );
}