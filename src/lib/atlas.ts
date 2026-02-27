import { getServiceSupabase } from "@/lib/supabase/server";

export type PostStatus = "draft" | "scheduled" | "published" | "archived";

export interface AtlasPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  youtube_url: string | null;
  youtube_video_id: string | null;
  featured_description: string | null;
  content: string | null;
  content_json: Record<string, unknown> | null;
  content_format: "markdown" | "json";
  banner_url: string | null;
  banner_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  related_posts: string[];
  tags: string[];
  is_published: boolean;
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  preview_token: string | null;
  created_at: string;
  updated_at: string;
}

/** Fetch all published atlas posts, sorted newest first (server-side) */
export async function getPublishedPosts(): Promise<AtlasPost[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("atlas_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Failed to fetch published posts:", error.message);
    return [];
  }
  return data ?? [];
}

/** Fetch a single published post by slug (server-side) */
export async function getPublishedPostBySlug(
  slug: string
): Promise<AtlasPost | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("atlas_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data;
}

/** Fetch a post by slug using a preview token (allows viewing drafts/scheduled) */
export async function getPostByPreviewToken(
  slug: string,
  token: string
): Promise<AtlasPost | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("atlas_posts")
    .select("*")
    .eq("slug", slug)
    .eq("preview_token", token)
    .single();

  if (error) return null;
  return data;
}

/** Fetch all published post slugs (for static generation) */
export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("atlas_posts")
    .select("slug")
    .eq("status", "published");

  return (data ?? []).map((d) => d.slug);
}

/** Fetch related posts by IDs */
export async function getRelatedPosts(ids: string[]): Promise<AtlasPost[]> {
  if (!ids || ids.length === 0) return [];
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("atlas_posts")
    .select("*")
    .in("id", ids)
    .eq("status", "published");

  return data ?? [];
}

/** Collect all unique tags from published posts */
export async function getAllTags(): Promise<string[]> {
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("atlas_posts")
    .select("tags")
    .eq("status", "published");

  if (!data) return [];
  const set = new Set<string>();
  for (const row of data) {
    for (const tag of row.tags ?? []) set.add(tag);
  }
  return Array.from(set).sort();
}

/** Fetch published posts that share tags with the given post (excluding it) */
export async function getRelatedPostsByTags(
  postId: string,
  tags: string[],
  limit = 4
): Promise<AtlasPost[]> {
  if (!tags || tags.length === 0) return [];
  const supabase = getServiceSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("atlas_posts")
    .select("*")
    .eq("status", "published")
    .neq("id", postId)
    .overlaps("tags", tags)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return data ?? [];
}

/** Extract YouTube video ID from various URL formats */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
