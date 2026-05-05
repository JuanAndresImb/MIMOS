import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    titre: "1. Identification du vendeur",
    contenu: `MIMOS est une marque exploitée par une société de droit belge, dont le siège social est situé en Belgique. Pour toute question, tu peux nous contacter à hello@mimos.be.`,
  },
  {
    titre: "2. Produits",
    contenu: `Nos produits sont des douceurs artisanales belges (brownies et assimilés) préparées à la main, conditionnées dans un packaging personnalisé et livrées directement en boîte aux lettres. Les photos et descriptions sont données à titre indicatif.`,
  },
  {
    titre: "3. Commande",
    contenu: `La commande est effectuée en ligne sur mimos.be. Elle est définitive après confirmation du paiement. Tu reçois un email de confirmation à l'adresse fournie lors de la commande.`,
  },
  {
    titre: "4. Prix",
    contenu: `Les prix sont indiqués en euros, toutes taxes comprises (TVA belge applicable). La livraison est incluse dans le prix affiché pour les adresses en Belgique. Aucun frais caché.`,
  },
  {
    titre: "5. Paiement",
    contenu: `Le paiement est sécurisé via Mollie. Les moyens acceptés sont Bancontact, carte bancaire (Visa, Mastercard) et virement bancaire. Le paiement est débité au moment de la commande.`,
  },
  {
    titre: "6. Livraison",
    contenu: `La livraison est effectuée en Belgique uniquement, par bpost, directement en boîte aux lettres. Le délai moyen est de 2 à 4 jours ouvrables après la commande. Nous ne sommes pas responsables des retards imputables au transporteur.`,
  },
  {
    titre: "7. Droit de rétractation",
    contenu: `Conformément à la directive européenne 2011/83/UE, le droit de rétractation ne s'applique pas aux denrées alimentaires périssables. Nos brownies étant des produits alimentaires frais, les commandes ne peuvent pas être annulées ni remboursées une fois préparées.`,
  },
  {
    titre: "8. Allergènes",
    contenu: `Nos produits contiennent du gluten, des œufs, du lait et des fruits à coque. Ils sont fabriqués dans un atelier utilisant également des arachides et du soja. La liste complète des allergènes est affichée sur chaque fiche produit. En cas de doute, contacte-nous avant de commander.`,
  },
  {
    titre: "9. Réclamations",
    contenu: `En cas de problème avec ta commande (produit endommagé, non reçu, etc.), contacte-nous dans les 48h suivant la livraison à hello@mimos.be avec une photo si possible. Nous ferons notre possible pour trouver une solution rapide.`,
  },
  {
    titre: "10. Données personnelles",
    contenu: `Les données collectées lors de la commande sont traitées conformément à notre Politique de confidentialité, disponible sur mimos.be/politique-de-confidentialite.`,
  },
  {
    titre: "11. Droit applicable",
    contenu: `Les présentes conditions sont soumises au droit belge. En cas de litige, les tribunaux belges sont compétents.`,
  },
];

export default function CGVPage() {
  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      <section className="w-full py-20 md:py-28">
        <div className="max-w-[48rem] mx-auto px-6">
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Conditions générales de vente
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
