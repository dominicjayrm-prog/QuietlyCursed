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
    type: "article",
  });
}

const SECTION_LABELS = [
  { key: "whatItIs" as const, title: "What It Is", icon: "eye" },
  { key: "howItShowsUp" as const, title: "How It Shows Up", icon: "signal" },
  { key: "hiddenCost" as const, title: "The Hidden Cost", icon: "warning" },
  { key: "whatItProtects" as const, title: "What It Protects", icon: "shield" },
];

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
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/atlas" className="hover:text-cyan-400 transition-colors">
            Atlas
          </Link>
          <span>/</span>
          <span className="text-white/50">{trap.title}</span>
        </nav>

        {/* Title block */}
        <header className="mb-12">
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
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-5xl">
            {trap.title}
          </h1>
          <p className="mb-1 text-sm text-white/25 tracking-widest uppercase">
            {trap.subtitle}
          </p>
          <p className="text-lg text-cyan-400/70 italic">{trap.tagline}</p>
        </header>

        {/* Video */}
        <div className="mb-14">
          <YouTubeEmbed videoId={trap.youtubeId} title={trap.title} />
        </div>

        {/* SEO Summary */}
        <div className="mb-16 space-y-6">
          {trap.summary.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-[1.8] text-white/60 md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Structured Sections */}
        <div className="mb-16 space-y-10">
          {SECTION_LABELS.map(({ key, title }) => (
            <section
              key={key}
              className="trap-section rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8"
            >
              <h2 className="mb-4 flex items-center gap-3 text-lg font-semibold text-cyan-400 md:text-xl">
                <span className="inline-block h-px w-6 bg-cyan-500/40" aria-hidden />
                {title}
              </h2>
              <p className="text-base leading-[1.8] text-white/55">
                {trap.sections[key]}
              </p>
            </section>
          ))}
        </div>

        {/* Related Traps */}
        {related.length > 0 && (
          <section className="border-t border-white/5 pt-12">
            <h2 className="mb-2 text-xl font-semibold text-white/70">
              Related Traps
            </h2>
            <p className="mb-6 text-sm text-white/30">
              Other patterns that connect to this trap.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <TrapCard key={r.slug} trap={r} />
              ))}
            </div>
          </section>
        )}

        {/* Back to Atlas CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium tracking-wider uppercase text-white/50 transition-all hover:border-cyan-500/30 hover:text-cyan-400"
          >
            <BrainIcon className="w-4 h-4 text-purple-400/70" />
            Browse all traps
          </Link>
        </div>
      </article>
    </>
  );
}
