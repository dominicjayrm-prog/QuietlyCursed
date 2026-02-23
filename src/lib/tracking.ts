"use client";

/**
 * Client-side session + UTM tracking utilities.
 *
 * Session lifecycle:
 *   1. On first page load, generate a session ID (stored in sessionStorage).
 *   2. Capture UTM params from URL, merge with any existing stored params.
 *   3. Insert a session row in Supabase on first visit.
 *   4. Insert a page_view row for every navigation.
 *   5. Heartbeat every 30s to update session duration.
 *   6. On visibilitychange/beforeunload, send a final duration update.
 */

// ─── Types ──────────────────────────────────────────────────────────
export interface UtmData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface GeoData {
  country: string | null;
  city: string | null;
}

// ─── Constants ──────────────────────────────────────────────────────
const SESSION_KEY = "qc_session_id";
const UTM_KEY = "qc_utm";
const SESSION_START_KEY = "qc_session_start";
const CONSENT_KEY = "qc_cookie_consent";
const HEARTBEAT_INTERVAL = 30_000; // 30 seconds

// ─── Session ID ─────────────────────────────────────────────────────
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    sessionStorage.setItem(SESSION_START_KEY, Date.now().toString());
  }
  return id;
}

export function getSessionStartTime(): number {
  if (typeof window === "undefined") return Date.now();
  const stored = sessionStorage.getItem(SESSION_START_KEY);
  return stored ? parseInt(stored, 10) : Date.now();
}

export function getSessionDuration(): number {
  return Math.floor((Date.now() - getSessionStartTime()) / 1000);
}

export function isNewSession(): boolean {
  if (typeof window === "undefined") return true;
  return !sessionStorage.getItem(SESSION_KEY);
}

// ─── UTM capture ────────────────────────────────────────────────────
const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function captureUtmParams(): UtmData {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: UtmData = {};

  for (const key of UTM_PARAMS) {
    const value = params.get(key);
    if (value) {
      (utm as Record<string, string>)[key] = value;
    }
  }

  // Merge with existing stored UTM (first touch wins for session)
  const existing = getStoredUtm();
  const merged = { ...existing, ...utm };

  if (Object.keys(merged).length > 0) {
    try {
      sessionStorage.setItem(UTM_KEY, JSON.stringify(merged));
    } catch {
      // sessionStorage unavailable
    }
  }

  return merged;
}

export function getStoredUtm(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(UTM_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ─── Cookie consent ─────────────────────────────────────────────────
export function hasConsented(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "true";
}

export function setConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, accepted ? "true" : "false");
}

export function consentDecisionMade(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) !== null;
}

// ─── Device detection ───────────────────────────────────────────────
export function getDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "mobile";
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  return "desktop";
}

export function getBrowser(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Other";
}

// ─── Geo fetch ──────────────────────────────────────────────────────
export async function fetchGeo(): Promise<GeoData> {
  try {
    const res = await fetch("/api/geo", { signal: AbortSignal.timeout(4000) });
    if (res.ok) return await res.json();
  } catch {
    // non-critical
  }
  return { country: null, city: null };
}

// ─── Heartbeat (session duration updater) ───────────────────────────
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

export function startHeartbeat(
  updateFn: (durationSeconds: number) => void
): void {
  if (heartbeatTimer) return;
  heartbeatTimer = setInterval(() => {
    updateFn(getSessionDuration());
  }, HEARTBEAT_INTERVAL);

  // Also update on visibility change and before unload
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      updateFn(getSessionDuration());
    }
  });
}

export function stopHeartbeat(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}
