import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuth, getServiceClient, safeError } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** GET /api/admin/settings — list all site settings */
export async function GET(request: Request) {
  const limited = rateLimit(`admin-settings-get:${getClientIp(request)}`, {
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
    .from("site_settings")
    .select("*")
    .order("key");

  if (error) return safeError("admin/settings GET", error);

  return NextResponse.json(data);
}

/** PATCH /api/admin/settings — upsert a single setting { key, value } */
export async function PATCH(request: Request) {
  const limited = rateLimit(`admin-settings-patch:${getClientIp(request)}`, {
    limit: 20,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const body = await request.json();
  const { key, value } = body as { key?: string; value?: string };

  if (!key || typeof key !== "string") {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }
  if (typeof value !== "string") {
    return NextResponse.json({ error: "Missing value" }, { status: 400 });
  }

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { data, error } = await service
    .from("site_settings")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    )
    .select()
    .single();

  if (error) return safeError("admin/settings PATCH", error);

  revalidatePath("/");

  return NextResponse.json(data);
}
