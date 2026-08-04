import { getDictionary } from "../dictionaries";
import NavigationPopup from "@/components/NavigationPopup";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

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
      <NavigationPopup dict={dict.nav} currentLang={lang} />
      <Hero dict={dict.hero} />
      <About dict={dict.aboutSection} />
      <Projects dict={dict.projects} />
      <Footer dict={dict.footer} />
    </main>
  );
}
