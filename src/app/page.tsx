import NavigationPopup from "@/components/NavigationPopup";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <NavigationPopup />
      <Hero />
      <Projects />
      <Footer />
    </main>
  );
}
