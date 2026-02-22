import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

/**
 * GET /api/setup
 * Checks if atlas_posts table exists and returns migration SQL if not.
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
        "Table atlas_posts does not exist. Run the migration SQL in Supabase Dashboard > SQL Editor.",
    });
  }

  return NextResponse.json({
    status: "ok",
    message: "atlas_posts table exists and is accessible.",
  });
}
