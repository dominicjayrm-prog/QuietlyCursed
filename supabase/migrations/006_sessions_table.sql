-- Sessions table for tracking session duration, entry page, and UTM attribution
CREATE TABLE IF NOT EXISTS sessions (
  session_id text PRIMARY KEY,
  started_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),
  duration_seconds integer DEFAULT 0,
  entry_page text,
  country text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert/update their own session (tracked via session_id)
DO $$ BEGIN
  CREATE POLICY "Public can insert sessions"
    ON sessions FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public can update sessions"
    ON sessions FOR UPDATE USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Only authenticated users can read sessions (admin dashboard)
DO $$ BEGIN
  CREATE POLICY "Authenticated can read sessions"
    ON sessions FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
