import Link from "next/link";
import type { Metadata } from "next";
import { OCCASIONS } from "@/data/occasions";

export const metadata: Metadata = {
  title: "Des attentions pour ton équipe — MIMOS",
  description:
    "Brownies artisanaux belges pour tes équipes, onboardings et cadeaux clients. Un geste sincère, livré directement chez eux.",
};

const occasion = OCCASIONS.entreprise;

const AVANTAGES = [
  {
    titre: "Un message personnel",
    texte:
      "Un message qui vient de vous — pas d'un catalogue. Court, sincère, mémorable.",
  },
  {
    titre: "Livraison directe",
    texte:
      "Expédié directement chez le destinataire. Vous n'avez rien à gérer logistiquement.",
  },
  {
    titre: "Facture avec TVA",
    texte:
      "Renseignez votre numéro de TVA à la commande et recevez une facture déductible.",
  },
  {
    titre: "Artisanal & belge",
    texte:
      "Brownies faits à la main en Belgique. Un cadeau qui sort vraiment du lot.",
  },
];

const USECASES = [
  "Onboarding d'un nouveau collaborateur",
  "Remerciement de fin de projet",
  "Cadeau client après signature",
  "Anniversaire d'un membre de l'équipe",
  "Célébration d'un objectif atteint",
];

export default function EntreprisePage() {
  return (
    <div style={{ backgroundColor: "var(--bg-secondary)" }}>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="mx-auto text-center" style={{ maxWidth: "48rem" }}>
          <span
            className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-6"
            style={{
              fontFamily: "var(--font-label)",
              backgroundColor: occasion.sleeveTokens.bg,
              color: occasion.sleeveTokens.accent,
            }}
          >
            Équipe & Entreprise
          </span>
          <h1
            className="text-4xl md:text-5xl font-black mb-6 leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            La reconnaissance d&apos;équipe qui n&apos;a pas l&apos;air d&apos;un catalogue corporate.
          </h1>
          <p
            className="text-lg mb-10"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", maxWidth: "36rem", margin: "0 auto 2.5rem" }}
          >
            Une brownie box artisanale belge avec votre message, expédiée directement
            chez le destinataire. Simple, mémorable, déductible.
          </p>
          <Link
            href="/commander?occasion=entreprise"
            className="inline-flex items-center px-8 py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
            style={{ backgroundColor: occasion.sleeveTokens.accent, fontFamily: "var(--font-body)" }}
          >
            Commander pour mon équipe
          </Link>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 px-6">
        <div className="mx-auto" style={{ maxWidth: "56rem" }}>
          <p
            className="text-xs uppercase tracking-widest text-center mb-10"
            style={{ fontFamily: "var(--font-label)", color: "var(--primary-500)" }}
          >
            Ce qui fait la différence
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {AVANTAGES.map((a) => (
              <div
                key={a.titre}
                className="rounded-2xl p-6"
                style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
              >
                <h3
                  className="text-base font-black mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  {a.titre}
                </h3>
                <p
                  className="text-sm"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                >
                  {a.texte}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16 px-6">
        <div className="mx-auto" style={{ maxWidth: "42rem" }}>
          <div
            className="rounded-3xl p-8"
            style={{ backgroundColor: occasion.sleeveTokens.bg, border: `1px solid ${occasion.sleeveTokens.accent}30` }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-6"
              style={{ fontFamily: "var(--font-label)", color: occasion.sleeveTokens.accent }}
            >
              Parfait pour…
            </p>
            <ul className="flex flex-col gap-3">
              {USECASES.map((uc) => (
                <li key={uc} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 text-sm"
                    style={{ color: occasion.sleeveTokens.accent }}
                  >
                    ✓
                  </span>
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
                  >
                    {uc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA bas */}
      <section className="py-20 px-6 text-center">
        <div className="mx-auto" style={{ maxWidth: "36rem" }}>
          <h2
            className="text-3xl font-black mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Prêt à marquer le coup ?
          </h2>
          <p
            className="text-base mb-8"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Tarifs dégressifs à partir de 10 unités · Facture TVA sur demande
          </p>
          <Link
            href="/commander?occasion=entreprise"
            className="inline-flex items-center px-8 py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
            style={{ backgroundColor: occasion.sleeveTokens.accent, fontFamily: "var(--font-body)" }}
          >
            Commander maintenant
          </Link>
        </div>
      </section>

    </div>
  );
}
