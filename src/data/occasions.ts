// Source de vérité unique pour les occasions — ne jamais dupliquer ces données ailleurs
// Nouvelle occasion = ajouter un slug ici, page SEO générée automatiquement

export type OccasionSlug =
  | "anniversaire"
  | "noel-fetes"
  | "surprise"
  | "collegue"
  | "entreprise";

export type SleeveType = "festif" | "affectueux" | "pro";

export interface SleeveTokens {
  bg: string;    // CSS custom property, ex: var(--sleeve-festif-bg)
  accent: string; // CSS custom property, ex: var(--sleeve-festif-accent)
  dark: string;  // CSS custom property, ex: var(--sleeve-festif-dark)
}

export interface Occasion {
  slug: OccasionSlug;
  /** Nom court — utilisé dans la nav et les badges */
  nom: string;
  /** Titre H1 page occasion */
  titre: string;
  /** Accroche courte sous le titre */
  accroche: string;
  sleeve: SleeveType;
  sleeveTokens: SleeveTokens;
  /** Exemple de message pré-rempli dans le tunnel */
  messageExemple: string;
  metaTitle: string;
  metaDescription: string;
  /** Ordre d'affichage dans la nav et les listings */
  ordre: number;
}

const SLEEVE_TOKENS: Record<SleeveType, SleeveTokens> = {
  festif: {
    bg: "var(--sleeve-festif-bg)",
    accent: "var(--sleeve-festif-accent)",
    dark: "var(--sleeve-festif-dark)",
  },
  affectueux: {
    bg: "var(--sleeve-aff-bg)",
    accent: "var(--sleeve-aff-accent)",
    dark: "var(--sleeve-aff-dark)",
  },
  pro: {
    bg: "var(--sleeve-pro-bg)",
    accent: "var(--sleeve-pro-accent)",
    dark: "var(--sleeve-pro-dark)",
  },
};

export const OCCASIONS: Record<OccasionSlug, Occasion> = {
  anniversaire: {
    slug: "anniversaire",
    nom: "Anniversaire",
    titre: "Une brownie box pour un anniversaire",
    accroche: "Le cadeau qui arrive par la boîte aux lettres, au bon moment.",
    sleeve: "festif",
    sleeveTokens: SLEEVE_TOKENS.festif,
    messageExemple:
      "Joyeux anniversaire ! 🎂 Cette box est rien que pour toi. Profites-en bien !",
    metaTitle: "Brownie box anniversaire — La Brownie Box Belge",
    metaDescription:
      "Offrez une brownie box artisanale belge pour un anniversaire. Livrée directement dans la boîte aux lettres avec un sleeve festif et votre message personnalisé.",
    ordre: 1,
  },

  "noel-fetes": {
    slug: "noel-fetes",
    nom: "Noël & Fêtes",
    titre: "Une brownie box pour les fêtes",
    accroche: "Un cadeau gourmand qui arrive avant les fêtes, directement chez eux.",
    sleeve: "festif",
    sleeveTokens: SLEEVE_TOKENS.festif,
    messageExemple:
      "Joyeuses fêtes ! 🎄 Un peu de douceur belge pour démarrer la saison comme il se doit.",
    metaTitle: "Brownie box Noël et fêtes — La Brownie Box Belge",
    metaDescription:
      "Offrez une brownie box artisanale belge pour Noël ou les fêtes de fin d'année. Sleeve festif, message personnalisé, livraison boîte aux lettres en Belgique.",
    ordre: 2,
  },

  surprise: {
    slug: "surprise",
    nom: "Juste parce que",
    titre: "Une brownie box juste parce que",
    accroche: "Parce que certains jours méritent une attention sans occasion particulière.",
    sleeve: "affectueux",
    sleeveTokens: SLEEVE_TOKENS.affectueux,
    messageExemple:
      "Je pensais à toi 💛 Pas besoin d'occasion — tu le méritais, c'est tout.",
    metaTitle: "Brownie box surprise — La Brownie Box Belge",
    metaDescription:
      "Offrez une brownie box artisanale belge sans occasion particulière. Parce que parfois, un petit geste inattendu est le plus beau des cadeaux.",
    ordre: 3,
  },

  collegue: {
    slug: "collegue",
    nom: "Collègue / Merci",
    titre: "Une brownie box pour un collègue ou dire merci",
    accroche: "Un merci qui marque les esprits sans dépasser le budget.",
    sleeve: "affectueux",
    sleeveTokens: SLEEVE_TOKENS.affectueux,
    messageExemple:
      "Merci pour tout ! 🙏 Ce petit geste gourmand pour te dire à quel point ton aide a compté.",
    metaTitle: "Brownie box collègue et merci — La Brownie Box Belge",
    metaDescription:
      "Offrez une brownie box artisanale belge à un collègue ou pour remercier quelqu'un. Livrée directement dans sa boîte aux lettres avec votre message.",
    ordre: 4,
  },

  entreprise: {
    slug: "entreprise",
    nom: "Équipe & Entreprise",
    titre: "Des brownie boxes pour votre équipe",
    accroche: "La reconnaissance d'équipe qui n'a pas l'air d'un catalogue corporate.",
    sleeve: "pro",
    sleeveTokens: SLEEVE_TOKENS.pro,
    messageExemple:
      "Merci pour votre travail cette année. Cette box est notre façon de célébrer ce qu'on a accompli ensemble.",
    metaTitle: "Brownie box entreprise et équipe — La Brownie Box Belge",
    metaDescription:
      "Brownie boxes artisanales belges pour vos équipes, onboardings et événements clients. Sleeve professionnel, commandes groupées disponibles.",
    ordre: 5,
  },
} as const;

/** Liste ordonnée — pour la nav, les listings, etc. */
export const OCCASIONS_LIST: Occasion[] = Object.values(OCCASIONS).sort(
  (a, b) => a.ordre - b.ordre
);

/** Slugs valides — pour `generateStaticParams` et la validation */
export const OCCASION_SLUGS = Object.keys(OCCASIONS) as OccasionSlug[];

export function getOccasion(slug: string): Occasion | undefined {
  return OCCASIONS[slug as OccasionSlug];
}
