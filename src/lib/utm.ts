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
