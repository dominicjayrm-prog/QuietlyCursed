"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabase } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import type { TipTapJSON } from "./RichTextEditor";

const BANNER_BUCKET = "atlas-banners";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-sm text-white/20">
      Loading editor...
    </div>
  ),
});

interface AtlasPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  youtube_url: string | null;
  youtube_video_id: string | null;
  featured_description: string | null;
  content: string | null;
  content_json: Record<string, unknown> | null;
  content_format: "markdown" | "json";
  banner_url: string | null;
  banner_alt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  related_posts: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

type PostForm = Omit<AtlasPost, "id" | "created_at" | "updated_at">;

const EMPTY_FORM: PostForm = {
  title: "",
  slug: "",
  subtitle: "",
  youtube_url: "",
  youtube_video_id: "",
  featured_description: "",
  content: "",
  content_json: null,
  content_format: "json",
  banner_url: "",
  banner_alt: "",
  meta_title: "",
  meta_description: "",
  related_posts: [],
  is_published: false,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractYouTubeId(url: string): string {
  if (!url) return "";
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return "";
}

export default function AtlasManager() {
  const [posts, setPosts] = useState<AtlasPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PostForm>({ ...EMPTY_FORM });
  const [error, setError] = useState("");
  const [titleManuallyEdited, setTitleManuallyEdited] = useState(false);
  const [tableStatus, setTableStatus] = useState<"checking" | "ok" | "missing">("checking");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  // Track the editor JSON separately so we don't re-render the editor on every keystroke
  const editorJsonRef = useRef<TipTapJSON | null>(null);
  // Key to force remount editor when switching posts
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    fetch("/api/setup")
      .then((r) => r.json())
      .then((d) => setTableStatus(d.status === "ok" ? "ok" : "missing"))
      .catch(() => setTableStatus("missing"));
  }, []);

  const getToken = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return null;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    const res = await fetch("/api/admin/atlas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setPosts(await res.json());
    }
    setLoading(false);
  }, [getToken]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  function openCreate() {
    setForm({ ...EMPTY_FORM });
    editorJsonRef.current = null;
    setEditingId(null);
    setTitleManuallyEdited(false);
    setError("");
    setEditorKey((k) => k + 1);
    setView("form");
  }

  function openEdit(post: AtlasPost) {
    const contentJson = post.content_json as TipTapJSON | null;
    editorJsonRef.current = contentJson;
    setForm({
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle ?? "",
      youtube_url: post.youtube_url ?? "",
      youtube_video_id: post.youtube_video_id ?? "",
      featured_description: post.featured_description ?? "",
      content: post.content ?? "",
      content_json: post.content_json,
      content_format: post.content_format || "markdown",
      banner_url: post.banner_url ?? "",
      banner_alt: post.banner_alt ?? "",
      meta_title: post.meta_title ?? "",
      meta_description: post.meta_description ?? "",
      related_posts: post.related_posts ?? [],
      is_published: post.is_published,
    });
    setEditingId(post.id);
    setTitleManuallyEdited(true);
    setError("");
    setEditorKey((k) => k + 1);
    setView("form");
  }

  function updateField(key: keyof PostForm, value: string | boolean | string[] | Record<string, unknown> | null) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !titleManuallyEdited) {
        next.slug = slugify(value as string);
      }
      if (key === "youtube_url") {
        next.youtube_video_id = extractYouTubeId(value as string);
      }
      return next;
    });
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    const supabase = getSupabase();
    if (!supabase) {
      setUploadingBanner(false);
      return;
    }

    // Remove old banner from storage if replacing
    if (form.banner_url) {
      const oldPath = form.banner_url.match(new RegExp(`${BANNER_BUCKET}/(.+)$`));
      if (oldPath) {
        await supabase.storage.from(BANNER_BUCKET).remove([oldPath[1]]);
      }
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BANNER_BUCKET)
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError("Banner upload failed: " + uploadError.message);
      setUploadingBanner(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from(BANNER_BUCKET)
      .getPublicUrl(fileName);

    updateField("banner_url", urlData.publicUrl);
    setUploadingBanner(false);
    if (bannerFileRef.current) bannerFileRef.current.value = "";
  }

  async function removeBanner() {
    const supabase = getSupabase();
    if (!supabase || !form.banner_url) return;

    // Remove from storage if it's in our bucket
    const pathMatch = form.banner_url.match(new RegExp(`${BANNER_BUCKET}/(.+)$`));
    if (pathMatch) {
      await supabase.storage.from(BANNER_BUCKET).remove([pathMatch[1]]);
    }

    updateField("banner_url", "");
  }

  async function handleSave() {
    setError("");
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);
    const token = await getToken();
    if (!token) {
      setError("Not authenticated.");
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      subtitle: form.subtitle || null,
      youtube_url: form.youtube_url || null,
      youtube_video_id: form.youtube_video_id || null,
      featured_description: form.featured_description || null,
      content: form.content || null,
      content_json: editorJsonRef.current ?? form.content_json ?? null,
      content_format: "json" as const,
      banner_url: form.banner_url || null,
      banner_alt: form.banner_alt || null,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
    };

    const url = editingId
      ? `/api/admin/atlas/${editingId}`
      : "/api/admin/atlas";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setView("list");
    await fetchPosts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const token = await getToken();
    if (!token) return;

    // Clean up banner from storage
    const post = posts.find((p) => p.id === id);
    if (post?.banner_url) {
      const supabase = getSupabase();
      const pathMatch = post.banner_url.match(new RegExp(`${BANNER_BUCKET}/(.+)$`));
      if (supabase && pathMatch) {
        await supabase.storage.from(BANNER_BUCKET).remove([pathMatch[1]]);
      }
    }

    await fetch(`/api/admin/atlas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchPosts();
  }

  async function handleTogglePublish(post: AtlasPost) {
    const token = await getToken();
    if (!token) return;

    await fetch(`/api/admin/atlas/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_published: !post.is_published }),
    });
    await fetchPosts();
  }

  // --- List View ---
  if (view === "list") {
    return (
      <div className="space-y-6">
        {tableStatus === "missing" && (
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <h3 className="mb-2 text-sm font-semibold text-yellow-400">
              Database Setup Required
            </h3>
            <p className="mb-3 text-xs text-white/40 leading-relaxed">
              The <code className="text-cyan-400">atlas_posts</code> table
              doesn&apos;t exist yet. Go to your{" "}
              <strong className="text-white/60">
                Supabase Dashboard &rarr; SQL Editor
              </strong>{" "}
              and run the migration SQL files in{" "}
              <code className="text-cyan-400">
                supabase/migrations/
              </code>
              .
            </p>
            <button
              onClick={() => {
                fetch("/api/setup")
                  .then((r) => r.json())
                  .then((d) =>
                    setTableStatus(d.status === "ok" ? "ok" : "missing")
                  );
              }}
              className="text-xs text-yellow-400/80 underline hover:text-yellow-400 cursor-pointer"
            >
              Recheck connection
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white/80">Atlas Posts</h2>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20 cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Post
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-white/30">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <p className="text-sm text-white/30">
              No Atlas posts yet. Create your first case file.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="truncate text-sm font-medium text-white/80">
                      {post.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        post.is_published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-white/30">
                    /atlas/{post.slug} &middot;{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className="rounded-md bg-white/5 px-3 py-1.5 text-xs text-white/40 hover:bg-white/10 hover:text-white/60 cursor-pointer"
                  >
                    {post.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => openEdit(post)}
                    className="rounded-md bg-white/5 px-3 py-1.5 text-xs text-white/40 hover:bg-white/10 hover:text-white/60 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="rounded-md bg-red-500/10 px-3 py-1.5 text-xs text-red-400/60 hover:bg-red-500/20 hover:text-red-400 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- Form View ---
  const availableRelated = posts.filter((p) => p.id !== editingId);
  const initialEditorContent = (form.content_json as TipTapJSON | null) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white/80">
          {editingId ? "Edit Post" : "New Atlas Post"}
        </h2>
        <button
          onClick={() => setView("list")}
          className="text-sm text-white/40 hover:text-white/60 cursor-pointer"
        >
          &larr; Back to list
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
            Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Why It Sucks To Be Highly Intelligent"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
            Slug *
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/20">/atlas/</span>
            <input
              value={form.slug}
              onChange={(e) => {
                setTitleManuallyEdited(true);
                updateField("slug", e.target.value);
              }}
              placeholder="why-it-sucks-to-be-highly-intelligent"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
            Subtitle (hook line)
          </label>
          <input
            value={form.subtitle ?? ""}
            onChange={(e) => updateField("subtitle", e.target.value)}
            placeholder="Short hook line for the post"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
          />
        </div>

        {/* Banner Image Upload */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
            Banner Image
          </label>
          {form.banner_url ? (
            <div className="relative overflow-hidden rounded-lg border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.banner_url}
                alt="Banner preview"
                className="h-40 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <label
                  htmlFor="banner-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/20"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  Replace
                </label>
                <button
                  type="button"
                  onClick={removeBanner}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-xs font-medium text-red-400 backdrop-blur-sm hover:bg-red-500/30 cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <label
                htmlFor="banner-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                {uploadingBanner ? "Uploading..." : "Upload Banner"}
              </label>
              <p className="mt-3 text-xs text-white/20">
                PNG, JPG, or WebP. Displayed as the post&apos;s hero image.
              </p>
            </div>
          )}
          <input
            ref={bannerFileRef}
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="hidden"
            id="banner-upload"
            disabled={uploadingBanner}
          />
          {form.banner_url && (
            <div className="mt-3">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
                Banner Alt Text
              </label>
              <input
                value={form.banner_alt ?? ""}
                onChange={(e) => updateField("banner_alt", e.target.value)}
                placeholder="Describe the banner image for accessibility and SEO"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* YouTube URL */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
            YouTube URL
          </label>
          <input
            value={form.youtube_url ?? ""}
            onChange={(e) => updateField("youtube_url", e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
          />
          {form.youtube_video_id && (
            <p className="mt-1.5 text-xs text-cyan-400/60">
              Video ID: {form.youtube_video_id}
            </p>
          )}
        </div>

        {/* Featured Description */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
            Featured Card Description
          </label>
          <textarea
            value={form.featured_description ?? ""}
            onChange={(e) =>
              updateField("featured_description", e.target.value)
            }
            placeholder="Short 1-2 line preview text for the card"
            rows={2}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
          />
        </div>

        {/* SEO Fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
              SEO Meta Title
            </label>
            <input
              value={form.meta_title ?? ""}
              onChange={(e) => updateField("meta_title", e.target.value)}
              placeholder="SEO title (defaults to post title)"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
              SEO Meta Description
            </label>
            <input
              value={form.meta_description ?? ""}
              onChange={(e) => updateField("meta_description", e.target.value)}
              placeholder="SEO description"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Article Content — Rich Text Editor */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
            Article Content
          </label>
          <RichTextEditor
            key={editorKey}
            initialContent={initialEditorContent}
            onChange={(json) => {
              editorJsonRef.current = json;
            }}
            placeholder="Start writing your article..."
          />
        </div>

        {/* Related Posts */}
        {availableRelated.length > 0 && (
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">
              Related Posts
            </label>
            <div className="space-y-2">
              {availableRelated.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2.5 cursor-pointer hover:border-white/10"
                >
                  <input
                    type="checkbox"
                    checked={form.related_posts.includes(p.id)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...form.related_posts, p.id]
                        : form.related_posts.filter((id) => id !== p.id);
                      updateField("related_posts", next);
                    }}
                    className="rounded border-white/20 accent-cyan-500"
                  />
                  <span className="text-sm text-white/60">{p.title}</span>
                  <span
                    className={`ml-auto text-[10px] uppercase tracking-wider ${
                      p.is_published ? "text-green-400/60" : "text-yellow-400/60"
                    }`}
                  >
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Publish Toggle */}
        <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => updateField("is_published", e.target.checked)}
              className="rounded border-white/20 accent-cyan-500"
            />
            <span className="text-sm text-white/60">
              {form.is_published ? "Published" : "Draft"} &mdash;{" "}
              {form.is_published
                ? "This post is live on the site."
                : "Save as draft. Not visible to the public."}
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-6 py-2.5 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : editingId ? "Update Post" : "Create Post"}
          </button>
          <button
            onClick={() => setView("list")}
            className="rounded-lg bg-white/5 px-6 py-2.5 text-sm text-white/40 hover:bg-white/10 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
