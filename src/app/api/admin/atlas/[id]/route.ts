import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth, getServiceClient, safeError } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
/** Generate a random hex token using Web Crypto API */
function generateToken(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** PATCH /api/admin/atlas/[id] — update a post */
export async function PATCH(request: Request, context: RouteContext) {
  const limited = rateLimit(`admin-atlas-patch:${getClientIp(request)}`, {
    limit: 20,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const body = await request.json();

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  // Sync is_published with status for backwards compatibility
  if (body.status) {
    body.is_published = body.status === "published";
    if (body.status === "published" && !body.published_at) {
      body.published_at = new Date().toISOString();
    }
  }

  // Generate preview token if saving a draft (if not already set)
  if (body.status === "draft") {
    const { data: existing } = await service
      .from("atlas_posts")
      .select("preview_token")
      .eq("id", id)
      .single();
    if (!existing?.preview_token) {
      body.preview_token = generateToken();
    }
  }

  const { data, error } = await service
    .from("atlas_posts")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return safeError("admin/atlas PATCH", error);

  // Revalidate public pages when status changes
  revalidatePath("/atlas");
  if (data?.slug) {
    revalidatePath(`/atlas/${data.slug}`);
  }

  return NextResponse.json(data);
}

/** DELETE /api/admin/atlas/[id] — delete a post */
export async function DELETE(request: Request, context: RouteContext) {
  const limited = rateLimit(`admin-atlas-del:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const { id } = await context.params;

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { error } = await service.from("atlas_posts").delete().eq("id", id);

  if (error) return safeError("admin/atlas DELETE", error);

  return NextResponse.json({ success: true });
}
