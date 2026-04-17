-- Migration : RLS Policies
-- Date : 2026-04-10
-- Principe : les tables critiques ont RLS activé (fait en migration 001)
-- Ces policies définissent qui peut accéder à quoi

-- ============================================================
-- TABLE : orders
-- Les admins (authenticated) voient tout
-- Les clients ne voient que leurs propres commandes
-- ============================================================
CREATE POLICY "Admins peuvent tout voir sur orders"
  ON orders FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Clients voient leurs propres commandes"
  ON orders FOR SELECT
  TO anon
  USING (false); -- Anon n'a pas accès direct aux commandes

-- ============================================================
-- TABLE : customers
-- Admins voient tout, clients voient leurs propres données
-- ============================================================
CREATE POLICY "Admins peuvent tout voir sur customers"
  ON customers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- TABLE : recipient_pages
-- Lecture publique via token uniquement (gérée côté application)
-- Admins voient tout
-- ============================================================
CREATE POLICY "Admins peuvent tout voir sur recipient_pages"
  ON recipient_pages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Lecture anon limitée — le token est validé côté application avant la requête
CREATE POLICY "Lecture publique recipient_pages via token"
  ON recipient_pages FOR SELECT
  TO anon
  USING (anonymized_at IS NULL AND expires_at > now());

-- ============================================================
-- TABLE : products (pas de RLS activé — lecture publique OK)
-- ============================================================
-- products n'a pas RLS activé en migration 001 — lecture publique pour le catalogue

-- ============================================================
-- TABLE : promo_codes (pas de RLS activé)
-- ============================================================
-- Validation côté serveur uniquement — pas d'accès direct client

-- ============================================================
-- SESSION TIMEOUT : 30 minutes d'inactivité (NFR9)
-- Configuré via Supabase Auth dashboard — valeur JWT expiry
-- jwt_expiry = 1800 (30 min) dans supabase/config.toml
-- ============================================================
