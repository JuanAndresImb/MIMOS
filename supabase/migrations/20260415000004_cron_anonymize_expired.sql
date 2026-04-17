-- Migration : note de configuration du cron RGPD (Story 4.4)
-- La Edge Function 'anonymize-expired' doit être invoquée quotidiennement à 02h00 UTC.
--
-- Configuration en production (Supabase Dashboard) :
--   Edge Functions → anonymize-expired → Schedule → "0 2 * * *"
--
-- Alternative locale (pg_cron + pg_net, si disponible) :
--   SELECT cron.schedule(
--     'anonymize-expired-pages',
--     '0 2 * * *',
--     $$ SELECT net.http_post(
--       url := 'https://<project-ref>.supabase.co/functions/v1/anonymize-expired',
--       headers := '{"Content-Type":"application/json"}'::jsonb,
--       body := '{}'::jsonb
--     ) $$
--   );
--
-- Pour déclencher manuellement en local :
--   supabase functions serve anonymize-expired
--   curl -X POST http://localhost:54321/functions/v1/anonymize-expired

-- Index supplémentaire pour optimiser la query de la cron (expires_at + anonymized_at)
CREATE INDEX IF NOT EXISTS idx_recipient_pages_cron
  ON recipient_pages (expires_at)
  WHERE anonymized_at IS NULL;
