"use client";

import TopBar from "@/components/TopBar";
import WikiSection from "@/components/WikiSection";
import Footer from "@/components/Footer";
import DraggableTerminal from "@/components/DraggableTerminal";

export default function WikiPage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#07070a", overflowX: "hidden" }}>
      <TopBar />

      <div style={{ paddingTop: "80px" }}>
        <WikiSection standalone={true} />
      </div>

      <Footer />

      <DraggableTerminal />
    </main>
  );
}
