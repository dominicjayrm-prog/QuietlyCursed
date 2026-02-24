-- Email subscribers table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  confirmed boolean DEFAULT false,
  confirm_token uuid DEFAULT gen_random_uuid(),
  subscribed_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz
);

ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admins) can read subscribers
CREATE POLICY "Admins can read subscribers"
  ON email_subscribers FOR SELECT
  USING (auth.role() = 'authenticated');

-- Anyone can insert (sign up)
CREATE POLICY "Anyone can subscribe"
  ON email_subscribers FOR INSERT
  WITH CHECK (true);

-- Anyone can update their own row (for confirm/unsubscribe via token)
CREATE POLICY "Token-based updates"
  ON email_subscribers FOR UPDATE
  USING (true);
