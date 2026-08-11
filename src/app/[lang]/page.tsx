import { getDictionary } from "../dictionaries";
import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
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
    <main style={{ minHeight: "100vh", backgroundColor: "#07070a", overflowX: "hidden" }}>
      <HackerIntro />
      <TopBar dict={dict.nav} currentLang={lang} />
      <Hero dict={dict.hero} aboutDict={dict.aboutSection} />
      <Footer dict={dict.footer} />
    </main>
  );
}
