"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/d4vide-portfolio/en");
  }, []);
  
  return null;
}
