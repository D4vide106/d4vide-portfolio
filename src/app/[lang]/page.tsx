import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import HackerIntro from "@/components/HackerIntro";
import DraggableTerminal from "@/components/DraggableTerminal";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "it" }, { lang: "es" }];
}

export default async function LangHome() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#07070a", overflowX: "hidden" }}>
      <HackerIntro />
      <TopBar />
      <Hero />
      <Projects />
      <Footer />
      <DraggableTerminal />
    </main>
  );
}
