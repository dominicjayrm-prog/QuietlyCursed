-- Add banner alt text to atlas_posts
-- Run this in the Supabase SQL Editor after previous migrations

ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS banner_alt text;
