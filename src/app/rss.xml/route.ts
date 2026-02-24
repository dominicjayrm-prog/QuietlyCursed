import { getPublishedPosts } from "@/lib/atlas";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const revalidate = 3600; // 1 hour

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/atlas/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/atlas/${post.slug}</guid>
      <description>${escapeXml(post.featured_description || post.subtitle || "")}</description>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>${
        post.tags && post.tags.length > 0
          ? post.tags.map((t) => `\n      <category>${escapeXml(t)}</category>`).join("")
          : ""
      }
    </item>`
    )
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — The Atlas</title>
    <link>${SITE_URL}/atlas</link>
    <description>The written case files behind each episode. Psychology, patterns, and the mind.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
