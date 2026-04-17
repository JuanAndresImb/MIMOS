# Story 4.3 : CTA conversion & code promo destinataire

## Status: review

## Story

En tant que **destinataire**,
Je veux pouvoir commander ma propre box depuis la page que j'ai reçue,
Afin d'offrir à mon tour un moment similaire à quelqu'un qui compte pour moi.

## Acceptance Criteria

- **AC1** — Première consultation : un code promo unique est généré et lié à `recipient_pages.promo_code_id` (type='recipient', 10%, 3 mois)
- **AC2** — Le code est affiché avec sa valeur (10%) et sa date d'expiration
- **AC3** — CTA "Offrir à mon tour" → `/commander?occasion=[slug]&promo=[code]`
- **AC4** — Le tunnel pré-applique le code automatiquement depuis `?promo=` dans l'URL
- **AC5** — Idempotence : deuxième consultation → même code, pas de création supplémentaire
- **AC6** — Code stocké dans `promo_codes` avec `type = 'recipient'`

## Tasks/Subtasks

- [x] Task 1 : Migration — ajouter 'recipient' au CHECK promo_codes.type
- [x] Task 2 : Génération promo code sur la page destinataire (synchrone, idempotent)
- [x] Task 3 : UI — carte promo + CTA avec URL pré-remplie
- [x] Task 4 : Tunnel — lire `?promo` depuis searchParams, passer à TunnelClient, auto-appliquer
- [x] Task 5 : Mettre à jour sprint-status.yaml

## Dev Notes

- Promo code : `value_cents = 1000` (10%), `type = 'recipient'`, expires = +3 mois
- Code name : `BIENV-[8 premiers chars du token en majuscules]` → unique, déterministe
- Idempotence : INSERT ... ON CONFLICT (code) DO NOTHING, puis re-select
- Tunnel commander page : `searchParams: Promise<{ occasion?: string; promo?: string }>`
- TunnelClient : prop `initialPromoCode?: string`, `useEffect` pour auto-appliquer

## Dev Agent Record

### Completion Notes
- Code promo généré de façon synchrone (idempotent) dans le Server Component `/destinataire/[token]/page.tsx`
- Format : `BIENV-[8 premiers chars du token en majuscules]`, type='recipient', 10%, expires +3 mois
- `value_cents = 1000` traité comme pourcentage (10%) dans le tunnel
- Auto-apply via `useEffect` dans `StepPaiement` — déclenché dès le montage si `initialPromoCode` fourni
- Migration `20260415000003` ajoute 'recipient' au CHECK constraint de `promo_codes.type`
- Edge cache `revalidate = 31536000` — la génération du code est synchrone donc incluse dans le cache

## File List
- `supabase/migrations/20260415000003_promo_codes_recipient_type.sql`
- `src/app/(public)/destinataire/[token]/page.tsx`
- `src/app/(public)/commander/page.tsx`
- `src/app/(public)/commander/TunnelClient.tsx`
- `src/lib/supabase/database.types.ts`

## Change Log
- 2026-04-15 : Story implémentée et testée (promo auto-appliquée confirmée en navigateur)
