"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase/client";

interface PageView {
  id: string;
  path: string;
  referrer: string | null;
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
    async function fetch() {
      const supabase = getSupabase()!;
      const { data } = await supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      setViews(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-sm text-white/30">Loading traffic data...</div>;
  }

  if (views.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-white/30">
        No page views recorded yet. Traffic data will appear here as visitors browse the site.
      </div>
    );
  }

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

  // Medium breakdown
  const mediumCounts: Record<string, number> = {};
  for (const v of views) {
    if (v.utm_medium) {
      mediumCounts[v.utm_medium] = (mediumCounts[v.utm_medium] || 0) + 1;
    }
  }
  const sortedMediums = Object.entries(mediumCounts).sort(([, a], [, b]) => b - a);

  // Campaign breakdown
  const campaignCounts: Record<string, number> = {};
  for (const v of views) {
    if (v.utm_campaign) {
      campaignCounts[v.utm_campaign] = (campaignCounts[v.utm_campaign] || 0) + 1;
    }
  }
  const sortedCampaigns = Object.entries(campaignCounts).sort(([, a], [, b]) => b - a);

  // Views by day
  const dayCounts: Record<string, number> = {};
  for (const v of views) {
    const day = v.created_at.slice(0, 10);
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  }
  const sortedDays = Object.entries(dayCounts).sort(([a], [b]) => a.localeCompare(b)).slice(-30);
  const maxDay = Math.max(...sortedDays.map(([, c]) => c), 1);

  const today = new Date().toISOString().slice(0, 10);
  const utmViews = views.filter((v) => v.utm_source);

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Views" value={views.length} />
        <StatCard label="Today" value={dayCounts[today] || 0} />
        <StatCard label="UTM Tracked" value={utmViews.length} />
        <StatCard label="Unique Pages" value={Object.keys(pageCounts).length} />
      </div>

      {/* Views over time */}
      {sortedDays.length > 1 && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
            Page Views (Last 30 Days)
          </h3>
          <div className="flex items-end gap-1 h-32">
            {sortedDays.map(([day, count]) => (
              <div key={day} className="group relative flex-1 flex flex-col items-center justify-end h-full">
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
        {/* Top pages */}
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

        {/* UTM Sources */}
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

      {/* Medium + Campaign */}
      <div className="grid gap-6 md:grid-cols-2">
        {sortedMediums.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
              By Medium
            </h3>
            <div className="space-y-3">
              {sortedMediums.slice(0, 10).map(([medium, count]) => (
                <div key={medium} className="flex items-center justify-between">
                  <span className="text-sm text-white/50">{medium}</span>
                  <span className="text-xs text-white/30">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sortedCampaigns.length > 0 && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
              By Campaign
            </h3>
            <div className="space-y-3">
              {sortedCampaigns.slice(0, 10).map(([campaign, count]) => (
                <div key={campaign} className="flex items-center justify-between">
                  <span className="text-sm text-white/50">{campaign}</span>
                  <span className="text-xs text-white/30">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
                <th className="pb-3 pr-4">Medium</th>
                <th className="pb-3">Campaign</th>
              </tr>
            </thead>
            <tbody>
              {views.slice(0, 25).map((v) => (
                <tr key={v.id} className="border-b border-white/[0.03]">
                  <td className="py-2.5 pr-4 text-white/30 whitespace-nowrap">
                    {new Date(v.created_at).toLocaleString()}
                  </td>
                  <td className="py-2.5 pr-4 text-white/50">{v.path}</td>
                  <td className="py-2.5 pr-4 text-white/40">{v.utm_source || "—"}</td>
                  <td className="py-2.5 pr-4 text-white/40">{v.utm_medium || "—"}</td>
                  <td className="py-2.5 text-white/40">{v.utm_campaign || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
      <p className="mb-1 text-xs uppercase tracking-wider text-white/30">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
