"use client";

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export type UtmData = Partial<Record<(typeof UTM_PARAMS)[number], string>>;

const SESSION_KEY = "qc_utm";
const SESSION_ID_KEY = "qc_session_id";
const SESSION_START_KEY = "qc_session_start";
const CONSENT_KEY = "qc_tracking_consent";

export function captureUtmParams(): UtmData {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const utm: UtmData = {};

  for (const key of UTM_PARAMS) {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
    }
  }

  if (Object.keys(utm).length > 0) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(utm));
    } catch {
      // sessionStorage unavailable
    }
  }

  return utm;
}

export function getStoredUtm(): UtmData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Generate or retrieve a session ID for grouping page views */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_ID_KEY, id);
      sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/** Get the session start timestamp in ms */
export function getSessionStart(): number {
  if (typeof window === "undefined") return Date.now();
  try {
    const raw = sessionStorage.getItem(SESSION_START_KEY);
    return raw ? Number(raw) : Date.now();
  } catch {
    return Date.now();
  }
}

/** Get current session duration in seconds */
export function getSessionDuration(): number {
  return Math.round((Date.now() - getSessionStart()) / 1000);
}

/** Send a session heartbeat (duration update) via sendBeacon or fetch */
export function sendSessionHeartbeat(): void {
  if (typeof window === "undefined") return;
  if (!hasTrackingConsent()) return;

  const utm = getStoredUtm();
  const payload = JSON.stringify({
    session_id: getSessionId(),
    duration_seconds: getSessionDuration(),
    entry_page: sessionStorage.getItem("qc_entry_page") || "/",
    utm_source: utm.utm_source || null,
    utm_medium: utm.utm_medium || null,
    utm_campaign: utm.utm_campaign || null,
    utm_content: utm.utm_content || null,
    utm_term: utm.utm_term || null,
  });

  // Prefer sendBeacon (works on tab close), fall back to fetch
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/track/heartbeat",
      new Blob([payload], { type: "application/json" })
    );
  } else {
    fetch("/api/track/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}

/** Check if user has given tracking consent */
export function hasTrackingConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

/** Check if user has made any consent choice (accept or decline) */
export function hasConsentChoice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_KEY) !== null;
  } catch {
    return false;
  }
}

/** Set tracking consent */
export function setTrackingConsent(consent: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONSENT_KEY, consent ? "true" : "false");
  } catch {
    // localStorage unavailable
  }
}

/** Send a page view to the tracking API */
export async function trackPageView(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!hasTrackingConsent()) return;

  const utm = getStoredUtm();
  const sessionId = getSessionId();

  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || null,
        session_id: sessionId,
        utm_source: utm.utm_source || null,
        utm_medium: utm.utm_medium || null,
        utm_campaign: utm.utm_campaign || null,
        utm_content: utm.utm_content || null,
        utm_term: utm.utm_term || null,
      }),
    });
  } catch {
    // tracking failed silently
  }
}
