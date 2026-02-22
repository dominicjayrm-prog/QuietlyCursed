import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/atlas";
import EyeGlow from "@/components/EyeGlow";
import BrainIcon from "@/components/BrainIcon";

export const metadata: Metadata = buildMetadata({
  title: "The Atlas",
  description:
    "The written case files behind each episode. Explore the psychology. Understand the pattern. See where it lives in you.",
  path: "/atlas",
});

export const revalidate = 60;

export default async function AtlasPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-16 text-center">
        <EyeGlow size="sm" className="mx-auto mb-6 w-10 h-5" />
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
          The Atlas
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-white/45 md:text-lg">
          The written case files behind each episode. Explore the psychology.
          Understand the pattern. See where it lives in you.
        </p>
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
          <EyeGlow size="sm" className="mx-auto mb-4 w-8 h-4 opacity-30" />
          <p className="text-sm text-white/30">
            Case files are being compiled. The first entry is coming soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/atlas/${post.slug}`}
              className="group relative block rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.04] hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.15)]"
            >
              <div className="mb-4 flex items-center gap-3">
                <BrainIcon className="w-5 h-5 text-purple-400/70 transition-colors group-hover:text-purple-400" />
                <time
                  dateTime={post.created_at}
                  className="text-xs text-white/30 tracking-wider uppercase"
                >
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white/90 transition-colors group-hover:text-cyan-400">
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                {post.featured_description || post.subtitle || ""}
              </p>
              <div className="mt-4 text-xs font-medium text-cyan-500/60 tracking-wider uppercase transition-colors group-hover:text-cyan-400">
                Enter Case File &rarr;
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
