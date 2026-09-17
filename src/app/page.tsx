"use client";

import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import OurWork from "@/components/OurWork";
import Projects from "@/components/Projects";
import Affiliates from "@/components/Affiliates";
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

      {/* 2. Our Works Showcase (Viral Shorts & TikToks - EnderClub Style) */}
      <OurWork />

      {/* 3. Standalone Full-Bleed Edge-to-Edge Modrinth Marquee Showcase */}
      <Projects />

      {/* 3. Official Partnerships & Services (Instant Gaming, BisectHosting, G2A, Amazon, Fiverr) */}
      <Affiliates />

      {/* 4. Dedicated Contact & Discord Community Section */}
      <Contact />

      {/* 5. Footer */}
      <Footer />
    </main>
  );
}
