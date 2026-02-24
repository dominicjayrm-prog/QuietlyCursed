"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export default function UserManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create form state
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function getToken() {
    const supabase = getSupabase();
    if (!supabase) return null;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }

  async function fetchUsers() {
    setLoading(true);
    setError("");
    const token = await getToken();
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to load users");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setCreating(true);

    const token = await getToken();
    if (!token) {
      setFormError("Not authenticated");
      setCreating(false);
      return;
    }

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || "Failed to create user");
      setCreating(false);
      return;
    }

    setFormSuccess(`User ${data.email} created successfully`);
    setEmail("");
    setPassword("");
    setCreating(false);
    fetchUsers();

    // Auto-hide success after 3s
    setTimeout(() => setFormSuccess(""), 3000);
  }

  async function handleDelete(id: string) {
    const token = await getToken();
    if (!token) return;

    const res = await fetch(`/api/admin/users?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete user");
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    fetchUsers();
  }

  function formatDate(iso: string | null) {
    if (!iso) return "Never";
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
      {/* User List */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
            Admin Users
          </h3>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormError("");
              setFormSuccess("");
            }}
            className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/20 cursor-pointer"
          >
            {showForm ? "Cancel" : "Add User"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/30">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="user@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-wider text-white/30">
                  Password (min 6 chars)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/50 focus:outline-none"
                />
              </div>
            </div>

            {formError && (
              <p className="text-sm text-red-400">{formError}</p>
            )}
            {formSuccess && (
              <p className="text-sm text-green-400">{formSuccess}</p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-6 py-2.5 text-sm font-medium uppercase tracking-wider text-cyan-400 transition-all hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              {creating ? "Creating..." : "Create User"}
            </button>
          </form>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-sm text-white/30 animate-pulse">Loading users...</p>
        )}

        {/* Users table */}
        {!loading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/30">
                    Email
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/30">
                    Created
                  </th>
                  <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-white/30">
                    Last Sign In
                  </th>
                  <th className="pb-3 text-xs font-medium uppercase tracking-wider text-white/30">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-white/[0.03] last:border-0"
                  >
                    <td className="py-3 pr-4 text-white/70">{u.email}</td>
                    <td className="py-3 pr-4 text-white/40">
                      {formatDate(u.created_at)}
                    </td>
                    <td className="py-3 pr-4 text-white/40">
                      {formatDate(u.last_sign_in_at)}
                    </td>
                    <td className="py-3">
                      {deletingId === u.id ? (
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-red-400">
                            Confirm?
                          </span>
                          <button
                            onClick={() => handleDelete(u.id)}
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
                          onClick={() => setDeletingId(u.id)}
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
        {!loading && users.length === 0 && !error && (
          <p className="text-sm text-white/30">No users found.</p>
        )}
      </div>

      {/* Info */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
          About Admin Users
        </h3>
        <div className="space-y-3 text-sm text-white/50">
          <p>
            <span className="text-white/70">1.</span> Any user created here can
            sign in at{" "}
            <code className="text-cyan-400/60">/admin/login</code> and access
            the full admin dashboard.
          </p>
          <p>
            <span className="text-white/70">2.</span> Users are created with
            email verification skipped so they can sign in immediately.
          </p>
          <p>
            <span className="text-white/70">3.</span> You can also create users
            from the command line:{" "}
            <code className="text-cyan-400/60">npm run create-admin</code>
          </p>
        </div>
      </div>
    </div>
  );
}
