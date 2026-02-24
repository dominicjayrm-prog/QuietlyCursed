import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * POST /api/track/heartbeat — upsert session with duration
 * Called via sendBeacon on visibility change / page unload
 */
export async function POST(request: Request) {
  // Rate limit: 20 heartbeats per minute per IP
  const limited = rateLimit(`heartbeat:${getClientIp(request)}`, {
    limit: 20,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = body.session_id ? String(body.session_id).slice(0, 128) : null;
  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  const durationSeconds = Math.max(
    0,
    Math.min(86400, Math.round(Number(body.duration_seconds) || 0))
  );

  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null;

  const { error } = await supabase.from("sessions").upsert(
    {
      session_id: sessionId,
      last_seen_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
      entry_page: body.entry_page ? String(body.entry_page).slice(0, 2048) : null,
      country,
      utm_source: body.utm_source ? String(body.utm_source).slice(0, 256) : null,
      utm_medium: body.utm_medium ? String(body.utm_medium).slice(0, 256) : null,
      utm_campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 256) : null,
      utm_content: body.utm_content ? String(body.utm_content).slice(0, 256) : null,
      utm_term: body.utm_term ? String(body.utm_term).slice(0, 256) : null,
    },
    { onConflict: "session_id" }
  );

  if (error) {
    console.error("[heartbeat]", error.message);
    return NextResponse.json({ error: "Heartbeat failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
