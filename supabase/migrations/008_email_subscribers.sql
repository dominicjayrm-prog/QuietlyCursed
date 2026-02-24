-- Email subscribers table (simple email collection)
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  subscribed_at timestamptz DEFAULT now()
);

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Service role (used by our API) bypasses RLS entirely,
-- so these policies are only for direct Supabase client access.

-- Admins can view subscribers
CREATE POLICY "Admins can read subscribers"
  ON email_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anyone can insert (subscribe)
CREATE POLICY "Anyone can subscribe"
  ON email_subscribers FOR INSERT
  WITH CHECK (true);
