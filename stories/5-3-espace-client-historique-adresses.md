# Story 5.3 : Espace client — historique & adresses

## Status: done

## Story

En tant que **client ayant un compte**,
Je veux accéder à un espace personnel protégé,
Afin de consulter l'historique de mes commandes, suivre mes livraisons et gérer mes données personnelles.

## Acceptance Criteria

- **AC1** — `/compte` affiche l'historique complet des commandes (hors `pending`)
- **AC2** — Chaque commande affiche : occasion, destinataire, ville, date, montant, statut coloré
- **AC3** — Si la commande est expédiée, un lien de suivi bpost est affiché
- **AC4** — Le client peut se déconnecter
- **AC5** — Le client peut accéder à la page de récapitulatif d'une commande
- **AC6** — Données personnelles RGPD : export CSV + suppression compte
- **AC7** — Routes `/compte/**` protégées par middleware (redirect `/compte/connexion` si non connecté)

## Tasks/Subtasks

- [x] Task 1 : Page `/compte`
  - [x] 1.1 — Récupérer user Auth + customer lié (`customers.user_id`)
  - [x] 1.2 — Requête orders du customer (hors `pending`, ordre desc)
  - [x] 1.3 — Affichage commandes : statut badge coloré par occasion (`sleeveTokens.accent`)
  - [x] 1.4 — Lien tracking bpost conditionnel (`tracking_number`)
  - [x] 1.5 — Lien vers `/confirmation?order=id`

- [x] Task 2 : RGPD dans l'espace client
  - [x] 2.1 — `DeleteAccountForm.tsx` : form avec confirmation
  - [x] 2.2 — Server Action `deleteMyAccount` : anonymisation orders + recipient_pages + customer, suppression Auth user
  - [x] 2.3 — Route `GET /api/account/export-data` : export CSV des données personnelles

- [x] Task 3 : Middleware
  - [x] 3.1 — `proxy.ts` : protection `/compte/**` (sauf `/compte/connexion`)

## Dev Notes

### Page `/compte` — Architecture

```
src/app/(public)/compte/page.tsx (Server Component)
  ├── createClient() → auth.getUser()
  ├── createAdminClient() → customers.select().eq('user_id', user.id)
  └── admin.from('orders').select(...).eq('customer_id', customer.id)
        .not('status', 'eq', 'pending').order('created_at', desc)
```

### Status badges

```ts
const STATUS_LABELS = {
  pending:     { label: "En attente",     color: "var(--warning)" },
  paid:        { label: "Payée",          color: "var(--success)" },
  preparing:   { label: "En préparation", color: "var(--primary-500)" },
  shipped:     { label: "Expédiée",       color: "var(--primary-500)" },
  delivered:   { label: "Livrée",         color: "var(--success)" },
  cancelled:   { label: "Annulée",        color: "var(--error)" },
}
```

### Note sur les adresses enregistrées
L'espace client n'implémente pas de carnet d'adresses persistant — les adresses sont stockées dans chaque commande (`orders.delivery_address JSONB`). Cela est suffisant pour le MVP.

## Dev Agent Record

### Completion Notes
Implémenté lors du développement Epic 5 (2026-04-16/17). Story documentée a posteriori le 2026-05-29.

## File List
- `src/app/(public)/compte/page.tsx`
- `src/app/(public)/compte/connexion/page.tsx`
- `src/app/(public)/compte/DeleteAccountForm.tsx`
- `src/app/api/account/export-data/route.ts`
- `src/actions/auth.ts` — `logoutCustomer`, `deleteMyAccount`
- `src/proxy.ts` — middleware `/compte`

## Change Log
- 2026-04-16 : Implémentation initiale
- 2026-05-29 : Story documentée a posteriori, marquée done
