-- Migration : ajout du type 'recipient' pour les codes promo générés automatiquement (Story 4.3)
-- Le type 'recipient' est traité comme 'percent' dans le calcul de remise

ALTER TABLE promo_codes
  DROP CONSTRAINT IF EXISTS promo_codes_type_check;

ALTER TABLE promo_codes
  ADD CONSTRAINT promo_codes_type_check
    CHECK (type IN ('percent', 'fixed', 'recipient'));
