# Story 4.1 : Génération token & page destinataire par commande

## Status: review

## Story

En tant que **système**,  
Je veux générer une page destinataire unique pour chaque commande confirmée,  
Afin que le destinataire puisse vivre un moment personnalisé à l'ouverture de sa boîte.

## Acceptance Criteria

- **AC1** — Given une commande passe à `paid` (webhook Mollie), Then un token UUID v4 CSPRNG est généré et inséré dans `recipient_pages` avec `expires_at = now() + 1 an`
- **AC2** — La page `/destinataire/[token]` est accessible sans authentification (route publique)
- **AC3** — La page est servie en SSR avec cache Edge Vercel (`s-maxage=31536000, stale-while-revalidate`)
- **AC4** — Un token invalide, inexistant, expiré ou anonymisé retourne un 404 propre avec message "Cette page n'est plus disponible"
- **AC5** — Le token est UUID v4 — 36 caractères, non devinable (NFR17)
- **AC6** — Si `recipient_pages` existe déjà pour cette commande (retry webhook), on ne crée pas de doublon (idempotence)

## Tasks/Subtasks

- [x] Task 1 : Logique de génération du token dans le webhook Mollie
  - [x] 1.1 — Extraire les champs nécessaires de l'ordre (`sender_name`, `recipient_message`, `occasion_slug`) lors du passage à `paid`
  - [x] 1.2 — Générer token via `crypto.randomUUID()` (UUID v4 natif Node.js)
  - [x] 1.3 — Insérer dans `recipient_pages` (idempotent — upsert ou skip si déjà présent)
  - [x] 1.4 — Logger le token généré (sans données PII) pour débogage

- [x] Task 2 : Route `/destinataire/[token]`
  - [x] 2.1 — Créer `src/app/(public)/destinataire/[token]/page.tsx` (Server Component)
  - [x] 2.2 — Requête Supabase : sélectionner depuis `recipient_pages` où token = param AND anonymized_at IS NULL AND expires_at > now()
  - [x] 2.3 — `notFound()` si aucun résultat
  - [x] 2.4 — Page minimale affichant le sender + message (4.2 gérera l'UI complète)
  - [x] 2.5 — Ajouter `export const revalidate = 31536000` pour cache Edge

- [x] Task 3 : Mettre à jour sprint-status.yaml

## Dev Notes

### Architecture
- Webhook Mollie : `src/app/api/webhooks/mollie/route.ts` — déjà gère `payment.paid`
- Table `recipient_pages` déjà créée dans migration `20260410155022_init_schema.sql`
- Colonnes disponibles : `order_id`, `token`, `sender_name`, `message`, `occasion_slug`, `promo_code_id`, `first_viewed_at`, `expires_at`, `anonymized_at`
- RLS : anon peut lire si `anonymized_at IS NULL AND expires_at > now()` ✅
- `delivery_address` JSONB dans `orders` contient `{ prenom, nom, ... }` — le prénom du destinataire est dans `delivery_address->>'prenom'`

### Idempotence
- Mollie peut appeler le webhook plusieurs fois → utiliser `.upsert()` avec `onConflict: 'order_id'` ou ignorer si la ligne existe déjà

### Cache Edge
- `export const revalidate = 31536000` — Next.js App Router : la page sera mise en cache pour 1 an côté Edge
- Alternativement utiliser les headers Cache-Control dans la Response

### Supabase client
- La route est publique → utiliser `createClient()` (client serveur anon) pour lire `recipient_pages`
- Le webhook utilise `createAdminClient()` pour écrire

## Dev Agent Record

### Implementation Plan
_À remplir lors de l'implémentation_

### Debug Log
_À remplir si nécessaire_

### Completion Notes
_À remplir à la fin_

## File List

- `src/app/api/webhooks/mollie/route.ts` — modifié : ajout `createRecipientPage()`, sélection champs supplémentaires sur orders
- `src/app/(public)/destinataire/[token]/page.tsx` — nouveau : route publique SSR avec cache Edge 1 an
- `src/app/(public)/destinataire/[token]/not-found.tsx` — nouveau : 404 personnalisé
- `stories/4-1-generation-token-page-destinataire-par-commande.md` — nouveau : story file

## Change Log

- 2026-04-15 : Implémentation complète — génération token UUID v4 dans webhook Mollie (idempotent via upsert), route `/destinataire/[token]` SSR avec cache Edge, 404 propre pour token invalide/expiré/anonymisé
