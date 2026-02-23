import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/geo — Returns visitor's country/city from request headers.
 *
 * Vercel / Cloudflare / most CDNs set geo headers automatically.
 * Falls back to a free IP geolocation API if headers aren't available.
 */
export async function GET(request: NextRequest) {
  // 1. Try platform-provided geo headers (Vercel, Cloudflare, etc.)
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    null;

  const city =
    request.headers.get("x-vercel-ip-city") ||
    request.headers.get("cf-ipcity") ||
    null;

  if (country) {
    return NextResponse.json({ country, city: city ? decodeURIComponent(city) : null });
  }

  // 2. Fallback: use forwarded IP with free geolocation service
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;

  if (ip && ip !== "127.0.0.1" && ip !== "::1") {
    try {
      const res = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          country: data.country_code || null,
          city: data.city || null,
        });
      }
    } catch {
      // Geolocation failed — non-critical, return null
    }
  }

  return NextResponse.json({ country: null, city: null });
}
