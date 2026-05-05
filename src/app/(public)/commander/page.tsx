import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getOccasion } from "@/data/occasions";
import { getProductByOccasion, getProductById } from "@/lib/services/products";
import TunnelClient from "./TunnelClient";

interface Props {
  searchParams: Promise<{ occasion?: string; promo?: string; product?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { occasion: slug } = await searchParams;
  const occasion = slug ? getOccasion(slug) : undefined;
  return {
    title: occasion
      ? `Commander — ${occasion.nom}`
      : "Commander",
    robots: { index: false, follow: false },
  };
}

export default async function CommanderPage({ searchParams }: Props) {
  const { occasion: slug, promo: initialPromoCode, product: productId } = await searchParams;

  if (!slug) notFound();

  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  // Si un produit spécifique est demandé (via sélection format), on le charge par ID
  // Sinon, on tombe sur le produit par défaut pour cette occasion
  const product = productId
    ? await getProductById(productId)
    : await getProductByOccasion(slug);

  // Aucun produit configuré ou épuisé → retour sur la page occasion
  if (!product || product.stock <= 0) redirect(`/offrir/${slug}`);

  return (
    <div
      className="min-h-screen py-12"
      style={{ backgroundColor: occasion.sleeveTokens.bg }}
    >
      <div className="max-w-[42rem] mx-auto px-6">
        <TunnelClient product={product} occasion={occasion} initialPromoCode={initialPromoCode} />
      </div>
    </div>
  );
}
