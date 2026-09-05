"use client";

import WikiSection from "@/components/WikiSection";

export default function WikiPage() {
  return (
    <div style={{ height: "100dvh", maxHeight: "100dvh", minHeight: "100dvh", backgroundColor: "#08080c", overflow: "hidden" }}>
      <WikiSection standalone={true} />
    </div>
  );
}
