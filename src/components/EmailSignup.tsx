"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setMessage("You're in. We'll be in touch.");
        setEmail("");
      } else {
        const data = await res.json();
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.03] p-8 text-center">
        <svg
          viewBox="0 0 24 24"
          className="mx-auto mb-3 h-6 w-6 text-cyan-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <p className="text-sm text-cyan-400">{message}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
      <h3 className="mb-2 text-lg font-semibold text-white/80">
        Stay in the loop
      </h3>
      <p className="mx-auto mb-6 max-w-sm text-sm text-white/40">
        New case files, psychological deep dives, and pattern breakdowns
        delivered to your inbox.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-md gap-3"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="you@example.com"
          required
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/30 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20 disabled:opacity-50 cursor-pointer"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-xs text-red-400">{message}</p>
      )}
    </div>
  );
}
