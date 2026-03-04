"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-cyan-400/60">
          Something broke
        </p>
        <h1 className="mb-4 text-2xl font-bold text-white">
          Unexpected Error
        </h1>
        <p className="mb-8 max-w-md text-sm leading-relaxed text-white/50">
          A runtime error occurred. This has been logged. You can try again or
          head back to the homepage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-6 py-2.5 text-sm font-semibold text-cyan-400 transition-colors hover:bg-cyan-500/20 cursor-pointer"
          >
            Try Again
          </button>
          <a
            href="/"
            className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:border-white/20 hover:text-white/80"
          >
            Go Home
          </a>
        </div>
      </div>
    </section>
  );
}
