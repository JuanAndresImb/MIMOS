import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOccasion, OCCASION_SLUGS } from "@/data/occasions";
import { getProductByOccasion } from "@/lib/services/products";
import ProductCard from "@/components/product/ProductCard";

// ISR — revalide toutes les heures
export const revalidate = 3600;

interface Props {
  params: Promise<{ occasion: string }>;
}

export function generateStaticParams() {
  return OCCASION_SLUGS.map((slug) => ({ occasion: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { occasion: slug } = await params;
  const occasion = getOccasion(slug);

  if (!occasion) {
    return { title: "Page introuvable — La Brownie Box Belge" };
  }

  return {
    title: occasion.metaTitle,
    description: occasion.metaDescription,
    openGraph: {
      title: occasion.metaTitle,
      description: occasion.metaDescription,
    },
  };
}

export default async function OccasionPage({ params }: Props) {
  const { occasion: slug } = await params;
  const occasion = getOccasion(slug);

  if (!occasion) {
    notFound();
  }

  // Produit récupéré en parallèle avec le rendu — null si Supabase indisponible
  const product = await getProductByOccasion(slug);

  return (
    <>
      {/* Hero occasion */}
      <section
        className="w-full py-16 md:py-24"
        style={{ backgroundColor: occasion.sleeveTokens.bg }}
        aria-labelledby={`occasion-heading-${slug}`}
      >
        <div className="max-w-[56rem] mx-auto px-6">
          {/* Badge sleeve */}
          <span
            className="inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full mb-6"
            style={{
              backgroundColor: occasion.sleeveTokens.accent,
              color: "#ffffff",
              fontFamily: "var(--font-label)",
              transform: "rotate(-1.5deg)",
            }}
          >
            Sleeve {occasion.sleeve}
          </span>

          {/* Titre */}
          <h1
            id={`occasion-heading-${slug}`}
            className="text-4xl md:text-5xl font-black leading-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: occasion.sleeveTokens.dark,
            }}
          >
            {occasion.titre}
          </h1>

          {/* Accroche */}
          <p
            className="text-lg md:text-xl mb-10 max-w-[36rem]"
            style={{
              fontFamily: "var(--font-body)",
              color: occasion.sleeveTokens.dark,
              opacity: 0.8,
            }}
          >
            {occasion.accroche}
          </p>
        </div>
      </section>

      {/* Fiche produit — affichée uniquement si un produit existe en base */}
      {product && (
        <ProductCard
          product={product}
          occasionSlug={slug}
          sleeveTokens={occasion.sleeveTokens}
        />
      )}
    </>
  );
}
