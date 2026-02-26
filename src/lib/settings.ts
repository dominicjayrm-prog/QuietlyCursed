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
