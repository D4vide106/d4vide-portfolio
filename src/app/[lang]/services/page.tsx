import { getDictionary } from "../../dictionaries";
import TopBar from "@/components/TopBar";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import DraggableTerminal from "@/components/DraggableTerminal";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "it" }];
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: "en" | "it" }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#07070a", overflowX: "hidden", paddingTop: "4rem" }}>
      <TopBar dict={dict.nav} currentLang={lang} />

      {/* Standalone Full Services, Discord Bots, Freelance & Estimator Showcase */}
      <ServicesSection dict={dict.services} />

      <Footer dict={dict.footer} />
      <DraggableTerminal />
    </main>
  );
}
