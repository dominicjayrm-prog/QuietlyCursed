-- Atlas Posts table
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE TABLE IF NOT EXISTS atlas_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  subtitle text,
  youtube_url text,
  youtube_video_id text,
  featured_description text,
  content text,
  meta_title text,
  meta_description text,
  related_posts uuid[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE atlas_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Public can read published posts"
  ON atlas_posts FOR SELECT
  USING (is_published = true);

-- Authenticated users (admins) have full access
CREATE POLICY "Authenticated users full access"
  ON atlas_posts FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_atlas_posts_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_atlas_posts_updated_at ON atlas_posts;
CREATE TRIGGER set_atlas_posts_updated_at
  BEFORE UPDATE ON atlas_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_atlas_posts_updated_at();
