# Story 4.4 : Anonymisation RGPD & cron Supabase

## Status: review

## Story

En tant que **système (conformité RGPD)**,
Je veux anonymiser automatiquement les données personnelles des pages destinataires après expiration,
Afin de respecter le principe de minimisation des données sans intervention manuelle.

## Acceptance Criteria

- **AC1** — Une Supabase Edge Function `anonymize-expired` est déployée et schedulée quotidiennement (02h00 UTC)
- **AC2** — La fonction anonymise toutes les `recipient_pages` où `expires_at < now()` : `sender_name`, `message`, `recipient_first_name` → `[supprimé]`, `anonymized_at = now()`
- **AC3** — Le token reste valide mais la page affiche "Ce message n'est plus disponible" (pas de 404)
- **AC4** — Le cache Edge Vercel est invalidé via `revalidatePath()` après anonymisation (appel à `/api/internal/revalidate`)
- **AC5** — L'opération est loggée en JSON structuré avec le nombre de pages anonymisées
- **AC6** — Une erreur dans la cron retourne HTTP 500 (alerte Sentry via Supabase monitoring)
- **AC7** — Idempotence : re-exécution sur les mêmes tokens = même résultat (filtre `anonymized_at IS NULL`)

## Tasks/Subtasks

- [x] Task 1 : Créer le story file
- [x] Task 2 : Modifier `destinataire/[token]/page.tsx` — supprimer les filtres expires/anonymized, gérer l'état anonymisé
- [x] Task 3 : Créer `/api/internal/revalidate/route.ts` — endpoint Next.js de cache busting protégé par `CRON_SECRET`
- [x] Task 4 : Créer `supabase/functions/anonymize-expired/index.ts` — Edge Function Deno idempotente
- [x] Task 5 : Configurer le schedule dans `supabase/config.toml` + `CRON_SECRET` dans `.env.example`
- [x] Task 6 : Mettre à jour sprint-status.yaml

## Dev Notes

- `recipient_pages` a déjà `anonymized_at TIMESTAMPTZ` (init_schema) et `recipient_first_name VARCHAR(100)` (migration 20260415000002)
- Idempotence : filtre `anonymized_at IS NULL` dans la query de la fonction
- Cache invalidation : Edge Function → POST `/api/internal/revalidate` avec header `x-cron-secret` → `revalidatePath('/destinataire/TOKEN')`
- Edge Function schedule : `config.toml` section `[functions.anonymize-expired]` + `verify_jwt = false` + `schedule = "0 2 * * *"`
- Import Supabase dans Deno : `npm:@supabase/supabase-js@2`
- Log JSON structuré : `{ timestamp, anonymized_count, tokens: [...] }`
- Erreur → console.error + HTTP 500 → Supabase monitoring → alerte Sentry

## Dev Agent Record

### Completion Notes
- RLS policy `recipient_pages` assouplie : `USING (true)` — le token UUID est le mécanisme d'accès
- Edge Function se compile ~30s la première fois (résolution npm) — normal en local, transparent en prod
- `schedule` non supporté dans `config.toml` v2.91.2 → commenté + migration avec instruction pg_cron
- `supabase/functions/` exclu du `tsconfig.json` pour éviter les erreurs Deno dans le check Next.js
- Testé : fonction anonymise correctement `test-expired-4-4`, idempotente sur `test-anonymized-4-4`
- Cache invalidation via `/api/internal/revalidate` protégé par `CRON_SECRET`

## File List
- `src/app/(public)/destinataire/[token]/page.tsx`
- `src/app/api/internal/revalidate/route.ts`
- `supabase/functions/anonymize-expired/index.ts`
- `supabase/config.toml`
- `supabase/migrations/20260415000004_cron_anonymize_expired.sql`
- `supabase/migrations/20260415000005_rls_recipient_pages_anonymized.sql`
- `tsconfig.json`
- `.env.example`

## Change Log
- 2026-04-16 : Story implémentée et testée (fonction anonymize-expired validée en local)
