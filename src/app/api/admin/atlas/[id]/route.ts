import { NextResponse } from "next/server";
import { requireAuth, getServiceClient, safeError } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

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

  const { data, error } = await service
    .from("atlas_posts")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return safeError("admin/atlas PATCH", error);

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
