"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabase } from "@/lib/supabase/client";

interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

export default function SiteSettings() {
  const [featuredVideoUrl, setFeaturedVideoUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const getToken = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  // Load settings on mount
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (!token) return;

      try {
        const res = await fetch("/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data: Setting[] = await res.json();
        const video = data.find((s) => s.key === "featured_video_url");
        if (video) {
          setFeaturedVideoUrl(video.value);
          setSavedUrl(video.value);
        }
      } catch {
        // Table may not exist yet — that's fine
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    const token = await getToken();
    if (!token) {
      setMessage({ type: "err", text: "Not authenticated." });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: "featured_video_url",
          value: featuredVideoUrl.trim(),
        }),
      });

      if (!res.ok) throw new Error();

      setSavedUrl(featuredVideoUrl.trim());
      setMessage({ type: "ok", text: "Saved. The homepage will update within 60 seconds." });
    } catch {
      setMessage({ type: "err", text: "Failed to save. Make sure the site_settings table exists (run migration 009)." });
    } finally {
      setSaving(false);
    }
  }

  function handleClear() {
    setFeaturedVideoUrl("");
  }

  // Extract video ID for preview
  const videoId = extractVideoId(featuredVideoUrl);
  const hasChanges = featuredVideoUrl.trim() !== savedUrl;

  return (
    <div className="space-y-8">
      {/* Featured Video */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-white/40">
          Featured YouTube Video
        </h3>
        <p className="mb-5 text-xs text-white/25">
          This video is embedded on the homepage below the &ldquo;Watch the Breakdowns&rdquo; section. Paste any YouTube URL and save.
        </p>

        {loading ? (
          <p className="text-sm text-white/30 animate-pulse">Loading...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/30">
                YouTube Video URL
              </label>
              <input
                type="text"
                value={featuredVideoUrl}
                onChange={(e) => setFeaturedVideoUrl(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            {/* Preview */}
            {videoId && (
              <div className="overflow-hidden rounded-lg border border-white/10">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                    title="Video preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              {featuredVideoUrl && (
                <button
                  onClick={handleClear}
                  className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-white/40 transition-colors hover:text-white/60 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status message */}
            {message && (
              <p
                className={`text-sm ${
                  message.type === "ok" ? "text-green-400/70" : "text-red-400/70"
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
          How It Works
        </h3>
        <div className="space-y-3 text-sm text-white/50">
          <p>
            <span className="text-white/70">1.</span> Paste a YouTube video URL above
          </p>
          <p>
            <span className="text-white/70">2.</span> Hit Save — the homepage will update within 60 seconds (ISR cache)
          </p>
          <p>
            <span className="text-white/70">3.</span> The video embeds directly below the &ldquo;Watch the latest psychological breakdown below&rdquo; line
          </p>
          <p>
            <span className="text-white/70">4.</span> Clear the URL and save to hide the embed entirely
          </p>
        </div>
      </div>
    </div>
  );
}

/** Extract a YouTube video ID from various URL formats */
function extractVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.trim().match(pattern);
    if (match) return match[1];
  }
  return null;
}
