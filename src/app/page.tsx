import Link from "next/link";
import EyeGlow from "@/components/EyeGlow";
import ParallaxSection from "@/components/ParallaxSection";
import BrainIcon from "@/components/BrainIcon";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6">
        {/* Background radial glow */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(34,211,238,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 50% 60%, rgba(168,85,247,0.06) 0%, transparent 70%)",
          }}
        />

        <ParallaxSection speed={0.15} className="relative z-10 flex flex-col items-center text-center">
          <div className="animate-float mb-8">
            <EyeGlow size="lg" className="w-28 h-14 md:w-40 md:h-20" />
          </div>

          <h1 className="animate-fade-in-up mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Quietly Cursed
          </h1>

          <p className="animate-fade-in-up-delay-1 mb-2 max-w-xl text-lg text-white/50 md:text-xl">
            A psychological atlas of the traps that silently shape your mind.
          </p>

          <p className="animate-fade-in-up-delay-2 mb-10 text-sm text-white/30 tracking-widest uppercase">
            You&apos;re already inside one.
          </p>

          <Link
            href="/atlas"
            className="animate-fade-in-up-delay-3 animate-glow-pulse inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase text-cyan-400 transition-all hover:bg-cyan-500/20 hover:border-cyan-400/50"
          >
            <BrainIcon className="w-4 h-4 text-purple-400" />
            Enter the Atlas
          </Link>
        </ParallaxSection>
      </section>

      {/* Teaser section */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="mb-6 text-2xl font-semibold text-white/80 md:text-3xl">
          What is the Atlas?
        </h2>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/45 md:text-lg">
          Every decision you make passes through invisible filters — cognitive
          biases, logical fallacies, emotional shortcuts. The Atlas maps these
          psychological traps: how they work, why they persist, and what it
          costs to ignore them. Each entry is a deep dive into one of the
          mind&apos;s quiet curses.
        </p>
      </section>

      {/* Trait Index CTA */}
      <section className="border-t border-white/5 bg-white/[0.01]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <EyeGlow size="sm" className="mx-auto mb-6 w-8 h-4 opacity-50" />
          <h2 className="mb-4 text-2xl font-semibold text-white/80 md:text-3xl">
            The Trait Index
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/45 md:text-lg">
            12 questions. 6 archetypes. Discover which psychological pattern
            runs deepest — The Watcher, The Prototype, The Container, The
            Climber, The Ghost, or The Peacemaker.
          </p>
          <Link
            href="/trait-index"
            className="inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-purple-500/10 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase text-purple-400 transition-all hover:bg-purple-500/20 hover:border-purple-400/50"
          >
            <BrainIcon className="w-4 h-4 text-cyan-400" />
            Take the Trait Index
          </Link>
        </div>
      </section>

      {/* Stats / social proof */}
      <section className="border-y border-white/5 bg-white/[0.01]">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-6 py-16 text-center md:grid-cols-3">
          {[
            { value: "6+", label: "Psychological Traps" },
            { value: "Deep", label: "Essay Explorations" },
            { value: "Free", label: "Always" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="mb-1 text-3xl font-bold text-cyan-400">
                {stat.value}
              </div>
              <div className="text-sm text-white/40 tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
