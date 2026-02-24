import { NextResponse } from "next/server";
import { requireAuth, getServiceClient, safeError } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** GET /api/admin/subscribers — list all subscribers */
export async function GET(request: Request) {
  const limited = rateLimit(`admin-subs-get:${getClientIp(request)}`, {
    limit: 30,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const format = new URL(request.url).searchParams.get("format");

  const { data, error } = await service
    .from("email_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  if (error) return safeError("admin/subscribers GET", error);

  // CSV export
  if (format === "csv") {
    const rows = (data ?? []).map((s) => `${s.email},${s.subscribed_at}`);
    const csv = ["email,subscribed_at", ...rows].join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json(data);
}

/** DELETE /api/admin/subscribers?id=<uuid> — remove a subscriber */
export async function DELETE(request: Request) {
  const limited = rateLimit(`admin-subs-del:${getClientIp(request)}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const auth = await requireAuth(request);
  if (auth.error) return auth.error;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const service = getServiceClient();
  if (!service)
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });

  const { error } = await service
    .from("email_subscribers")
    .delete()
    .eq("id", id);

  if (error) return safeError("admin/subscribers DELETE", error);

  return NextResponse.json({ ok: true });
}
