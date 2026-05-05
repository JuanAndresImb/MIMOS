import type { Metadata } from "next";
import HeroFullscreen from "@/components/home/HeroFullscreen";
import TrustStrip from "@/components/home/TrustStrip";
import OccasionsCarousel from "@/components/home/OccasionsCarousel";
import BrandStory from "@/components/home/BrandStory";
import ProductCarousel from "@/components/home/ProductCarousel";
import RecipientTeaser from "@/components/home/RecipientTeaser";

export const metadata: Metadata = {
  title: "MIMOS — Des attentions artisanales belges",
  description:
    "Envoie un brownie artisanal belge avec ton message, soigneusement emballé. Une attention sincère pour chaque occasion — livré directement chez eux.",
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
