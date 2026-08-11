import { getDictionary } from "../dictionaries";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import HackerIntro from "@/components/HackerIntro";
import DraggableTerminal from "@/components/DraggableTerminal";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "it" }];
}

export default async function LangHome({
  params,
}: {
  params: Promise<{ lang: "en" | "it" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#07070a", overflowX: "hidden" }}>
      <HackerIntro />
      <TopBar dict={dict.nav} currentLang={lang} />
      
      {/* 1. Hero: Title, 3D Constellation & Profile/About Showcase */}
      <Hero dict={dict.hero} aboutDict={dict.aboutSection} />

      {/* 2. Standalone Full-Bleed Edge-to-Edge Modrinth Marquee Showcase */}
      <Projects dict={dict.projects} />

      {/* 3. Footer */}
      <Footer dict={dict.footer} />

      {/* Floating Standalone Draggable Terminal Window */}
      <DraggableTerminal />
    </main>
  );
}
