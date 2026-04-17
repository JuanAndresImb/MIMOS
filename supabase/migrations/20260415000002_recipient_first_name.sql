-- Migration : ajout recipient_first_name à recipient_pages (Story 4.2)
-- Stocke le prénom du destinataire au moment de la génération pour éviter une jointure orders côté public

ALTER TABLE recipient_pages
  ADD COLUMN IF NOT EXISTS recipient_first_name VARCHAR(100);
