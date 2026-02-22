import type { Metadata } from "next";
import type { Trap } from "@/data/traps";
import type { AtlasPost } from "@/lib/atlas";

const SITE_URL = "https://quietlycursed.com";
const SITE_NAME = "Quietly Cursed";
const DEFAULT_DESCRIPTION =
  "Explore the psychological traps that silently shape your decisions. A dark, minimalist atlas of the mind.";

export function buildMetadata(overrides?: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const title = overrides?.title
    ? `${overrides.title} | ${SITE_NAME}`
    : SITE_NAME;
  const description = overrides?.description ?? DEFAULT_DESCRIPTION;
  const url = overrides?.path ? `${SITE_URL}${overrides.path}` : SITE_URL;
  const image = overrides?.image ?? `${SITE_URL}/og-default.png`;
  const ogType = overrides?.type ?? "website";

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630 }],
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function buildTrapJsonLd(trap: Trap): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: trap.title,
    alternativeHeadline: trap.subtitle,
    description: trap.tagline,
    datePublished: trap.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/atlas/${trap.slug}`,
    },
    articleSection: "Psychology",
    keywords: [
      "cognitive bias",
      "psychological trap",
      trap.title,
      "mental model",
      "decision making",
    ],
    video: {
      "@type": "VideoObject",
      name: trap.title,
      description: trap.tagline,
      embedUrl: `https://www.youtube.com/embed/${trap.youtubeId}`,
    },
  });
}

export function buildAtlasPostJsonLd(post: AtlasPost): string {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta_title || post.title,
    description: post.meta_description || post.subtitle || post.featured_description || "",
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/atlas/${post.slug}`,
    },
    articleSection: "Psychology",
    keywords: [
      "psychology",
      "cognitive bias",
      post.title,
      "mental model",
      "quietly cursed",
    ],
  };

  if (post.youtube_video_id) {
    jsonLd.video = {
      "@type": "VideoObject",
      name: post.title,
      description: post.subtitle || post.title,
      embedUrl: `https://www.youtube.com/embed/${post.youtube_video_id}`,
    };
  }

  return JSON.stringify(jsonLd);
}

export function buildWebsiteJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
  });
}
