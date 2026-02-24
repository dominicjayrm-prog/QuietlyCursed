import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/atlas";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ─── Static pages ───────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/atlas`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/trait-index`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/mascot`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // ─── Dynamic atlas posts ────────────────────────────────
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    postPages = posts.map((post) => ({
      url: `${SITE_URL}/atlas/${post.slug}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Supabase unavailable at build time — static pages still get indexed
  }

  return [...staticPages, ...postPages];
}
