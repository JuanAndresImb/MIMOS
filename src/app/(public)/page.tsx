import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import MarqueeBand from "@/components/home/MarqueeBand";
import OccasionsGrid from "@/components/home/OccasionsGrid";
import StatsBand from "@/components/home/StatsBand";

export const metadata: Metadata = {
  title: "La Brownie Box Belge — Brownie box artisanale livrée en boîte aux lettres",
  description:
    "Offrez une brownie box artisanale belge avec votre message personnalisé. Livrée directement dans la boîte aux lettres, pour chaque occasion.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBand />
      <OccasionsGrid />
      <StatsBand />
    </>
  );
}
