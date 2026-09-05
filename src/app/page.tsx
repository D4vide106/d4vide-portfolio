"use client";

import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HackerIntro from "@/components/HackerIntro";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#050507", overflowX: "hidden" }}>
      <HackerIntro />
      <TopBar />
      
      {/* 1. Hero: Title, 3D Constellation & Profile/About Showcase */}
      <Hero />

      {/* 2. Standalone Full-Bleed Edge-to-Edge Modrinth Marquee Showcase */}
      <Projects />

      {/* 3. Dedicated Contact & Discord Community Section */}
      <Contact />

      {/* 4. Footer */}
      <Footer />
    </main>
  );
}
