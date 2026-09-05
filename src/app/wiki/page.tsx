"use client";

import WikiSection from "@/components/WikiSection";

export default function WikiPage() {
  return (
    <div style={{ height: "100vh", maxHeight: "100vh", backgroundColor: "#08080c", overflow: "hidden" }}>
      <WikiSection standalone={true} />
    </div>
  );
}
