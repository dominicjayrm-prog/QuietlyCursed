"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase/client";

interface PageView {
  id: string;
  path: string;
  referrer: string | null;
  session_id: string | null;
  country: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
}

export default function TrafficAnalytics() {
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getSupabase()!;
      const { data } = await supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000);
      setViews(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-white/30">
        Loading traffic data...
      </div>
    );
  }

  if (views.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-white/30">
        No page views recorded yet. Traffic data will appear here as visitors
        browse the site.
      </div>
    );
  }

  // ─── Derived data ───────────────────────────────────────

  const today = new Date().toISOString().slice(0, 10);

  // Page counts
  const pageCounts: Record<string, number> = {};
  for (const v of views) {
    pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
  }
  const sortedPages = Object.entries(pageCounts).sort(
    ([, a], [, b]) => b - a
  );
  const maxPage = Math.max(...Object.values(pageCounts), 1);

  // Source breakdown
  const sourceCounts: Record<string, number> = {};
  for (const v of views) {
    const source = v.utm_source || "(direct)";
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  }
  const sortedSources = Object.entries(sourceCounts).sort(
    ([, a], [, b]) => b - a
  );

  // Medium breakdown
  const mediumCounts: Record<string, number> = {};
  for (const v of views) {
    if (v.utm_medium) {
      mediumCounts[v.utm_medium] = (mediumCounts[v.utm_medium] || 0) + 1;
    }
  }
  const sortedMediums = Object.entries(mediumCounts).sort(
    ([, a], [, b]) => b - a
  );

  // Campaign breakdown
  const campaignCounts: Record<string, number> = {};
  for (const v of views) {
    if (v.utm_campaign) {
      campaignCounts[v.utm_campaign] =
        (campaignCounts[v.utm_campaign] || 0) + 1;
    }
  }
  const sortedCampaigns = Object.entries(campaignCounts).sort(
    ([, a], [, b]) => b - a
  );

  // Views by day
  const dayCounts: Record<string, number> = {};
  for (const v of views) {
    const day = v.created_at.slice(0, 10);
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  }
  const sortedDays = Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30);
  const maxDay = Math.max(...sortedDays.map(([, c]) => c), 1);

  // ─── Sessions ───────────────────────────────────────────

  const sessions: Record<string, PageView[]> = {};
  for (const v of views) {
    if (v.session_id) {
      if (!sessions[v.session_id]) sessions[v.session_id] = [];
      sessions[v.session_id].push(v);
    }
  }
  const sessionList = Object.values(sessions);
  const uniqueSessionCount = sessionList.length;

  const avgPagesPerSession =
    sessionList.length > 0
      ? (
          sessionList.reduce((sum, s) => sum + s.length, 0) /
          sessionList.length
        ).toFixed(1)
      : "0";

  // Avg session duration (from first → last page view per session)
  const durations = sessionList
    .map((s) => {
      if (s.length < 2) return 0;
      const sorted = [...s].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      return (
        new Date(sorted[sorted.length - 1].created_at).getTime() -
        new Date(sorted[0].created_at).getTime()
      );
    })
    .filter((d) => d > 0);

  const avgDurationSec =
    durations.length > 0
      ? Math.round(
          durations.reduce((a, b) => a + b, 0) / durations.length / 1000
        )
      : 0;

  function formatDuration(seconds: number) {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }

  // ─── Countries ──────────────────────────────────────────

  const countryCounts: Record<string, number> = {};
  for (const v of views) {
    if (v.country) {
      countryCounts[v.country] = (countryCounts[v.country] || 0) + 1;
    }
  }
  const sortedCountries = Object.entries(countryCounts).sort(
    ([, a], [, b]) => b - a
  );
  const maxCountry = Math.max(...Object.values(countryCounts), 1);

  // ─── YouTube Video Performance ──────────────────────────

  const ytViews = views.filter((v) => v.utm_source === "youtube");
  interface VideoStats {
    campaign: string;
    videoId: string | null;
    views: number;
    sessions: Set<string>;
    topPage: string;
  }
  const videoMap: Record<string, VideoStats> = {};
  for (const v of ytViews) {
    const key = v.utm_campaign || "(no-campaign)";
    if (!videoMap[key]) {
      videoMap[key] = {
        campaign: key,
        videoId: v.utm_content,
        views: 0,
        sessions: new Set(),
        topPage: v.path,
      };
    }
    videoMap[key].views++;
    if (v.session_id) videoMap[key].sessions.add(v.session_id);
    if (!videoMap[key].videoId && v.utm_content)
      videoMap[key].videoId = v.utm_content;
  }
  const sortedVideos = Object.values(videoMap).sort(
    (a, b) => b.views - a.views
  );

  const utmViews = views.filter((v) => v.utm_source);

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Views" value={views.length} />
        <StatCard label="Today" value={dayCounts[today] || 0} />
        <StatCard label="YouTube Clicks" value={ytViews.length} />
        <StatCard label="UTM Tracked" value={utmViews.length} />
        <StatCard label="Sessions" value={uniqueSessionCount} />
        <StatCard label="Countries" value={sortedCountries.length} />
      </div>

      {/* Session stats row */}
      {uniqueSessionCount > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <p className="mb-1 text-xs uppercase tracking-wider text-white/30">
              Avg Pages / Session
            </p>
            <p className="text-2xl font-bold text-white">
              {avgPagesPerSession}
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <p className="mb-1 text-xs uppercase tracking-wider text-white/30">
              Avg Session Duration
            </p>
            <p className="text-2xl font-bold text-white">
              {avgDurationSec > 0 ? formatDuration(avgDurationSec) : "—"}
            </p>
            {avgDurationSec === 0 && uniqueSessionCount > 0 && (
              <p className="mt-1 text-[10px] text-white/20">
                Single-page sessions don&apos;t have duration data
              </p>
            )}
          </div>
        </div>
      )}

      {/* ─── YouTube Video Performance ───────────────────── */}
      {sortedVideos.length > 0 && (
        <div className="rounded-xl border border-purple-500/10 bg-purple-500/[0.03] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-purple-400/60">
            YouTube Video Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-white/30">
                  <th className="pb-3 pr-4">Video</th>
                  <th className="pb-3 pr-4 text-right">Clicks</th>
                  <th className="pb-3 pr-4 text-right">Sessions</th>
                  <th className="pb-3 pr-4">Top Landing</th>
                  <th className="pb-3">YouTube Link</th>
                </tr>
              </thead>
              <tbody>
                {sortedVideos.slice(0, 20).map((v) => (
                  <tr
                    key={v.campaign}
                    className="border-b border-white/[0.03]"
                  >
                    <td className="py-2.5 pr-4 text-white/60">
                      {prettifyCampaign(v.campaign)}
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-cyan-400/70">
                      {v.views}
                    </td>
                    <td className="py-2.5 pr-4 text-right font-mono text-white/40">
                      {v.sessions.size}
                    </td>
                    <td className="py-2.5 pr-4 text-white/30">{v.topPage}</td>
                    <td className="py-2.5">
                      {v.videoId ? (
                        <a
                          href={`https://youtube.com/watch?v=${v.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cyan-400/50 underline decoration-cyan-400/20 hover:text-cyan-400/80"
                        >
                          {v.videoId}
                        </a>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Views over time */}
      {sortedDays.length > 1 && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
            Page Views (Last 30 Days)
          </h3>
          <div className="flex h-32 items-end gap-1">
            {sortedDays.map(([day, count]) => (
              <div
                key={day}
                className="group relative flex h-full flex-1 flex-col items-center justify-end"
              >
                <div
                  className="w-full min-h-[2px] rounded-t bg-purple-400/60 transition-all"
                  style={{ height: `${(count / maxDay) * 100}%` }}
                />
                <div className="absolute -top-8 z-10 hidden whitespace-nowrap rounded bg-neutral-800 px-2 py-1 text-[10px] text-white group-hover:block">
                  {day}: {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pages + Sources side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top pages */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
            Top Pages
          </h3>
          <div className="space-y-3">
            {sortedPages.slice(0, 10).map(([path, count]) => (
              <div key={path} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-sm text-white/50">
                  {path}
                </span>
                <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-cyan-400/60"
                    style={{ width: `${(count / maxPage) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs text-white/30">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* UTM Sources */}
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
            Traffic Sources
          </h3>
          <div className="space-y-3">
            {sortedSources.slice(0, 10).map(([source, count]) => (
              <div
                key={source}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-white/50">{source}</span>
                <span className="text-xs text-white/30">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Countries + Medium */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Countries */}
        {sortedCountries.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
              Countries
            </h3>
            <div className="space-y-3">
              {sortedCountries.slice(0, 15).map(([code, count]) => (
                <div key={code} className="flex items-center gap-3">
                  <span className="w-8 text-sm text-white/60">
                    {countryFlag(code)}
                  </span>
                  <span className="min-w-0 flex-1 text-sm text-white/50">
                    {code}
                  </span>
                  <div className="h-2 w-20 shrink-0 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-purple-400/60"
                      style={{ width: `${(count / maxCountry) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-xs text-white/30">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medium */}
        {sortedMediums.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
              By Medium
            </h3>
            <div className="space-y-3">
              {sortedMediums.slice(0, 10).map(([medium, count]) => (
                <div
                  key={medium}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-white/50">{medium}</span>
                  <span className="text-xs text-white/30">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Campaign */}
      {sortedCampaigns.length > 0 && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
            By Campaign
          </h3>
          <div className="space-y-3">
            {sortedCampaigns.slice(0, 15).map(([campaign, count]) => (
              <div
                key={campaign}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-white/50">
                  {prettifyCampaign(campaign)}
                </span>
                <span className="text-xs text-white/30">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent views table */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
          Recent Page Views
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-white/30">
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 pr-4">Page</th>
                <th className="pb-3 pr-4">Source</th>
                <th className="pb-3 pr-4">Campaign</th>
                <th className="pb-3 pr-4">Country</th>
                <th className="pb-3">Session</th>
              </tr>
            </thead>
            <tbody>
              {views.slice(0, 30).map((v) => (
                <tr key={v.id} className="border-b border-white/[0.03]">
                  <td className="whitespace-nowrap py-2.5 pr-4 text-white/30">
                    {new Date(v.created_at).toLocaleString()}
                  </td>
                  <td className="py-2.5 pr-4 text-white/50">{v.path}</td>
                  <td className="py-2.5 pr-4 text-white/40">
                    {v.utm_source || "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-white/40">
                    {v.utm_campaign
                      ? prettifyCampaign(v.utm_campaign)
                      : "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-white/40">
                    {v.country
                      ? `${countryFlag(v.country)} ${v.country}`
                      : "—"}
                  </td>
                  <td className="py-2.5 font-mono text-xs text-white/20">
                    {v.session_id ? v.session_id.slice(0, 8) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
      <p className="mb-1 text-xs uppercase tracking-wider text-white/30">
        {label}
      </p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

/** Turn a slug like "why-narcissists-fear-you" into "Why Narcissists Fear You" */
function prettifyCampaign(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Convert 2-letter country code to flag emoji */
function countryFlag(code: string): string {
  try {
    return code
      .toUpperCase()
      .split("")
      .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
      .join("");
  } catch {
    return code;
  }
}
