"use client";

import { useState, useEffect, useRef } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { validateImageFile } from "@/lib/api-helpers";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  sort_order: number;
  created_at: string;
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });
    setImages(data ?? []);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setUploading(true);
    const supabase = getSupabase();
    if (!supabase) { setUploading(false); return; }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("mascot-gallery")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("mascot-gallery")
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("gallery_images").insert({
      src: urlData.publicUrl,
      alt: file.name,
      caption: "",
      sort_order: images.length,
    });

    if (insertError) {
      alert("Failed to save image record: " + insertError.message);
    } else {
      await fetchImages();
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(id: string, src: string) {
    if (!confirm("Delete this image?")) return;

    const supabase = getSupabase();
    if (!supabase) return;

    // Delete from storage
    const pathMatch = src.match(/mascot-gallery\/(.+)$/);
    if (pathMatch) {
      await supabase.storage.from("mascot-gallery").remove([pathMatch[1]]);
    }

    // Delete record
    await supabase.from("gallery_images").delete().eq("id", id);
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  function startEdit(img: GalleryImage) {
    setEditingId(img.id);
    setEditAlt(img.alt);
    setEditCaption(img.caption);
  }

  async function saveEdit(id: string) {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase
      .from("gallery_images")
      .update({ alt: editAlt, caption: editCaption })
      .eq("id", id);
    setEditingId(null);
    await fetchImages();
  }

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleUpload}
          className="hidden"
          id="gallery-upload"
        />
        <label
          htmlFor="gallery-upload"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          {uploading ? "Uploading..." : "Upload Image"}
        </label>
        <p className="mt-3 text-xs text-white/20">
          PNG, JPG, WebP, or SVG. Images are stored in Supabase Storage.
        </p>
      </div>

      {/* Image grid */}
      {loading ? (
        <div className="py-12 text-center text-sm text-white/30">Loading gallery...</div>
      ) : images.length === 0 ? (
        <div className="py-12 text-center text-sm text-white/30">
          No images yet. Upload your first mascot image above.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="group rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
              <div className="relative aspect-square bg-neutral-900/50">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover"
                />
                {/* Action overlay */}
                <div className="absolute inset-0 flex items-start justify-end gap-2 bg-gradient-to-b from-black/40 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => startEdit(img)}
                    className="rounded-md bg-white/10 p-1.5 text-white/70 backdrop-blur-sm hover:bg-white/20 cursor-pointer"
                    title="Edit"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(img.id, img.src)}
                    className="rounded-md bg-red-500/20 p-1.5 text-red-400 backdrop-blur-sm hover:bg-red-500/30 cursor-pointer"
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Edit form or caption display */}
              {editingId === img.id ? (
                <div className="space-y-3 p-4">
                  <input
                    value={editAlt}
                    onChange={(e) => setEditAlt(e.target.value)}
                    placeholder="Alt text"
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
                  />
                  <input
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="Caption"
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(img.id)}
                      className="flex-1 rounded-md bg-cyan-500/20 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/30 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 rounded-md bg-white/5 py-1.5 text-xs text-white/40 hover:bg-white/10 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-xs text-white/50 line-clamp-2">
                    {img.caption || img.alt || "No caption"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
