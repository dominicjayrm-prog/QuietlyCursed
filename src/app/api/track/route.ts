import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";

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

  // Detect country from hosting/CDN headers
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null;

  const { error } = await supabase.from("page_views").insert({
    path: String(body.path || "/"),
    referrer: body.referrer ? String(body.referrer) : null,
    session_id: body.session_id ? String(body.session_id) : null,
    country: country,
    utm_source: body.utm_source ? String(body.utm_source) : null,
    utm_medium: body.utm_medium ? String(body.utm_medium) : null,
    utm_campaign: body.utm_campaign ? String(body.utm_campaign) : null,
    utm_content: body.utm_content ? String(body.utm_content) : null,
    utm_term: body.utm_term ? String(body.utm_term) : null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
