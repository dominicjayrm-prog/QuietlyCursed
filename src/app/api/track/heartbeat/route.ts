import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

/**
 * POST /api/track/heartbeat — upsert session with duration
 * Called via sendBeacon on visibility change / page unload
 */
export async function POST(request: Request) {
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

  const sessionId = body.session_id ? String(body.session_id) : null;
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
      entry_page: body.entry_page ? String(body.entry_page) : null,
      country,
      utm_source: body.utm_source ? String(body.utm_source) : null,
      utm_medium: body.utm_medium ? String(body.utm_medium) : null,
      utm_campaign: body.utm_campaign ? String(body.utm_campaign) : null,
      utm_content: body.utm_content ? String(body.utm_content) : null,
      utm_term: body.utm_term ? String(body.utm_term) : null,
    },
    { onConflict: "session_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
