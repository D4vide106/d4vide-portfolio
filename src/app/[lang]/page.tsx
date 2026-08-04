import { getDictionary } from "../dictionaries";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import DraggableTerminal from "@/components/DraggableTerminal";
import HackerIntro from "@/components/HackerIntro";

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
    <main>
      <HackerIntro />
      <DraggableTerminal />
      <TopBar dict={dict.nav} currentLang={lang} />
      <div className="animate-entrance-1">
        <Hero dict={dict.hero} aboutDict={dict.aboutSection} />
      </div>
      <div className="animate-entrance-2">
        <Projects dict={dict.projects} />
      </div>
      <div className="animate-entrance-3">
        <Footer dict={dict.footer} />
      </div>
    </main>
  );
}
