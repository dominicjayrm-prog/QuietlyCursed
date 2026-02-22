import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import EyeGlow from "@/components/EyeGlow";
import TraitQuiz from "@/components/TraitQuiz";

export const metadata: Metadata = buildMetadata({
  title: "Trait Index",
  description:
    "Discover your psychological archetype. A 12-question personality quiz that maps your hidden patterns — The Watcher, The Prototype, The Container, The Climber, The Ghost, or The Peacemaker.",
  path: "/trait-index",
});

export default function TraitIndexPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-12 text-center">
        <EyeGlow size="sm" className="mx-auto mb-6 w-10 h-5" />
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          The Trait Index
        </h1>
        <p className="mx-auto max-w-lg text-base text-white/45 md:text-lg">
          12 questions. 6 archetypes. Discover which psychological pattern
          runs deepest in you.
        </p>
      </div>

      {/* Quiz */}
      <TraitQuiz />
    </section>
  );
}
