import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nos douceurs — MIMOS",
  description:
    "Trois formats de brownies artisanaux belges, faits à la main. Pour chaque moment, une attention qui compte vraiment.",
};

/* ── Gammes ────────────────────────────────────────────────────── */
const GAMMES = [
  {
    id: "clin-doeil",
    nom: "Le Clin d'Œil",
    quantite: "6 brownies",
    prix: "€24,99",
    accroche: "Pour le geste qui compte, même quand on ne sait pas quoi dire.",
    pourQui: ["Un merci spontané", "Une pensée inattendue", "Juste parce que"],
    bg: "var(--haze)",
    badge: null,
    href: "/offrir/surprise",
  },
  {
    id: "attention",
    nom: "L'Attention",
    quantite: "9 brownies",
    prix: "€29,99",
    accroche: "Le classique. Celui qui ne déçoit jamais, et qu'on n'oublie pas.",
    pourQui: ["Un anniversaire", "Une bonne nouvelle", "Un merci du cœur"],
    bg: "var(--cantaloupe)",
    badge: "Le plus offert",
    href: "/offrir/anniversaire",
  },
  {
    id: "grand-geste",
    nom: "Le Grand Geste",
    quantite: "12 brownies",
    prix: "€39,99",
    accroche: "Pour les moments qui méritent plus qu'un simple message.",
    pourQui: ["Une grande occasion", "Une équipe à remercier", "Une célébration"],
    bg: "var(--gumdrop)",
    badge: null,
    href: "/offrir/entreprise",
  },
] as const;

/* ── Mapping occasion × gamme ──────────────────────────────────── */
const MOMENTS = [
  {
    moment: "Un anniversaire",
    recommandation: "L'Attention",
    raison: "Le format juste — assez pour que ce soit une vraie surprise.",
  },
  {
    moment: "Un merci sincère",
    recommandation: "Le Clin d'Œil",
    raison: "Simple, généreux, sans en faire trop. Exactement ce qu'il faut.",
  },
  {
    moment: "Une naissance",
    recommandation: "L'Attention",
    raison: "Pour célébrer le nouveau venu avec quelque chose de doux.",
  },
  {
    moment: "Noël & les fêtes",
    recommandation: "Le Grand Geste",
    raison: "12 brownies à partager en famille ou entre amis.",
  },
  {
    moment: "Toute une équipe",
    recommandation: "Le Grand Geste",
    raison: "Pour que tout le monde se sente considéré, sans exception.",
  },
  {
    moment: "Juste parce que",
    recommandation: "Le Clin d'Œil",
    raison: "Parce que les petites attentions sans raison sont souvent les plus belles.",
  },
];

