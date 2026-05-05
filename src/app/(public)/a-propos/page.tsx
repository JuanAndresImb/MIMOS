import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos — MIMOS",
  description:
    "MIMOS est né d'une frustration simple : les gens pensent aux autres, mais la vie va trop vite. On a voulu créer le chemin le plus court entre une pensée et un geste.",
};

export default function AProposPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{ backgroundColor: "var(--lime)", paddingTop: "88px", paddingBottom: "96px" }}
        aria-labelledby="apropos-heading"
      >
        <div
          className="mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start"
          style={{ maxWidth: "72rem" }}
        >
          {/* Texte narratif */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 500,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--dark)",
                opacity: 0.4,
              }}
            >
              Pourquoi MIMOS existe
            </p>

            <h1
              id="apropos-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 700,
                color: "var(--dark)",
                lineHeight: 1.1,
              }}
            >
              Tu penses à eux.<br />
              Souvent.
            </h1>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                fontFamily: "var(--font-body)",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: 1.8,
                color: "var(--dark)",
                opacity: 0.72,
              }}
            >
              <p>
                Entre deux réunions. En voyant quelque chose qui leur ressemble.
                En entendant une chanson qu&apos;ils auraient aimée.
              </p>
              <p>
                Et puis tu continues. Parce que la vie va vite, et que
                &ldquo;je leur enverrai quelque chose&rdquo; reste une intention.
              </p>
              <p>
                MIMOS est né de cette frustration — et de la conviction qu&apos;une
                pensée mérite mieux qu&apos;un SMS.
              </p>
              <p>
                On a voulu créer le chemin le plus court entre une pensée et un
                geste. Quelque chose de vrai, fait à la main en Belgique, qui
                arrive chez eux avec tes mots.
              </p>
              <p style={{ fontWeight: 400 }}>
                Pas de logistique. Pas de déplacement.<br />
                Juste toi, eux — et trois minutes.
              </p>
            </div>
          </div>

          {/* Citation éditoriale */}
          <div
            style={{
              position: "sticky",
              top: "140px",
              display: "flex",
              flexDirection: "column",
              gap: "48px",
            }}
          >
            <blockquote
              style={{
                borderLeft: "2px solid var(--dark)",
                paddingLeft: "32px",
                margin: 0,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                  fontWeight: 700,
                  color: "var(--dark)",
                  lineHeight: 1.2,
                }}
              >
                &ldquo;Une pensée mérite
                mieux qu&apos;un SMS.&rdquo;
              </p>
            </blockquote>

            {/* Chiffres */}
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {[
                { chiffre: "3 min", label: "De l'envie au geste" },
                { chiffre: "48h",   label: "Et c'est chez eux" },
                { chiffre: "100%",  label: "Fait à la main en Belgique" },
              ].map(({ chiffre, label }) => (
                <li
                  key={label}
                  style={{ display: "flex", alignItems: "baseline", gap: "16px" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "var(--dark)",
                      minWidth: "64px",
                    }}
                  >
                    {chiffre}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "14px",
                      fontWeight: 300,
                      color: "var(--dark)",
                      opacity: 0.6,
                    }}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section valeurs */}
      <section
        style={{ backgroundColor: "var(--bg-primary)", paddingTop: "80px", paddingBottom: "88px" }}
        aria-labelledby="valeurs-heading"
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
              opacity: 0.4,
              marginBottom: "20px",
            }}
          >
            Ce qu&apos;on croit
          </p>
          <h2
            id="valeurs-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 700,
              color: "var(--dark)",
              lineHeight: 1.1,
              marginBottom: "48px",
            }}
          >
            Trois convictions,<br />une marque.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                titre: "Un geste vaut mille mots.",
                texte:
                  "Un SMS disparaît dans la journée. Un geste physique, lui, reste. Sur une étagère, dans un souvenir — longtemps après.",
              },
              {
                titre: "La simplicité est une marque de respect.",
                texte:
                  "Ton temps est précieux. Offrir quelque chose de vrai ne devrait pas prendre une heure. Trois minutes, c'est le maximum qu'on s'autorise à te demander.",
              },
              {
                titre: "L'artisanat belge mérite d'être partagé.",
                texte:
                  "On a grandi avec le chocolat. On est convaincus que ce qu'on fait ici, à la main, avec de bons ingrédients, a quelque chose que rien d'autre n'a.",
              },
            ].map(({ titre, texte }) => (
              <div
                key={titre}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  paddingTop: "28px",
                  borderTop: "1.5px solid rgba(30,27,46,0.1)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--dark)",
                    lineHeight: 1.25,
                  }}
                >
                  {titre}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 300,
                    lineHeight: 1.75,
                    color: "var(--dark)",
                    opacity: 0.65,
                  }}
                >
                  {texte}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section
        style={{ backgroundColor: "var(--dark)", paddingTop: "80px", paddingBottom: "88px" }}
        aria-labelledby="cta-apropos-heading"
      >
        <div className="mx-auto px-6 text-center" style={{ maxWidth: "560px" }}>
          <h2
            id="cta-apropos-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Tu as quelqu&apos;un en tête ?
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              fontWeight: 300,
              lineHeight: 1.7,
              color: "white",
              opacity: 0.6,
              marginBottom: "44px",
            }}
          >
            C&apos;est déjà assez.<br />
            On s&apos;occupe du reste.
          </p>
          <Link
            href="/offrir/anniversaire"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "15px 44px",
              borderRadius: "999px",
              backgroundColor: "var(--cantaloupe)",
              color: "var(--dark)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
            className="hover:opacity-80 transition-opacity"
          >
            Choisir le moment
          </Link>
        </div>
      </section>
    </>
  );
}
