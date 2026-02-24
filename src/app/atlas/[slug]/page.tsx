import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedPostBySlug,
  getAllPublishedSlugs,
  getRelatedPosts,
  getRelatedPostsByTags,
} from "@/lib/atlas";
import { buildMetadata, buildAtlasPostJsonLd, SITE_URL } from "@/lib/seo";
import YouTubeEmbed from "@/components/YouTubeEmbed";
import MarkdownContent from "@/components/MarkdownContent";
import RichContentRenderer from "@/components/RichContentRenderer";
import BrainIcon from "@/components/BrainIcon";
import EyeGlow from "@/components/EyeGlow";
import ShareButtons from "@/components/ShareButtons";
import EmailSignup from "@/components/EmailSignup";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return buildMetadata();

  return buildMetadata({
    title: post.meta_title || post.title,
    description:
      post.meta_description || post.subtitle || post.featured_description || "",
    path: `/atlas/${post.slug}`,
    image: post.banner_url || undefined,
    type: "article",
  });
}

export default async function AtlasPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  // Prefer tag-based related posts, fall back to manually linked
  let related = await getRelatedPostsByTags(post.id, post.tags ?? []);
  if (related.length === 0 && post.related_posts?.length > 0) {
    related = await getRelatedPosts(post.related_posts);
  }
  const hasJsonContent =
    post.content_format === "json" && post.content_json != null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildAtlasPostJsonLd(post) }}
      />

      <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-white/30 tracking-wider uppercase">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/atlas"
            className="hover:text-cyan-400 transition-colors"
          >
            Atlas
          </Link>
          <span>/</span>
          <span className="text-white/50">{post.title}</span>
        </nav>

        {/* Banner Image */}
        {post.banner_url && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-white/5">
            <Image
              src={post.banner_url}
              alt={post.banner_alt || post.title}
              width={768}
              height={400}
              className="w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {/* Title block */}
        <header className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <BrainIcon className="w-5 h-5 text-purple-400" />
            <time
              dateTime={post.created_at}
              className="text-xs text-white/30 tracking-wider uppercase"
            >
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            {post.title}
          </h1>
          {post.subtitle && (
            <p className="text-lg text-cyan-400/70 italic">{post.subtitle}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs tracking-wider uppercase text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Video */}
        {post.youtube_video_id && (
          <div className="mb-14">
            <YouTubeEmbed videoId={post.youtube_video_id} title={post.title} />
          </div>
        )}

        {/* Article Content — JSON (rich editor) or Markdown (legacy) */}
        {hasJsonContent ? (
          <div className="mb-16">
            <RichContentRenderer
              content={post.content_json as Parameters<typeof RichContentRenderer>[0]["content"]}
            />
          </div>
        ) : post.content ? (
          <div className="mb-16">
            <MarkdownContent content={post.content} />
          </div>
        ) : null}

        {/* Share */}
        <ShareButtons
          url={`${SITE_URL}/atlas/${post.slug}`}
          title={post.title}
        />

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="border-t border-white/5 pt-12">
            <h2 className="mb-2 text-xl font-semibold text-white/70">
              Related Case Files
            </h2>
            <p className="mb-6 text-sm text-white/30">
              Other patterns that connect to this topic.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/atlas/${r.slug}`}
                  className="group block rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-cyan-500/20 hover:bg-white/[0.04]"
                >
                  <h3 className="mb-1 text-sm font-semibold text-white/80 transition-colors group-hover:text-cyan-400">
                    {r.title}
                  </h3>
                  <p className="text-xs text-white/40">
                    {r.featured_description || r.subtitle || ""}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trait Index CTA */}
        <section className="mt-16 rounded-2xl border border-purple-500/10 bg-purple-500/[0.03] p-8 text-center">
          <EyeGlow size="sm" className="mx-auto mb-4 w-8 h-4 opacity-40" />
          <h2 className="mb-2 text-lg font-semibold text-white/70">
            The Trait Index
          </h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-white/40">
            Discover which psychological pattern runs deepest in you. 12
            questions. 6 archetypes.
          </p>
          <Link
            href="/trait-index"
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-purple-400 transition-all hover:bg-purple-500/20 hover:border-purple-400/50"
          >
            <BrainIcon className="w-4 h-4 text-cyan-400" />
            Take the Trait Index
          </Link>
        </section>

        {/* Email Signup */}
        <section className="mt-12">
          <EmailSignup />
        </section>

        {/* Back to Atlas */}
        <div className="mt-12 text-center">
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium tracking-wider uppercase text-white/50 transition-all hover:border-cyan-500/30 hover:text-cyan-400"
          >
            <BrainIcon className="w-4 h-4 text-purple-400/70" />
            Browse all case files
          </Link>
        </div>
      </article>
    </>
  );
}
