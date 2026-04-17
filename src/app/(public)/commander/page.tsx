import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOccasion } from "@/data/occasions";
import { getProductByOccasion } from "@/lib/services/products";
import TunnelClient from "./TunnelClient";

interface Props {
  searchParams: Promise<{ occasion?: string; promo?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { occasion: slug } = await searchParams;
  const occasion = slug ? getOccasion(slug) : undefined;
  return {
    title: occasion
      ? `Commander — ${occasion.nom} — La Brownie Box Belge`
      : "Commander — La Brownie Box Belge",
    robots: { index: false, follow: false },
  };
}

export default async function CommanderPage({ searchParams }: Props) {
  const { occasion: slug, promo: initialPromoCode } = await searchParams;

  if (!slug) notFound();

  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  const product = await getProductByOccasion(slug);
  if (!product || product.stock <= 0) notFound();

  return (
    <div
      className="min-h-screen py-12"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="max-w-[42rem] mx-auto px-6">
        <TunnelClient product={product} occasion={occasion} initialPromoCode={initialPromoCode} />
      </div>
    </div>
  );
}
