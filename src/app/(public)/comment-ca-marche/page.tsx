import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comment ça marche — MIMOS",
  description:
    "Trois minutes pour transformer une pensée en geste réel. Tu choisis le moment, tu écris quelques mots, on s'occupe du reste.",
};

const STEPS = [
  {
    num: 1,
    titre: "Tu choisis le moment",
    description:
      "Anniversaire, merci sincère, juste parce que… Chaque moment a le sien. Tu sélectionnes celui qui correspond à la personne que tu as en tête.",
  },
  {
    num: 2,
    titre: "Tu écris quelques mots",
    description:
      "Un message court, une phrase qui compte. Rien d'autre ne t'est demandé. C'est toi qui décides ce que tu veux dire.",
  },
  {
    num: 3,
    titre: "On s'occupe du reste",
    description:
      "La box est préparée à la main en Belgique, emballée avec soin, et livrée directement chez eux. Tu n'as rien à gérer.",
  },
];

const FAQS = [
  {
    question: "Combien de temps ça prend pour commander ?",
    answer:
      "En moyenne, trois minutes. Tu choisis le moment, tu écris ton message, tu indiques l'adresse. On s'occupe du reste.",
  },
  {
    question: "Combien de brownies y a-t-il dans la box ?",
    answer:
      "Selon le format : 6 brownies (Le Clin d'Œil), 9 brownies (L'Attention) ou 12 brownies (Le Grand Geste). Tous faits à la main en Belgique.",
  },
  {
    question: "Est-ce qu'on peut envoyer à l'étranger ?",
    answer:
      "Pour l'instant, la livraison est disponible uniquement en Belgique. On travaille sur les envois vers la France et les Pays-Bas.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer:
      "La box est préparée dans les 1 à 2 jours ouvrables, puis expédiée par bpost. Comptez 2 à 4 jours ouvrables au total.",
  },
  {
    question: "Les brownies contiennent-ils des allergènes ?",
    answer:
      "Oui — les brownies contiennent du gluten, des œufs, du lait et des fruits à coque. Fabriqués dans un atelier qui utilise également des arachides et du soja. La liste complète est disponible sur chaque fiche produit.",
  },
  {
    question: "Est-ce que je peux commander pour plusieurs personnes ?",
    answer:
      "Pour des commandes groupées — équipes, entreprises — contacte-nous via la page Entreprises. On gère les commandes en volume avec la même attention.",
  },
];

const ENGAGEMENTS = [
  {
    titre: "100% artisanal belge",
    description: "Préparés à la main en Belgique, avec des ingrédients soigneusement choisis.",
  },
  {
    titre: "Livraison soignée",
    description: "Emballé avec attention, expédié par bpost, livré directement chez le destinataire.",
  },
  {
    titre: "Un message qui accompagne",
    description: "Tu écris librement. Ton message fait partie du geste — pas une carte perdue.",
  },
  {
    titre: "Paiement sécurisé",
    description: "Via Mollie — Bancontact, carte bancaire, virement SEPA.",
  },
];

export default function CommentCaMarchePage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{ backgroundColor: "var(--bleu)", paddingTop: "80px", paddingBottom: "80px" }}
        aria-labelledby="ccm-heading"
      >
        <div className="mx-auto px-6 text-center" style={{ maxWidth: "640px" }}>
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
            En trois minutes
          </p>
          <h1
            id="ccm-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 700,
              color: "var(--dark)",
              lineHeight: 1.08,
              marginBottom: "24px",
            }}
          >
            On s&apos;occupe<br />du reste.
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
            Tu penses à quelqu&apos;un. Tu choisis le moment, tu écris quelques mots.
            On prépare, on emballe, on livre — directement chez eux.
          </p>
        </div>
      </section>

      {/* Étapes */}
      <section
        style={{ backgroundColor: "var(--bg-primary)", paddingTop: "80px", paddingBottom: "88px" }}
        aria-labelledby="etapes-heading"
      >
        <div className="mx-auto px-6" style={{ maxWidth: "56rem" }}>
          <h2 id="etapes-heading" className="sr-only">Les 3 étapes</h2>

          <ol style={{ display: "flex", flexDirection: "column" }} role="list">
            {STEPS.map((step, i) => (
              <li key={step.num} style={{ display: "flex", gap: "40px" }}>
                {/* Numéro + ligne verticale */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "var(--dark)",
                      color: "var(--chantilly)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontSize: "18px",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      style={{
                        width: "1px",
                        flex: 1,
                        margin: "8px 0",
                        backgroundColor: "var(--dark)",
                        opacity: 0.12,
                        minHeight: "48px",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Contenu */}
                <div style={{ paddingBottom: "48px", paddingTop: "4px", flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "var(--dark)",
                      lineHeight: 1.2,
                      marginBottom: "12px",
                    }}
                  >
                    {step.titre}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "16px",
                      fontWeight: 300,
                      lineHeight: 1.75,
                      color: "var(--dark)",
                      opacity: 0.65,
                      maxWidth: "32rem",
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            href="/offrir/anniversaire"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "15px 44px",
              borderRadius: "999px",
              backgroundColor: "var(--dark)",
              color: "var(--chantilly)",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
            className="hover:opacity-75 transition-opacity"
          >
            Choisir le moment
          </Link>
        </div>
      </section>

      {/* Engagements */}
      <section
        style={{ backgroundColor: "var(--lime)", paddingTop: "72px", paddingBottom: "80px" }}
        aria-labelledby="engagements-heading"
      >
        <div className="mx-auto px-6" style={{ maxWidth: "72rem" }}>
          <h2
            id="engagements-heading"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 700,
              color: "var(--dark)",
              lineHeight: 1.1,
              marginBottom: "48px",
            }}
          >
            Ce qu&apos;on s&apos;engage à faire
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ENGAGEMENTS.map((e) => (
              <div
                key={e.titre}
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "28px",
                  border: "1px solid rgba(30,27,46,0.07)",
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
                  {e.titre}
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
                  {e.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{ backgroundColor: "var(--bg-primary)", paddingTop: "72px", paddingBottom: "80px" }}
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
            {FAQS.map(({ question, answer }) => (
              <div key={question} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <dt
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--dark)",
                  }}
                >
                  {question}
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
                  {answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA final */}
      <section
        style={{ backgroundColor: "var(--dark)", paddingTop: "80px", paddingBottom: "88px" }}
        aria-labelledby="cta-final-heading"
      >
        <div className="mx-auto px-6 text-center" style={{ maxWidth: "560px" }}>
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
