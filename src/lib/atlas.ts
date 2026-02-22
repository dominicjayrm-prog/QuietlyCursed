import { getServiceSupabase } from "@/lib/supabase/server";

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
  meta_title: string | null;
  meta_description: string | null;
  related_posts: string[];
  is_published: boolean;
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
    .eq("is_published", true)
    .order("created_at", { ascending: false });

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
    .eq("is_published", true)
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
    .eq("is_published", true);

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
    .eq("is_published", true);

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
