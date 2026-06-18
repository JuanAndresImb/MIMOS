/**
 * HeroFullscreen — Page d'accueil, section hero
 *
 * Design Read : premium gifting · warm editorial · soft-structuralism
 * Dials : DESIGN_VARIANCE 6 · MOTION_INTENSITY 4 · VISUAL_DENSITY 3
 *
 * - Asymétrique : headline 58% / visuel décoratif 42%
 * - Animations CSS keyframes staggerées (hero-line-1/2/3/4 dans globals.css)
 * - CTA pattern imbriqué : texte + icône → dans bulle blanche translucide
 * - Colonne droite : stack de 3 cartes occasion flottantes (aria-hidden, CSS float animation)
 * - Zéro référence produit hardcodée
 * - Server Component — pas de "use client"
 */

import Link from "next/link";

export default function HeroFullscreen() {
  return (
    <section
      style={{
        backgroundColor: "var(--bleu)",
        overflow: "hidden",
        position: "relative",
      }}
      aria-labelledby="hero-heading"
    >
      <div
        className="mx-auto px-6"
        style={{
          maxWidth: "72rem",
          paddingTop: "72px",
          paddingBottom: "88px",
          minHeight: "calc(100svh - 80px)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-[58fr_42fr] w-full"
          style={{ gap: "48px", alignItems: "center" }}
        >
          {/* ── Colonne gauche — bloc headline ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

            {/* Eyebrow */}
            <p
              className="hero-line hero-line-1"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 500,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--dark)",
                opacity: 0.45,
              }}
            >
              L&apos;attention, manifestée
            </p>

            {/* H1 */}
            <h1
              id="hero-heading"
              className="hero-line hero-line-2"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 7vw, 5.4rem)",
                fontWeight: 800,
                color: "var(--dark)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
                textWrap: "balance",
                maxWidth: "15ch",
                margin: 0,
              }}
            >
              Pour quand un message ne suffit pas.
            </h1>

            {/* Description */}
            <p
              className="hero-line hero-line-3"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "17px",
                fontWeight: 300,
                lineHeight: 1.75,
                color: "var(--dark)",
                opacity: 0.62,
                maxWidth: "38ch",
                margin: 0,
              }}
            >
              Vous avez quelqu&apos;un en tête. En quelques clics, ce geste est chez eux — avec vos mots.
            </p>

            {/* CTA — nested arrow pattern */}
            <div className="hero-line hero-line-4">
              <Link
                href="/offrir/anniversaire"
                className="hover:opacity-85 transition-opacity"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 14px 14px 28px",
                  borderRadius: "999px",
                  backgroundColor: "var(--dark)",
                  color: "var(--chantilly)",
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                }}
              >
                Choisir le moment
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255,255,255,0.16)",
                    fontSize: "15px",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* ── Colonne droite — stack de cartes décoratif ── */}
          <div
            className="hidden md:flex"
            style={{
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              height: "400px",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                position: "relative",
                width: "280px",
                height: "340px",
              }}
            >
              {/* Carte 3 — arrière-plan */}
              <div
                className="hero-card-back"
                style={{
                  position: "absolute",
                  width: "224px",
                  height: "148px",
                  borderRadius: "20px",
                  backgroundColor: "var(--sleeve-pro-bg)",
                  top: "176px",
                  left: "34px",
                  transform: "rotate(6deg)",
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxShadow: "0 8px 32px rgba(30,27,46,0.08)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--sleeve-pro-dark)",
                    opacity: 0.55,
                    margin: 0,
                  }}
                >
                  Pour un collègue
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--sleeve-pro-dark)",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  Un merci sincère
                </p>
              </div>

              {/* Carte 2 — milieu */}
              <div
                className="hero-card-mid"
                style={{
                  position: "absolute",
                  width: "224px",
                  height: "148px",
                  borderRadius: "20px",
                  backgroundColor: "var(--sleeve-aff-bg)",
                  top: "96px",
                  left: "14px",
                  transform: "rotate(-3deg)",
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxShadow: "0 10px 40px rgba(30,27,46,0.10)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--sleeve-aff-dark)",
                    opacity: 0.55,
                    margin: 0,
                  }}
                >
                  Juste parce que
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--sleeve-aff-dark)",
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  Tu penses à eux.
                </p>
              </div>

              {/* Carte 1 — premier plan */}
              <div
                className="hero-card-front"
                style={{
                  position: "absolute",
                  width: "236px",
                  height: "156px",
                  borderRadius: "20px",
                  backgroundColor: "var(--sleeve-festif-bg)",
                  top: "8px",
                  left: "22px",
                  transform: "rotate(1.5deg)",
                  padding: "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  boxShadow: "0 14px 56px rgba(30,27,46,0.12), 0 2px 8px rgba(30,27,46,0.06)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--sleeve-festif-dark)",
                    opacity: 0.55,
                    margin: 0,
                  }}
                >
                  Anniversaire
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "19px",
                    fontWeight: 800,
                    color: "var(--sleeve-festif-dark)",
                    lineHeight: 1.18,
                    margin: 0,
                  }}
                >
                  Ton message,<br />leur surprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
