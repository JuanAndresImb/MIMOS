import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Comment ça marche — La Brownie Box Belge",
  description:
    "Offrir une brownie box artisanale belge en 3 étapes simples : choisissez l'occasion, écrivez votre message, on s'occupe du reste. Livraison directement en boîte aux lettres.",
};

// ─── Données ──────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: 1,
    icon: "🎁",
    titre: "Choisissez l'occasion",
    description:
      "Anniversaire, fêtes, surprise, collègue… Chaque occasion a son sleeve personnalisé. Sélectionnez celle qui correspond et découvrez le design dédié.",
  },
  {
    num: 2,
    icon: "✍️",
    titre: "Écrivez votre message",
    description:
      "Votre message est imprimé directement sur le sleeve de la box. Pas de carte séparée — le mot du cœur fait partie du cadeau lui-même.",
  },
  {
    num: 3,
    icon: "📬",
    titre: "On livre dans la boîte aux lettres",
    description:
      "Indiquez l'adresse du destinataire et c'est parti. La box est conçue pour rentrer dans une boîte aux lettres standard — pas besoin que quelqu'un soit présent.",
  },
];

const FAQS = [
  {
    question: "Est-ce que la box rentre vraiment dans une boîte aux lettres ?",
    answer:
      "Oui. Le format de la box a été pensé dès le départ pour rentrer dans une boîte aux lettres aux normes belges. Pas besoin que le destinataire soit là — c'est l'avantage.",
  },
  {
    question: "Combien de brownies y a-t-il dans la box ?",
    answer:
      "6 brownies artisanaux belges, préparés à la main avec du bon chocolat. Juste ce qu'il faut pour un vrai moment gourmand.",
  },
  {
    question: "Le destinataire sait-il qui envoie la box ?",
    answer:
      "Oui — votre prénom et votre message apparaissent sur le sleeve. C'est voulu : un cadeau anonyme n'a pas de valeur émotionnelle. Vous pouvez évidemment rester sobre si vous préférez.",
  },
  {
    question: "Est-ce que je peux envoyer une box à l'étranger ?",
    answer:
      "Pour l'instant, la livraison est disponible uniquement en Belgique. On travaille sur les envois vers la France et les Pays-Bas — restez à l'affût.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer:
      "La box est préparée dans les 1 à 2 jours ouvrables après la commande, puis expédiée par bpost. Comptez 2 à 4 jours ouvrables au total selon votre localisation en Belgique.",
  },
  {
    question: "Les brownies contiennent-ils des allergènes ?",
    answer:
      "Oui — les brownies contiennent du gluten, des œufs, du lait et des fruits à coque. Ils sont fabriqués dans un atelier qui utilise également des arachides et du soja. La liste complète est affichée sur chaque fiche produit.",
  },
  {
    question: "Est-ce que je peux commander plusieurs boxes à la fois ?",
    answer:
      "Pour des commandes multiples (équipes, entreprises), contactez-nous directement via la page Entreprises. Nous gérons les commandes groupées avec un sleeve personnalisé à vos couleurs si vous le souhaitez.",
  },
];

