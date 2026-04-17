// src/messages/fr.ts
// SOURCE DE VÉRITÉ pour toutes les strings utilisateur — zéro string hardcodée dans le code
// Architecture i18n prête pour NL/EN en Phase 2 : ajouter messages/nl.ts et messages/en.ts

const messages = {
  // Navigation
  nav: {
    occasions: "Occasions",
    entreprises: "Entreprises",
    commander: "Commander",
    menu: "Menu",
    fermer: "Fermer le menu",
  },

  // Occasions
  occasions: {
    titre: "Choisissez votre occasion",
    anniversaire: "Anniversaire",
    noelFetes: "Noël & Fêtes",
    surprise: "Juste parce que",
    collegue: "Collègue",
    entreprise: "Entreprise",
  },

  // Tunnel d'achat
  tunnel: {
    etapes: {
      occasion: "Occasion",
      message: "Message",
      livraison: "Livraison",
      paiement: "Paiement",
    },
    message: {
      titre: "Votre message personnalisé",
      placeholder:
        "Écrivez votre message ici… il sera imprimé sur le sleeve de la box.",
      compteur: "{count}/{max} caractères",
      apercu: "Aperçu du sleeve",
    },
    livraison: {
      titre: "Adresse de livraison",
      prenom: "Prénom",
      nom: "Nom",
      adresse: "Adresse",
      complementAdresse: "Complément d'adresse",
      codePostal: "Code postal",
      ville: "Ville",
      pays: "Pays",
    },
    paiement: {
      titre: "Paiement",
      codePromo: "Code promo",
      appliquer: "Appliquer",
      total: "Total",
      fraisLivraison: "Frais de livraison",
      payer: "Payer maintenant",
      securise: "Paiement sécurisé via Mollie",
    },
    boutons: {
      suivant: "Suivant",
      precedent: "Précédent",
      commander: "Commander",
    },
  },

  // Confirmation commande
  confirmation: {
    titre: "Commande confirmée !",
    sousTitre: "Merci pour votre commande.",
    description:
      "Vous recevrez une confirmation par email sous peu. Votre box sera préparée avec soin.",
    retourAccueil: "Retour à l'accueil",
  },

  // Page destinataire
  destinataire: {
    titre: "Vous avez reçu une surprise !",
    de: "De la part de",
    cta: "Commander à mon tour",
    partager: "Partager",
    codePromo: "Profitez de {discount} sur votre première commande",
  },

  // B2B
  b2b: {
    titre: "Commandes entreprise",
    sousTitre: "Pour vos équipes, clients et partenaires",
    formulaire: {
      nomEntreprise: "Nom de l'entreprise",
      numeroTva: "Numéro de TVA",
      nombreBoxes: "Nombre de boxes",
      messageCommun: "Message commun",
      submit: "Demander un devis",
    },
  },

  // Admin
  admin: {
    connexion: {
      titre: "Connexion",
      email: "Email",
      motDePasse: "Mot de passe",
      seConnecter: "Se connecter",
      erreur: "Email ou mot de passe incorrect",
    },
    dashboard: {
      titre: "Dashboard",
      commandes: "Commandes",
      produits: "Produits",
      clients: "Clients",
      codesPromo: "Codes promo",
      factures: "Factures",
    },
    commandes: {
      titre: "Commandes",
      statuts: {
        pending: "En attente",
        paid: "Payée",
        preparing: "En préparation",
        shipped: "Expédiée",
        delivered: "Livrée",
        cancelled: "Annulée",
      },
    },
    produits: {
      titre: "Produits",
      ajouter: "Ajouter un produit",
      modifier: "Modifier",
      supprimer: "Supprimer",
      stock: "Stock",
      prix: "Prix",
      actif: "Actif",
    },
  },

  // Erreurs
  erreurs: {
    stockEpuise: "Ce produit est actuellement en rupture de stock.",
    codePromoInvalide: "Ce code promo est invalide ou expiré.",
    codePromoDejaUtilise: "Ce code promo a déjà été utilisé.",
    erreurPaiement: "Une erreur est survenue lors du paiement. Veuillez réessayer.",
    erreurGenerale:
      "Une erreur inattendue s'est produite. Veuillez réessayer.",
    champObligatoire: "Ce champ est obligatoire.",
    emailInvalide: "Adresse email invalide.",
    tvaInvalide: "Numéro de TVA belge invalide.",
  },

  // Mentions légales & conformité
  legal: {
    cgv: "Conditions générales de vente",
    mentionsLegales: "Mentions légales",
    politiqueRetour: "Politique de retour",
    rgpd: "Politique de confidentialité",
    consentementCookies:
      "Ce site utilise des cookies pour améliorer votre expérience.",
    accepter: "Accepter",
    refuser: "Refuser",
  },

  // Allergènes
  allergenes: {
    titre: "Allergènes",
    liste: {
      gluten: "Gluten",
      oeufs: "Œufs",
      lait: "Lait",
      noix: "Fruits à coque",
      soja: "Soja",
      arachides: "Arachides",
    },
    avertissement: "Fabriqué dans un atelier utilisant des {allergenes}.",
  },

  // Accessibilité
  a11y: {
    ouvrirMenu: "Ouvrir le menu de navigation",
    fermerMenu: "Fermer le menu de navigation",
    imageProduit: "Photo de {produit}",
    chargement: "Chargement en cours…",
    etapeActive: "Étape {numero} sur {total} : {nom}",
  },
} as const;

export default messages;
export type Messages = typeof messages;
