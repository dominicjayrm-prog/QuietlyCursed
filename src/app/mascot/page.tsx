import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { mascotLore, mascotGallery } from "@/data/mascot";
import EyeGlow from "@/components/EyeGlow";
import MascotGallery from "@/components/MascotGallery";

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
      <div className="mx-auto mb-20 max-w-2xl space-y-8 text-center">
        {mascotLore.description.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-lg leading-[2] text-white/60 md:text-xl tracking-wide"
                : i === mascotLore.description.split("\n\n").length - 1
                  ? "text-base leading-[2] text-white/35 md:text-lg italic"
                  : "text-base leading-[2] text-white/45 md:text-lg"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Manifestations */}
      <div className="mb-8">
        <h2 className="mb-3 text-center text-2xl font-semibold text-white/70">
          Manifestations
        </h2>
        <p className="mx-auto mb-4 max-w-lg text-center text-sm leading-relaxed text-white/40">
          The Watcher shifts form depending on the trap it observes.
        </p>
        <p className="mx-auto mb-10 max-w-lg text-center text-sm leading-relaxed text-white/30 italic">
          It changes posture, but never expression.
        </p>
        <MascotGallery images={mascotGallery} />
      </div>
    </section>
  );
}
