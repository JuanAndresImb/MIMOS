-- Migration : table admin_settings
-- Stocke la configuration des notifications webhook admin (Story 7.7)

CREATE TABLE admin_settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_url   TEXT,
  webhook_events TEXT[] NOT NULL DEFAULT ARRAY['new_order', 'low_stock', 'invoice_error', 'wire_payment_received'],
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Une seule ligne de configuration pour toute la plateforme
INSERT INTO admin_settings (webhook_url, webhook_events)
VALUES (
  NULL,
  ARRAY['new_order', 'low_stock', 'invoice_error', 'wire_payment_received']
);

-- RLS : accès service_role uniquement (jamais exposé au client anon)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_settings_service_only"
  ON admin_settings
  USING (false);
