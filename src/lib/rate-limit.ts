import { NextResponse } from "next/server";

/**
 * Simple in-memory sliding-window rate limiter.
 * Each serverless instance keeps its own window — this won't provide
 * perfect global limiting, but it stops trivial abuse without adding
 * an external dependency (Redis, Upstash, etc.).
 */

interface WindowEntry {
  count: number;
  resetAt: number;
}

const windows = new Map<string, WindowEntry>();

// Evict stale entries every 60s to avoid unbounded memory growth
const EVICT_INTERVAL = 60_000;
let lastEvict = Date.now();

function evictStale() {
  const now = Date.now();
  if (now - lastEvict < EVICT_INTERVAL) return;
  lastEvict = now;
  for (const [key, entry] of windows) {
    if (now > entry.resetAt) windows.delete(key);
  }
}

/**
 * Check rate limit for a given key.
 * Returns null if allowed, or a 429 NextResponse if blocked.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): NextResponse | null {
  evictStale();

  const now = Date.now();
  const entry = windows.get(key);

  if (!entry || now > entry.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;
  if (entry.count > limit) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)),
        },
      }
    );
  }

  return null;
}

/** Extract a client identifier from the request (IP or fallback). */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
