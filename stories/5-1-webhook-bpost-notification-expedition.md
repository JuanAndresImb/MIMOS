# Story 5.1 : Webhook bpost & notification expédition

## Status: review

## Story

En tant que **acheteur B2C**,
Je veux recevoir une notification automatique avec mon lien de suivi quand ma box est expédiée,
Afin de savoir exactement quand le destinataire va recevoir son cadeau.

## Acceptance Criteria

- **AC1** — Given Juan marque une commande comme "expédiée" dans le dashboard admin, When le statut passe à `shipped`, Then un numéro de suivi bpost est enregistré sur la commande et un email de notification est déclenché
- **AC2** — L'email de notification contient le lien de suivi bpost (`track.bpost.cloud`) avec le numéro de colis
- **AC3** — Le lien de suivi est également accessible dans l'espace client `/compte` si un compte est créé
- **AC4** — Si le numéro de suivi est absent, la transition vers `shipped` est bloquée (validation côté serveur)
- **AC5** — Le webhook bpost `POST /api/webhooks/bpost` vérifie la signature HMAC-SHA256 en première ligne avant tout traitement
- **AC6** — Le webhook bpost marque automatiquement la commande en `delivered` quand bpost envoie un événement de livraison
- **AC7** — La notification email est envoyée en fire-and-forget (ne bloque pas la réponse admin)

## Tasks/Subtasks

- [x] Task 1 : Server Action `updateOrderStatus` — transition `shipped`
  - [x] 1.1 — Valider que `trackingNumber` est fourni avant de passer en `shipped`
  - [x] 1.2 — Stocker `tracking_number` dans `orders` lors du passage en `shipped`
  - [x] 1.3 — Déclencher `sendShippingNotificationEmail` en fire-and-forget au premier passage en `shipped`

- [x] Task 2 : Email de notification expédition
  - [x] 2.1 — `sendShippingNotificationEmail(orderId, trackingNumber)` dans `src/actions/emails.ts`
  - [x] 2.2 — Template React Email `ShippingNotification.tsx` avec lien bpost tracking
  - [x] 2.3 — URL de suivi : `https://track.bpost.cloud/btr/web/#/search?itemCode=[tracking]&lang=fr`

- [x] Task 3 : Webhook bpost `POST /api/webhooks/bpost`
  - [x] 3.1 — Vérification signature HMAC-SHA256 via `x-bpost-signature` en première ligne (→ 401 si invalide)
  - [x] 3.2 — Mapping événements bpost → `delivered` (DELIVERED, DELIVERED_AT_DOOR, etc.)
  - [x] 3.3 — Idempotence : ne pas re-mettre à jour si déjà `delivered`

- [x] Task 4 : Suivi visible dans l'espace client
  - [x] 4.1 — `compte/page.tsx` : afficher le lien bpost si `tracking_number` présent sur la commande

- [x] Task 5 : Mettre à jour sprint-status.yaml

## Dev Notes

### Architecture
- `updateOrderStatus` (`src/actions/admin.ts`) : Server Action admin, gère la transition `shipped`
- `sendShippingNotificationEmail` (`src/actions/emails.ts`) : fire-and-forget, pas de blocage
- Webhook bpost (`src/app/api/webhooks/bpost/route.ts`) : route API (pas Server Action) — reçoit les événements de livraison
- Pas d'appel outbound à l'API bpost pour créer un envoi — le numéro de suivi est saisi manuellement par Juan dans le dashboard

### Sécurité
- Signature HMAC-SHA256 avec `timingSafeEqual` (protection contre timing attacks)
- Secret stocké dans `BPOST_WEBHOOK_SECRET` (variable d'environnement)

### Fallback bpost indisponible (NFR28)
- Pas de dépendance hard à une API bpost outbound — le tracking est manuel
- Si Resend échoue, l'erreur est loggée mais n'empêche pas la mise à jour du statut

## Dev Agent Record

### Completion Notes
- Implémentation déjà en place lors de la création de cette story
- `updateOrderStatus` : tracking_number obligatoire pour `shipped`, email déclenché en fire-and-forget
- `sendShippingNotificationEmail` : récupère commande + email client via Supabase admin, envoie via Resend
- Template `ShippingNotification.tsx` : header vert bpost, numéro de suivi, CTA "Suivre mon colis bpost"
- Webhook `/api/webhooks/bpost` : HMAC-SHA256, événements DELIVERED* → statut `delivered`, idempotent
- `compte/page.tsx` : affiche lien bpost si `tracking_number` présent

## File List

- `src/actions/admin.ts` — `updateOrderStatus` avec validation tracking + trigger email
- `src/actions/emails.ts` — `sendShippingNotificationEmail`
- `src/emails/ShippingNotification.tsx` — template email React Email
- `src/app/api/webhooks/bpost/route.ts` — webhook avec vérification HMAC-SHA256
- `src/app/(public)/compte/page.tsx` — affichage lien de suivi bpost

## Change Log

- 2026-05-01 : Story créée — implémentation déjà présente, story documentée et passée en review
