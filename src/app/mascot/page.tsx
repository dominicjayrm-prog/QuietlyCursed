import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { mascotLore, mascotGallery } from "@/data/mascot";
import EyeGlow from "@/components/EyeGlow";

export const metadata: Metadata = buildMetadata({
  title: "The Watcher — Mascot",
  description: mascotLore.tagline,
  path: "/mascot",
});

export default function MascotPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <EyeGlow size="lg" className="w-32 h-16" />
        </div>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
          {mascotLore.name}
        </h1>
        <p className="text-lg text-cyan-400/70 italic">{mascotLore.tagline}</p>
      </div>

      {/* Lore */}
      <div className="mx-auto mb-20 max-w-2xl space-y-6">
        {mascotLore.description.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-base leading-[1.8] text-white/55 md:text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Gallery */}
      <div className="mb-8">
        <h2 className="mb-8 text-center text-2xl font-semibold text-white/70">
          Gallery
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {mascotGallery.map((img) => (
            <figure
              key={img.src}
              className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-colors hover:border-purple-500/20"
            >
              <div className="flex aspect-square items-center justify-center bg-neutral-900/50 p-8">
                {/* Placeholder — replace with actual artwork */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <EyeGlow size="lg" className="w-24 h-12 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs text-white/20 tracking-wider uppercase">
                    Artwork placeholder
                  </span>
                </div>
              </div>
              <figcaption className="px-5 py-4">
                <p className="text-sm text-white/50">{img.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
