"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase/client";

interface PageView {
  id: string;
  path: string;
  referrer: string | null;
  session_id: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
}

interface Session {
  id: string;
  started_at: string;
  last_seen_at: string;
  duration_seconds: number;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  landing_page: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  page_count: number;
  cookie_consent: boolean;
}

export default function TrafficAnalytics() {
  const [views, setViews] = useState<PageView[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "sessions" | "videos" | "countries">("overview");

  useEffect(() => {
    async function load() {
      const supabase = getSupabase()!;
      const [viewsRes, sessionsRes] = await Promise.all([
        supabase
          .from("page_views")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(2000),
        supabase
          .from("sessions")
          .select("*")
          .order("started_at", { ascending: false })
          .limit(1000),
      ]);
      setViews(viewsRes.data ?? []);
      setSessions(sessionsRes.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-sm text-white/30">Loading traffic data...</div>;
  }

  if (views.length === 0 && sessions.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-white/30">
        No traffic data yet. Data will appear here as visitors browse the site.
      </div>
    );
  }

  // ── Computed metrics ──────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10);
  const utmViews = views.filter((v) => v.utm_source);
  const youtubeViews = views.filter((v) => v.utm_source === "youtube");

  // Page view counts
  const pageCounts: Record<string, number> = {};
  for (const v of views) {
    pageCounts[v.path] = (pageCounts[v.path] || 0) + 1;
  }
  const sortedPages = Object.entries(pageCounts).sort(([, a], [, b]) => b - a);
  const maxPage = Math.max(...Object.values(pageCounts), 1);

  // Source breakdown
  const sourceCounts: Record<string, number> = {};
  for (const v of views) {
    const source = v.utm_source || "(direct)";
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  }
  const sortedSources = Object.entries(sourceCounts).sort(([, a], [, b]) => b - a);

  // Campaign breakdown (video-specific)
  const campaignCounts: Record<string, number> = {};
  for (const v of views) {
    if (v.utm_campaign) {
      campaignCounts[v.utm_campaign] = (campaignCounts[v.utm_campaign] || 0) + 1;
    }
  }
  const sortedCampaigns = Object.entries(campaignCounts).sort(([, a], [, b]) => b - a);
  const maxCampaign = Math.max(...Object.values(campaignCounts), 1);

  // Country breakdown
  const countryCounts: Record<string, number> = {};
  for (const s of sessions) {
    const country = s.country || "Unknown";
    countryCounts[country] = (countryCounts[country] || 0) + 1;
  }
  const sortedCountries = Object.entries(countryCounts).sort(([, a], [, b]) => b - a);
  const maxCountry = Math.max(...Object.values(countryCounts), 1);

  // Device breakdown
  const deviceCounts: Record<string, number> = {};
  for (const s of sessions) {
    const device = s.device_type || "unknown";
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
  }

  // Average session duration
  const sessionsWithDuration = sessions.filter((s) => s.duration_seconds > 0);
  const avgDuration =
    sessionsWithDuration.length > 0
      ? Math.round(
          sessionsWithDuration.reduce((sum, s) => sum + s.duration_seconds, 0) /
            sessionsWithDuration.length
        )
      : 0;

  // Average pages per session
  const avgPages =
    sessions.length > 0
      ? (sessions.reduce((sum, s) => sum + s.page_count, 0) / sessions.length).toFixed(1)
      : "0";

  // Views by day (last 30)
  const dayCounts: Record<string, number> = {};
  for (const v of views) {
    const day = v.created_at.slice(0, 10);
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  }
  const sortedDays = Object.entries(dayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30);
  const maxDay = Math.max(...sortedDays.map(([, c]) => c), 1);

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "videos" as const, label: "By Video" },
    { key: "sessions" as const, label: "Sessions" },
    { key: "countries" as const, label: "Countries" },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-1 rounded-lg border border-white/5 bg-white/[0.01] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
              activeTab === tab.key
                ? "bg-purple-500/10 text-purple-400"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <OverviewTab
          views={views}
          sessions={sessions}
          today={today}
          utmViews={utmViews}
          youtubeViews={youtubeViews}
          avgDuration={avgDuration}
          avgPages={avgPages}
          sortedDays={sortedDays}
          maxDay={maxDay}
          sortedPages={sortedPages}
          maxPage={maxPage}
          sortedSources={sortedSources}
          deviceCounts={deviceCounts}
          dayCounts={dayCounts}
        />
      )}

      {activeTab === "videos" && (
        <VideosTab
          sortedCampaigns={sortedCampaigns}
          maxCampaign={maxCampaign}
          sessions={sessions}
          views={views}
        />
      )}

      {activeTab === "sessions" && <SessionsTab sessions={sessions} />}

      {activeTab === "countries" && (
        <CountriesTab sortedCountries={sortedCountries} maxCountry={maxCountry} sessions={sessions} />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Overview Tab
// ════════════════════════════════════════════════════════════════════
function OverviewTab({
  views,
  sessions,
  today,
  utmViews,
  youtubeViews,
  avgDuration,
  avgPages,
  sortedDays,
  maxDay,
  sortedPages,
  maxPage,
  sortedSources,
  deviceCounts,
  dayCounts,
}: {
  views: PageView[];
  sessions: Session[];
  today: string;
  utmViews: PageView[];
  youtubeViews: PageView[];
  avgDuration: number;
  avgPages: string;
  sortedDays: [string, number][];
  maxDay: number;
  sortedPages: [string, number][];
  maxPage: number;
  sortedSources: [string, number][];
  deviceCounts: Record<string, number>;
  dayCounts: Record<string, number>;
}) {
  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Views" value={views.length} />
        <StatCard label="Today" value={dayCounts[today] || 0} />
        <StatCard label="Sessions" value={sessions.length} />
        <StatCard label="YouTube Traffic" value={youtubeViews.length} />
        <StatCard label="UTM Tracked" value={utmViews.length} />
        <StatCard label="Avg. Duration" value={formatDuration(avgDuration)} isText />
        <StatCard label="Avg. Pages/Session" value={avgPages} isText />
        <StatCard
          label="Devices"
          value={`${deviceCounts["mobile"] || 0}m / ${deviceCounts["desktop"] || 0}d`}
          isText
        />
      </div>

      {/* 30-day chart */}
      {sortedDays.length > 1 && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
            Page Views (Last 30 Days)
          </h3>
          <div className="flex items-end gap-1 h-32">
            {sortedDays.map(([day, count]) => (
              <div
                key={day}
                className="group relative flex-1 flex flex-col items-center justify-end h-full"
              >
                <div
                  className="w-full rounded-t bg-purple-400/60 transition-all min-h-[2px]"
                  style={{ height: `${(count / maxDay) * 100}%` }}
                />
                <div className="absolute -top-8 hidden group-hover:block rounded bg-neutral-800 px-2 py-1 text-[10px] text-white whitespace-nowrap z-10">
                  {day}: {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pages + Sources side by side */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
            Top Pages
          </h3>
          <div className="space-y-3">
            {sortedPages.slice(0, 10).map(([path, count]) => (
              <div key={path} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-sm text-white/50">{path}</span>
                <div className="w-24 h-2 rounded-full bg-white/5 overflow-hidden shrink-0">
                  <div
                    className="h-full rounded-full bg-cyan-400/60"
                    style={{ width: `${(count / maxPage) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-white/30 shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
            Traffic Sources
          </h3>
          <div className="space-y-3">
            {sortedSources.slice(0, 10).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-sm text-white/50">{source}</span>
                <span className="text-xs text-white/30">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Videos Tab — per-campaign (video) breakdown
// ════════════════════════════════════════════════════════════════════
function VideosTab({
  sortedCampaigns,
  maxCampaign,
  sessions,
  views,
}: {
  sortedCampaigns: [string, number][];
  maxCampaign: number;
  sessions: Session[];
  views: PageView[];
}) {
  if (sortedCampaigns.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-white/30">
        No video campaign data yet. Generate a tracking link, put it in a YouTube video description,
        and traffic will appear here.
      </div>
    );
  }

  // Build per-campaign stats
  const campaignStats = sortedCampaigns.map(([campaign, viewCount]) => {
    const campaignSessions = sessions.filter((s) => s.utm_campaign === campaign);
    const withDuration = campaignSessions.filter((s) => s.duration_seconds > 0);
    const avgDur =
      withDuration.length > 0
        ? Math.round(withDuration.reduce((sum, s) => sum + s.duration_seconds, 0) / withDuration.length)
        : 0;
    const countries = new Set(campaignSessions.map((s) => s.country).filter(Boolean));

    return {
      campaign,
      viewCount,
      sessionCount: campaignSessions.length,
      avgDuration: avgDur,
      countries: countries.size,
      topCountry: (() => {
        const cc: Record<string, number> = {};
        for (const s of campaignSessions) {
          if (s.country) cc[s.country] = (cc[s.country] || 0) + 1;
        }
        const sorted = Object.entries(cc).sort(([, a], [, b]) => b - a);
        return sorted[0]?.[0] || "—";
      })(),
    };
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
          Traffic By Video (Campaign)
        </h3>
        <div className="space-y-4">
          {campaignStats.map((stat) => (
            <div
              key={stat.campaign}
              className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-full bg-purple-400/10 px-3 py-1 text-xs font-medium text-purple-400/80">
                  {stat.campaign}
                </span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-400/60"
                    style={{ width: `${(stat.viewCount / maxCampaign) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-white/50">{stat.viewCount} views</span>
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4 text-xs text-white/30">
                <span>
                  Sessions: <span className="text-white/50">{stat.sessionCount}</span>
                </span>
                <span>
                  Avg. Duration: <span className="text-white/50">{formatDuration(stat.avgDuration)}</span>
                </span>
                <span>
                  Countries: <span className="text-white/50">{stat.countries}</span>
                </span>
                <span>
                  Top Country: <span className="text-white/50">{stat.topCountry}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign content breakdown (description link vs pinned comment etc.) */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
          By Link Placement (utm_content)
        </h3>
        {(() => {
          const contentCounts: Record<string, number> = {};
          for (const v of views) {
            if (v.utm_content) {
              contentCounts[v.utm_content] = (contentCounts[v.utm_content] || 0) + 1;
            }
          }
          const sorted = Object.entries(contentCounts).sort(([, a], [, b]) => b - a);
          if (sorted.length === 0) {
            return (
              <p className="text-sm text-white/20">
                No content placement data yet. Use the &quot;Content ID&quot; field when generating
                links to track where in the video viewers click from (e.g. &quot;description&quot; vs
                &quot;pinned-comment&quot;).
              </p>
            );
          }
          return (
            <div className="space-y-3">
              {sorted.map(([content, count]) => (
                <div key={content} className="flex items-center justify-between">
                  <span className="text-sm text-white/50">{content}</span>
                  <span className="text-xs text-white/30">{count}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Sessions Tab — individual session details
// ════════════════════════════════════════════════════════════════════
function SessionsTab({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-white/30">
        No session data yet. Sessions are tracked when visitors browse the site.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Duration distribution */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total Sessions" value={sessions.length} />
        <StatCard
          label="Avg. Duration"
          value={formatDuration(
            sessions.filter((s) => s.duration_seconds > 0).length > 0
              ? Math.round(
                  sessions.filter((s) => s.duration_seconds > 0).reduce((sum, s) => sum + s.duration_seconds, 0) /
                    sessions.filter((s) => s.duration_seconds > 0).length
                )
              : 0
          )}
          isText
        />
        <StatCard
          label="Avg. Pages"
          value={(sessions.reduce((sum, s) => sum + s.page_count, 0) / sessions.length).toFixed(1)}
          isText
        />
        <StatCard
          label="Consent Rate"
          value={`${sessions.length > 0 ? Math.round((sessions.filter((s) => s.cookie_consent).length / sessions.length) * 100) : 0}%`}
          isText
        />
      </div>

      {/* Recent sessions table */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
          Recent Sessions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-white/30">
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 pr-4">Duration</th>
                <th className="pb-3 pr-4">Pages</th>
                <th className="pb-3 pr-4">Source</th>
                <th className="pb-3 pr-4">Campaign</th>
                <th className="pb-3 pr-4">Country</th>
                <th className="pb-3 pr-4">Device</th>
                <th className="pb-3">Landing</th>
              </tr>
            </thead>
            <tbody>
              {sessions.slice(0, 50).map((s) => (
                <tr key={s.id} className="border-b border-white/[0.03]">
                  <td className="py-2.5 pr-4 text-white/30 whitespace-nowrap text-xs">
                    {new Date(s.started_at).toLocaleString()}
                  </td>
                  <td className="py-2.5 pr-4 text-white/50 text-xs">
                    {formatDuration(s.duration_seconds)}
                  </td>
                  <td className="py-2.5 pr-4 text-white/40 text-xs">{s.page_count}</td>
                  <td className="py-2.5 pr-4 text-white/40 text-xs">{s.utm_source || "direct"}</td>
                  <td className="py-2.5 pr-4 text-xs">
                    {s.utm_campaign ? (
                      <span className="rounded-full bg-purple-400/10 px-2 py-0.5 text-purple-400/70">
                        {s.utm_campaign}
                      </span>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-white/40 text-xs">
                    {s.country || "—"}
                    {s.city ? `, ${s.city}` : ""}
                  </td>
                  <td className="py-2.5 pr-4 text-white/40 text-xs capitalize">{s.device_type || "—"}</td>
                  <td className="py-2.5 text-white/30 text-xs truncate max-w-[200px]">
                    {s.landing_page || "—"}
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

// ════════════════════════════════════════════════════════════════════
// Countries Tab
// ════════════════════════════════════════════════════════════════════
function CountriesTab({
  sortedCountries,
  maxCountry,
  sessions,
}: {
  sortedCountries: [string, number][];
  maxCountry: number;
  sessions: Session[];
}) {
  if (sortedCountries.length === 0 || (sortedCountries.length === 1 && sortedCountries[0][0] === "Unknown")) {
    return (
      <div className="py-12 text-center text-sm text-white/30">
        No country data yet. Country detection requires visitors to browse the site.
      </div>
    );
  }

  // Per-country average duration
  const countryStats = sortedCountries.map(([country, count]) => {
    const countrySessions = sessions.filter((s) => (s.country || "Unknown") === country);
    const withDuration = countrySessions.filter((s) => s.duration_seconds > 0);
    const avgDur =
      withDuration.length > 0
        ? Math.round(withDuration.reduce((sum, s) => sum + s.duration_seconds, 0) / withDuration.length)
        : 0;
    return { country, count, avgDuration: avgDur };
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
          Visitors by Country
        </h3>
        <div className="space-y-3">
          {countryStats.map((stat) => (
            <div key={stat.country} className="flex items-center gap-3">
              <span className="w-16 text-sm text-white/50 shrink-0">{stat.country}</span>
              <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-400/60 transition-all"
                  style={{ width: `${(stat.count / maxCountry) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs text-white/30 shrink-0">{stat.count}</span>
              <span className="w-16 text-right text-xs text-white/20 shrink-0">
                {formatDuration(stat.avgDuration)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-white/15">Right column = avg. session duration</p>
      </div>

      {/* City breakdown */}
      {(() => {
        const cityCounts: Record<string, number> = {};
        for (const s of sessions) {
          if (s.city) {
            const label = `${s.city}${s.country ? `, ${s.country}` : ""}`;
            cityCounts[label] = (cityCounts[label] || 0) + 1;
          }
        }
        const sortedCities = Object.entries(cityCounts).sort(([, a], [, b]) => b - a);
        if (sortedCities.length === 0) return null;

        return (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
              Top Cities
            </h3>
            <div className="space-y-2">
              {sortedCities.slice(0, 15).map(([city, count]) => (
                <div key={city} className="flex items-center justify-between">
                  <span className="text-sm text-white/50">{city}</span>
                  <span className="text-xs text-white/30">{count}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// Shared components
// ════════════════════════════════════════════════════════════════════
function StatCard({
  label,
  value,
  isText,
}: {
  label: string;
  value: number | string;
  isText?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="mb-1 text-[10px] uppercase tracking-wider text-white/30">{label}</p>
      <p className={`text-xl font-bold ${isText ? "text-cyan-400 text-base" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}
