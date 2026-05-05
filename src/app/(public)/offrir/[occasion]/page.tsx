import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getOccasion, OCCASION_SLUGS } from "@/data/occasions";
import { getAllActiveProducts } from "@/lib/services/products";
import { formatPriceCents } from "@/lib/utils";

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
  if (!occasion) return { title: "Page introuvable" };
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
  if (!occasion) notFound();

  const products = await getAllActiveProducts();

  return (
    <>
      {/* ── Hero ── */}
      <section
        style={{
          backgroundColor: occasion.sleeveTokens.bg,
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
        aria-labelledby={`occasion-heading-${slug}`}
      >
        <div className="mx-auto px-6" style={{ maxWidth: "72rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 500,
              fontStyle: "italic",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--dark)",
              opacity: 0.5,
              marginBottom: "20px",
            }}
          >
            {occasion.nom}
          </p>

          <h1
            id={`occasion-heading-${slug}`}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "var(--dark)",
              lineHeight: 1.08,
              marginBottom: "20px",
              maxWidth: "20ch",
            }}
          >
            {occasion.titre}
          </h1>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "17px",
              fontWeight: 300,
              lineHeight: 1.75,
              color: "var(--dark)",
              opacity: 0.7,
              maxWidth: "42ch",
              marginBottom: "16px",
            }}
          >
            {occasion.accroche}
          </p>

          {/* Paragraphe émotionnel */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "var(--dark)",
              opacity: 0.7,
              maxWidth: "46ch",
              marginBottom: "40px",
            }}
          >
            {occasion.histoire}
          </p>

          {/* Mini trust strip */}
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              "Livré directement chez eux",
              "Fait à la main en Belgique",
              "Pensé en 3 minutes",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "var(--dark)",
                  opacity: 0.6,
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: occasion.sleeveTokens.accent,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sélection du format ── */}
      <section
        style={{
          backgroundColor: "var(--bg-primary)",
          paddingTop: "80px",
          paddingBottom: "88px",
        }}
        aria-labelledby="format-heading"
      >
        <div className="mx-auto px-6" style={{ maxWidth: "72rem" }}>
          <div style={{ marginBottom: "48px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 500,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: occasion.sleeveTokens.accent,
                marginBottom: "12px",
              }}
            >
              Choisis ton format
            </p>
            <h2
              id="format-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                fontWeight: 700,
                color: "var(--dark)",
                lineHeight: 1.1,
              }}
            >
              Quelle attention veux-tu envoyer ?
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {products.map((product, i) => {
                const isMiddle = i === 1;
                return (
                  <div
                    key={product.id}
                    style={{
                      backgroundColor: isMiddle
                        ? occasion.sleeveTokens.bg
                        : "var(--chantilly)",
                      border: isMiddle
                        ? `1.5px solid ${occasion.sleeveTokens.accent}`
                        : "1.5px solid rgba(30,27,46,0.08)",
                      borderRadius: "24px",
                      padding: "32px 28px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      position: "relative",
                    }}
                  >
                    {/* Badge "Le plus offert" sur la carte du milieu */}
                    {isMiddle && (
                      <span
                        style={{
                          position: "absolute",
                          top: "-12px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: occasion.sleeveTokens.accent,
                          color: "white",
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          padding: "4px 14px",
                          borderRadius: "999px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Le plus offert
                      </span>
                    )}

                    {/* Nom + prix */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "22px",
                          fontWeight: 700,
                          color: "var(--dark)",
                          lineHeight: 1.15,
                        }}
                      >
                        {product.name}
                      </h3>
                      {product.description && (
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "14px",
                            fontWeight: 300,
                            lineHeight: 1.65,
                            color: "var(--dark)",
                            opacity: 0.65,
                          }}
                        >
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Prix */}
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "26px",
                        fontWeight: 700,
                        color: occasion.sleeveTokens.accent,
                      }}
                    >
                      {formatPriceCents(product.price_cents)}
                    </p>

                    {/* CTA */}
                    <div style={{ marginTop: "auto" }}>
                      {product.stock <= 0 ? (
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "var(--dark)",
                            opacity: 0.4,
                            fontStyle: "italic",
                          }}
                        >
                          Momentanément indisponible
                        </p>
                      ) : (
                        <Link
                          href={`/commander?occasion=${slug}&product=${product.id}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            padding: "13px 24px",
                            borderRadius: "999px",
                            backgroundColor: isMiddle
                              ? occasion.sleeveTokens.accent
                              : "transparent",
                            border: isMiddle
                              ? "none"
                              : `1.5px solid ${occasion.sleeveTokens.accent}`,
                            color: isMiddle ? "white" : occasion.sleeveTokens.accent,
                            fontFamily: "var(--font-body)",
                            fontSize: "14px",
                            fontWeight: 500,
                            textDecoration: "none",
                            letterSpacing: "0.01em",
                          }}
                          className="hover:opacity-75 transition-opacity"
                        >
                          Choisir ce format
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Aucun produit configuré — état transitoire */
            <div
              style={{
                textAlign: "center",
                padding: "56px 24px",
                borderRadius: "24px",
                border: "1.5px dashed rgba(30,27,46,0.15)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--dark)",
                  marginBottom: "8px",
                }}
              >
                Bientôt disponible
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "var(--dark)",
                  opacity: 0.55,
                  marginBottom: "28px",
                }}
              >
                Les formats pour cette occasion arrivent prochainement.
              </p>
              <Link
                href="/nos-douceurs"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--dark)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
                className="hover:opacity-60 transition-opacity"
              >
                Voir tous les formats
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Réassurance ── */}
      <section
        style={{
          backgroundColor: "var(--lime)",
          paddingTop: "56px",
          paddingBottom: "64px",
        }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: "72rem" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                titre: "Livré directement chez eux",
                desc: "Tu indiques l'adresse du destinataire. La box arrive sans que tu aies à t'en occuper.",
              },
              {
                titre: "Fait à la main en Belgique",
                desc: "Chaque création est préparée avec soin. On goûte la différence.",
              },
              {
                titre: "Satisfait ou remboursé",
                desc: "Si quelque chose ne va pas, on s'en occupe. Sans question.",
              },
            ].map(({ titre, desc }) => (
              <div
                key={titre}
                style={{
                  paddingTop: "24px",
                  borderTop: `2px solid ${occasion.sleeveTokens.accent}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "var(--dark)",
                  }}
                >
                  {titre}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: "var(--dark)",
                    opacity: 0.65,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
