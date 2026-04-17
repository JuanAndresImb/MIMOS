-- Migration 001 : Schéma initial La Brownie Box Belge
-- Date : 2026-04-10
-- Règles : snake_case, montants en centimes (INTEGER), dates TIMESTAMPTZ, RLS sur tables critiques

-- ============================================================
-- TABLE : customers
-- ============================================================
CREATE TABLE customers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  first_name    VARCHAR(100),
  last_name     VARCHAR(100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_customers_email ON customers (email);

-- ============================================================
-- TABLE : products
-- ============================================================
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  price_cents   INTEGER NOT NULL CHECK (price_cents > 0),
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  images        JSONB NOT NULL DEFAULT '[]',
  allergens     TEXT[] NOT NULL DEFAULT '{}',
  occasion_slugs TEXT[] NOT NULL DEFAULT '{}',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  stock_alert_threshold INTEGER NOT NULL DEFAULT 5,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_is_active ON products (is_active);

-- ============================================================
-- TABLE : promo_codes
-- ============================================================
CREATE TABLE promo_codes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          VARCHAR(50) UNIQUE NOT NULL,
  type          VARCHAR(10) NOT NULL CHECK (type IN ('percent', 'fixed')),
  value_cents   INTEGER NOT NULL CHECK (value_cents > 0),
  expires_at    TIMESTAMPTZ,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_promo_codes_code ON promo_codes (code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes (is_active);

-- ============================================================
-- TABLE : orders
-- ============================================================
CREATE TABLE orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key       VARCHAR(255) UNIQUE NOT NULL,
  customer_id           UUID REFERENCES customers (id),
  status                VARCHAR(30) NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'paid', 'preparing', 'shipped', 'delivered', 'cancelled')),
  total_cents           INTEGER NOT NULL CHECK (total_cents >= 0),
  delivery_address      JSONB NOT NULL,
  promo_code_id         UUID REFERENCES promo_codes (id),
  discount_cents        INTEGER NOT NULL DEFAULT 0 CHECK (discount_cents >= 0),
  recipient_message     TEXT,
  sender_name           VARCHAR(255),
  occasion_slug         VARCHAR(100),
  is_b2b                BOOLEAN NOT NULL DEFAULT false,
  company_name          VARCHAR(255),
  vat_number            VARCHAR(30),
  mollie_payment_id     VARCHAR(255),
  invoice_sent_at       TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_orders_idempotency_key ON orders (idempotency_key);
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

-- ============================================================
-- TABLE : order_items
-- ============================================================
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products (id),
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

-- ============================================================
-- TABLE : recipient_pages
-- ============================================================
CREATE TABLE recipient_pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL UNIQUE REFERENCES orders (id) ON DELETE CASCADE,
  token           VARCHAR(255) UNIQUE NOT NULL,
  sender_name     VARCHAR(255) NOT NULL,
  message         TEXT NOT NULL,
  occasion_slug   VARCHAR(100) NOT NULL,
  promo_code_id   UUID REFERENCES promo_codes (id),
  first_viewed_at TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ NOT NULL,
  anonymized_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE recipient_pages ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_recipient_pages_token ON recipient_pages (token);
CREATE INDEX idx_recipient_pages_expires_at ON recipient_pages (expires_at);

-- ============================================================
-- TRIGGER : updated_at automatique
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_customers
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
