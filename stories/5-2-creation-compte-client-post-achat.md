# Story 5.2 : Création compte client post-achat

## Status: done

## Story

En tant qu'**acheteur**,
Je veux pouvoir créer un compte depuis la page de confirmation de commande,
Afin de retrouver facilement mes commandes et commander plus vite la prochaine fois.

## Acceptance Criteria

- **AC1** — Sur la page de confirmation, un formulaire optionnel invite à créer un compte (email pré-rempli en lecture seule)
- **AC2** — Le compte est créé directement confirmé (pas de double opt-in email — l'email a déjà été validé à l'achat)
- **AC3** — Le customer existant est lié au compte Auth (`customers.user_id`)
- **AC4** — Le consentement marketing est capturé explicitement (opt-in RGPD)
- **AC5** — Une page `/compte` protégée affiche l'historique des commandes
- **AC6** — La page `/compte/connexion` permet la reconnexion ultérieure
- **AC7** — Le client peut se déconnecter
- **AC8** — Le client peut supprimer son compte (droit à l'effacement RGPD) : données anonymisées, compte Auth supprimé
- **AC9** — Le client peut télécharger ses données (export CSV RGPD)
- **AC10** — Les routes `/compte/**` (sauf `/compte/connexion`) sont protégées par le middleware

## Tasks/Subtasks

- [x] Task 1 : Formulaire post-achat (page confirmation)
  - [x] 1.1 — `CreateAccountForm.tsx` : email pré-rempli readonly, champ password, consentement marketing
  - [x] 1.2 — Server Action `signUpAfterPurchase` : `auth.admin.createUser` + lien `customers.user_id`
  - [x] 1.3 — Intégration dans `confirmation/page.tsx`

- [x] Task 2 : Espace compte client
  - [x] 2.1 — `/compte/page.tsx` : historique commandes, statuts colorés, lien tracking bpost
  - [x] 2.2 — `/compte/connexion/page.tsx` : formulaire login avec `loginCustomer`
  - [x] 2.3 — Server Action `loginCustomer` : signIn + redirect `/compte`
  - [x] 2.4 — Server Action `logoutCustomer` : signOut + redirect `/`

- [x] Task 3 : RGPD
  - [x] 3.1 — `DeleteAccountForm.tsx` : confirmation avant suppression
  - [x] 3.2 — Server Action `deleteMyAccount` : anonymise commandes + recipient_pages, supprime Auth user
  - [x] 3.3 — `/api/account/export-data` : export CSV des données personnelles

- [x] Task 4 : Middleware
  - [x] 4.1 — `proxy.ts` : protection `/compte/**` (sauf `/compte/connexion`) via Supabase Auth

## Dev Notes

### Architecture implémentée

```
src/
├── actions/auth.ts
│   ├── signUpAfterPurchase()   # admin.createUser + link customer.user_id
│   ├── loginCustomer()         # signInWithPassword + redirect /compte
│   ├── logoutCustomer()        # signOut + redirect /
│   └── deleteMyAccount()       # anonymise + deleteUser
│
├── app/(public)/
│   ├── confirmation/
│   │   ├── page.tsx            # intègre <CreateAccountForm email={...} />
│   │   └── CreateAccountForm.tsx  # useActionState(signUpAfterPurchase)
│   └── compte/
│       ├── page.tsx            # dashboard : orders, tracking, logout, RGPD
│       ├── connexion/page.tsx  # login form
│       └── DeleteAccountForm.tsx  # RGPD delete avec confirmation
│
└── proxy.ts                    # middleware : /compte/* → /compte/connexion si !user
```

### Flux de création de compte

```
Paiement Mollie OK
  → webhook mollie crée order + customer (sans user_id)
  → email confirmation envoyé
  → redirect /confirmation/[id]
  → CreateAccountForm affiché avec email pré-rempli
  → signUpAfterPurchase:
      1. auth.admin.createUser({ email_confirm: true })  ← pas de vérif email
      2. customers.update({ user_id: newUser.id, marketing_consent })
  → succès : message vert, formulaire remplacé
```

### Points techniques clés

- `email_confirm: true` → compte immédiatement actif, pas de vérification email
- Admin client utilisé pour `createUser` (l'anon client ne peut pas créer d'autres users)
- Le customer peut exister sans `user_id` (achats guest) → liaison optionnelle
- Erreurs gérées : `EMAIL_EXISTS`, `WEAK_PASSWORD`, `UNKNOWN`
- Suppression : customer anonymisé (gardé pour agrégats financiers), Auth user supprimé

### Migration DB impliquée

- `20260416000003_customers_auth_link.sql` : colonne `customers.user_id uuid REFERENCES auth.users`

## Dev Agent Record

### Completion Notes

Implémentation complète réalisée lors du développement des Epics 4-5 (2026-04-16/17).
Story documentée a posteriori le 2026-05-29.

**Ce qui fonctionne :**
- Création compte depuis confirmation : ✅
- Login/logout : ✅
- Historique commandes avec statuts colorés par occasion : ✅
- Lien tracking bpost sur commandes expédiées : ✅
- Suppression compte RGPD complète : ✅
- Export données CSV : ✅
- Middleware protection `/compte` : ✅

**À surveiller :**
- Pas de mot de passe oublié / reset password implémenté → à ajouter si besoin utilisateur
- Le formulaire de création compte est optionnel et dismissable (bouton "Non merci")

## File List

- `src/actions/auth.ts` — signUpAfterPurchase, loginCustomer, logoutCustomer, deleteMyAccount
- `src/app/(public)/confirmation/CreateAccountForm.tsx` — formulaire post-achat
- `src/app/(public)/confirmation/page.tsx` — intègre CreateAccountForm
- `src/app/(public)/compte/page.tsx` — dashboard compte client
- `src/app/(public)/compte/connexion/page.tsx` — page connexion
- `src/app/(public)/compte/DeleteAccountForm.tsx` — formulaire suppression RGPD
- `src/app/api/account/export-data/route.ts` — export CSV données personnelles
- `src/proxy.ts` — middleware protection routes /compte
- `supabase/migrations/20260416000003_customers_auth_link.sql`

## Change Log

- 2026-04-16 : Implémentation initiale (confirmation + compte + connexion + RGPD)
- 2026-05-29 : Story documentée a posteriori, marquée done
