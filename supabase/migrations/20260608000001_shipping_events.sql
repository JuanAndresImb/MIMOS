-- Migration : table shipping_events — historique des événements bpost par commande
-- Permet d'afficher une frise de suivi "native" dans /compte au lieu de renvoyer
-- systématiquement vers track.bpost.cloud (story tracking natif, 2026-06-08)

CREATE TABLE IF NOT EXISTS shipping_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number VARCHAR(100) NOT NULL,
  event_code      TEXT NOT NULL,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Idempotence : bpost peut renvoyer le même événement plusieurs fois
  UNIQUE (order_id, event_code, occurred_at)
);

CREATE INDEX IF NOT EXISTS idx_shipping_events_order_id ON shipping_events(order_id);

-- RLS : accès service_role uniquement (lecture exposée via le Server Component /compte
-- qui utilise le client admin après vérification de l'utilisateur connecté)
ALTER TABLE shipping_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shipping_events_service_only"
  ON shipping_events
  USING (false);
