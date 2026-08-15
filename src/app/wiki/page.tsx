"use client";

import TopBar from "@/components/TopBar";
import WikiSection from "@/components/WikiSection";
import Footer from "@/components/Footer";
import DraggableTerminal from "@/components/DraggableTerminal";

export default function WikiPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0b0b0f", overflowX: "hidden" }}>
      <TopBar />
      <WikiSection standalone={true} />
      <Footer />
      <DraggableTerminal />
    </main>
  );
}
