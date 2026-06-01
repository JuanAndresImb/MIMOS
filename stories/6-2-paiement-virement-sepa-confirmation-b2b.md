# Story 6.2 : Paiement virement SEPA & confirmation B2B

## Status: done

## Story

En tant qu'**acheteur professionnel**,
Je veux recevoir les coordonnées bancaires pour effectuer mon virement,
Afin de finaliser ma commande B2B sans carte de crédit.

## Acceptance Criteria

- **AC1** — Après validation du tunnel B2B, une page de confirmation affiche IBAN, BIC, communication exacte et montant
- **AC2** — Si le virement n'est pas reçu sous 7 jours ouvrables, la commande est annulée automatiquement
- **AC3** — Quand Mollie confirme le virement, le statut passe à `paid` et la facture est envoyée
- **AC4** — La page confirmation s'adapte : instructions si `pending_payment`, confirmation si `paid`

## Tasks/Subtasks

- [x] Task 1 : Page confirmation B2B
  - [x] 1.1 — `/confirmation-b2b/page.tsx` : récupère order + détails Mollie (`payment.details`)
  - [x] 1.2 — Affichage conditionnel : `pending_payment` → instructions virement, `paid` → reçu
  - [x] 1.3 — Détails bancaires : `bankName`, `bankAccount` (IBAN), `bankBic`, `transferReference`
  - [x] 1.4 — Avertissement 7 jours avec communication exacte obligatoire

- [x] Task 2 : Expiration automatique
  - [x] 2.1 — CRON `/api/cron/expire-b2b-payments/route.ts` : commandes `pending_payment` > 7j → `expired_payment`
  - [x] 2.2 — Vercel Cron configuré dans `vercel.json` (schedule: `0 6 * * 1-5`)

- [x] Task 3 : Webhook Mollie — réception virement
  - [x] 3.1 — `webhooks/mollie/route.ts` : si payment status `paid` → order status `paid`

## Dev Notes

### Détails bancaires depuis Mollie
```ts
const payment = await mollie.payments.get(order.mollie_payment_id);
const { bankName, bankAccount, bankBic, transferReference } = payment.details;
```
Si les détails ne sont pas encore disponibles, un message "envoyés par email" est affiché.

### Statuts commande B2B
```
pending_payment → (virement reçu Mollie) → paid → preparing → shipped → delivered
pending_payment → (7j sans virement)     → expired_payment
```

### CRON expiration
```ts
// vercel.json
{ "path": "/api/cron/expire-b2b-payments", "schedule": "0 6 * * 1-5" }
```

## Dev Agent Record

### Completion Notes
Implémenté lors du développement Epic 6 (2026-04-17). Story documentée a posteriori le 2026-05-29.

## File List
- `src/app/(public)/confirmation-b2b/page.tsx`
- `src/app/api/cron/expire-b2b-payments/route.ts`
- `src/app/api/webhooks/mollie/route.ts` — gestion statut `paid`
- `vercel.json` — cron schedule

## Change Log
- 2026-04-17 : Implémentation initiale
- 2026-05-29 : Story documentée a posteriori, marquée done
