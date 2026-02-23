"use client";

import { useEffect, useRef } from "react";
import {
  getSessionId,
  isNewSession,
  captureUtmParams,
  getStoredUtm,
  getSessionDuration,
  fetchGeo,
  getDeviceType,
  getBrowser,
  startHeartbeat,
  hasConsented,
} from "@/lib/tracking";

/**
 * Invisible component mounted in the root layout.
 * Handles UTM capture, session creation, page view logging,
 * and session duration heartbeat.
 */
export default function UtmCapture() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const newSession = isNewSession();
    const sessionId = getSessionId();
    const utm = captureUtmParams();
    const merged = { ...getStoredUtm(), ...utm };

    // Defer Supabase import so it never blocks initial paint
    import("@/lib/supabase/client").then(async ({ getSupabase }) => {
      const supabase = getSupabase();
      if (!supabase) return;

      // Fetch geo data (non-blocking for the rest)
      const geo = await fetchGeo();

      const device = getDeviceType();
      const browser = getBrowser();

      // ── Insert page view ─────────────────────────────────
      supabase
        .from("page_views")
        .insert({
          path: window.location.pathname,
          referrer: document.referrer || null,
          session_id: sessionId,
          country: geo.country,
          city: geo.city,
          device_type: device,
          browser,
          utm_source: merged.utm_source || null,
          utm_medium: merged.utm_medium || null,
          utm_campaign: merged.utm_campaign || null,
          utm_content: merged.utm_content || null,
          utm_term: merged.utm_term || null,
        })
        .then(() => {});

      // ── Create session row (first visit only) ────────────
      if (newSession) {
        supabase
          .from("sessions")
          .insert({
            id: sessionId,
            landing_page: window.location.pathname + window.location.search,
            referrer: document.referrer || null,
            country: geo.country,
            city: geo.city,
            device_type: device,
            browser,
            cookie_consent: hasConsented(),
            utm_source: merged.utm_source || null,
            utm_medium: merged.utm_medium || null,
            utm_campaign: merged.utm_campaign || null,
            utm_content: merged.utm_content || null,
            utm_term: merged.utm_term || null,
          })
          .then(() => {});
      } else {
        // Returning navigation — increment page count
        supabase.rpc("increment_page_count", { sid: sessionId }).then(() => {});
      }

      // ── Heartbeat: update session duration every 30s ─────
      startHeartbeat((durationSeconds) => {
        supabase
          .from("sessions")
          .update({
            duration_seconds: durationSeconds,
            last_seen_at: new Date().toISOString(),
          })
          .eq("id", sessionId)
          .then(() => {});
      });
    });
  }, []);

  return null;
}
