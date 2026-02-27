import { getServiceSupabase } from "@/lib/supabase/server";

/** Fetch a single site setting by key (server-side, bypasses RLS) */
export async function getSetting(key: string): Promise<string | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data) return null;
  return data.value;
}

/** Fetch the featured YouTube video URL */
export async function getFeaturedVideoUrl(): Promise<string | null> {
  return getSetting("featured_video_url");
}

/** Fetch social media links */
export async function getSocialLinks(): Promise<{ twitter: string | null; youtube: string | null }> {
  const supabase = getServiceSupabase();
  if (!supabase) return { twitter: null, youtube: null };

  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["social_twitter_url", "social_youtube_url"]);

  const map = new Map((data ?? []).map((d) => [d.key, d.value]));
  return {
    twitter: map.get("social_twitter_url") || null,
    youtube: map.get("social_youtube_url") || null,
  };
}
