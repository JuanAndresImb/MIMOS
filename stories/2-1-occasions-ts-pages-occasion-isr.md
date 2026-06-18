# Story 2.1 : occasions.ts — source de vérité + pages /offrir/[occasion] ISR

## Status: done

## Story

En tant que **visiteur cherchant un cadeau pour une occasion précise**,
Je veux naviguer vers une page dédiée à mon occasion (anniversaire, Noël, surprise, collègue, entreprise) avec le bon storytelling et les bons produits,
Afin de me sentir compris et d'être guidé vers le geste approprié.

## Acceptance Criteria

- **AC1** — `src/data/occasions.ts` est la **source de vérité unique** pour toutes les occasions : slug, nom, titre H1, accroche, sleeve, sleeveTokens, histoire, messageExemple, metaTitle, metaDescription, ordre, intention
- **AC2** — 5 occasions actives : `anniversaire`, `noel-fetes`, `surprise`, `collegue`, `entreprise`
- **AC3** — 3 types de sleeve mappés : `festif` (lavande), `affectueux` (saumon), `pro` (menthe) — tokens CSS exposés comme `var(--sleeve-[type]-bg/accent/dark)`
- **AC4** — Page `/offrir/[occasion]` en ISR (`revalidate = 3600`) avec `generateStaticParams()` — toutes les pages pré-rendues au build
- **AC5** — `generateMetadata()` injecte `metaTitle` + `metaDescription` par occasion
- **AC6** — Page affiche hero avec palette sleeve, section `histoire`, liste des produits actifs avec prix réels DB
- **AC7** — Si le slug n'existe pas → `notFound()` (404)
- **AC8** — 3 intentions groupant les occasions : `pour-une-personne`, `pour-un-collegue`, `pour-mon-equipe`

## Notes de développement

### Architecture
- `occasions.ts` : pas d'import Supabase, pas d'état async — pur TypeScript exportable côté client ET serveur
- `getOccasion(slug)` : helper qui retourne `Occasion | undefined`
- `OCCASION_SLUGS` : tableau readonly exporté pour `generateStaticParams()` et les type guards
- `INTENTIONS` : tableau exporté pour la nav groupée
- Sleeve tokens : définis dans `globals.css` comme CSS custom properties, mappés à partir de `SLEEVE_TOKENS` dans `occasions.ts`

### Règle importante
Ne **jamais** dupliquer les données d'occasion dans d'autres fichiers — toujours importer depuis `@/data/occasions`. Nouvelle occasion = ajouter ici uniquement.

## File List
- `src/data/occasions.ts` — source de vérité (nouveau)
- `src/app/(public)/offrir/[occasion]/page.tsx` — page ISR par occasion (nouveau)
- `src/app/(public)/offrir/page.tsx` — redirect ou listing général (nouveau)
- `src/app/globals.css` — CSS vars sleeve tokens (`--sleeve-festif-*`, `--sleeve-aff-*`, `--sleeve-pro-*`)

## Change Log
- 2026-04-10 : Story implémentée (pré-workflow story-files). Source de vérité + 5 occasions + pages ISR.
