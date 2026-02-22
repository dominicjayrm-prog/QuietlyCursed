-- Create the atlas-banners storage bucket for post banner images
INSERT INTO storage.buckets (id, name, public)
VALUES ('atlas-banners', 'atlas-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view banner images (public bucket)
CREATE POLICY "Public read access for atlas banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'atlas-banners');

-- Allow authenticated users to upload banner images
CREATE POLICY "Authenticated users can upload atlas banners"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'atlas-banners');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update atlas banners"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'atlas-banners');

-- Allow authenticated users to delete banner images
CREATE POLICY "Authenticated users can delete atlas banners"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'atlas-banners');
