// Source de vérité unique pour les occasions — ne jamais dupliquer ces données ailleurs
// Nouvelle occasion = ajouter un slug ici, page SEO générée automatiquement

export type OccasionSlug =
  | "anniversaire"
  | "noel-fetes"
  | "surprise"
  | "collegue"
  | "entreprise";

export type IntentionSlug =
  | "pour-une-personne"
  | "pour-un-collegue"
  | "pour-mon-equipe";

export type SleeveType = "festif" | "affectueux" | "pro";

export interface SleeveTokens {
  bg: string;
  accent: string;
  dark: string;
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
  /** Paragraphe émotionnel — page occasion, entre hero et formats */
  histoire: string;
  /** Exemple de message pré-rempli dans le tunnel */
  messageExemple: string;
  metaTitle: string;
  metaDescription: string;
  /** Ordre d'affichage dans la nav et les listings */
  ordre: number;
  /** Intention parente pour le groupement nav */
  intention: IntentionSlug;
}

export interface Intention {
  slug: IntentionSlug;
  /** Clé i18n nav — ex: nav.pourUnePersonne */
  labelKey: string;
  occasions: OccasionSlug[];
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
    titre: "Pour quelqu'un qui vient de souffler ses bougies.",
    accroche: "Ton message, leur surprise. Une journée dont ils vont se souvenir.",
    histoire:
      "C'est ce genre de journée où les gens font semblant de ne pas vouloir qu'on s'en souvienne — mais où un geste inattendu peut tout changer. Pas besoin d'un grand discours. Juste quelque chose de fait à la main, livré chez eux, avec tes mots.",
    sleeve: "festif",
    sleeveTokens: SLEEVE_TOKENS.festif,
    messageExemple:
      "Joyeux anniversaire ! Cette box est rien que pour toi. Profites-en bien !",
    metaTitle: "Brownie artisanal pour anniversaire — MIMOS",
    metaDescription:
      "Envoie une attention gourmande artisanale belge pour un anniversaire. Livrée directement chez eux avec ton message personnalisé.",
    ordre: 1,
    intention: "pour-une-personne",
  },

  "noel-fetes": {
    slug: "noel-fetes",
    nom: "Noël & Fêtes",
    titre: "Pour les fêtes qui méritent plus qu'une carte.",
    accroche: "Un geste gourmand avant les fêtes — livré directement chez eux, soigneusement.",
    histoire:
      "Avant que les fêtes ne deviennent une liste de choses à faire — un geste simple, sincère, qui arrive chez eux sans que tu aies à te déplacer. Quelque chose de fait à la main, qui sent le vrai, pas le catalogue.",
    sleeve: "festif",
    sleeveTokens: SLEEVE_TOKENS.festif,
    messageExemple:
      "Joyeuses fêtes ! Un peu de douceur belge pour démarrer la saison comme il se doit.",
    metaTitle: "Brownie artisanal Noël & Fêtes — MIMOS",
    metaDescription:
      "Envoie une attention gourmande artisanale belge pour Noël ou les fêtes. Message personnalisé, livraison soignée en Belgique.",
    ordre: 2,
    intention: "pour-une-personne",
  },

  surprise: {
    slug: "surprise",
    nom: "Juste parce que",
    titre: "Pour quelqu'un à qui tu penses en ce moment.",
    accroche: "Parce que certains jours méritent une attention sans occasion particulière.",
    histoire:
      "Les meilleurs cadeaux arrivent sans raison. Celui-là, tu l'as eu en tête depuis ce matin — en voyant quelque chose qui leur ressemble, ou juste parce. C'est justement ce genre de geste qu'on n'oublie pas.",
    sleeve: "affectueux",
    sleeveTokens: SLEEVE_TOKENS.affectueux,
    messageExemple:
      "Je pensais à toi. Pas besoin d'occasion — tu le méritais, c'est tout.",
    metaTitle: "Douceur surprise — juste parce que",
    metaDescription:
      "Envoie une attention gourmande artisanale belge sans occasion particulière. Parce que parfois, un geste inattendu est le plus beau.",
    ordre: 3,
    intention: "pour-une-personne",
  },

  collegue: {
    slug: "collegue",
    nom: "Collègue / Merci",
    titre: "Pour dire merci comme il se doit.",
    accroche: "Un merci qui marque les esprits sans dépasser le budget.",
    histoire:
      "Il y a les \"merci\" qu'on dit dans un couloir, et ceux qu'on reçoit et qu'on garde. Ce geste a une adresse, il arrive chez eux — et il dit bien plus que ce que les mots auraient pu.",
    sleeve: "affectueux",
    sleeveTokens: SLEEVE_TOKENS.affectueux,
    messageExemple:
      "Merci pour tout. Ce petit geste pour te dire à quel point ton aide a compté.",
    metaTitle: "Brownie artisanal pour un collègue ou dire merci — MIMOS",
    metaDescription:
      "Envoie une attention gourmande artisanale belge à un collègue ou pour remercier quelqu'un. Livrée directement chez eux avec ton message personnalisé.",
    ordre: 4,
    intention: "pour-un-collegue",
  },

  entreprise: {
    slug: "entreprise",
    nom: "Équipe & Entreprise",
    titre: "Pour toute une équipe qui le mérite.",
    accroche: "La reconnaissance d'équipe qui n'a pas l'air d'un catalogue corporate.",
    histoire:
      "Reconnaître quelqu'un par son prénom, pas son poste — c'est ce qui distingue une bonne entreprise d'une grande. Une box par personne, livrée directement chez eux, avec un message qui vient vraiment de toi.",
    sleeve: "pro",
    sleeveTokens: SLEEVE_TOKENS.pro,
    messageExemple:
      "Merci pour votre travail cette année. Cette box est notre façon de célébrer ce qu'on a accompli ensemble.",
    metaTitle: "Brownies artisanaux pour ton équipe & entreprise — MIMOS",
    metaDescription:
      "Attentions gourmandes artisanales belges pour tes équipes, onboardings et cadeaux clients. Message personnalisé, commandes groupées disponibles.",
    ordre: 5,
    intention: "pour-mon-equipe",
  },
} as const;

/** Groupement par intention — pour la navigation "Pour qui ?" */
export const INTENTIONS: Intention[] = [
  {
    slug: "pour-une-personne",
    labelKey: "pourUnePersonne",
    occasions: ["anniversaire", "noel-fetes", "surprise"],
  },
  {
    slug: "pour-un-collegue",
    labelKey: "pourUneEquipe",
    occasions: ["collegue"],
  },
  {
    slug: "pour-mon-equipe",
    labelKey: "equipeEntreprise",
    occasions: ["entreprise"],
  },
];

/** Liste ordonnée — pour la nav, les listings, etc. */
export const OCCASIONS_LIST: Occasion[] = Object.values(OCCASIONS).sort(
  (a, b) => a.ordre - b.ordre
);

/** Slugs valides — pour `generateStaticParams` et la validation */
export const OCCASION_SLUGS = Object.keys(OCCASIONS) as OccasionSlug[];

export function getOccasion(slug: string): Occasion | undefined {
  return OCCASIONS[slug as OccasionSlug];
}
