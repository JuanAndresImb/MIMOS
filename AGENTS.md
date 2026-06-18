<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# MIMOS — Project Context for AI Agents

> Last updated: 2026-06-08

## 1. Project Identity

| Field | Value |
|-------|-------|
| Brand name | **MIMOS** (formerly "La Brownie Box Belge") |
| Concept | **"Marque d'attention manifestée"** — les gens veulent montrer qu'ils pensent aux autres même si la vie va trop vite. MIMOS matérialise ce geste : "3 clicks pour dire Je pense à toi". Produit de départ : brownies artisanaux belges envoyés avec message personnalisé imprimé. Plateforme extensible à d'autres produits (brownies ou non). |
| Storytelling | Images parlent d'elles-mêmes pour l'artisanal et les sleeves. Pas d'accent latino explicite. Pas de mascottes. Pas d'argument "belge" ou "artisanal" en copy — c'est visuel et implicite. Le fil conducteur est toujours l'**émotion du geste** et **l'expérience du destinataire**. |
| Repo | `brownie-box-belge` (historical name, keep as-is) |
| Package manager | **pnpm** (never use npm or yarn) |
| Dev server | `pnpm dev` → `http://localhost:3000` |
| DB dev | **Supabase Cloud** `xonliijpkalycvozzqob` — EU West (Ireland) — **pas de Docker** |
| DB prod | Supabase Cloud `zfigulucdisedfntcfba` — São Paulo (à migrer EU avant launch) |

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router (TypeScript) |
| Styling | CSS custom properties (design tokens) — no Tailwind utility classes for layout; Tailwind used sparingly for flex/grid helpers |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (admin-only) |
| Payments | Mollie |
| Email | Resend + React Email |
| State | Zustand (tunnel d'achat) |
| Animations | CSS keyframes + IntersectionObserver (main); GSAP installed but not yet wired up |
| Monitoring | Sentry |
| Deploy | Vercel |
| Testing | Playwright |

---

## 3. Route Architecture

```
src/app/
├── (public)/          # Standard layout (navbar + footer)
│   ├── page.tsx                  # Homepage
│   ├── offrir/[occasion]/        # Occasion landing page
│   ├── commander/                # Checkout tunnel (multi-step)
│   ├── nos-douceurs/             # Product catalogue
│   ├── confirmation/[id]/        # Order confirmation
│   └── compte/                   # Client account (post-purchase)
│
├── (gift)/            # IMMERSIVE layout — NO navbar, NO footer
│   └── destinataire/[token]/     # Recipient gift page (full-screen experience)
│       ├── page.tsx              # Server component (Supabase fetch + promo logic)
│       └── DestinataireImmersif.tsx  # Client component (animations, sections)
│
├── (admin)/           # Admin dashboard (protected)
│   └── admin/
│       ├── commandes/            # Order management
│       ├── produits/             # Product/stock management
│       ├── codes-promo/          # Promo code management
│       ├── metriques/            # Dashboard metrics
│       ├── rgpd/                 # RGPD anonymisation manuelle
│       ├── parametres/           # Webhook settings
│       └── factures/             # CSV export factures (GET /api/admin/export/factures)
│
└── api/
    ├── webhooks/mollie/          # Payment webhook → creates recipient_pages
    └── webhooks/bpost/           # Shipping webhook → marks delivered
```

### Route Group Rules
- `(public)` → uses `src/app/(public)/layout.tsx` which wraps `<Navbar>` + `<Footer>`
- `(gift)` → uses `src/app/(gift)/layout.tsx` which returns `<>{children}</>` — pure immersion, no chrome
- `(admin)` → protected by Supabase Auth middleware

---

## 4. Design System

### 4.1 CSS Custom Properties (globals.css)

```css
/* Typography — injected by next/font via layout.tsx */
--font-display: P22 Mackinac Pro   /* H1, titres émotionnels, cartes message */
--font-body:    Outfit              /* Body, labels, boutons, eyebrows */
--font-label:   Caveat              /* via var(--font-handwriting) — accents décoratifs */

/* Palette MIMOS — pastels doux */
--chantilly:  #FFFDFE   /* Branco — fond global et cards */
--cantaloupe: #FFD8DD   /* Strawberry Blonde */
--haze:       #CFC7FA   /* Lilás */
--lime:       #FBF6BC   /* Jasmine — sections réassurance */
--lavande:    #CFC7FA   /* festif bg */
--saumon:     #F8B6A8   /* affectueux bg */
--menthe:     #A5E7CB   /* pro bg */

/* Sémantiques */
--primary-500: #6D65B0  /* lilas (WCAG AA 4.65:1 sur blanc) */
--primary-700: #5550A0  /* hover */
--bg-primary:  var(--chantilly) = #FFFDFE
--bg-secondary: var(--haze) = #CFC7FA
--text-primary: #1a1a1a
--dark:         #1E1B2E  /* indigo sombre — couleur principale texte/fonds */
```

### 4.2 Système Sleeve — Occasions (src/data/occasions.ts)

Les `sleeveTokens: { bg, accent, dark }` sont définis par **type de sleeve**, pas par occasion.
Les 5 occasions actives se répartissent ainsi :

| Sleeve type | Occasions | bg | accent | dark |
|---|---|---|---|---|
| `festif` | `anniversaire`, `noel-fetes` | `#CFC7FA` (lavande) | `#6D65B0` | `#3D3880` |
| `affectueux` | `surprise`, `collegue` | `#F8B6A8` (saumon) | `#C07868` | `#7A4535` |
| `pro` | `entreprise` | `#A5E7CB` (menthe) | `#3D9A72` | `#2D6B50` |

Les tokens sont exposés via `SLEEVE_TOKENS` et résolus en CSS vars (`var(--sleeve-festif-bg)`, etc.).
**Ne jamais hardcoder ces hex** — toujours lire depuis `occasion.sleeveTokens.*`.

### 4.3 Typography Conventions
- `var(--font-display)` = P22 Mackinac Pro → H1, titres émotionnels, carte message
- `var(--font-body)` = Outfit → body, labels, boutons, eyebrows
- `var(--font-label)` = Caveat → accents décoratifs uniquement
- Eyebrow style: `font-size: 12px; font-weight: 500; font-style: italic; text-transform: uppercase; letter-spacing: 0.15em`
- Ghost/outline text: `WebkitTextStroke: 1.5px [color]; color: transparent` (DestinataireImmersif parallax)

---

## 5. Key Files Map

### Data & Services
```
src/data/occasions.ts           # Occasion definitions: tokens, copy, slugs, histoire, accroche
src/lib/services/products.ts    # getAllActiveProducts(), getProductById()
src/lib/supabase/server.ts      # createClient() for Server Components
src/lib/supabase/admin.ts       # createAdminClient() for privileged ops
src/lib/supabase/database.types.ts  # Generated Supabase types
src/lib/utils.ts                # formatPriceCents(), etc.
```

### Tunnel d'achat
```
src/app/(public)/commander/page.tsx         # Entry: resolves occasion + product, passes to TunnelClient
src/app/(public)/commander/TunnelClient.tsx # Multi-step form (Zustand): message → address → review → pay
src/store/tunnelStore.ts                    # Zustand store for checkout state
src/actions/orders.ts                       # Server Actions: createOrder, validatePromoCode
src/actions/admin.ts                        # Server Actions: updateOrderStatus (ships → tracking email)
src/actions/emails.ts                       # sendShippingNotificationEmail, sendOrderConfirmation
```

### Page Destinataire (Immersive)
```
src/app/(gift)/destinataire/[token]/page.tsx              # Server: fetch recipient_page, generate promo
src/app/(gift)/destinataire/[token]/DestinataireImmersif.tsx  # Client: 3-section immersive experience
```

### Webhooks
```
src/app/api/webhooks/mollie/route.ts   # Mollie payment → creates order + recipient_page
src/app/api/webhooks/bpost/route.ts    # bpost delivery events → marks order delivered (HMAC-SHA256)
```

### Emails (React Email)
```
src/emails/OrderConfirmation.tsx
src/emails/ShippingNotification.tsx    # Header vert bpost, CTA "Suivre mon colis"
```

---

## 6. Database Schema (key tables)

```sql
orders               -- Main order table (status: pending|paid|preparing|shipped|delivered|cancelled)
recipient_pages      -- One per order: token, message, promo_code_id, first_viewed_at, anonymized_at
promo_codes          -- type: 'recipient' (10% off for gift recipient), 'manual'
products             -- name, price_cents, stock, is_active
occasion_slugs       -- Embedded in occasions.ts, not in DB
```

### Recipient Page Flow
1. Mollie webhook fires on payment → creates `recipient_page` with unique token
2. Recipient visits `/destinataire/[token]`
3. Server: if first visit → generate promo code `BIENV-{token[0:8]}` (10%, 3 months), link to page
4. Server: mark `first_viewed_at`
5. CRON: anonymize pages older than 90 days (RGPD)

---

## 7. DestinataireImmersif — Architecture

Full-screen 3-section immersive experience (CSS + IntersectionObserver, no heavy deps):

### Section 1 — Hero (100svh)
- Background: `sleeveTokens.bg`
- Ghost/parallax text: recipient name in outline style, moves with `scrollY * 0.35`
- Decorative CSS circles (no images)
- Staggered fade-in: eyebrow → "Pour {name}" → sender → scroll arrow
- Animations: `HeroFade` component, delays 80/360/620/900ms
- Fixed X button (top-right, glassmorphism): returns to `/`

### Section 2 — Message (100svh)
- White background for readability contrast
- Ghost recipient name bottom-right (outline, decorative)
- `Reveal` components: scroll-triggered via IntersectionObserver
- Message card: white bg, `border-left: 5px solid accent`, colorful `box-shadow`, large `"` quote mark in accent

### Section 3 — CTA & Promo (70svh)
- Background: `sleeveTokens.bg` (mirrors hero)
- Ghost sender name centered (decorative)
- Promo code card: `gift-stamp` CSS animation on enter
- CTA button: dark bg (`tokens.dark`)
- Soft "Retour à MIMOS" link

### Occasion Copy (`OCCASION_COPY` map)
Each occasion slug maps to `{ eyebrow, intro, ghost }` — personalized for the emotional context.

---

## 8. Occasion Pages — /offrir/[occasion]

### Hero
- `sleeveTokens.bg` background
- Eyebrow: `occasion.nom` (muted)
- H1: `occasion.titre`
- Accroche: `occasion.accroche`
- Histoire: `occasion.histoire` (emotional paragraph — no "sleeve" or "brownies" wording)
- Trust strip: 3 items with accent-colored bullet dots

### Format Selection
- 3-card grid (from `getAllActiveProducts()`)
- Middle card: `sleeveTokens.bg` + accent border + "Le plus offert" badge
- Side cards: `--chantilly` bg + ghost border
- Prices in `sleeveTokens.accent`
- CTAs → `/commander?occasion={slug}&product={id}`
- Fallback "Bientôt disponible" when no products (no 404)

### Reassurance
- `var(--lime)` background
- Section borders: `2px solid sleeveTokens.accent`

---

## 9. Commander Tunnel — Key Design Decisions

- Page background: `sleeveTokens.bg` (occasion-specific, not monochrome)
- `StepIndicator` uses `accent` prop → active/done steps in occasion accent color
- Preview box: white bg + `1.5px solid {accent}22` border (subtle)
- Copy avoids "sleeve" — uses "message" and occasion-specific emotional language
- `?product=id` pre-selects format; `?occasion=slug` required; redirects to `/offrir/{slug}` if missing

---

## 10. Development Conventions

### Do
- Use **pnpm** for all package installs: `pnpm add [pkg]`
- Use **Server Components** for data fetching, pass data down as props
- Use `createClient()` for read queries in Server Components
- Use `createAdminClient()` for privileged writes (promo generation, page updates)
- Use CSS custom properties (`var(--xxx)`) for all colors — never hardcode
- Use `occasion.sleeveTokens.accent` for brand-colored UI elements
- Check `stock <= 0` before rendering purchase CTAs
- All admin routes check auth via middleware

### Don't
- Never use `npm install` — use `pnpm add`
- Never import from `@/app/(public)/destinataire` — that route was deleted; use `(gift)` group
- Never add navbar/footer logic to `(gift)/layout.tsx`
- Never hardcode the promo code prefix — it's `BIENV-{token.slice(0,8).toUpperCase()}`
- Never skip HMAC-SHA256 validation in bpost webhook

---

## 11. MCP Tools Available

| Tool | Purpose |
|------|---------|
| 21st.dev Magic | UI component generation/inspiration (`mcp__magic__*`) |
| Figma | Design context, screenshots, variables |
| Chrome DevTools | Browser automation, screenshots |
| Notion | Project notes |
| Gmail | Email drafts |

---

## 12. Sprint Context

See `sprint-status.yaml` for full epic/story tracking.

**Current focus** (2026-06-09): Refonte page d'accueil livrée (story 2-3). Nouvelles features post-MVP — tracking bpost natif, reset password, email bienvenue (done).

**Epics complétés :** 1 (Fondations), 2 (Catalogue), 3 (Tunnel), 4 (Destinataire), 5 (Notifications), 6 (B2B), 7 (Admin dashboard)

**Features livrées hors epic (2026-06-08) :**
- Tracking bpost natif dans `/compte` : table `shipping_events`, webhook updated, `ShippingTimeline.tsx`
- Reset password : `/compte/mot-de-passe-oublie` + `/compte/reinitialiser-mot-de-passe`
- Email de bienvenue : `Welcome.tsx` template, `sendWelcomeEmail()`, hooké dans `signUpAfterPurchase`

**Refonte page d'accueil (2026-06-09) — story `2-3-page-daccueil-hero-sections-principales` :**
- Les 6 sections de `/` réécrites en appliquant les éléments taste-skill (asymétrie, motion, haptic depth) : `HeroFullscreen`, `TrustStrip`, `OccasionsCarousel`, `BrandStory`, `ProductCarousel`, `RecipientTeaser`
- Nouveau composant réutilisable `src/components/ui/Reveal.tsx` (scroll-reveal IntersectionObserver, props `delay`/`distance`/`threshold`)
- `ProductCarousel` désormais Server Component async branché sur `getAllActiveProducts()` (vrais produits/prix DB), délègue l'UI scroll à `ProductCarouselTrack` (Client Component)
- `RecipientTeaser` déplacé de `--dark` (section isolée) vers `--bleu` — plus de section sombre isolée sur la home
- Keyframes hero (`mimosFadeUp`, `mimosFloat*`) ajoutées dans `globals.css`, hero reste un Server Component (stagger 100% CSS)

**Résumé des changements structurels majeurs :**
- Route group `(gift)` → layout immersif sans navbar/footer (`/destinataire/[token]`)
- `DestinataireImmersif` : 3 sections CSS (hero parallax, message card, promo CTA)
- `occasions.ts` refactorisé : 5 slugs actifs, système 3 sleeves, champs `histoire` + `intention`
- Tunnel d'achat : bg occasion-specific, `StepIndicator` avec `accent` prop
- Admin Epic 7 complet : commandes, produits, codes-promo, métriques, RGPD, paramètres
- GSAP installé mais non utilisé — animations via CSS keyframes + IntersectionObserver

---

## 13. Pre-Production Checklist

See `memory/project_production_checklist.md` for full list. Key items:
- Remove `Bash(*)` from `settings.local.json`
- Set Vercel env vars (Supabase prod URL/key, Mollie live key, CRON_SECRET, BPOST_WEBHOOK_SECRET, Resend key)
- Run **all** Supabase migrations against prod (`supabase db push`) — y compris `20260618000001_fix_rls_missing_tables.sql` (RLS, obligatoire)
- Verify Mollie live mode
- Vérifier domaine Resend (`mimos.be`) et mettre à jour `FROM_EMAIL` dans `src/lib/resend.ts`

---

## 14. Frontend Design Standards — Taste-Skill (Anti-Slop Rules)

> Skills installés dans `.agents/skills/` : `design-taste-frontend`, `redesign-existing-projects`, `full-output-enforcement`, `high-end-visual-design`, `minimalist-ui`
> Source : https://github.com/Leonxlnx/taste-skill

### 14.1 Design Read — toujours déclarer en premier

Avant tout nouveau composant public, déclarer en une ligne :
**"Reading this as: `<type de page>` for `<audience>`, with a `<vibe>` language, leaning toward `<aesthetic family>`."**

**MIMOS Design Read par défaut :**
> *"Reading this as: premium consumer gifting page for emotionally-driven buyers (25–45), with a warm editorial / soft-structuralism language, leaning toward Fraunces display + Outfit body, pastel palette, airy density, restrained motion."*

### 14.2 Les 3 Dials MIMOS

| Dial | Valeur | Signification |
|------|--------|---------------|
| `DESIGN_VARIANCE` | **6** | Asymétrie mesurée — pas symétrique, pas chaotique |
| `MOTION_INTENSITY` | **4** | CSS keyframes + IntersectionObserver — pas de cinématique lourde |
| `VISUAL_DENSITY` | **3** | Aéré, respirant — "art gallery airy" pour les pages produit/occasion |

### 14.3 Patterns BANNIS sur MIMOS

Ces éléments font échouer le design instantanément — ne jamais les produire :

**Typographie :**
- ❌ `Inter`, `Roboto`, `Arial`, `Open Sans` — MIMOS utilise `Fraunces` (display) + `Outfit` (body) + `Caveat` (accents déco uniquement)
- ❌ Gros titres centrés génériques sans intention asymétrique
- ❌ All-caps partout sans raison — préférer lowercase italic ou sentence case pour les eyebrows

**Couleurs & surfaces :**
- ❌ Gradients AI générique (purple/blue mesh) — MIMOS n'utilise que sa palette tokens (`--chantilly`, `--cantaloupe`, `--haze`, `--lime`, sleeves)
- ❌ `box-shadow: 0 4px 12px rgba(0,0,0,0.15)` — shadows tintées selon l'arrière-plan ou quasi-absentes
- ❌ Fonds noirs ou dark mode — MIMOS est une marque chaude/lumineuse
- ❌ Sections dark isolées dans une page claire — incohérence visuelle

**Layout :**
- ❌ 3 colonnes égales de feature cards (layout AI-générique le plus fréquent)
- ❌ Hero centré symétrique avec image à droite / texte à gauche banale
- ❌ `height: 100vh` — toujours `min-height: 100svh` ou `100dvh`
- ❌ Padding uniforme partout — varier `24px / 40px / 64px / 96px` selon la hiérarchie

**Composants :**
- ❌ Emojis dans les titres, headings, ou alt text — réserver aux contextes explicitement chaleureux (copy émotionnelle, labels)
- ❌ Copy AI-cliché : "Elevate", "Seamless", "Unleash", "Next-Gen", "Délicieux", "Artisanal" (en titre)
- ❌ Placeholder `Lorem ipsum` — contenu MIMOS réel ou contenu contextuel toujours
- ❌ `// ...` ou `// reste du code` dans les blocs de code — output complet obligatoire (full-output-enforcement)

### 14.4 Patterns RECOMMANDÉS pour MIMOS

**Typographie :**
- ✅ `Fraunces` pour les titres émotionnels (`font-display`) — tracking serré `-0.02em`, weight 700–900
- ✅ `Outfit` pour tout le body/UI (`font-body`) — 400/500 pour le corps, 600 pour les labels actifs
- ✅ Hiérarchie par **poids + couleur** plutôt que taille seule
- ✅ `text-wrap: balance` sur les headlines pour éviter les orphelins

**Couleurs :**
- ✅ Toujours `var(--xxx)` — jamais de hex hardcodés
- ✅ `occasion.sleeveTokens.accent` pour les CTAs, highlights, borders actives
- ✅ `var(--chantilly)` (#FFFDFE) comme fond global — jamais blanc pur #FFFFFF ni noir
- ✅ Shadows tintées : `box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06)` — très légères

**Layout :**
- ✅ Asymétrie mesurée : grille 2 colonnes avec proportions inégales (60/40, 55/45)
- ✅ Espacement large dans les sections produit/occasion — respiration émotionnelle
- ✅ Double-bezel sur les cards produit : outer shell `p-1.5` + `rounded-[2rem]`, inner core `rounded-[calc(2rem-0.375rem)]`
- ✅ Boutons CTA : `rounded-full`, padding généreux `px-8 py-4`, couleur sleeve accent

**Narrative & Copy :**
- ✅ Toujours répondre à "pour qui ?" et "quel moment on crée ?" — pas juste "qu'est-ce que c'est ?"
- ✅ Mettre en avant **l'expérience du destinataire** et **le message personnalisé** — c'est le différenciateur MIMOS
- ✅ Allergens et infos légales : présentés avec chaleur, pas en annexe réglementaire froide
- ✅ CTA : "Composer ce MIMOS" / "Préparer ce geste" plutôt que "Commander" / "Choisir ce format"

### 14.5 Audit obligatoire avant redesign

Avant toute modification d'une page publique existante, scanner pour :
1. Pattern générique AI présent (3-col equal grid, centered hero, Inter, generic shadows) ?
2. Storytelling "attention manifestée" présent ou absent ?
3. Expérience destinataire / message personnalisé évoqué ?
4. Tokens CSS utilisés correctement (`var(--xxx)`, `sleeveTokens.*`) ?
5. Dead code / composants orphelins à nettoyer en passant ?

### 14.6 Fiche Produit — Décisions Architecture (2026-06-08)

**Découverte :** `ProductCard.tsx` et `AllergensList.tsx` sont des composants **orphelins** — jamais importés sur une page publique. Les produits sont affichés en cards pricing inline sur `/offrir/[occasion]`.

**Décision :** Construire une vraie page produit `/produits/[slug]` qui :
- Réutilise et améliore `ProductCard` + `AllergensList`
- Intègre le storytelling "attention manifestée" : moment créé, message personnalisé, expérience destinataire
- Corrige le trou de conformité légale (allergènes EU 1169/2011 actuellement invisibles)
- Reste product-agnostic (pas de références "brownies" hardcodées — `product.name` + `product.description`)
- Apply les dials MIMOS : variance 6, density 3, motion 4

### 14.7 Patterns réutilisables — Refonte page d'accueil (2026-06-09)

**`Reveal` (`src/components/ui/Reveal.tsx`)** — wrapper scroll-reveal générique :
- IntersectionObserver, `threshold` par défaut 0.12, anime `opacity` + `translateY(distance)` sur 0.65s `cubic-bezier(0.22,1,0.36,1)`
- Props : `delay` (ms, pour stagger des colonnes/siblings), `distance` (px, défaut 32), `as`
- Dégrade proprement si l'élément est déjà visible au mount (pas d'animation surprise sur petits écrans / fast scroll)
- À privilégier pour tout nouveau scroll-reveal plutôt que de réécrire un `IntersectionObserver` inline (sauf besoin de deux refs/colonnes synchronisées comme `RecipientTeaser`, qui garde son implémentation locale)

**Stagger hero en CSS pur** — pour animer l'entrée d'un hero **sans** `"use client"` :
- Définir des `@keyframes` dans `globals.css` (`mimosFadeUp`, `mimosScaleIn`, `mimosFloat*`)
- Classes `.hero-line` + `.hero-line-1..4` avec `animation-delay` croissants pour le stagger texte
- Classes `.hero-card-front/mid/back` pour un flottement infini léger sur des éléments décoratifs (`aria-hidden="true"`)
- Le composant hero reste un Server Component — la motion est entièrement déléguée au CSS

**Split Server/Client pour les carrousels de données** — pattern à reproduire pour toute section qui (a) fetch depuis la DB et (b) a besoin d'interactivité scroll/JS :
- Le composant exporté de la section est un **Server Component async** (`ProductCarousel.tsx`) qui fetch les données et les passe en props
- Un composant `*Track.tsx` séparé (`"use client"`) reçoit les données en props et gère le scroll/hover
- Le Client Component ne doit **jamais** importer depuis `@/lib/services/*` si ce module importe `@/lib/supabase/server` — redéfinir le type localement depuis `@/lib/supabase/database.types` et importer les helpers purs (ex. `formatPriceCents`) depuis `@/lib/utils`
