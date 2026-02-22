import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { traps, getTrapBySlug, getRelatedTraps } from "@/data/traps";
import { buildMetadata, buildTrapJsonLd } from "@/lib/seo";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import TrapCard from "@/components/TrapCard";
import BrainIcon from "@/components/BrainIcon";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return traps.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const trap = getTrapBySlug(slug);
  if (!trap) return buildMetadata();
  return buildMetadata({
    title: trap.title,
    description: trap.tagline,
    path: `/atlas/${trap.slug}`,
  });
}

export default async function TrapPage({ params }: PageProps) {
  const { slug } = await params;
  const trap = getTrapBySlug(slug);
  if (!trap) notFound();

  const related = getRelatedTraps(trap);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildTrapJsonLd(trap) }}
      />

      <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-white/30 tracking-wider uppercase">
          <Link href="/atlas" className="hover:text-cyan-400 transition-colors">
            Atlas
          </Link>
          <span>/</span>
          <span className="text-white/50">{trap.title}</span>
        </nav>

        {/* Title block */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <BrainIcon className="w-5 h-5 text-purple-400" />
            <time
              dateTime={trap.publishedAt}
              className="text-xs text-white/30 tracking-wider uppercase"
            >
              {new Date(trap.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            {trap.title}
          </h1>
          <p className="text-lg text-cyan-400/70 italic">{trap.tagline}</p>
        </header>

        {/* Video */}
        <div className="mb-12">
          <YouTubeEmbed videoId={trap.youtubeId} title={trap.title} />
        </div>

        {/* Essay */}
        <div className="prose-qc mb-16 space-y-6">
          {trap.summary.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-[1.8] text-white/60 md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-white/5 pt-12">
            <h2 className="mb-6 text-xl font-semibold text-white/70">
              Related Traps
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <TrapCard key={r.slug} trap={r} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
