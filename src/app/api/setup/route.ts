import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS atlas_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  subtitle text,
  youtube_url text,
  youtube_video_id text,
  featured_description text,
  content text,
  content_json jsonb,
  content_format text DEFAULT 'markdown',
  banner_url text,
  banner_alt text,
  meta_title text,
  meta_description text,
  related_posts uuid[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE atlas_posts ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public can read published posts" ON atlas_posts FOR SELECT USING (is_published = true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users full access" ON atlas_posts FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE OR REPLACE FUNCTION update_atlas_posts_updated_at() RETURNS trigger AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_atlas_posts_updated_at ON atlas_posts;
CREATE TRIGGER set_atlas_posts_updated_at BEFORE UPDATE ON atlas_posts FOR EACH ROW EXECUTE FUNCTION update_atlas_posts_updated_at();
-- Idempotent column additions for existing tables:
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS content_json jsonb;
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS content_format text DEFAULT 'markdown';
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS banner_url text;
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS banner_alt text;
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_atlas_posts_tags ON atlas_posts USING GIN (tags);
-- Email subscribers
CREATE TABLE IF NOT EXISTS email_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  subscribed_at timestamptz DEFAULT now()
);
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Admins can read subscribers" ON email_subscribers FOR SELECT USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Anyone can subscribe" ON email_subscribers FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
-- Site settings (key-value)
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated users can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
-- Quiz results
CREATE TABLE IF NOT EXISTS quiz_results (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, primary_archetype text, secondary_archetype text, scores jsonb, created_at timestamptz DEFAULT now());
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public can insert quiz results" ON quiz_results FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated can read quiz results" ON quiz_results FOR SELECT USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
-- Assessment modules (scalable add-on system)
CREATE TABLE IF NOT EXISTS assessment_modules (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, quiz_result_id uuid REFERENCES quiz_results(id) ON DELETE SET NULL, module_type text NOT NULL, primary_result text NOT NULL, secondary_result text, scores jsonb, created_at timestamptz DEFAULT now());
ALTER TABLE assessment_modules ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN CREATE POLICY "Public can insert assessment modules" ON assessment_modules FOR INSERT WITH CHECK (true); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE POLICY "Authenticated can read assessment modules" ON assessment_modules FOR SELECT USING (auth.role() = 'authenticated'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_assessment_modules_quiz_result ON assessment_modules (quiz_result_id);
CREATE INDEX IF NOT EXISTS idx_assessment_modules_type ON assessment_modules (module_type);
-- Atlas scheduling columns
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS published_at timestamptz;
ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS preview_token text;
UPDATE atlas_posts SET status = 'published', published_at = created_at WHERE is_published = true AND (status IS NULL OR status = 'draft');
UPDATE atlas_posts SET status = 'draft' WHERE is_published = false AND (status IS NULL OR status = 'draft');
CREATE INDEX IF NOT EXISTS idx_atlas_posts_status ON atlas_posts (status);
`;

/** GET /api/setup — check if atlas_posts table exists */
export async function GET() {
  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json(
      { status: "error", message: "Supabase not configured" },
      { status: 500 }
    );
  }

  const { error } = await supabase
    .from("atlas_posts")
    .select("id")
    .limit(1);

  if (error?.code === "PGRST205") {
    return NextResponse.json({
      status: "missing",
      message:
        "Table atlas_posts does not exist. Run the migration SQL in Supabase Dashboard > SQL Editor.",
      sql: MIGRATION_SQL.trim(),
    });
  }

  return NextResponse.json({
    status: "ok",
    message: "atlas_posts table exists and is accessible.",
  });
}

/**
 * POST /api/setup — run migration to create atlas_posts table
 * Requires: SUPABASE_DB_URL env var with postgres connection string
 * Format: postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres
 */
export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  const expected = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    return NextResponse.json(
      {
        error:
          "Database connection not configured. Run the migration SQL manually in the Supabase Dashboard SQL Editor.",
        sql: MIGRATION_SQL.trim(),
      },
      { status: 500 }
    );
  }

  const postgresModule = await import("postgres");
  const sql = postgresModule.default(dbUrl, { ssl: "require", connect_timeout: 15 });

  try {
    await sql`
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
      )
    `;

    await sql`ALTER TABLE atlas_posts ENABLE ROW LEVEL SECURITY`;

    await sql`
      DO $$ BEGIN
        CREATE POLICY "Public can read published posts"
          ON atlas_posts FOR SELECT USING (is_published = true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;

    await sql`
      DO $$ BEGIN
        CREATE POLICY "Authenticated users full access"
          ON atlas_posts FOR ALL USING (auth.role() = 'authenticated');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;

    await sql`
      CREATE OR REPLACE FUNCTION update_atlas_posts_updated_at()
      RETURNS trigger AS $$
      BEGIN NEW.updated_at = now(); RETURN NEW;
      END; $$ LANGUAGE plpgsql
    `;

    await sql`DROP TRIGGER IF EXISTS set_atlas_posts_updated_at ON atlas_posts`;

    await sql`
      CREATE TRIGGER set_atlas_posts_updated_at
        BEFORE UPDATE ON atlas_posts FOR EACH ROW
        EXECUTE FUNCTION update_atlas_posts_updated_at()
    `;

    // Rich editor, banner & tags columns (idempotent)
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS content_json jsonb`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS content_format text DEFAULT 'markdown'`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS banner_url text`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS banner_alt text`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'`;
    await sql`CREATE INDEX IF NOT EXISTS idx_atlas_posts_tags ON atlas_posts USING GIN (tags)`;

    // ─── email_subscribers table ────
    await sql`
      CREATE TABLE IF NOT EXISTS email_subscribers (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        email text NOT NULL UNIQUE,
        subscribed_at timestamptz DEFAULT now()
      )
    `;
    await sql`ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Admins can read subscribers"
          ON email_subscribers FOR SELECT USING (auth.role() = 'authenticated');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Anyone can subscribe"
          ON email_subscribers FOR INSERT WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;

    // ─── page_views table (analytics & UTM tracking) ────
    await sql`
      CREATE TABLE IF NOT EXISTS page_views (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        path text NOT NULL,
        referrer text,
        session_id text,
        country text,
        utm_source text,
        utm_medium text,
        utm_campaign text,
        utm_content text,
        utm_term text,
        created_at timestamptz DEFAULT now()
      )
    `;
    await sql`ALTER TABLE page_views ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Public can insert page views"
          ON page_views FOR INSERT WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Authenticated can read page views"
          ON page_views FOR SELECT USING (auth.role() = 'authenticated');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    // Add session_id & country columns if table already existed without them
    await sql`ALTER TABLE page_views ADD COLUMN IF NOT EXISTS session_id text`;
    await sql`ALTER TABLE page_views ADD COLUMN IF NOT EXISTS country text`;

    // ─── sessions table (duration & attribution tracking) ────
    await sql`
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
      )
    `;
    await sql`ALTER TABLE sessions ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Public can insert sessions"
          ON sessions FOR INSERT WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Public can update sessions"
          ON sessions FOR UPDATE USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Authenticated can read sessions"
          ON sessions FOR SELECT USING (auth.role() = 'authenticated');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;

    // ─── site_settings table (key-value config) ────
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key text PRIMARY KEY,
        value text NOT NULL,
        updated_at timestamptz DEFAULT now()
      )
    `;
    await sql`ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Public can read site settings"
          ON site_settings FOR SELECT USING (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Authenticated users can manage site settings"
          ON site_settings FOR ALL USING (auth.role() = 'authenticated');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;

    // ─── quiz_results table ────
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        primary_archetype text,
        secondary_archetype text,
        scores jsonb,
        created_at timestamptz DEFAULT now()
      )
    `;
    await sql`ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Public can insert quiz results"
          ON quiz_results FOR INSERT WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Authenticated can read quiz results"
          ON quiz_results FOR SELECT USING (auth.role() = 'authenticated');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;

    // ─── assessment_modules table (scalable add-on system) ────
    await sql`
      CREATE TABLE IF NOT EXISTS assessment_modules (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        quiz_result_id uuid REFERENCES quiz_results(id) ON DELETE SET NULL,
        module_type text NOT NULL,
        primary_result text NOT NULL,
        secondary_result text,
        scores jsonb,
        created_at timestamptz DEFAULT now()
      )
    `;
    await sql`ALTER TABLE assessment_modules ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Public can insert assessment modules"
          ON assessment_modules FOR INSERT WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Authenticated can read assessment modules"
          ON assessment_modules FOR SELECT USING (auth.role() = 'authenticated');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_assessment_modules_quiz_result ON assessment_modules (quiz_result_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_assessment_modules_type ON assessment_modules (module_type)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_assessment_modules_created ON assessment_modules (created_at DESC)`;

    // ─── Atlas scheduling columns ────
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft'`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS scheduled_at timestamptz`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS published_at timestamptz`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS preview_token text`;
    await sql`UPDATE atlas_posts SET status = 'published', published_at = created_at WHERE is_published = true AND (status IS NULL OR status = 'draft')`;
    await sql`UPDATE atlas_posts SET status = 'draft' WHERE is_published = false AND (status IS NULL OR status = 'draft')`;
    await sql`CREATE INDEX IF NOT EXISTS idx_atlas_posts_status ON atlas_posts (status)`;

    await sql.end();

    return NextResponse.json({
      status: "ok",
      message:
        "Migration completed. All tables created with RLS: atlas_posts, email_subscribers, page_views, sessions, site_settings, quiz_results, assessment_modules.",
    });
  } catch (e) {
    await sql.end().catch(() => {});
    console.error("[setup migration]", e instanceof Error ? e.message : e);
    return NextResponse.json(
      {
        error: "Migration failed. Check server logs or run the SQL manually in Supabase Dashboard.",
        sql: MIGRATION_SQL.trim(),
      },
      { status: 500 }
    );
  }
}
