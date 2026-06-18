/**
 * ProductCard — Fiche produit premium
 *
 * Design Read : premium consumer gifting detail · warm editorial / soft-structuralism
 * Dials : DESIGN_VARIANCE 6 · MOTION_INTENSITY 4 · VISUAL_DENSITY 3
 *
 * Storytelling : met en avant le geste (message personnalisé + expérience destinataire),
 * pas juste les specs produit. Product-agnostic — pas de références hardcodées "brownies".
 */

import Image from "next/image";
import Link from "next/link";
import AllergensList from "./AllergensList";
import type { Product } from "@/lib/services/products";
import { formatPriceCents } from "@/lib/services/products";
import type { Occasion } from "@/data/occasions";

interface Props {
  product: Product;
  occasion: Occasion;
}

function getFirstImage(images: unknown): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  const first = images[0];
  if (typeof first === "string") return first;
  if (typeof first === "object" && first !== null && "url" in first) {
    return String((first as { url: unknown }).url);
  }
  return null;
}

export default function ProductCard({ product, occasion }: Props) {
  const imageUrl = getFirstImage(product.images);
  const { sleeveTokens } = occasion;
  const ctaHref = `/commander?occasion=${occasion.slug}&product=${product.id}`;

  return (
    <article aria-labelledby={`product-name-${product.id}`}>

      {/* ── Grille asymétrique : image 55 / info 45 ── */}
      <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-10 md:gap-14 items-start">

        {/* ── Visuel — double-bezel ── */}
        <div
          style={{
            padding: "10px",
            borderRadius: "2rem",
            backgroundColor: sleeveTokens.bg,
            border: `1px solid ${sleeveTokens.accent}22`,
          }}
        >
          <div
            className="relative overflow-hidden w-full"
            style={{
              aspectRatio: "4/3",
              borderRadius: "calc(2rem - 10px)",
              backgroundColor: sleeveTokens.bg,
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${product.name} — MIMOS`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: sleeveTokens.dark,
                    opacity: 0.25,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Visuel bientôt
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Colonne info ── */}
        <div className="flex flex-col" style={{ gap: "28px" }}>

          {/* Eyebrow occasion */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 500,
              fontStyle: "italic",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: sleeveTokens.accent,
            }}
          >
            {occasion.nom}
          </p>

          {/* Nom produit */}
          <div style={{ marginTop: "-16px" }}>
            <h1
              id={`product-name-${product.id}`}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                textWrap: "balance",
              }}
            >
              {product.name}
            </h1>

            {/* Prix */}
            <div className="flex items-baseline gap-2 mt-3">
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: sleeveTokens.accent,
                  letterSpacing: "-0.02em",
                }}
              >
                {formatPriceCents(product.price_cents)}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                }}
              >
                TVA incluse · livraison incluse
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 300,
                lineHeight: 1.75,
                color: "var(--text-primary)",
                maxWidth: "42ch",
              }}
            >
              {product.description}
            </p>
          )}

          {/* ── Le geste que vous créez — storytelling ── */}
          <div
            style={{
              borderRadius: "16px",
              padding: "20px 22px",
              backgroundColor: sleeveTokens.bg,
              border: `1px solid ${sleeveTokens.accent}30`,
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: sleeveTokens.accent,
                margin: 0,
              }}
            >
              Le geste que vous créez
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                {
                  icon: "✦",
                  text: "Votre message, écrit par vous — imprimé sur l'emballage. Pas une carte, pas un post-it.",
                },
                {
                  icon: "→",
                  text: "Livré directement chez eux. Vous n'avez rien d'autre à faire.",
                },
                {
                  icon: "◎",
                  text: "Ils reçoivent une page qui leur est dédiée. Quelque chose qu'on garde.",
                },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      color: sleeveTokens.accent,
                      flexShrink: 0,
                      marginTop: "2px",
                      width: "16px",
                      textAlign: "center",
                    }}
                  >
                    {icon}
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "13px",
                      fontWeight: 300,
                      lineHeight: 1.65,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA ou rupture de stock */}
          {product.stock <= 0 ? (
            <p
              className="text-sm font-medium px-4 py-3 rounded-xl"
              style={{
                fontFamily: "var(--font-body)",
                backgroundColor: "#fef2f2",
                color: "var(--error)",
              }}
              role="alert"
            >
              Momentanément indisponible — revenez bientôt.
            </p>
          ) : (
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                backgroundColor: sleeveTokens.accent,
                color: "white",
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 500,
                padding: "15px 32px",
                borderRadius: "999px",
                textDecoration: "none",
                width: "fit-content",
              }}
              aria-label={`Composer ce MIMOS pour ${occasion.nom} — ${formatPriceCents(product.price_cents)}`}
            >
              Composer ce MIMOS
              <span aria-hidden="true"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.18)",
                  fontSize: "13px",
                }}
              >
                →
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* ── Allergènes — séparés visuellement mais dans le flux ── */}
      <div
        className="mt-12 pt-10"
        style={{ borderTop: `1px solid ${sleeveTokens.accent}22` }}
      >
        <AllergensList
          presentAllergens={product.allergens}
          accentColor={sleeveTokens.accent}
        />
      </div>

    </article>
  );
}
