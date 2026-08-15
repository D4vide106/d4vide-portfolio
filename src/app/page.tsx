"use client";

import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import WikiSection from "@/components/WikiSection";
import Footer from "@/components/Footer";
import HackerIntro from "@/components/HackerIntro";
import DraggableTerminal from "@/components/DraggableTerminal";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#07070a", overflowX: "hidden" }}>
      <HackerIntro />
      <TopBar />
      
      {/* 1. Hero: Title, 3D Constellation & Profile/About Showcase */}
      <Hero />

      {/* 2. Standalone Full-Bleed Edge-to-Edge Modrinth Marquee Showcase */}
      <Projects />

      {/* 3. Professional Wiki Section */}
      <WikiSection />

      {/* 4. Footer */}
      <Footer />

      {/* Floating Standalone Draggable Terminal Window */}
      <DraggableTerminal />
    </main>
  );
}
