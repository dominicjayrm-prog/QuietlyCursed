import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServiceClient } from "@/lib/api-helpers";

/**
 * POST /api/cron/publish — Auto-publish scheduled posts
 *
 * This endpoint should be called by a cron job (e.g. Vercel Cron, external service)
 * every minute. It finds all posts with status='scheduled' whose scheduled_at
 * timestamp has passed and sets them to published.
 *
 * Protected by CRON_SECRET env var. Configure in Vercel:
 *   vercel.json: { "crons": [{ "path": "/api/cron/publish", "schedule": "* * * * *" }] }
 *
 * Or call externally with:
 *   curl -X POST https://yoursite.com/api/cron/publish \
 *     -H "Authorization: Bearer YOUR_CRON_SECRET"
 */
export async function POST(request: Request) {
  // Verify cron secret (Vercel sends it automatically, or use Bearer token)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const service = getServiceClient();
  if (!service) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const now = new Date().toISOString();

  // Find all scheduled posts whose scheduled_at is in the past
  const { data: due, error: fetchError } = await service
    .from("atlas_posts")
    .select("id, slug")
    .eq("status", "scheduled")
    .lte("scheduled_at", now);

  if (fetchError) {
    console.error("[cron/publish] Failed to fetch scheduled posts:", fetchError.message);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  if (!due || due.length === 0) {
    return NextResponse.json({ published: 0 });
  }

  const ids = due.map((p) => p.id);

  // Update all due posts to published
  const { error: updateError } = await service
    .from("atlas_posts")
    .update({
      status: "published",
      is_published: true,
      published_at: now,
    })
    .in("id", ids);

  if (updateError) {
    console.error("[cron/publish] Failed to publish:", updateError.message);
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 });
  }

  // Revalidate public pages
  revalidatePath("/atlas");
  for (const post of due) {
    if (post.slug) {
      revalidatePath(`/atlas/${post.slug}`);
    }
  }

  console.log(`[cron/publish] Published ${ids.length} post(s): ${due.map((p) => p.slug).join(", ")}`);

  return NextResponse.json({ published: ids.length, slugs: due.map((p) => p.slug) });
}

/** GET handler for Vercel Cron (Vercel sends GET requests for crons) */
export async function GET(request: Request) {
  return POST(request);
}
