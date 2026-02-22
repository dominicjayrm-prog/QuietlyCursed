"use client";

import { useEffect } from "react";
import { captureUtmParams, getStoredUtm } from "@/lib/utm";

export default function UtmCapture() {
  useEffect(() => {
    const utm = captureUtmParams();
    const merged = { ...getStoredUtm(), ...utm };

    // Defer Supabase import so it never blocks initial paint
    import("@/lib/supabase/client").then(({ getSupabase }) => {
      const supabase = getSupabase();
      if (supabase) {
        supabase
          .from("page_views")
          .insert({
            path: window.location.pathname,
            referrer: document.referrer || null,
            utm_source: merged.utm_source || null,
            utm_medium: merged.utm_medium || null,
            utm_campaign: merged.utm_campaign || null,
            utm_content: merged.utm_content || null,
            utm_term: merged.utm_term || null,
          })
          .then(() => {});
      }
    });
  }, []);

  return null;
}
