import type { Metadata } from "next";
import { traps } from "@/data/traps";
import { buildMetadata } from "@/lib/seo";
import TrapCard from "@/components/TrapCard";
import EyeGlow from "@/components/EyeGlow";

export const metadata: Metadata = buildMetadata({
  title: "The Atlas",
  description:
    "A directory of psychological traps — cognitive biases, logical fallacies, and emotional shortcuts mapped and explained.",
  path: "/atlas",
});

export default function AtlasPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-16 text-center">
        <EyeGlow size="sm" className="mx-auto mb-6 w-10 h-5" />
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
          The Atlas
        </h1>
        <p className="mx-auto max-w-lg text-base text-white/45 md:text-lg">
          A directory of psychological traps. Pick one. Learn how it works.
          Decide if you&apos;re inside it.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {traps.map((trap) => (
          <TrapCard key={trap.slug} trap={trap} />
        ))}
      </div>
    </section>
  );
}
