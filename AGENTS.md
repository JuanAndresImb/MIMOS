<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# MIMOS — Project Context for AI Agents

> Last updated: 2026-05-04

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
│       └── metriques/            # Dashboard metrics
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
/* Typography */
--font-display: Fraunces        /* Headlines, emotional impact */
--font-body: Plus Jakarta Sans  /* Body, labels, UI */
--font-label: var(--font-body)

/* Brand palette */
--primary-500: #E8A87C          /* Caramel tendre */
--primary-700: darker caramel
--bg-primary: #FAF3E0           /* Crème */
--bg-secondary: #FFF8F0         /* Off-white warm */
--text-primary: #41393E         /* Chocolat */
--text-secondary: muted dark
--chantilly: #FFF5F0            /* Card backgrounds */
--lime: #F5FAE8                 /* Reassurance section bg */
--dark: #41393E
```

### 4.2 Occasion Tokens (src/data/occasions.ts)

Each occasion has `sleeveTokens: { bg, accent, dark }` used across all occasion-specific UIs:

| Occasion | bg | accent |
|----------|----|--------|
| `noel-fetes` | `#FFF0F3` (blush rose) | `#D64F6E` (rouge festif) |
| `anniversaire` | `#FFF3E0` (pêche dorée) | `#E8682A` (orange chaleureux) |
| `saint-valentin` | `#FFF0F3` (blush rose) | `#D64F6E` (rouge intense) |
| `naissance-bebe` | `#F0F8FF` (bleu ciel) | `#4A90D9` (bleu doux) |
| `remerciements` | `#F0FAF5` (menthe claire) | `#2D9E6B` (vert confiance) |
| `festif` (legacy) | lavande `#CFC7FA` | `#6D65B0` |
| `affectueux` (legacy) | saumon `#F8B6A8` | `#C07868` |
| `pro` (legacy) | menthe `#A5E7CB` | `#3D9A72` |

### 4.3 Typography Conventions
- `var(--font-display)` = Fraunces → H1, emotional quotes, hero text
- `var(--font-body)` = Plus Jakarta Sans → body, labels, buttons, eyebrows
- Eyebrow style: `font-size: 12px; font-weight: 500; font-style: italic; text-transform: uppercase; letter-spacing: 0.15em`
- Ghost/outline text: `webkit-text-stroke: 2px [color]; color: transparent` (used in DestinataireImmersif parallax)

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
src/actions/order.ts                        # Server Actions: createOrder, etc.
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
orders               -- Main order table (status: pending|paid|shipped|delivered|cancelled)
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
- CTA button: dark bg (`var(--text-primary)`)
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

**Current focus** (2026-05-04): Epic 5 (Notifications) — story 5-1 (bpost webhook) complete, story 5-2 (customer account post-purchase) backlog.

**Recently completed** (this session, 2026-05-04):
- DestinataireImmersif full rebuild (3-section, scroll animations, glassmorphism X button)
- Route group `(gift)` created → immersive layout without navbar/footer
- Occasion pages redesigned (format cards with `sleeveTokens.accent`, `histoire` field)
- Commander tunnel: occasion-specific bg, accent step indicators, emotional copy
- All user-facing "sleeve" / "brownie" language removed from occasion pages + tunnel
- GSAP installed (not yet wired — animations use CSS + IntersectionObserver)
- 21st.dev Magic MCP added to Claude settings

---

## 13. Pre-Production Checklist

See `memory/project_production_checklist.md` for full list. Key items:
- Remove `Bash(*)` from `settings.local.json`
- Set Vercel env vars (Supabase prod URL/key, Mollie live key, CRON_SECRET, BPOST_WEBHOOK_SECRET, Resend key)
- Run Supabase migrations against prod
- Verify Mollie live mode
