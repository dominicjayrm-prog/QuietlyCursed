import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Rate limit: 30 page-view tracks per minute per IP
  const limited = rateLimit(`track:${getClientIp(request)}`, {
    limit: 30,
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

  // Detect country from hosting/CDN headers
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null;

  const { error } = await supabase.from("page_views").insert({
    path: String(body.path || "/").slice(0, 2048),
    referrer: body.referrer ? String(body.referrer).slice(0, 2048) : null,
    session_id: body.session_id ? String(body.session_id).slice(0, 128) : null,
    country: country,
    utm_source: body.utm_source ? String(body.utm_source).slice(0, 256) : null,
    utm_medium: body.utm_medium ? String(body.utm_medium).slice(0, 256) : null,
    utm_campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 256) : null,
    utm_content: body.utm_content ? String(body.utm_content).slice(0, 256) : null,
    utm_term: body.utm_term ? String(body.utm_term).slice(0, 256) : null,
  });

  if (error) {
    console.error("[track]", error.message);
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