/* ── FAQ ───────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "Comment choisir entre les trois formats ?",
    r: "C'est surtout une question d'intention. Le Clin d'Œil, c'est pour un geste spontané. L'Attention, pour une vraie occasion. Le Grand Geste, pour les moments ou les équipes qui le méritent.",
  },
  {
    q: "Est-ce qu'on peut écrire ce qu'on veut comme message ?",
    r: "Oui — lors de la commande, tu peux y ajouter un message personnalisé. Il accompagne ton envoi et donne à ton geste toute sa valeur.",
  },
  {
    q: "Combien de temps les brownies se conservent-ils ?",
    r: "5 à 7 jours après réception, à température ambiante. On te conseille de le préciser si tu envoies à quelqu'un qui part en voyage.",
  },
];

export default function NosDouceursPage() {
  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--cantaloupe)", paddingTop: "72px", paddingBottom: "72px" }}
        aria-labelledby="nos-douceurs-heading"
      >
        <div
          className="mx-auto px-6 text-center"
          style={{ maxWidth: "640px" }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 500,
              fontStyle: "italic",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--dark)",
              opacity: 0.45,
              marginBottom: "20px",
            }}
          >
            Nos douceurs
          </p>
          <h1
            id="nos-douceurs-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "var(--dark)",
              lineHeight: 1.08,
              marginBottom: "24px",
            }}
          >
            Trois formats.<br />Une seule promesse.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "17px",
              fontWeight: 300,
              lineHeight: 1.75,
              color: "var(--dark)",
              opacity: 0.65,
            }}
          >
            Des brownies artisanaux belges, faits à la main. Emballés avec soin.
            Livrés directement chez eux.
          </p>
        </div>
      </section>

      {/* ── 2. Les 3 gammes ──────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--bg-primary)", paddingTop: "80px", paddingBottom: "88px" }}
        aria-labelledby="gammes-heading"
      >
        <div className="mx-auto px-6" style={{ maxWidth: "72rem" }}>
          <h2 id="gammes-heading" className="sr-only">Nos gammes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GAMMES.map((g) => (
              <div
                key={g.id}
                className="flex flex-col rounded-3xl overflow-hidden"
                style={{ backgroundColor: g.bg }}
              >
                {/* Badge */}
                <div style={{ minHeight: "32px", padding: "12px 28px 0" }}>
                  {g.badge && (
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--dark)",
                        backgroundColor: "white",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        opacity: 0.85,
                      }}
                    >
                      {g.badge}
                    </span>
                  )}
                </div>

                {/* Contenu */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px 28px 32px",
                    gap: "20px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "24px",
                        fontWeight: 700,
                        color: "var(--dark)",
                        lineHeight: 1.15,
                      }}
                    >
                      {g.nom}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        fontWeight: 400,
                        color: "var(--dark)",
                        opacity: 0.5,
                      }}
                    >
                      {g.quantite}
                    </p>
                  </div>

                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      fontWeight: 300,
                      lineHeight: 1.7,
                      color: "var(--dark)",
                      opacity: 0.75,
                    }}
                  >
                    {g.accroche}
                  </p>

                  {/* Pour qui */}
                  <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {g.pourQui.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "var(--dark)",
                          opacity: 0.65,
                        }}
                      >
                        <span
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor: "var(--dark)",
                            opacity: 0.4,
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Prix + CTA */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "var(--dark)",
                      }}
                    >
                      {g.prix}
                    </span>
                    <Link
                      href={g.href}
                      className="hover:opacity-75 transition-opacity"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 20px",
                        borderRadius: "999px",
                        backgroundColor: "var(--dark)",
                        color: "white",
                        fontFamily: "var(--font-body)",
                        fontSize: "13px",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      Choisir
                      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Ce qu'ils découvrent ──────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--haze)", paddingTop: "72px", paddingBottom: "80px" }}
        aria-labelledby="contenu-heading"
      >
        <div
          className="mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center"
          style={{ maxWidth: "72rem" }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 500,
                fontStyle: "italic",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--dark)",
                opacity: 0.45,
                marginBottom: "16px",
              }}
            >
              À l&apos;ouverture
            </p>
            <h2
              id="contenu-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                fontWeight: 700,
                color: "var(--dark)",
                lineHeight: 1.1,
                marginBottom: "32px",
              }}
            >
              Ce qu&apos;ils<br />découvrent.
            </h2>
            <ul style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                {
                  titre: "Des brownies faits à la main",
                  desc: "Cuits en Belgique, avec des ingrédients soigneusement choisis. On goûte la différence.",
                },
                {
                  titre: "Un emballage qui fait son effet",
                  desc: "Chaque détail compte. La box arrive dans un état qui donne envie de l'ouvrir lentement.",
                },
                {
                  titre: "Livré directement chez eux",
                  desc: "Pas besoin que quelqu'un soit là. Ça arrive, et ça fait son effet.",
                },
              ].map(({ titre, desc }) => (
                <li key={titre} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--dark)",
                    }}
                  >
                    {titre}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "15px",
                      fontWeight: 300,
                      lineHeight: 1.65,
                      color: "var(--dark)",
                      opacity: 0.65,
                    }}
                  >
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Citation éditoriale — B&W style */}
          <blockquote
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                fontWeight: 700,
                color: "var(--dark)",
                lineHeight: 1.2,
              }}
            >
              &ldquo;Un colis qu&apos;on n&apos;attendait pas.
              Un brownie qu&apos;on n&apos;oublie pas.&rdquo;
            </p>
            <footer
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 400,
                fontStyle: "italic",
                color: "var(--dark)",
                opacity: 0.45,
              }}
            >
              — L&apos;idée derrière MIMOS
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── 4. Pour quel moment ? ────────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--bg-primary)", paddingTop: "72px", paddingBottom: "80px" }}
        aria-labelledby="moments-heading"
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
                letterSpacing: "0.12em",
                color: "var(--text-secondary)",
                marginBottom: "12px",
              }}
            >
              Le bon format au bon moment
            </p>
            <h2
              id="moments-heading"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
                fontWeight: 700,
                color: "var(--dark)",
                lineHeight: 1.1,
              }}
            >
              Quelle douceur pour quel moment ?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOMENTS.map(({ moment, recommandation, raison }) => (
              <div
                key={moment}
                style={{
                  backgroundColor: "var(--chantilly)",
                  border: "1px solid rgba(30,27,46,0.07)",
                  borderRadius: "16px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "var(--text-secondary)",
                  }}
                >
                  {moment}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--dark)",
                  }}
                >
                  {recommandation}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    fontWeight: 300,
                    lineHeight: 1.6,
                    color: "var(--dark)",
                    opacity: 0.6,
                  }}
                >
                  {raison}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Mini FAQ ──────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--lime)", paddingTop: "64px", paddingBottom: "72px" }}
        aria-labelledby="faq-heading"
      >
        <div className="mx-auto px-6" style={{ maxWidth: "680px" }}>
          <h2
            id="faq-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
              fontWeight: 700,
              color: "var(--dark)",
              lineHeight: 1.1,
              marginBottom: "40px",
            }}
          >
            Questions fréquentes
          </h2>
          <dl style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
            {FAQ.map(({ q, r }) => (
              <div key={q} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <dt
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--dark)",
                  }}
                >
                  {q}
                </dt>
                <dd
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: "var(--dark)",
                    opacity: 0.65,
                    margin: 0,
                  }}
                >
                  {r}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 6. CTA final ─────────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "var(--dark)", paddingTop: "80px", paddingBottom: "88px" }}
        aria-labelledby="cta-final-heading"
      >
        <div
          className="mx-auto px-6 text-center"
          style={{ maxWidth: "560px" }}
        >
          <h2
            id="cta-final-heading"
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
            Choisis l&apos;occasion, écris ton message.<br />
            On s&apos;occupe du reste.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/offrir/anniversaire"
              className="hover:opacity-80 transition-opacity"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 36px",
                borderRadius: "999px",
                backgroundColor: "var(--cantaloupe)",
                color: "var(--dark)",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Voir les occasions
            </Link>
            <Link
              href="/comment-ca-marche"
              className="hover:opacity-80 transition-opacity"
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 400,
                fontStyle: "italic",
                color: "white",
                opacity: 0.55,
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              Comment ça marche ?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
