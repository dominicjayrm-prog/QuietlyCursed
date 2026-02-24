import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware — runs before every matched route.
 *
 * 1. Protects /admin (non-login) pages: redirects to /admin/login when
 *    no Supabase auth cookies are present.
 * 2. Restricts /api/admin/* to same-origin requests (basic CORS).
 */

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "";

function isAuthenticated(request: NextRequest): boolean {
  // Supabase SSR stores the session across cookies whose names start
  // with "sb-" and contain "-auth-token".  If at least one exists the
  // user *likely* has a session; the API routes still verify the token.
  for (const [name] of request.cookies.getAll().map((c) => [c.name])) {
    if (name.startsWith("sb-") && name.includes("-auth-token")) return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── CORS gate for /api/admin/* ──────────────────────────────────
  if (pathname.startsWith("/api/admin")) {
    const origin = request.headers.get("origin");

    // Preflight
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    // Block cross-origin requests (origin header is only absent for
    // same-origin navigations / server-side fetches — both are fine).
    if (origin && SITE_ORIGIN && origin !== SITE_ORIGIN) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: corsHeaders(origin) }
      );
    }

    // Attach CORS headers to the response
    const response = NextResponse.next();
    applyCorsHeaders(response.headers, origin);
    return response;
  }

  // ── Auth gate for /admin pages (except /admin/login) ────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated(request)) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// ── Helpers ─────────────────────────────────────────────────────────

function corsHeaders(origin: string | null): HeadersInit {
  const allowed = SITE_ORIGIN || origin || "";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

function applyCorsHeaders(headers: Headers, origin: string | null) {
  const allowed = SITE_ORIGIN || origin || "";
  headers.set("Access-Control-Allow-Origin", allowed);
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
