-- Atlas Blog Scheduling System
-- Adds status workflow (draft/scheduled/published/archived),
-- scheduled_at datetime, published_at datetime, and preview_token.

-- Status column replaces the boolean is_published
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS preview_token text;

-- Backfill: set status based on existing is_published flag
UPDATE atlas_posts SET status = 'published', published_at = created_at WHERE is_published = true AND status = 'draft';
UPDATE atlas_posts SET status = 'draft' WHERE is_published = false AND status = 'draft';

-- Index for efficient queries on status + scheduled_at (auto-publish cron)
CREATE INDEX IF NOT EXISTS idx_atlas_posts_status ON atlas_posts (status);
CREATE INDEX IF NOT EXISTS idx_atlas_posts_scheduled ON atlas_posts (scheduled_at) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_atlas_posts_preview_token ON atlas_posts (preview_token) WHERE preview_token IS NOT NULL;

-- Update RLS policy to use status instead of is_published
-- Drop old policy and create new one
DROP POLICY IF EXISTS "Public can read published posts" ON atlas_posts;
CREATE POLICY "Public can read published posts"
  ON atlas_posts FOR SELECT
  USING (status = 'published' OR is_published = true);
