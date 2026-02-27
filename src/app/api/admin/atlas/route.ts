import { NextResponse } from "next/server";
import { requireAuth, getServiceClient, safeError } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

/** GET /api/admin/atlas — list all posts (including drafts) */
export async function GET(request: Request) {
  const limited = rateLimit(`admin-atlas-get:${getClientIp(request)}`, {
    limit: 30,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { data, error } = await service
    .from("atlas_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return safeError("admin/atlas GET", error);

  return NextResponse.json(data);
}

/** POST /api/admin/atlas — create a new post */
export async function POST(request: Request) {
  const limited = rateLimit(`admin-atlas-post:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const body = await request.json();

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  // Set defaults for new posts
  if (!body.status) body.status = "draft";
  body.is_published = body.status === "published";
  if (body.status === "published" && !body.published_at) {
    body.published_at = new Date().toISOString();
  }
  // Always generate a preview token for new posts
  body.preview_token = crypto.randomBytes(16).toString("hex");

  const { data, error } = await service
    .from("atlas_posts")
    .insert(body)
    .select()
    .single();

  if (error) return safeError("admin/atlas POST", error);

  return NextResponse.json(data, { status: 201 });
}
