-- Add session and country tracking to page_views
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS session_id text;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS country text;
