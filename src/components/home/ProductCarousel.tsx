/**
 * ProductCarousel — Présentation des produits disponibles
 *
 * Server Component — fetches real products from DB via getAllActiveProducts()
 * Délègue l'UI scroll à ProductCarouselTrack (Client Component)
 *
 * Taste-skill :
 * - Données réelles (prix, noms, descriptions depuis la DB)
 * - Partie gauche : eyebrow + headline + lien discret
 * - Pas de données hardcodées — product-agnostic
 */

import Reveal from "@/components/ui/Reveal";
import ProductCarouselTrack from "./ProductCarouselTrack";
import { getAllActiveProducts } from "@/lib/services/products";

export default async function ProductCarousel() {
  const products = await getAllActiveProducts();

  return (
    <section
      className="w-full"
      style={{
        backgroundColor: "var(--bg-primary)",
        paddingTop: "72px",
        paddingBottom: "80px",
      }}
      aria-labelledby="products-heading"
    >
      <div
        className="mx-auto px-6 flex flex-col md:flex-row gap-10 md:gap-16"
        style={{ maxWidth: "72rem" }}
      >
        {/* ── Texte gauche ── */}
        <Reveal
          className="md:w-52 flex-shrink-0 flex flex-col justify-between"
          style={{ gap: "32px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 500,
                textTransform: "uppercase",
                fontStyle: "italic",
                letterSpacing: "0.12em",
                color: "var(--dark)",
                opacity: 0.4,
              }}
            >
              Nos formats
            </p>
            <h2
              id="products-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                textWrap: "balance",
                margin: 0,
              }}
            >
              Quelle attention pour eux ?
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 300,
                lineHeight: 1.7,
                color: "var(--text-secondary)",
              }}
            >
              {products.length} format{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}.
              Chacun livré avec votre message, chez eux.
            </p>
          </div>
          <a
            href="/nos-douceurs"
            className="hover:opacity-60 transition-opacity"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 400,
              fontStyle: "italic",
              textTransform: "uppercase",
              color: "var(--dark)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              letterSpacing: "0.04em",
            }}
          >
            Voir toute la gamme &rsaquo;
          </a>
        </Reveal>

        {/* ── Cards ── */}
        <Reveal className="flex-1 min-w-0" delay={120}>
          {products.length > 0 ? (
            <ProductCarouselTrack products={products} />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
                border: "1.5px dashed rgba(30,27,46,0.12)",
                borderRadius: "24px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "var(--text-secondary)",
                }}
              >
                Nos formats arrivent bientôt.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
