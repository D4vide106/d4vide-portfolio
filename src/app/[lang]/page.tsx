import { getDictionary } from "../dictionaries";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
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
    <main>
      <DraggableTerminal />
      <TopBar dict={dict.nav} currentLang={lang} />
      <Hero dict={dict.hero} aboutDict={dict.aboutSection} />
      <Projects dict={dict.projects} />
      <Footer dict={dict.footer} />
    </main>
  );
}
