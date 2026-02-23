"use client";

import { useState, useEffect } from "react";
import {
  hasConsentChoice,
  setTrackingConsent,
  trackPageView,
} from "@/lib/utm";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show banner only if user hasn't made a choice yet
    if (!hasConsentChoice()) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  function accept() {
    setTrackingConsent(true);
    setShow(false);
    // Fire the tracking call for the current page now that consent was given
    trackPageView();
  }

  function decline() {
    setTrackingConsent(false);
    setShow(false);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-neutral-950/95 backdrop-blur-sm p-4">
      <div className="mx-auto max-w-4xl flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/60">
          We use first-party analytics to understand how visitors find us and
          improve the site. No data is shared with third parties.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="rounded-lg border border-white/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white/40 transition-colors hover:border-white/20 hover:text-white/60 cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 text-xs font-medium uppercase tracking-wider text-cyan-400 transition-colors hover:bg-cyan-500/30 cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
