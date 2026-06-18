-- Migration : activation RLS sur les tables manquantes + correction policy orders
-- Date : 2026-06-18
-- Contexte : alerte Supabase "rls_disabled_in_public" sur products, promo_codes, order_items
--            + correction policy orders trop permissive (tout authenticated → lire toutes commandes)

-- ============================================================
-- TABLE : products
-- Lecture publique du catalogue (is_active = true) sans RLS pose un risque d'accès
-- aux produits inactifs/brouillon. On active RLS + on expose le catalogue public proprement.
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Lecture publique : uniquement les produits actifs
CREATE POLICY "Catalogue produits publics"
  ON products FOR SELECT
  TO anon
  USING (is_active = true);

-- service_role bypasse RLS automatiquement (admin operations côté serveur)

-- ============================================================
-- TABLE : promo_codes
-- Jamais exposée au client — validation via Server Action / Route Handler uniquement.
-- service_role bypasse RLS : le serveur peut valider normalement.
-- ============================================================
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "promo_codes_service_only"
  ON promo_codes
  USING (false);

-- ============================================================
-- TABLE : order_items
-- Jamais exposée directement au client — lue uniquement côté serveur avec service_role.
-- ============================================================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_service_only"
  ON order_items
  USING (false);

-- ============================================================
-- TABLE : orders — correction policy trop permissive
-- "Admins peuvent tout voir sur orders TO authenticated" accordait la lecture de TOUTES
-- les commandes à n'importe quel utilisateur connecté (clients inclus).
-- Correction : la lecture/écriture admin reste service_role côté serveur.
-- Les clients n'ont pas de requête directe sur orders (tout passe par Server Actions).
-- ============================================================
DROP POLICY IF EXISTS "Admins peuvent tout voir sur orders" ON orders;
DROP POLICY IF EXISTS "Clients voient leurs propres commandes" ON orders;

-- service_role (admin server-side) bypasse RLS → pas de policy nécessaire pour l'admin
-- Anon et authenticated n'ont aucun accès direct : tout passe par les Server Actions
CREATE POLICY "orders_service_only"
  ON orders
  USING (false);
