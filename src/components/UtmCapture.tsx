"use client";

import { useEffect } from "react";
import { captureUtmParams, trackPageView } from "@/lib/utm";

export default function UtmCapture() {
  useEffect(() => {
    // Always capture UTM params to sessionStorage (no consent needed for this)
    captureUtmParams();
    // Send page view if user has consented
    trackPageView();
  }, []);

  return null;
}
