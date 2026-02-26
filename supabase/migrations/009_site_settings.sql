-- Site-wide key/value settings (e.g. featured YouTube video URL)
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for homepage to render the featured video)
DO $$ BEGIN
  CREATE POLICY "Public can read site settings"
    ON site_settings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Only authenticated admins can modify settings
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage site settings"
    ON site_settings FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
