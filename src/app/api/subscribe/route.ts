import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/api-helpers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

/** POST /api/subscribe — email signup (public, rate-limited) */
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

  const service = getServiceClient();
  if (!service) {
    return NextResponse.json(
      { error: "Service unavailable." },
      { status: 503 }
    );
  }

  // Simple insert — service role bypasses RLS
  const { error } = await service
    .from("email_subscribers")
    .insert({ email });

  if (error) {
    // 23505 = unique_violation — email already subscribed, treat as success
    if (error.code === "23505") {
      return NextResponse.json({ ok: true });
    }
    console.error("subscribe error:", error.code, error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
