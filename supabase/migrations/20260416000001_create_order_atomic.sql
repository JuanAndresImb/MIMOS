-- Migration : Fonction create_order_atomic
-- Résout 3 bugs critiques :
--   1. Stock jamais décrémenté → sur-vente possible
--   2. Opérations multi-tables sans transaction → état incohérent en cas d'échec partiel
--   3. idempotency_key avec Date.now() → ne protège pas contre les doubles clics
--
-- La fonction encapsule en une seule transaction atomique :
--   customer upsert → lock produit → vérif stock → order insert → order_items insert → stock decrement

CREATE OR REPLACE FUNCTION create_order_atomic(
  p_idempotency_key   TEXT,
  p_email             TEXT,
  p_first_name        TEXT,
  p_last_name         TEXT,
  p_product_id        UUID,
  p_occasion_slug     TEXT,
  p_recipient_message TEXT,
  p_sender_name       TEXT,
  p_delivery_address  JSONB,
  p_promo_code_id     UUID,       -- nullable
  p_discount_cents    INTEGER,
  p_unit_price_cents  INTEGER,
  p_total_cents       INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id       UUID;
  v_order_id          UUID;
  v_existing_order_id UUID;
  v_current_stock     INTEGER;
BEGIN
  -- 1. Idempotence : si la clé existe déjà, retourner l'order_id existant sans rien créer
  SELECT id INTO v_existing_order_id
  FROM orders
  WHERE idempotency_key = p_idempotency_key;

  IF v_existing_order_id IS NOT NULL THEN
    RETURN v_existing_order_id;
  END IF;

  -- 2. Upsert customer (email comme clé naturelle)
  INSERT INTO customers (email, first_name, last_name, updated_at)
  VALUES (LOWER(p_email), p_first_name, p_last_name, now())
  ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name  = EXCLUDED.last_name,
    updated_at = now()
  RETURNING id INTO v_customer_id;

  -- 3. Verrouiller la ligne produit (FOR UPDATE) et vérifier le stock
  --    Le lock empêche deux transactions concurrentes de passer simultanément ce check
  SELECT stock INTO v_current_stock
  FROM products
  WHERE id = p_product_id AND is_active = true
  FOR UPDATE;

  IF v_current_stock IS NULL THEN
    RAISE EXCEPTION 'PRODUCT_NOT_FOUND';
  END IF;

  IF v_current_stock <= 0 THEN
    RAISE EXCEPTION 'OUT_OF_STOCK';
  END IF;

  -- 4. Créer la commande
  INSERT INTO orders (
    idempotency_key,
    customer_id,
    status,
    total_cents,
    delivery_address,
    promo_code_id,
    discount_cents,
    recipient_message,
    sender_name,
    occasion_slug
  ) VALUES (
    p_idempotency_key,
    v_customer_id,
    'pending',
    p_total_cents,
    p_delivery_address,
    p_promo_code_id,
    p_discount_cents,
    p_recipient_message,
    p_sender_name,
    p_occasion_slug
  )
  RETURNING id INTO v_order_id;

  -- 5. Créer l'order_item (prix unitaire avant remise)
  INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
  VALUES (v_order_id, p_product_id, 1, p_unit_price_cents);

  -- 6. Décrémenter le stock — atomique grâce au lock FOR UPDATE acquis en step 3
  UPDATE products
  SET stock = stock - 1, updated_at = now()
  WHERE id = p_product_id;

  RETURN v_order_id;
END;
$$;
