"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureUtmParams, trackPageView } from "@/lib/utm";

export default function UtmCapture() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    // Always capture UTM params to sessionStorage (no consent needed for this)
    captureUtmParams();
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      // First render: track immediately
      isFirst.current = false;
      trackPageView();
    } else {
      // Subsequent navigations: track each new page
      trackPageView();
    }
  }, [pathname]);

  return null;
}
