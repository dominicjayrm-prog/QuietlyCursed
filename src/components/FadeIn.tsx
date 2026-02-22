"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  /** Extra delay in ms before starting the animation */
  delay?: number;
}

/**
 * Lightweight scroll-triggered fade-in using IntersectionObserver.
 * No external libraries. Triggers once when element enters viewport.
 */
export default function FadeIn({
  children,
  className = "",
  delay = 0,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay) {
            setTimeout(() => el.classList.add("fade-in-visible"), delay);
          } else {
            el.classList.add("fade-in-visible");
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`fade-in-hidden ${className}`}>
      {children}
    </div>
  );
}
