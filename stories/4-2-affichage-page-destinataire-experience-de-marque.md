# Story 4.2 : Affichage page destinataire & expérience de marque

## Status: done

## Story

En tant que **destinataire**,
Je veux voir le message que l'expéditeur m'a écrit sur une page à mon nom,
Afin de vivre pleinement le moment de surprise et de me sentir valorisé.

## Acceptance Criteria

- **AC1** — La page affiche le prénom du destinataire, le nom de l'expéditeur et le message complet
- **AC2** — Le header utilise les tokens de l'occasion (bg clair en fond, accent pour décoration)
- **AC3** — La couleur vive (accent) est réservée au CTA — le corps de page utilise les tons clairs
- **AC4** — Le message est affiché en Fraunces avec l'univers de marque
- **AC5** — La page ne requiert pas de compte ni d'inscription
- **AC6** — La page est responsive mobile-first
- **AC7** — *(ajout)* Expérience full-screen immersive : aucune navbar ni footer, bouton X pour quitter
- **AC8** — *(ajout)* Animations scroll progressives pour révéler chaque section

## Tasks/Subtasks

- [x] Task 1 : Migration — ajouter `recipient_first_name` à `recipient_pages`
  - [x] 1.1 — Créer migration SQL (`20260415000002_recipient_first_name.sql`)
  - [x] 1.2 — Mettre à jour la génération dans le webhook Mollie (extraire `delivery_address.prenom`)

- [x] Task 2 : UI de marque sur `/destinataire/[token]`
  - [x] 2.1 — Récupérer `recipient_first_name` dans la query Supabase
  - [x] 2.2 — Header : fond `sleeveTokens.bg`, accent sur titre et CTA
  - [x] 2.3 — Affichage prénom destinataire + nom expéditeur + message
  - [x] 2.4 — Responsive mobile-first

- [x] Task 3 : Redesign immersif (2026-05-04)
  - [x] 3.1 — Créer route group `(gift)` avec layout minimal (pas de navbar/footer)
  - [x] 3.2 — Déplacer `destinataire/[token]` vers `(gift)` (supprimer de `(public)`)
  - [x] 3.3 — Créer `DestinataireImmersif.tsx` — expérience plein écran 3 sections
  - [x] 3.4 — Bouton X fixe (glassmorphism) → retour à `/`
  - [x] 3.5 — Section 1 Hero : ghost text parallax, cercles décoratifs CSS, fade-in staggeré
  - [x] 3.6 — Section 2 Message : carte avec border accent, ombre colorée, IntersectionObserver reveals
  - [x] 3.7 — Section 3 CTA/Promo : animation gift-stamp, CTA fond foncé
  - [x] 3.8 — `OCCASION_COPY` map : textes personnalisés par slug d'occasion

- [x] Task 4 : Mettre à jour sprint-status.yaml

## Dev Notes

### Architecture (version finale 2026-05-04)

- **Route group** : `src/app/(gift)/destinataire/[token]/` — layout = `<>{children}</>` (aucune chrome)
- **Server component** (`page.tsx`) : fetch `recipient_pages` + promo code logic (inchangé)
- **Client component** (`DestinataireImmersif.tsx`) : animations, scroll reveals, sections

### Technique d'animation
- Ghost/outline text : `webkit-text-stroke: 2px color; color: transparent`
- Parallax : `window.scrollY` via `useEffect` scroll listener sur `useRef`
- Scroll reveals : `IntersectionObserver` via composant `Reveal`
- Keyframes CSS : `gift-bounce` (scroll arrow), `gift-stamp` (promo card apparition)
- GSAP installé mais pas encore utilisé (future amélioration ScrollTrigger)

### Section 1 — Hero (100svh)
- Fond : `sleeveTokens.bg`
- Texte fantôme parallax (nom du destinataire, défilement lent)
- Cercles décoratifs purement CSS (pas d'images)
- Stagger fade-in : delays 80 / 360 / 620 / 900ms
- Bouton X : `position: fixed; top: 24px; right: 24px; backdrop-filter: blur(8px)`

### Section 2 — Message (100svh)
- Fond blanc (contraste lecture)
- Nom du destinataire fantôme (coin bas-droite, décoratif)
- Carte message : `border-left: 5px solid accent`, `box-shadow` colorée, guillemet `"` en accent

### Section 3 — CTA/Promo (70svh)
- Fond : `sleeveTokens.bg` (symétrie avec hero)
- Code promo : animation `gift-stamp` à l'entrée
- CTA : fond `var(--text-primary)`, lien discret "Retour à MIMOS"

### Tokens par occasion (sleeveTokens dans occasions.ts)
- noel-fetes / saint-valentin : bg blush rose, accent rouge festif
- anniversaire : bg pêche, accent orange chaleureux
- naissance-bebe : bg bleu ciel, accent bleu doux
- remerciements : bg menthe, accent vert

## Dev Agent Record

### Completion Notes

**Version initiale (2026-04-15)**
- Implémentation dans `(public)/destinataire/[token]/page.tsx`
- Header avec `sleeveTokens.bg`, message en Nunito 900 → Fraunces
- Tokens legacy : festif `#ffe3e3/#ff6b6b` | affectueux `#fff8e8/#fdcb6e` | pro `#e8faf6/#00b894`

**Version immersive (2026-05-04)**
- Route group `(gift)` créé → plus de navbar ni footer sur la page destinataire
- `DestinataireImmersif.tsx` — 3 sections plein écran avec animations CSS + IntersectionObserver
- Bouton X glassmorphism fixe (top-right)
- Ghost text parallax en Section 1
- Reveal staggeré en Section 2 pour les éléments du message
- Promo card avec animation `gift-stamp` en Section 3
- `OCCASION_COPY` map pour textes personnalisés par occasion

## File List

**Migrations**
- `supabase/migrations/20260415000002_recipient_first_name.sql`

**Route group (gift)**
- `src/app/(gift)/layout.tsx` — nouveau : layout minimal `<>{children}</>`
- `src/app/(gift)/destinataire/[token]/page.tsx` — Server Component (déplacé de `(public)`)
- `src/app/(gift)/destinataire/[token]/DestinataireImmersif.tsx` — nouveau : Client Component immersif

**Supprimés**
- `src/app/(public)/destinataire/` — supprimé entièrement (conflit de routes)

**Modifiés**
- `src/app/api/webhooks/mollie/route.ts` — extraction `delivery_address.prenom` → `recipient_first_name`
- `src/lib/supabase/database.types.ts` — régénéré après migration

## Change Log

- 2026-04-15 : Migration `recipient_first_name`, UI de marque avec tokens sleeve par occasion, message en Fraunces, CTA "Offrir à mon tour"
- 2026-05-04 : Redesign complet — route group `(gift)`, `DestinataireImmersif` 3 sections, scroll animations CSS + IntersectionObserver, bouton X glassmorphism, ghost text parallax, animation promo `gift-stamp`, `OCCASION_COPY` map personnalisé par occasion
