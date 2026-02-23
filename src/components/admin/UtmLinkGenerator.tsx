"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase/client";

interface UtmLink {
  id: string;
  label: string;
  video_url: string | null;
  destination_path: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string | null;
  utm_term: string | null;
  full_url: string;
  click_count: number;
  created_at: string;
}

const DESTINATION_OPTIONS = [
  { value: "/", label: "Home Page" },
  { value: "/atlas", label: "Atlas" },
  { value: "/trait-index", label: "Trait Index (Quiz)" },
];

export default function UtmLinkGenerator({ siteDomain }: { siteDomain: string }) {
  const [links, setLinks] = useState<UtmLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  // Form state
  const [label, setLabel] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [destination, setDestination] = useState("/trait-index");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const domain = siteDomain || "quietlycursed.com";

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    const supabase = getSupabase()!;
    const { data } = await supabase
      .from("utm_links")
      .select("*")
      .order("created_at", { ascending: false });
    setLinks(data ?? []);
    setLoading(false);
  }

  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function buildUrl(): string {
    const slug = campaign ? generateSlug(campaign) : "";
    const params = new URLSearchParams();
    params.set("utm_source", "youtube");
    params.set("utm_medium", "video");
    if (slug) params.set("utm_campaign", slug);
    if (content) params.set("utm_content", content.trim());
    return `https://${domain}${destination}?${params.toString()}`;
  }

  async function handleCreate() {
    if (!label.trim() || !campaign.trim()) return;
    setSaving(true);

    const slug = generateSlug(campaign);
    const fullUrl = buildUrl();
    const supabase = getSupabase()!;

    const { error } = await supabase.from("utm_links").insert({
      label: label.trim(),
      video_url: videoUrl.trim() || null,
      destination_path: destination,
      utm_source: "youtube",
      utm_medium: "video",
      utm_campaign: slug,
      utm_content: content.trim() || null,
      full_url: fullUrl,
    });

    if (!error) {
      setLabel("");
      setVideoUrl("");
      setCampaign("");
      setContent("");
      await fetchLinks();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const supabase = getSupabase()!;
    await supabase.from("utm_links").delete().eq("id", id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  const previewUrl = buildUrl();

  return (
    <div className="space-y-8">
      {/* Generator form */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white/40">
          Generate YouTube Tracking Link
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Label */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/30">
              Link Label *
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder='e.g. "Sunk Cost Fallacy — Feb 2026"'
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-colors"
            />
          </div>

          {/* YouTube Video URL */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/30">
              YouTube Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-colors"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/30">
              Destination Page *
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/30 transition-colors"
            >
              {DESTINATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-neutral-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Campaign name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/30">
              Campaign Name * <span className="text-white/15">(video topic)</span>
            </label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder='e.g. "Sunk Cost Fallacy"'
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-colors"
            />
            {campaign && (
              <p className="mt-1 text-xs text-white/20">
                Slug: <span className="text-cyan-400/60">{generateSlug(campaign)}</span>
              </p>
            )}
          </div>

          {/* Content identifier (optional) */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-white/30">
              Content ID <span className="text-white/15">(optional — e.g. &quot;description-link&quot; vs &quot;pinned-comment&quot;)</span>
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='e.g. "description" or "pinned-comment"'
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-cyan-500/30 transition-colors"
            />
          </div>
        </div>

        {/* Preview */}
        {campaign && (
          <div className="mt-5 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] p-4">
            <p className="mb-1 text-xs font-medium text-cyan-400/60">Preview URL</p>
            <p className="break-all text-sm text-cyan-300/80 font-mono">{previewUrl}</p>
          </div>
        )}

        {/* Create button */}
        <button
          onClick={handleCreate}
          disabled={saving || !label.trim() || !campaign.trim()}
          className="mt-5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-6 py-2.5 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? "Creating..." : "Generate Link"}
        </button>
      </div>

      {/* Existing links */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
          Your Tracking Links
        </h3>

        {loading ? (
          <p className="text-sm text-white/20">Loading...</p>
        ) : links.length === 0 ? (
          <p className="text-sm text-white/20">
            No tracking links yet. Generate one above and paste it in your YouTube video description.
          </p>
        ) : (
          <div className="space-y-4">
            {links.map((link) => (
              <div
                key={link.id}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-white/70 truncate">
                        {link.label}
                      </h4>
                      <span className="shrink-0 rounded-full bg-purple-400/10 px-2 py-0.5 text-[10px] font-medium text-purple-400/70">
                        {link.utm_campaign}
                      </span>
                    </div>
                    <p className="break-all text-xs text-white/30 font-mono mb-2">
                      {link.full_url}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-white/20">
                      <span>
                        Destination: <span className="text-white/40">{link.destination_path}</span>
                      </span>
                      {link.video_url && (
                        <a
                          href={link.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400/40 hover:text-cyan-400/70 transition-colors"
                        >
                          View Video ↗
                        </a>
                      )}
                      {link.utm_content && (
                        <span>
                          Content: <span className="text-white/40">{link.utm_content}</span>
                        </span>
                      )}
                      <span>
                        Created: <span className="text-white/40">
                          {new Date(link.created_at).toLocaleDateString()}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyToClipboard(link.full_url, link.id)}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/40 transition-all hover:border-cyan-500/20 hover:text-cyan-400 cursor-pointer"
                    >
                      {copied === link.id ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-red-400/40 transition-all hover:border-red-500/20 hover:text-red-400 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
