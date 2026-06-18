# Story 2.4 : Page fiche produit avec allergènes

## Status: done

## Story

En tant qu'**acheteur potentiel**,
Je veux voir une fiche produit complète avec les détails, le storytelling du geste et les allergènes,
Afin de prendre ma décision d'achat en confiance et de comprendre ce que j'offre vraiment.

## Acceptance Criteria

- **AC1** — La fiche produit est accessible via `/produits/[id]?occasion=[slug]`
- **AC2** — Elle affiche : nom, prix (TVA + livraison incluses), description, image (double-bezel)
- **AC3** — Section "Le geste que vous créez" présente le message personnalisé et l'expérience destinataire (product-agnostic, pas de références hardcodées)
- **AC4** — Les 14 allergènes UE (Règl. 1169/2011) sont affichés de manière chaleureuse — ceux présents mis en évidence, disclaimer légal visible mais discret
- **AC5** — L'occasion (sleeve tokens, couleurs, nom) est résolue via `?occasion=` param ou première occasion du produit en fallback
- **AC6** — Lien "Voir les détails & allergènes" ajouté discrètement sur les cards de la page occasion `/offrir/[occasion]`
- **AC7** — Breadcrumb "← [Occasion]" en haut de page
- **AC8** — Si le produit appartient à plusieurs occasions, une section "Voir aussi pour" liste les autres

## Notes de développement

### Découverte (2026-06-08)
`ProductCard.tsx` et `AllergensList.tsx` existaient mais n'étaient jamais importés
sur aucune page publique — composants orphelins, allergènes invisibles pour les clients.
Les produits étaient affichés en cards pricing inline dans `/offrir/[occasion]`.

### Architecture
- `/produits/[id]/page.tsx` — Server Component, revalidate 3600s
- `ProductCard.tsx` — redesigné avec taste-skill (double-bezel image, layout asymétrique 55/45, storytelling "attention manifestée")
- `AllergensList.tsx` — présentation chaleureuse, heading "Ce que contient ce MIMOS"
- Occasion résolue côté serveur : `?occasion` param > `product.occasion_slugs[0]` > fallback `anniversaire`
- Product-agnostic : fonctionne pour tout produit présent ou futur, pas de "brownies" hardcodé

### Design (taste-skill)
- DESIGN_VARIANCE: 6 — asymétrie mesurée
- MOTION_INTENSITY: 4 — pas de JS, CSS uniquement
- VISUAL_DENSITY: 3 — aéré, respirant
- Double-bezel image : outer shell `p-2.5` + `rounded-[2rem]` bg sleeve, inner `rounded-[calc(2rem-10px)]`
- CTA : `rounded-full`, sleeve accent, icône `→` dans bulle blanche semi-transparente

## File List
- `src/app/(public)/produits/[id]/page.tsx` — nouvelle page
- `src/components/product/ProductCard.tsx` — redesigné
- `src/components/product/AllergensList.tsx` — warmified
- `src/app/(public)/offrir/[occasion]/page.tsx` — lien "Voir les détails & allergènes" ajouté

## Change Log
- 2026-06-08 : Story créée + implémentée. Découverte composants orphelins. Page `/produits/[id]` livrée.
