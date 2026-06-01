# Story 6.1 : Formulaire de commande B2B

## Status: done

## Story

En tant qu'**acheteur professionnel**,
Je veux passer une commande en indiquant les coordonnées de mon entreprise,
Afin de recevoir une facture avec TVA et de payer par virement bancaire.

## Acceptance Criteria

- **AC1** — Le tunnel d'achat propose un mode B2B (case à cocher ou page dédiée)
- **AC2** — Le formulaire B2B collecte : nom de l'entreprise (requis) + numéro TVA (optionnel, format `BE` + 10 chiffres)
- **AC3** — La méthode de paiement virement bancaire est proposée pour les commandes B2B
- **AC4** — Les données B2B sont persistées sur la commande (`is_b2b`, `company_name`, `vat_number`)
- **AC5** — Une landing page `/offrir/entreprise` présente l'offre B2B

## Tasks/Subtasks

- [x] Task 1 : Landing B2B
  - [x] 1.1 — Page `/offrir/entreprise/page.tsx` : hero, avantages, CTA vers tunnel

- [x] Task 2 : Formulaire dans le tunnel
  - [x] 2.1 — `TunnelClient.tsx` : champ `isB2b` (checkbox), `companyName`, `vatNumber`
  - [x] 2.2 — Validation Zod : `companyName` requis si B2B, `vatNumber` regex `BE\d{10}` (optionnel)
  - [x] 2.3 — Sélecteur méthode paiement : `standard` (Mollie carte) ou `banktransfer` (virement)

- [x] Task 3 : Persistance
  - [x] 3.1 — Migration DB : colonnes `is_b2b`, `company_name`, `vat_number` sur `orders`
  - [x] 3.2 — Server Action `createOrder` : accepte paramètres B2B + route vers Mollie banktransfer si virement

## Dev Notes

### Validation Zod dans TunnelClient
```ts
companyName: z.string().min(1).optional(),
vatNumber: z.string().regex(/^BE\d{10}$/).optional(),
isB2b: z.boolean().default(false),
paymentMethod: z.enum(["standard", "banktransfer"]).default("standard"),
```

### Migration DB
`20260410155022_init_schema.sql` :
```sql
is_b2b          BOOLEAN DEFAULT false,
company_name    VARCHAR(255),
vat_number      VARCHAR(30),
```

### Flux B2B
```
TunnelClient → createOrder({ isB2b: true, paymentMethod: "banktransfer" })
  → Mollie.payments.create({ method: PaymentMethod.banktransfer })
  → order.status = "pending_payment"
  → redirect /confirmation-b2b?order={id}
```

## Dev Agent Record

### Completion Notes
Implémenté lors du développement Epic 6 (2026-04-17). Story documentée a posteriori le 2026-05-29.

## File List
- `src/app/(public)/offrir/entreprise/page.tsx`
- `src/app/(public)/commander/TunnelClient.tsx` — section B2B
- `src/actions/orders.ts` — `createOrder` avec params B2B
- `supabase/migrations/20260410155022_init_schema.sql` — colonnes B2B

## Change Log
- 2026-04-17 : Implémentation initiale
- 2026-05-29 : Story documentée a posteriori, marquée done
