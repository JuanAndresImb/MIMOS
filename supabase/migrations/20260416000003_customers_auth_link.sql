-- Migration : Lien compte client ↔ Supabase Auth + consentement marketing
--
-- user_id       : UUID de l'utilisateur Supabase Auth après création de compte post-achat
-- marketing_consent : consentement explicite opt-in email marketing (RGPD)

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_user_id
  ON customers (user_id)
  WHERE user_id IS NOT NULL;
