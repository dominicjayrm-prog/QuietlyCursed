import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import postgres from "postgres";

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
          "SUPABASE_DB_URL not configured. Add your Supabase database connection string to Vercel env vars, or run the migration SQL manually in the Supabase Dashboard SQL Editor.",
        sql: MIGRATION_SQL.trim(),
      },
      { status: 500 }
    );
  }

  const sql = postgres(dbUrl, { ssl: "require", connect_timeout: 15 });

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

    // Rich editor & banner columns (idempotent)
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS content_json jsonb`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS content_format text DEFAULT 'markdown'`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS banner_url text`;
    await sql`ALTER TABLE atlas_posts ADD COLUMN IF NOT EXISTS banner_alt text`;

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

    await sql.end();

    return NextResponse.json({
      status: "ok",
      message:
        "Migration completed. atlas_posts and page_views tables created with RLS.",
    });
  } catch (e) {
    await sql.end().catch(() => {});
    return NextResponse.json(
      {
        error: `Migration failed: ${e instanceof Error ? e.message : "Unknown error"}. Try running the SQL manually in Supabase Dashboard.`,
        sql: MIGRATION_SQL.trim(),
      },
      { status: 500 }
    );
  }
}
