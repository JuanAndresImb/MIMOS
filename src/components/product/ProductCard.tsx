import Image from "next/image";
import Link from "next/link";
import AllergensList from "./AllergensList";
import type { Product } from "@/lib/services/products";
import { formatPriceCents } from "@/lib/services/products";
import type { SleeveTokens } from "@/data/occasions";

interface Props {
  product: Product;
  occasionSlug: string;
  sleeveTokens: SleeveTokens;
}

// Extrait la première image valide du champ JSON `images`
function getFirstImage(images: unknown): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  const first = images[0];
  if (typeof first === "string") return first;
  if (typeof first === "object" && first !== null && "url" in first) {
    return String((first as { url: unknown }).url);
  }
  return null;
}

export default function ProductCard({ product, occasionSlug, sleeveTokens }: Props) {
  const imageUrl = getFirstImage(product.images);

  return (
    <section
      className="w-full py-12 md:py-16"
      style={{ backgroundColor: "var(--bg-primary)" }}
      aria-labelledby={`product-heading-${product.id}`}
    >
      <div className="max-w-[56rem] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Visuel produit */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              aspectRatio: "1",
              backgroundColor: sleeveTokens.bg,
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Photo de ${product.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-label={`Visuel ${product.name} — à venir`}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--dark)",
                    opacity: 0.3,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Visuel bientôt
                </span>
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="flex flex-col gap-6">

            {/* Nom */}
            <h2
              id={`product-heading-${product.id}`}
              className="text-2xl md:text-3xl"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                color: "var(--text-primary)",
                lineHeight: 1.1,
              }}
            >
              {product.name}
            </h2>

            {/* Prix */}
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: sleeveTokens.accent,
                }}
              >
                {formatPriceCents(product.price_cents)}
              </span>
              <span
                className="text-sm"
                style={{
                  fontFamily: "var(--font-label)",
                  color: "var(--text-secondary)",
                }}
              >
                TVA incluse
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p
                className="text-base leading-relaxed"
                style={{
                  fontFamily: "var(--font-body)",
                  // var(--text-primary) = #1a1a1a sur blanc = ratio 15:1 — WCAG AAA
                  color: "var(--text-primary)",
                }}
              >
                {product.description}
              </p>
            )}

            {/* Stock */}
            {product.stock <= 0 ? (
              <p
                className="text-sm font-semibold px-4 py-2 rounded-lg"
                style={{
                  fontFamily: "var(--font-body)",
                  backgroundColor: "#fef2f2",
                  color: "var(--error)",
                }}
                role="alert"
              >
                Ce produit est actuellement en rupture de stock.
              </p>
            ) : (
              <Link
                href={`/commander?occasion=${occasionSlug}`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
                style={{
                  backgroundColor: sleeveTokens.accent,
                  fontFamily: "var(--font-body)",
                }}
                aria-label={`Commander ${product.name} pour ${formatPriceCents(product.price_cents)} TVA incluse`}
              >
                Choisir ce format
              </Link>
            )}

            {/* Séparateur */}
            <hr style={{ borderColor: "var(--primary-100)" }} />

            {/* Allergènes (FR46) */}
            <AllergensList presentAllergens={product.allergens} />
          </div>
        </div>
      </div>
    </section>
  );
}
