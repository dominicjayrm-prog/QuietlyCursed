-- Add tags to atlas_posts
-- Run this in the Supabase SQL Editor after previous migrations

ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Index for tag queries
CREATE INDEX IF NOT EXISTS idx_atlas_posts_tags ON atlas_posts USING GIN (tags);
