# Story 2.2 : Navbar — dropdown par intention + sleeve preview

## Status: done

## Story

En tant que **visiteur sur le site MIMOS**,
Je veux une navigation claire qui m'aide à trouver rapidement l'occasion qui me correspond,
Afin de ne pas être perdu et d'accéder directement à la page produit pertinente.

## Acceptance Criteria

- **AC1** — Navbar fixe en haut, fond dynamique (transparent → opaque au scroll via `NavbarScrollBg.tsx`)
- **AC2** — Dropdown par "intention" (`pour-une-personne`, `pour-un-collegue`, `pour-mon-equipe`) groupant les occasions correspondantes
- **AC3** — Chaque entrée du dropdown affiche un aperçu de la couleur sleeve de l'occasion (dot coloré ou bande)
- **AC4** — Navigation mobile avec `MobileMenu.tsx` (overlay plein écran)
- **AC5** — `NavbarColorController.tsx` adapte la couleur du texte/logo navbar selon le fond de la page (sections claires vs bleu hero)
- **AC6** — Lien "Comment ça marche" et CTA "Offrir" visibles dans la nav principale
- **AC7** — Pas de référence à la typographie générique — Fraunces pour le logo, Outfit pour les liens

## Notes de développement

### Architecture
- `Navbar.tsx` : layout général, imports des sous-composants
- `NavDropdown.tsx` : dropdown desktop groupé par intention, sleeve preview via `sleeveTokens.bg`
- `NavDropdownAPropos.tsx` : dropdown secondaire "À propos / Comment ça marche"
- `NavbarScrollBg.tsx` : Client Component, IntersectionObserver sur le hero pour switcher le bg
- `NavbarColorController.tsx` : Client Component, gère la couleur du texte selon le contexte de page
- `MobileMenu.tsx` : Client Component, overlay mobile avec les mêmes groupements par intention

### Règle
La navbar consomme `INTENTIONS` et `OCCASIONS` depuis `@/data/occasions.ts` — pas de liste d'occasions hardcodée dans les composants nav.

## File List
- `src/components/navbar/Navbar.tsx`
- `src/components/navbar/NavDropdown.tsx`
- `src/components/navbar/NavDropdownAPropos.tsx`
- `src/components/navbar/NavbarColorController.tsx`
- `src/components/navbar/NavbarScrollBg.tsx`
- `src/components/navbar/MobileMenu.tsx`

## Change Log
- 2026-04-10 : Story implémentée (pré-workflow story-files). Navbar avec dropdown intentions + sleeve preview + mobile menu.
