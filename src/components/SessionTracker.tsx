"use client";

import { useEffect } from "react";
import {
  hasTrackingConsent,
  sendSessionHeartbeat,
} from "@/lib/utm";

/**
 * Tracks session duration by sending heartbeats when:
 * - The tab becomes hidden (user switches tabs or minimizes)
 * - The page is about to unload (user closes tab or navigates away)
 * - Every 30 seconds while the page is visible (periodic heartbeat)
 */
export default function SessionTracker() {
  useEffect(() => {
    if (!hasTrackingConsent()) return;

    // Store entry page for this session
    try {
      if (!sessionStorage.getItem("qc_entry_page")) {
        sessionStorage.setItem("qc_entry_page", window.location.pathname);
      }
    } catch {
      // ignore
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") {
        sendSessionHeartbeat();
      }
    }

    function onBeforeUnload() {
      sendSessionHeartbeat();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);

    // Periodic heartbeat every 30s to capture long sessions
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        sendSessionHeartbeat();
      }
    }, 30000);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
      clearInterval(interval);
    };
  }, []);

  return null;
}
