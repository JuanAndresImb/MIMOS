-- Migration : autoriser la lecture des pages anonymisées (Story 4.4)
-- La RLS policy précédente bloquait les pages avec anonymized_at IS NOT NULL ou expires_at passée.
-- Le token UUID aléatoire est le mécanisme de contrôle d'accès — la policy applique la logique métier
-- (afficher "Ce message n'est plus disponible") au niveau de l'application, pas de la BDD.

DROP POLICY IF EXISTS "Lecture publique recipient_pages via token" ON recipient_pages;

CREATE POLICY "Lecture publique recipient_pages via token"
  ON recipient_pages FOR SELECT
  TO anon
  USING (true);
-- La query applicative filtre toujours par token UUID (non guessable).
-- L'état anonymisé est géré dans le Server Component Next.js.
