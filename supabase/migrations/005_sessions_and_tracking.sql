-- ============================================================
-- Migration 005: Sessions, visitor tracking & UTM link generator
-- ============================================================

-- 1. Add session + geo columns to page_views
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS session_id text;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS device_type text;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS browser text;

-- 2. Sessions table — one row per visitor session
CREATE TABLE IF NOT EXISTS sessions (
  id text PRIMARY KEY,                       -- client-generated UUID
  started_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),
  duration_seconds integer DEFAULT 0,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  referrer text,
  country text,
  city text,
  device_type text,
  browser text,
  page_count integer DEFAULT 1,
  cookie_consent boolean DEFAULT false
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Anyone can insert sessions"
    ON sessions FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can update sessions"
    ON sessions FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated can read sessions"
    ON sessions FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. UTM links table — generated tracking links for YouTube videos
CREATE TABLE IF NOT EXISTS utm_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,                       -- e.g. "Sunk Cost Fallacy Video"
  video_url text,                            -- YouTube video URL
  destination_path text NOT NULL DEFAULT '/',-- e.g. "/atlas" or "/trait-index"
  utm_source text NOT NULL DEFAULT 'youtube',
  utm_medium text NOT NULL DEFAULT 'video',
  utm_campaign text NOT NULL,                -- e.g. "sunk-cost-fallacy"
  utm_content text,                          -- optional extra identifier
  utm_term text,                             -- optional
  full_url text NOT NULL,                    -- the complete generated URL
  click_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE utm_links ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Authenticated full access utm_links"
    ON utm_links FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 4. RPC function to increment page_count for returning navigations
CREATE OR REPLACE FUNCTION increment_page_count(sid text)
RETURNS void AS $$
BEGIN
  UPDATE sessions
  SET page_count = page_count + 1,
      last_seen_at = now()
  WHERE id = sid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views (session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_campaign ON sessions (utm_campaign);
CREATE INDEX IF NOT EXISTS idx_sessions_source ON sessions (utm_source);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views (created_at DESC);
