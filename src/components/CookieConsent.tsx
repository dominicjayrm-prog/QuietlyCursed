"use client";

import { useState, useEffect } from "react";
import { consentDecisionMade, setConsent } from "@/lib/tracking";

/**
 * Minimal, non-intrusive cookie consent banner.
 * Stored in localStorage so it only shows once.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't made a decision yet
    if (!consentDecisionMade()) {
      // Small delay so it doesn't flash on initial load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    setConsent(true);
    setVisible(false);

    // Update current session's consent status
    import("@/lib/supabase/client").then(({ getSupabase }) => {
      const supabase = getSupabase();
      if (!supabase) return;
      const sessionId = sessionStorage.getItem("qc_session_id");
      if (sessionId) {
        supabase
          .from("sessions")
          .update({ cookie_consent: true })
          .eq("id", sessionId)
          .then(() => {});
      }
    });
  }

  function handleDecline() {
    setConsent(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade-in-up p-4">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur-xl px-6 py-4 shadow-2xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/50 leading-relaxed">
            We use anonymous session tracking to understand how visitors find and use this site.
            No personal data is collected.
          </p>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleDecline}
              className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium text-white/30 transition-colors hover:text-white/50 cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 text-xs font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 cursor-pointer"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
