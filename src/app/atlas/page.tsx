import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getPublishedPosts, getAllTags } from "@/lib/atlas";
import EyeGlow from "@/components/EyeGlow";
import AtlasGrid from "@/components/AtlasGrid";

export const metadata: Metadata = buildMetadata({
  title: "The Atlas",
  description:
    "The written case files behind each episode. Explore the psychology. Understand the pattern. See where it lives in you.",
  path: "/atlas",
});

export const revalidate = 60;

export default async function AtlasPage() {
  const [posts, allTags] = await Promise.all([
    getPublishedPosts(),
    getAllTags(),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-16 text-center animate-fade-in-up">
        <EyeGlow size="sm" className="mx-auto mb-6 w-10 h-5" />
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
          The Atlas
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
          The written case files behind each episode. Explore the psychology.
          Understand the pattern. See where it lives in you.
        </p>
      </div>

      <AtlasGrid posts={posts} allTags={allTags} />
    </section>
  );
}
