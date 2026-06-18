# Story 2.3 : Page d'accueil — hero & sections principales

## Status: done

## Story

En tant que **visiteur découvrant MIMOS pour la première fois**,
Je veux une page d'accueil qui exprime immédiatement la promesse "l'attention, manifestée" via un hero fort, un storytelling de marque et un accès direct aux occasions/produits,
Afin de comprendre en quelques secondes ce que MIMOS propose et d'être guidé vers le geste qui me correspond.

## Acceptance Criteria

- **AC1** — Hero plein écran asymétrique (58/40) : eyebrow, H1 "Pour quand un message ne suffit pas.", description, CTA nested "Choisir le moment →"
- **AC2** — Le hero présente 3 cards d'occasions empilées en flottement (festif/affectueux/pro), animées via CSS keyframes (`hero-card-front/mid/back`), `aria-hidden`
- **AC3** — Le hero applique un stagger d'entrée (`hero-line-1..4`) en CSS pur (Server Component, pas de `"use client"` requis)
- **AC4** — Bandeau de confiance (`TrustStrip`) avec 4 promesses : livraison directe, message personnalisé, rapidité, satisfaction garantie
- **AC5** — Carrousel d'occasions (`OccasionsCarousel`) avec cards double-bezel, eyebrow = nom de l'occasion, micro-CTA "Voir les formats →", header en scroll-reveal
- **AC6** — Section storytelling de marque (`BrandStory`) avec colonnes reveal décalées (stagger 120ms) et 3 stats produit-agnostic ("3 min", "48h", "1 message unique")
- **AC7** — Carrousel produits (`ProductCarousel`) affichant les **vrais produits** depuis la DB (prix, noms, descriptions), cards double-bezel à palette cyclique (festif/affectueux/pro)
- **AC8** — Section destinataire (`RecipientTeaser`) sur fond `--bleu` (cohérent avec le hero, pas de section dark isolée), layout asymétrique 2 colonnes, 3 "moments" en reveal
- **AC9** — Toutes les sections appliquent les dials MIMOS (DESIGN_VARIANCE 6, MOTION_INTENSITY 4, VISUAL_DENSITY 3) et respectent les tokens CSS (pas de hex hardcodés)
- **AC10** — Aucune violation Server/Client Component : les imports server-only (`@/lib/supabase/server`) ne fuient pas dans les Client Components

## Notes de développement

### Contexte (2026-06-09)
Refonte complète de la page d'accueil pour aligner les 6 sections sur les éléments taste-skill définis en §14 d'AGENTS.md (asymétrie, motion, haptic depth, double-bezel, nested CTA). La version précédente avait : hero centré symétrique avec eyebrow "Brownies artisanaux · Belgique", `RecipientTeaser` sur fond `--dark` (section sombre isolée — pattern banni), `TrustStrip` à 2 items, `BrandStory` avec stat "100% Fait à la main en Belgique".

### Architecture
- `ProductCarousel` : Server Component async (`getAllActiveProducts()`) délègue le rendu scroll au Client Component `ProductCarouselTrack` (props `products: Product[]`)
- `ProductCarouselTrack` : type `Product` défini localement depuis `@/lib/supabase/database.types` (pas via `@/lib/services/products`, qui importe `@/lib/supabase/server`) — évite la fuite server-only dans le bundle client
- `Reveal` (nouveau composant réutilisable `src/components/ui/Reveal.tsx`) : wrapper IntersectionObserver générique, props `delay`, `distance`, `threshold`
- Animations hero (stagger + float des cards) : keyframes CSS purs dans `globals.css` (`mimosFadeUp`, `mimosScaleIn`, `mimosFloat`, `mimosFloatSlow`, `mimosFloatSlower`) — pas de JS, donc `HeroFullscreen` reste un Server Component

### Design (taste-skill)
- DESIGN_VARIANCE: 6 — hero grid `58fr/42fr`, `RecipientTeaser` 2 colonnes asymétriques
- MOTION_INTENSITY: 4 — stagger CSS sur le hero, IntersectionObserver reveal sur les autres sections
- VISUAL_DENSITY: 3 — sections aérées, padding variable (72–96px)
- Double-bezel sur `OccasionsCarousel` et `ProductCarouselTrack` (outer `padding:8px` + `borderRadius:28px`, inner `calc(28px-8px)`)
- Toutes les sections sur fond clair (`--bleu` / `--bg-primary`) — aucune section dark isolée

## File List
- `src/app/globals.css` — keyframes hero (mimosFadeUp, mimosScaleIn, mimosFloat*)
- `src/components/ui/Reveal.tsx` — nouveau, composant scroll-reveal réutilisable
- `src/components/home/HeroFullscreen.tsx` — réécrit, hero asymétrique + cards flottantes
- `src/components/home/TrustStrip.tsx` — réécrit, 4 items
- `src/components/home/OccasionsCarousel.tsx` — réécrit, double-bezel + reveal header
- `src/components/home/BrandStory.tsx` — réécrit, reveal stagger + nouvelles stats
- `src/components/home/ProductCarousel.tsx` — réécrit, Server Component async (DB réelle)
- `src/components/home/ProductCarouselTrack.tsx` — nouveau, Client Component (scroll UI)
- `src/components/home/RecipientTeaser.tsx` — réécrit, fond `--bleu`, layout asymétrique
- `src/app/(public)/page.tsx` — metadata mise à jour ("L'attention, manifestée")

## Change Log
- 2026-06-09 : Refonte complète des 6 sections de la page d'accueil appliquant les éléments taste-skill (motion, haptic depth, asymétrie, typographie). Split Server/Client Component du carrousel produits pour utiliser les vraies données DB. Build vérifié (`npm run build` ✓), rendu vérifié via Chrome MCP.
