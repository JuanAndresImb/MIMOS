-- Bucket public pour les images produits
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Lecture publique
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'products');

-- Upload réservé aux admins (authenticated)
CREATE POLICY "Authenticated upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products');

-- Suppression réservée aux admins
CREATE POLICY "Authenticated delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products');
