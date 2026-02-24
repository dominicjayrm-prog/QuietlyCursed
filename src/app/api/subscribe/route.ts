import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** POST /api/subscribe — email signup */
export async function POST(request: Request) {
  const limited = rateLimit(`subscribe:${getClientIp(request)}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const email = body?.email?.trim()?.toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 400 }
    );
  }

  const supabase = getServiceSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service unavailable." },
      { status: 503 }
    );
  }

  // Upsert: if they already exist, just return success silently
  const { error } = await supabase
    .from("email_subscribers")
    .upsert(
      { email, confirmed: false },
      { onConflict: "email", ignoreDuplicates: true }
    );

  if (error) {
    console.error("subscribe error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
