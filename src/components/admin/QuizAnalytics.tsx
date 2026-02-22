"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase/client";

interface QuizResult {
  id: string;
  primary_archetype: string;
  secondary_archetype: string;
  scores: Record<string, number>;
  created_at: string;
}

const ARCHETYPE_COLORS: Record<string, string> = {
  watcher: "bg-cyan-400",
  prototype: "bg-amber-400",
  container: "bg-emerald-400",
  climber: "bg-red-400",
  ghost: "bg-slate-400",
  peacemaker: "bg-purple-400",
};

export default function QuizAnalytics() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const supabase = getSupabase()!;
      const { data } = await supabase
        .from("quiz_results")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      setResults(data ?? []);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-sm text-white/30">Loading analytics...</div>;
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-white/30">
        No quiz completions yet. Results will appear here once visitors take the Trait Index.
      </div>
    );
  }

  // Archetype distribution
  const primaryCounts: Record<string, number> = {};
  const secondaryCounts: Record<string, number> = {};
  for (const r of results) {
    primaryCounts[r.primary_archetype] = (primaryCounts[r.primary_archetype] || 0) + 1;
    secondaryCounts[r.secondary_archetype] = (secondaryCounts[r.secondary_archetype] || 0) + 1;
  }
  const maxPrimary = Math.max(...Object.values(primaryCounts), 1);

  // Completions by day (last 30 days)
  const dayCounts: Record<string, number> = {};
  for (const r of results) {
    const day = r.created_at.slice(0, 10);
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  }
  const sortedDays = Object.entries(dayCounts).sort(([a], [b]) => a.localeCompare(b)).slice(-30);
  const maxDay = Math.max(...sortedDays.map(([, c]) => c), 1);

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total Completions" value={results.length} />
        <StatCard label="Today" value={dayCounts[new Date().toISOString().slice(0, 10)] || 0} />
        <StatCard
          label="Top Archetype"
          value={Object.entries(primaryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—"}
          isText
        />
        <StatCard label="Last 7 Days" value={results.filter((r) => {
          const d = new Date(r.created_at);
          return d > new Date(Date.now() - 7 * 86400000);
        }).length} />
      </div>

      {/* Primary archetype distribution */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
          Primary Archetype Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(primaryCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([archetype, count]) => (
              <div key={archetype} className="flex items-center gap-3">
                <span className="w-24 text-sm capitalize text-white/50">{archetype}</span>
                <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ARCHETYPE_COLORS[archetype] || "bg-cyan-400"} opacity-70 transition-all duration-500`}
                    style={{ width: `${(count / maxPrimary) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-white/30">{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Completions over time */}
      {sortedDays.length > 1 && (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
            Completions Over Time (Last 30 Days)
          </h3>
          <div className="flex items-end gap-1 h-32">
            {sortedDays.map(([day, count]) => (
              <div key={day} className="group relative flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full rounded-t bg-cyan-400/60 transition-all min-h-[2px]"
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

      {/* Recent results table */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white/40">
          Recent Results
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-white/30">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Primary</th>
                <th className="pb-3 pr-4">Secondary</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 20).map((r) => (
                <tr key={r.id} className="border-b border-white/[0.03]">
                  <td className="py-2.5 pr-4 text-white/30">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 pr-4 capitalize text-white/60">{r.primary_archetype}</td>
                  <td className="py-2.5 pr-4 capitalize text-white/40">{r.secondary_archetype}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

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
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
      <p className="mb-1 text-xs uppercase tracking-wider text-white/30">{label}</p>
      <p className={`text-2xl font-bold ${isText ? "capitalize text-cyan-400 text-lg" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
