<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# MIMOS — Project Context for AI Agents

> Last updated: 2026-05-11

## 1. Project Identity

| Field | Value |
|-------|-------|
| Brand name | **MIMOS** (formerly "La Brownie Box Belge") |
| Concept | "3 clicks pour dire Je pense à toi" — gifting service for artisanal Belgian brownies sent with a personalised printed message |
| Repo | `brownie-box-belge` (historical name, keep as-is) |
| Package manager | **pnpm** (never use npm or yarn) |
| Dev server | `pnpm dev` → `http://localhost:3000` |
| Local DB | Supabase Docker → `http://127.0.0.1:54321` (start with `npx supabase start`) |

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

**Current focus** (2026-05-11): Epic 5 (Notifications) — story 5-2 (compte client post-achat) en backlog, pas encore de story file.

**Epics complétés :** 1 (Fondations), 2 (Catalogue), 3 (Tunnel), 4 (Destinataire), 7 (Admin dashboard)

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
- Run Supabase migrations against prod
- Verify Mollie live mode
