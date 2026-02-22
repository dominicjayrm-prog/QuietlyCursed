-- Rich text editor upgrade for atlas_posts
-- Run this in the Supabase SQL Editor after 001_atlas_posts.sql

-- JSON content storage (TipTap document JSON)
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS content_json jsonb;

-- Content format flag: 'markdown' (legacy) or 'json' (rich editor)
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS content_format text DEFAULT 'markdown';

-- Banner/hero image URL
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS banner_url text;
