import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    titre: "1. Qui sommes-nous ?",
    contenu: `MIMOS est une marque belge proposant des douceurs artisanales livrées en boîte aux lettres. Le responsable du traitement des données est Juan Imbaquingo, joignable à hello@mimos.be.`,
  },
  {
    titre: "2. Données collectées",
    contenu: `Lors d'une commande, nous collectons : ton prénom et nom, l'adresse email, l'adresse de livraison du destinataire, et les données de paiement (traitées directement par Mollie — nous n'avons pas accès à tes données bancaires). Si tu crées un compte, nous conservons aussi ton historique de commandes.`,
  },
  {
    titre: "3. Pourquoi nous collectons ces données",
    contenu: `Tes données sont utilisées exclusivement pour : traiter et livrer ta commande, t'envoyer les confirmations et mises à jour de livraison, gérer ton compte si tu en crées un, respecter nos obligations légales (facturation, TVA).`,
  },
  {
    titre: "4. Base légale",
    contenu: `Le traitement est fondé sur l'exécution du contrat (la commande) et nos obligations légales. Nous ne traitons aucune donnée à des fins marketing sans ton consentement explicite.`,
  },
  {
    titre: "5. Partage des données",
    contenu: `Nous partageons certaines données avec nos prestataires de confiance : Mollie (paiement), bpost (livraison), Resend (emails transactionnels), Supabase (base de données hébergée en Europe), Vercel (hébergement). Ces prestataires traitent les données uniquement pour exécuter leurs services.`,
  },
  {
    titre: "6. Durée de conservation",
    contenu: `Les données de commande sont conservées 7 ans (obligation comptable belge). Les données de compte sont supprimées sur demande. Les données de livraison sont anonymisées 3 ans après la dernière commande.`,
  },
  {
    titre: "7. Tes droits",
    contenu: `Conformément au RGPD, tu as le droit d'accéder à tes données, de les rectifier, de les supprimer, de t'opposer à leur traitement et de les exporter. Pour exercer ces droits : hello@mimos.be. Tu peux aussi introduire une réclamation auprès de l'Autorité de protection des données belge (autoriteprotectiondonnees.be).`,
  },
  {
    titre: "8. Cookies",
    contenu: `Nous utilisons uniquement les cookies strictement nécessaires au fonctionnement du site (session, préférence de langue). Nous n'utilisons pas de cookies publicitaires ou de tracking tiers.`,
  },
  {
    titre: "9. Sécurité",
    contenu: `Nous appliquons des mesures techniques adaptées pour protéger tes données : connexions HTTPS, base de données sécurisée, accès restreints. Aucun système n'est infaillible, mais nous prenons la sécurité au sérieux.`,
  },
  {
    titre: "10. Contact",
    contenu: `Pour toute question relative à tes données personnelles : hello@mimos.be`,
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      <section className="w-full py-20 md:py-28">
        <div className="max-w-[48rem] mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Politique de confidentialité
          </h1>
          <p
            className="text-base mb-16"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Dernière mise à jour : avril 2026
          </p>

          <div className="flex flex-col gap-10">
            {SECTIONS.map((s) => (
              <div key={s.titre}>
                <h2
                  className="text-lg font-bold mb-3"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
                >
                  {s.titre}
                </h2>
                <p
                  className="text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
                >
                  {s.contenu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
