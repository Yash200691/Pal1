import CinematicScroll from "@/components/CinematicScroll";
import TheProblem from "@/components/TheProblem";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import NightDawnParallax from "@/components/NightDawnParallax";
import ForNGOs from "@/components/ForNGOs";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-[var(--color-plum)] selection:text-[var(--color-dawn)]">
      <CinematicScroll />
      <TheProblem />
      <HowItWorks />
      <Features />
      <NightDawnParallax />
      <ForNGOs />
      <Footer />
    </main>
  );
}