const ENGAGEMENTS = [
  {
    icon: "🇧🇪",
    titre: "100% artisanal belge",
    description: "Préparés à la main en Belgique, avec des ingrédients sourcés localement.",
  },
  {
    icon: "📦",
    titre: "Emballage boîte aux lettres",
    description: "Format conçu pour rentrer dans toute boîte aux lettres belge standard.",
  },
  {
    icon: "✉️",
    titre: "Message imprimé sur le sleeve",
    description: "Votre mot est intégré au packaging — pas de carte perdue ou oubliée.",
  },
  {
    icon: "🔒",
    titre: "Paiement sécurisé",
    description: "Paiement via Mollie — Bancontact, carte bancaire, virement.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommentCaMarchePage() {
  return (
    <>
      {/* Hero */}
      <section
        className="w-full py-16 md:py-24"
        style={{ backgroundColor: "var(--primary-50)" }}
        aria-labelledby="ccm-heading"
      >
        <div className="max-w-[48rem] mx-auto px-6 text-center">
          <span
            className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{
              fontFamily: "var(--font-label)",
              backgroundColor: "var(--primary-100)",
              color: "var(--primary-700)",
            }}
          >
            Simple comme bonjour
          </span>
          <h1
            id="ccm-heading"
            className="text-4xl md:text-5xl font-black leading-tight mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Offrir une brownie box en 3 étapes
          </h1>
          <p
            className="text-lg md:text-xl max-w-[36rem] mx-auto"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", lineHeight: 1.6 }}
          >
            Pas de déplacement, pas d'emballage à gérer, pas de carte à ne pas oublier.
            Juste un cadeau qui arrive directement chez le destinataire.
          </p>
        </div>
      </section>

      {/* Étapes */}
      <section
        className="w-full py-16 md:py-24"
        style={{ backgroundColor: "var(--bg-primary)" }}
        aria-labelledby="etapes-heading"
      >
        <div className="max-w-[56rem] mx-auto px-6">
          <h2 id="etapes-heading" className="sr-only">
            Les 3 étapes pour commander
          </h2>

          <ol className="flex flex-col gap-0" role="list">
            {STEPS.map((step, i) => (
              <li key={step.num} className="flex gap-6 md:gap-10">
                {/* Ligne verticale + numéro */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black shrink-0"
                    style={{
                      backgroundColor: "var(--primary-500)",
                      color: "white",
                      fontFamily: "var(--font-display)",
                    }}
                    aria-hidden
                  >
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="w-0.5 flex-1 my-2"
                      style={{ backgroundColor: "var(--primary-100)", minHeight: "48px" }}
                      aria-hidden
                    />
                  )}
                </div>

                {/* Contenu */}
                <div className="pb-10 pt-1 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl" aria-hidden>
                      {step.icon}
                    </span>
                    <h3
                      className="text-xl md:text-2xl font-black"
                      style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                    >
                      {step.titre}
                    </h3>
                  </div>
                  <p
                    className="text-base leading-relaxed max-w-[32rem]"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                  >
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* CTA */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/offrir/anniversaire"
              className="inline-flex items-center px-8 py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
              style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
            >
              Choisir une occasion
            </Link>
          </div>
        </div>
      </section>

      {/* Engagements */}
      <section
        className="w-full py-16 md:py-20"
        style={{ backgroundColor: "var(--bg-secondary)" }}
        aria-labelledby="engagements-heading"
      >
        <div className="max-w-[56rem] mx-auto px-6">
          <h2
            id="engagements-heading"
            className="text-2xl md:text-3xl font-black mb-10"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Ce qu&apos;on s&apos;engage à faire
          </h2>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            role="list"
          >
            {ENGAGEMENTS.map((e) => (
              <li
                key={e.titre}
                className="flex gap-4 rounded-2xl p-5"
                style={{ backgroundColor: "white", border: "1px solid var(--primary-100)" }}
              >
                <span className="text-2xl shrink-0 mt-0.5" aria-hidden>
                  {e.icon}
                </span>
                <div>
                  <h3
                    className="text-base font-bold mb-1"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                  >
                    {e.titre}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                  >
                    {e.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="w-full py-16 md:py-24"
        style={{ backgroundColor: "var(--bg-primary)" }}
        aria-labelledby="faq-heading"
      >
        <div className="max-w-[48rem] mx-auto px-6">
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-black mb-10"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Questions fréquentes
          </h2>

          <dl className="flex flex-col gap-6">
            {FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl p-5"
                style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--primary-100)" }}
              >
                <dt
                  className="text-base font-bold mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  {faq.question}
                </dt>
                <dd
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                >
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA final — dark */}
      <section
        className="w-full py-16 md:py-20"
        style={{ backgroundColor: "var(--dark)" }}
        aria-labelledby="cta-final-heading"
      >
        <div className="max-w-[48rem] mx-auto px-6 text-center">
          <h2
            id="cta-final-heading"
            className="text-3xl md:text-4xl font-black mb-4"
            style={{ fontFamily: "var(--font-display)", color: "white" }}
          >
            Prêt à faire plaisir ?
          </h2>
          <p
            className="text-base mb-8 max-w-[28rem] mx-auto"
            style={{ fontFamily: "var(--font-body)", color: "#e8e8e8", lineHeight: 1.6 }}
          >
            Choisissez l&apos;occasion, écrivez votre message, et laissez-nous livrer la douceur.
          </p>
          <Link
            href="/offrir/anniversaire"
            className="inline-flex items-center px-8 py-4 rounded-full text-[var(--dark)] font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dark)]"
            style={{ backgroundColor: "var(--primary-500)", color: "white", fontFamily: "var(--font-body)" }}
          >
            Choisir une occasion
          </Link>
        </div>
      </section>
    </>
  );
}
