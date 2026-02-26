import Link from "next/link";
import EyeGlow from "@/components/EyeGlow";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <EyeGlow size="lg" className="mb-8 w-24 h-12 opacity-40" />
      <h1 className="mb-3 text-4xl font-bold text-white/80">Lost in the Atlas</h1>
      <p className="mb-8 max-w-md text-white/40">
        This trap doesn&apos;t exist. Or maybe it does, and you just can&apos;t
        see it yet.
      </p>
      <Link
        href="/atlas"
        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-6 py-2.5 text-sm font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20"
      >
        Return to the Atlas
      </Link>
    </section>
  );
}
