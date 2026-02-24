export default function AtlasLoading() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Header skeleton */}
      <div className="mb-16 text-center">
        <div className="mx-auto mb-6 h-5 w-10 rounded bg-white/5 animate-pulse" />
        <div className="mx-auto mb-4 h-10 w-48 rounded bg-white/5 animate-pulse" />
        <div className="mx-auto h-5 w-80 rounded bg-white/5 animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-white/5 animate-pulse" />
              <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
            </div>
            <div className="mb-3 h-5 w-3/4 rounded bg-white/5 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-white/5 animate-pulse" />
            </div>
            <div className="mt-4 h-3 w-28 rounded bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}
