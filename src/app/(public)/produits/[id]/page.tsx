import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductById, formatPriceCents } from "@/lib/services/products";
import { getOccasion, OCCASIONS } from "@/data/occasions";
import ProductCard from "@/components/product/ProductCard";
import type { Occasion } from "@/data/occasions";

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ occasion?: string }>;
}

/** Résout l'occasion à afficher : param URL > première occasion du produit > fallback anniversaire */
function resolveOccasion(
  occasionParam: string | undefined,
  productOccasionSlugs: string[]
): Occasion {
  if (occasionParam) {
    const o = getOccasion(occasionParam);
    if (o) return o;
  }
  if (productOccasionSlugs.length > 0) {
    const o = getOccasion(productOccasionSlugs[0]);
    if (o) return o;
  }
  return OCCASIONS["anniversaire"];
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { occasion: occasionParam } = await searchParams;
  const product = await getProductById(id);
  if (!product) return { title: "Produit introuvable" };

  const occasion = resolveOccasion(occasionParam, product.occasion_slugs);
  const price = formatPriceCents(product.price_cents);

  return {
    title: `${product.name} — ${occasion.nom} · MIMOS`,
    description: product.description
      ?? `${product.name} — ${price} TVA incluse. Un geste d'attention pour ${occasion.nom.toLowerCase()}.`,
    openGraph: {
      title: `${product.name} — MIMOS`,
      description: product.description ?? `${price} · Livré directement chez eux.`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProduitPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { occasion: occasionParam } = await searchParams;

  const product = await getProductById(id);
  if (!product) notFound();

  const occasion = resolveOccasion(occasionParam, product.occasion_slugs);

  return (
    <div
      style={{
        minHeight: "100svh",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      {/* ── Breadcrumb ── */}
      <div
        style={{
          borderBottom: `1px solid ${occasion.sleeveTokens.accent}22`,
          backgroundColor: occasion.sleeveTokens.bg,
          padding: "14px 0",
        }}
      >
        <div
          className="mx-auto px-6"
          style={{ maxWidth: "64rem" }}
        >
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2">
            <Link
              href={`/offrir/${occasion.slug}`}
              className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: occasion.sleeveTokens.accent,
                textDecoration: "none",
              }}
            >
              <span aria-hidden="true">←</span>
              {occasion.nom}
            </Link>
            <span
              aria-hidden="true"
              style={{ color: "var(--text-secondary)", fontSize: "13px" }}
            >
              /
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Contenu principal ── */}
      <div
        className="mx-auto px-6 py-12 md:py-16"
        style={{ maxWidth: "64rem" }}
      >
        <ProductCard product={product} occasion={occasion} />
      </div>

      {/* ── Occasions disponibles pour ce produit ── */}
      {product.occasion_slugs.length > 1 && (
        <div
          style={{
            borderTop: `1px solid ${occasion.sleeveTokens.accent}18`,
            backgroundColor: occasion.sleeveTokens.bg,
            padding: "40px 0",
          }}
        >
          <div className="mx-auto px-6" style={{ maxWidth: "64rem" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: occasion.sleeveTokens.accent,
                marginBottom: "16px",
              }}
            >
              Voir aussi pour
            </p>
            <div className="flex flex-wrap gap-2">
              {product.occasion_slugs.map((slug) => {
                const o = getOccasion(slug);
                if (!o || o.slug === occasion.slug) return null;
                return (
                  <Link
                    key={slug}
                    href={`/produits/${product.id}?occasion=${slug}`}
                    className="transition-opacity hover:opacity-75"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      fontWeight: 500,
                      padding: "7px 16px",
                      borderRadius: "999px",
                      backgroundColor: "var(--bg-primary)",
                      border: `1.5px solid ${occasion.sleeveTokens.accent}40`,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                    }}
                  >
                    {o.nom}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
