"use client";

import { useEffect } from "react";
import { captureUtmParams, getStoredUtm } from "@/lib/utm";
import { getSupabase } from "@/lib/supabase/client";

export default function UtmCapture() {
  useEffect(() => {
    const utm = captureUtmParams();
    const merged = { ...getStoredUtm(), ...utm };

    // Track page view directly in Supabase (fire-and-forget)
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
  }, []);

  return null;
}
