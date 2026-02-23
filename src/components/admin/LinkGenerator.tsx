"use client";

import { useState } from "react";

const DESTINATIONS = [
  { label: "Homepage", path: "/" },
  { label: "Atlas", path: "/atlas" },
  { label: "Trait Quiz", path: "/trait-index" },
  { label: "Mascot", path: "/mascot" },
];

export default function LinkGenerator() {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [destination, setDestination] = useState("/atlas");
  const [customPath, setCustomPath] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  function handleVideoUrl(raw: string) {
    // Try to extract video ID from full YouTube URL
    const match = raw.match(
      /(?:youtu\.be\/|v=|\/v\/|embed\/)([a-zA-Z0-9_-]{11})/
    );
    setVideoId(match ? match[1] : raw);
  }

  function generateLink() {
    const base =
      typeof window !== "undefined" ? window.location.origin : "";
    const path = destination === "custom" ? customPath : destination;

    const campaign = videoTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const params = new URLSearchParams({
      utm_source: "youtube",
      utm_medium: "video",
      utm_campaign: campaign || "untitled",
      utm_content: videoId || "unknown",
    });

    setGenerated(`${base}${path}?${params.toString()}`);
    setCopied(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const campaignSlug = videoTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div className="space-y-8">
      {/* Generator */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
          Generate YouTube Tracking Link
        </h3>

        <div className="space-y-4">
          {/* Video Title */}
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/30">
              Video Title
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="e.g. Why Narcissists Fear You"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>

          {/* Video URL / ID */}
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/30">
              YouTube Video URL or ID
            </label>
            <input
              type="text"
              value={videoId}
              onChange={(e) => handleVideoUrl(e.target.value)}
              placeholder="e.g. https://youtube.com/watch?v=dQw4w9WgXcQ or just dQw4w9WgXcQ"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:outline-none"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/30">
              Destination Page
            </label>
            <div className="flex flex-wrap gap-2">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.path}
                  onClick={() => setDestination(d.path)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                    destination === d.path
                      ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
                      : "border border-white/10 text-white/40 hover:text-white/60"
                  }`}
                >
                  {d.label}
                </button>
              ))}
              <button
                onClick={() => setDestination("custom")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                  destination === "custom"
                    ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
                    : "border border-white/10 text-white/40 hover:text-white/60"
                }`}
              >
                Custom Path
              </button>
            </div>

            {destination === "custom" && (
              <input
                type="text"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="/atlas/my-post-slug"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:outline-none"
              />
            )}
          </div>

          {/* Generate */}
          <button
            onClick={generateLink}
            disabled={!videoTitle}
            className="w-full rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 text-sm font-medium uppercase tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Generate Link
          </button>
        </div>

        {/* Output */}
        {generated && (
          <div className="mt-6 rounded-lg border border-white/10 bg-black/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <code className="break-all text-sm text-cyan-400/80">
                {generated}
              </code>
              <button
                onClick={copyLink}
                className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/60 cursor-pointer"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="mt-3 space-y-0.5 text-xs text-white/30">
              <p>
                <code className="text-cyan-400/50">utm_source</code> = youtube
              </p>
              <p>
                <code className="text-cyan-400/50">utm_medium</code> = video
              </p>
              <p>
                <code className="text-cyan-400/50">utm_campaign</code> ={" "}
                {campaignSlug || "—"}
              </p>
              <p>
                <code className="text-cyan-400/50">utm_content</code> ={" "}
                {videoId || "—"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
          How It Works
        </h3>
        <div className="space-y-3 text-sm text-white/50">
          <p>
            <span className="text-white/70">1.</span> Enter your YouTube video
            title and URL/ID above
          </p>
          <p>
            <span className="text-white/70">2.</span> Choose where you want
            viewers to land
          </p>
          <p>
            <span className="text-white/70">3.</span> Copy the generated link
            and paste it in your video description
          </p>
          <p>
            <span className="text-white/70">4.</span> Track performance in the{" "}
            <span className="text-cyan-400/60">Traffic &amp; UTM</span> tab
            &mdash; filter by video to see which ones drive traffic
          </p>
        </div>
        <div className="mt-4 rounded-lg border border-white/5 bg-white/[0.01] p-4 text-xs text-white/30">
          <p className="mb-2 font-semibold text-white/40">
            UTM Parameters Used:
          </p>
          <p>
            <code className="text-cyan-400/60">utm_source</code> = youtube
            (always)
          </p>
          <p>
            <code className="text-cyan-400/60">utm_medium</code> = video
            (always)
          </p>
          <p>
            <code className="text-cyan-400/60">utm_campaign</code> = slugified
            video title (identifies which video)
          </p>
          <p>
            <code className="text-cyan-400/60">utm_content</code> = YouTube
            video ID (links back to the video)
          </p>
        </div>
      </div>
    </div>
  );
}
