import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import postgres from "postgres";

/**
 * GET /api/setup — check if atlas_posts table exists
 */
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
        "Table atlas_posts does not exist. Run the migration SQL in Supabase Dashboard > SQL Editor, or POST to /api/setup with SUPABASE_DB_URL configured.",
    });
  }

  return NextResponse.json({
    status: "ok",
    message: "atlas_posts table exists and is accessible.",
  });
}

/**
 * POST /api/setup — run migration to create atlas_posts table
 * Requires: SUPABASE_DB_URL env var or service role key auth
 */
export async function POST(request: Request) {
  // Auth: require service role key
  const auth = request.headers.get("authorization");
  const expected = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!expected || auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Try connecting via SUPABASE_DB_URL or construct from project ref
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    // Try connecting using the project ref and service role key as password
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!projectUrl) {
      return NextResponse.json(
        {
          error:
            "No SUPABASE_DB_URL configured. Set it in your Vercel env vars, or run the migration SQL manually.",
        },
        { status: 500 }
      );
    }

    // Extract project ref from URL: https://<ref>.supabase.co
    const ref = projectUrl.replace("https://", "").replace(".supabase.co", "");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Try pooler connection with service role key as password
    const poolerUrl = `postgresql://postgres.${ref}:${serviceKey}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

    try {
      return await runMigration(poolerUrl);
    } catch {
      // Try direct connection
      const directUrl = `postgresql://postgres.${ref}:${serviceKey}@db.${ref}.supabase.co:5432/postgres`;
      try {
        return await runMigration(directUrl);
      } catch (e) {
        return NextResponse.json(
          {
            error: `Migration failed. Set SUPABASE_DB_URL in Vercel env vars or run SQL manually. Details: ${e instanceof Error ? e.message : "Unknown error"}`,
          },
          { status: 500 }
        );
      }
    }
  }

  try {
    return await runMigration(dbUrl);
  } catch (e) {
    return NextResponse.json(
      {
        error: `Migration failed: ${e instanceof Error ? e.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}

async function runMigration(connectionString: string) {
  const sql = postgres(connectionString, {
    ssl: "require",
    connect_timeout: 10,
  });

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

    // Create policies (ignore if they already exist)
    await sql`
      DO $$ BEGIN
        CREATE POLICY "Public can read published posts"
          ON atlas_posts FOR SELECT
          USING (is_published = true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;

    await sql`
      DO $$ BEGIN
        CREATE POLICY "Authenticated users full access"
          ON atlas_posts FOR ALL
          USING (auth.role() = 'authenticated');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$
    `;

    // Auto-update trigger
    await sql`
      CREATE OR REPLACE FUNCTION update_atlas_posts_updated_at()
      RETURNS trigger AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `;

    await sql`DROP TRIGGER IF EXISTS set_atlas_posts_updated_at ON atlas_posts`;

    await sql`
      CREATE TRIGGER set_atlas_posts_updated_at
        BEFORE UPDATE ON atlas_posts
        FOR EACH ROW
        EXECUTE FUNCTION update_atlas_posts_updated_at()
    `;

    await sql.end();

    return NextResponse.json({
      status: "ok",
      message: "Migration completed successfully. atlas_posts table created.",
    });
  } catch (e) {
    await sql.end();
    throw e;
  }
}
