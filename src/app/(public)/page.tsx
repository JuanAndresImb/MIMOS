import type { Metadata } from "next";
import HeroFullscreen from "@/components/home/HeroFullscreen";
import TrustStrip from "@/components/home/TrustStrip";
import OccasionsCarousel from "@/components/home/OccasionsCarousel";
import BrandStory from "@/components/home/BrandStory";
import ProductCarousel from "@/components/home/ProductCarousel";
import RecipientTeaser from "@/components/home/RecipientTeaser";

export const metadata: Metadata = {
  title: "MIMOS — L'attention, manifestée",
  description:
    "Vous avez quelqu'un en tête. En quelques clics, ce geste est chez eux — avec vos mots. MIMOS : des attentions sincères pour chaque occasion.",
};

export default function HomePage() {
  return (
    <>
      <HeroFullscreen />
      <TrustStrip />
      <OccasionsCarousel />
      <BrandStory />
      <ProductCarousel />
      <RecipientTeaser />
    </>
  );
}
