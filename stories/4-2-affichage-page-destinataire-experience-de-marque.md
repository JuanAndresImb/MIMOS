# Story 4.2 : Affichage page destinataire & expérience de marque

## Status: review

## Story

En tant que **destinataire**,
Je veux voir le message que l'expéditeur m'a écrit sur une page à mon nom,
Afin de vivre pleinement le moment de surprise et de me sentir valorisé.

## Acceptance Criteria

- **AC1** — La page affiche le prénom du destinataire, le nom de l'expéditeur et le message complet
- **AC2** — Le header utilise les tokens sleeve de l'occasion (bg clair en fond, accent pour décoration)
- **AC3** — La couleur vive (accent) est réservée au CTA (Story 4.3) — le corps de page utilise les tons clairs
- **AC4** — Le message est affiché en Nunito 900 avec l'univers de marque
- **AC5** — La page ne requiert pas de compte ni d'inscription
- **AC6** — La page est responsive mobile-first

## Tasks/Subtasks

- [x] Task 1 : Migration — ajouter `recipient_first_name` à `recipient_pages`
  - [x] 1.1 — Créer migration SQL (`20260415000002_recipient_first_name.sql`)
  - [x] 1.2 — Mettre à jour la génération dans le webhook Mollie (extraire `delivery_address.prenom`)

- [x] Task 2 : UI de marque sur `/destinataire/[token]`
  - [x] 2.1 — Récupérer `recipient_first_name` dans la query Supabase
  - [x] 2.2 — Header sleeve : fond `sleeveTokens.bg`, accent sur titre et CTA
  - [x] 2.3 — Affichage prénom destinataire + nom expéditeur + message en Nunito 900
  - [x] 2.4 — Responsive mobile-first (max-w-[32rem] centré)

- [x] Task 3 : Mettre à jour sprint-status.yaml

## Dev Notes

- Tokens sleeve : `getOccasion(slug)?.sleeveTokens` depuis `src/data/occasions.ts`
- Couleurs : festif bg=#ffe3e3 accent=#ff6b6b | affectueux bg=#fff8e8 accent=#fdcb6e | pro bg=#e8faf6 accent=#00b894
- Police message : Nunito (var(--font-display)), font-weight 900
- Prénom vient de `delivery_address->>'prenom'` (JSONB dans orders) — stocker dans `recipient_pages.recipient_first_name` à la génération

## Dev Agent Record

### Completion Notes
_À remplir_

## File List

- `supabase/migrations/20260415000002_recipient_first_name.sql` — nouveau : ajout colonne `recipient_first_name`
- `src/app/api/webhooks/mollie/route.ts` — modifié : extraction `delivery_address.prenom` → `recipient_first_name`
- `src/app/(public)/destinataire/[token]/page.tsx` — modifié : UI de marque complète avec tokens sleeve
- `src/lib/supabase/database.types.ts` — régénéré après migration

## Change Log

- 2026-04-15 : Migration `recipient_first_name`, UI de marque avec tokens sleeve par occasion (festif/affectueux/pro), message en Nunito 900, CTA "Offrir à mon tour" — placeholder pour Story 4.3
