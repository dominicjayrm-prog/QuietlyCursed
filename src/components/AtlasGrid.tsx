"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import BrainIcon from "@/components/BrainIcon";

interface Post {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  featured_description: string | null;
  tags: string[];
  created_at: string;
}

interface AtlasGridProps {
  posts: Post[];
  allTags: string[];
}

export default function AtlasGrid({ posts, allTags }: AtlasGridProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = posts;

    if (activeTag) {
      result = result.filter((p) => p.tags?.includes(activeTag));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          (p.featured_description &&
            p.featured_description.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [posts, query, activeTag]);

  return (
    <>
      {/* Search bar */}
      <div className="mx-auto mb-8 max-w-xl">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case files..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-cyan-500/30 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer ${
              activeTag === null
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer ${
                activeTag === tag
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                  : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
          <p className="text-sm text-white/50">
            {query || activeTag
              ? "No case files match your search."
              : "Case files are being compiled. The first entry is coming soon."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <Link
              key={post.id}
              href={`/atlas/${post.slug}`}
              className={`group relative block rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.04] hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.15)] ${
                i < 3
                  ? `animate-fade-in-up-delay-${i + 1}`
                  : "animate-fade-in-up-delay-3"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <BrainIcon className="w-5 h-5 text-purple-400/70 transition-colors group-hover:text-purple-400" />
                <time
                  dateTime={post.created_at}
                  className="text-xs text-white/30 tracking-wider uppercase"
                >
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white/90 transition-colors group-hover:text-cyan-400">
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                {post.featured_description || post.subtitle || ""}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] tracking-wider uppercase text-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 text-xs font-medium text-cyan-500/60 tracking-wider uppercase transition-colors group-hover:text-cyan-400">
                Enter Case File &rarr;
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
