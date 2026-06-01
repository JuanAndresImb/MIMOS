# Story 6.3 : Génération automatique facture PDF

## Status: done

## Story

En tant qu'**acheteur professionnel**,
Je veux recevoir automatiquement une facture PDF par email après paiement,
Afin de pouvoir la transmettre à ma comptabilité.

## Acceptance Criteria

- **AC1** — Une facture PDF est générée automatiquement quand une commande B2B passe en `paid`
- **AC2** — La facture contient : numéro séquentiel (`FAC-YYYY-NNNN`), données entreprise, HTVA/TVA 21%/TVAC
- **AC3** — La facture est envoyée par email (Resend) en pièce jointe PDF
- **AC4** — L'admin peut télécharger n'importe quelle facture depuis le dashboard
- **AC5** — L'admin peut exporter un CSV comptable par période

## Tasks/Subtasks

- [x] Task 1 : Génération PDF
  - [x] 1.1 — `src/lib/pdf/generateInvoice.ts` : `InvoiceData` interface + génération via pdf-lib
  - [x] 1.2 — Header MIMOS, tableau articles, totaux HTVA/TVA/TVAC, remise si code promo
  - [x] 1.3 — Numérotation séquentielle `FAC-{YYYY}-{0000}` via RPC `next_invoice_number()`

- [x] Task 2 : Envoi email
  - [x] 2.1 — `sendB2bInvoiceEmail()` dans `src/actions/emails.ts` : génère PDF + persiste numéro + envoie via Resend
  - [x] 2.2 — Idempotent : vérifie `invoice_number` existant avant de re-générer

- [x] Task 3 : Admin dashboard
  - [x] 3.1 — `/admin/factures/page.tsx` : liste commandes payées avec numéro facture + lien PDF
  - [x] 3.2 — `GET /api/admin/invoices/[orderId]` : téléchargement PDF (auth admin requis)
  - [x] 3.3 — `ExportForm.tsx` + `GET /api/admin/export/factures` : export CSV comptable par période

- [x] Task 4 : Migration DB
  - [x] 4.1 — `20260417000001_invoice_fields.sql` : `invoice_number TEXT UNIQUE`, `invoice_url TEXT`, `invoice_sent_at TIMESTAMPTZ`
  - [x] 4.2 — Séquence `invoice_number_seq` + RPC `next_invoice_number()`

## Dev Notes

### Note d'implémentation
La story était planifiée comme une Edge Function Supabase, mais implémentée en **Server Action Next.js + Resend** — plus simple pour ce MVP et sans dépendance supplémentaire.

### Numérotation séquentielle
```sql
-- Migration 20260417000001_invoice_fields.sql
CREATE SEQUENCE invoice_number_seq START 1;

CREATE OR REPLACE FUNCTION next_invoice_number()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE seq INT;
BEGIN
  seq := nextval('invoice_number_seq');
  RETURN 'FAC-' || to_char(NOW(), 'YYYY') || '-' || lpad(seq::text, 4, '0');
END;
$$;
```

### Calcul TVA
```ts
const htva = Math.round(total_cents / 1.21);
const tva  = total_cents - htva;
// Affiché : HTVA + TVA 21% + TVAC
```

### Génération PDF (pdf-lib)
```ts
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
// Couleurs MIMOS : #B8874A (caramel), #1a1a1a (dark)
```

## Dev Agent Record

### Completion Notes
Implémenté lors du développement Epic 6 (2026-04-17). Story documentée a posteriori le 2026-05-29.
Note : pas d'Edge Function Supabase — Server Action Next.js utilisée à la place.

## File List
- `src/lib/pdf/generateInvoice.ts`
- `src/actions/emails.ts` — `sendB2bInvoiceEmail`
- `src/app/(admin)/admin/factures/page.tsx`
- `src/app/(admin)/admin/factures/ExportForm.tsx`
- `src/app/api/admin/invoices/[orderId]/route.ts`
- `src/app/api/admin/export/factures/route.ts`
- `supabase/migrations/20260417000001_invoice_fields.sql`

## Change Log
- 2026-04-17 : Implémentation initiale (Server Action + Resend, pas Edge Function)
- 2026-05-29 : Story documentée a posteriori, marquée done
