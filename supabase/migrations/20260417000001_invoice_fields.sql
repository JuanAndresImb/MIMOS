-- Migration : Champs facture B2B sur orders + séquence numéro + bucket Storage

-- Colonnes facture sur orders (idempotent)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS invoice_url    TEXT,
  ADD COLUMN IF NOT EXISTS invoice_number TEXT UNIQUE;

-- Séquence pour numéro de facture séquentiel (évite les race conditions)
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- Fonction RPC appelable depuis l'Edge Function
CREATE OR REPLACE FUNCTION next_invoice_number()
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT nextval('invoice_number_seq')::INTEGER;
$$;

-- Note : le bucket Storage "invoices" est créé via l'API (voir seed ou bootstrap script)
-- car storage.buckets n'est pas disponible en migration locale Supabase CLI.
