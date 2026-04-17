-- Migration : Ajout colonne tracking_number sur orders
-- Utilisée lors du passage au statut "shipped" pour stocker le numéro de suivi bpost

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100);
