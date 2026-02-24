"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export default function SubscriberManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function getToken() {
    const supabase = getSupabase();
    if (!supabase) return null;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }

  async function fetchSubscribers() {
    setLoading(true);
    setError("");
    const token = await getToken();
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/subscribers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to load subscribers");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setSubscribers(data);
    } catch {
      setError("Failed to connect to the server.");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    const token = await getToken();
    if (!token) return;

    const res = await fetch(`/api/admin/subscribers?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete subscriber");
    }

    setDeletingId(null);
    fetchSubscribers();
  }

  async function handleExportCsv() {
    const token = await getToken();
    if (!token) return;

    const res = await fetch("/api/admin/subscribers?format=csv", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      setError("Failed to export CSV");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
            Email Subscribers
            {!loading && (
              <span className="ml-2 text-white/20">
                ({subscribers.length})
              </span>
            )}
          </h3>
          {subscribers.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/20 cursor-pointer"
            >
              Export CSV
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-sm text-white/30 animate-pulse">
            Loading subscribers...
          </p>
        )}

        {/* Table */}
        {!loading && subscribers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/30">
                    Email
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/30">
                    Subscribed
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-wider text-white/30">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-white/[0.03] last:border-0"
                  >
                    <td className="py-3 pr-4 text-white/70">{s.email}</td>
                    <td className="py-3 pr-4 text-white/40">
                      {formatDate(s.subscribed_at)}
                    </td>
                    <td className="py-3">
                      {deletingId === s.id ? (
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-red-400">
                            Confirm?
                          </span>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="rounded px-2 py-1 text-xs font-medium text-red-400 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="rounded px-2 py-1 text-xs font-medium text-white/40 border border-white/10 hover:text-white/60 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeletingId(s.id)}
                          className="rounded px-2 py-1 text-xs font-medium text-white/30 border border-white/10 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty state */}
        {!loading && subscribers.length === 0 && !error && (
          <p className="text-sm text-white/30">
            No subscribers yet. The signup form is live on every Atlas post page.
          </p>
        )}
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
          About Subscribers
        </h3>
        <div className="space-y-3 text-sm text-white/50">
          <p>
            <span className="text-white/70">1.</span> Emails are collected from
            the signup form displayed on Atlas post pages.
          </p>
          <p>
            <span className="text-white/70">2.</span> Use{" "}
            <strong className="text-white/70">Export CSV</strong> to download
            all subscribers for import into your email provider.
          </p>
          <p>
            <span className="text-white/70">3.</span> The table must be created
            first — run the setup migration at{" "}
            <code className="text-cyan-400/60">POST /api/setup</code> or
            execute migration{" "}
            <code className="text-cyan-400/60">
              008_email_subscribers.sql
            </code>{" "}
            in the Supabase SQL Editor.
          </p>
        </div>
      </div>
    </div>
  );
}
