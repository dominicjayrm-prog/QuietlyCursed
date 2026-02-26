import Link from "next/link";
import EyeGlow from "@/components/EyeGlow";
import ParallaxSection from "@/components/ParallaxSection";
import BrainIcon from "@/components/BrainIcon";
import FadeIn from "@/components/FadeIn";
import HomepageFAQ from "@/components/HomepageFAQ";

const ARCHETYPE_TEASERS = [
  {
    name: "The Watcher",
    teaser: "Sees everything. Says nothing. Understands too much.",
  },
  {
    name: "The Prototype",
    teaser: "Always becoming. Never arriving. The draft that never ships.",
  },
  {
    name: "The Climber",
    teaser: "Measures life in wins. Fills the void with the next achievement.",
  },
  {
    name: "The Ghost",
    teaser: "Present but unreachable. Safe inside strategic absence.",
  },
  {
    name: "The Container",
    teaser: "Holds everything for everyone. Puts nothing down.",
  },
  {
    name: "The Peacemaker",
    teaser: "Would rather bleed than cause a wound. Keeps the peace at any cost.",
  },
];

const EMOTIONAL_DRIVERS = [
  "To understand why they always feel responsible for everyone else\u2019s emotions.",
  "To understand why success never feels like enough — and the next goal starts before the last one lands.",
  "To understand why they see patterns others miss, but can\u2019t stop watching long enough to act.",
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6">
        <div
          aria-hidden="true"
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

          <p className="animate-fade-in-up-delay-2 mb-10 text-sm text-white/50 tracking-widest uppercase">
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

      {/* ─── Section 1: The Trait Index (moved above Atlas) ─── */}
      <section className="border-t border-white/5 bg-white/[0.01]" aria-label="Trait Index assessment">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
          <FadeIn>
            <EyeGlow size="sm" className="mx-auto mb-6 w-8 h-4 opacity-50" />
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
              The Trait Index
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              Not a personality label. Not a type indicator. The Trait Index maps
              the psychological identity pattern you&apos;ve been running your
              entire life — the role you default to, the defence you don&apos;t
              notice, the self you built without choosing it.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <ul className="mx-auto mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400/50" />
                12 psychologically weighted questions
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400/50" />
                6 archetypes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400/50" />
                Takes 2–3 minutes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-cyan-400/50" />
                No sign-up required
              </li>
            </ul>
          </FadeIn>

          <FadeIn delay={200}>
            <Link
              href="/trait-index"
              className="animate-glow-pulse inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-8 py-3.5 text-sm font-semibold tracking-wider uppercase text-cyan-400 transition-all hover:bg-cyan-500/20 hover:border-cyan-400/50"
              aria-label="Start the Trait Index psychological archetype quiz"
            >
              <BrainIcon className="w-4 h-4 text-purple-400" />
              Take the Trait Index
            </Link>
            <p className="mt-4 text-xs text-white/40">
              Private. Anonymous. Designed for psychological self-reflection.
            </p>
            <p className="mt-1 text-xs text-white/40">
              Most people complete this in under 3 minutes.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── Section 2: Archetype Preview Grid ─── */}
      <section className="border-t border-white/5" aria-label="The six psychological archetypes">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <FadeIn>
            <h3 className="mb-2 text-center text-lg font-semibold tracking-tight text-white/70 md:text-xl">
              The Six Archetypes
            </h3>
            <p className="mx-auto mb-10 max-w-md text-center text-sm text-white/50">
              One runs deepest. The quiz tells you which.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ARCHETYPE_TEASERS.map((arch, i) => (
              <FadeIn key={arch.name} delay={i * 80}>
                <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-cyan-500/20 hover:bg-cyan-500/[0.03] hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.15)]">
                  <h4 className="mb-2 text-base font-semibold text-white/80 transition-colors group-hover:text-cyan-400">
                    {arch.name}
                  </h4>
                  <p className="text-sm leading-relaxed text-white/50 transition-colors group-hover:text-white/60">
                    {arch.teaser}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 3: What is the Atlas? ─── */}
      <section className="border-t border-white/5 bg-white/[0.01]" aria-label="About the Atlas">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24 text-center">
          <FadeIn>
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-white md:text-3xl">
              What is the Atlas?
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-[1.85] text-white/60 md:text-lg">
              Your brain runs invisible programs — cognitive biases, emotional
              shortcuts, identity loops — that distort every decision you think
              you&apos;re making freely. The Atlas is a structural breakdown of
              each one. Not advice. Not theory. Psychological architecture.
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <ul className="mx-auto mt-8 max-w-lg space-y-3 text-left text-sm text-white/60">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500/40" />
                How each trap operates beneath conscious awareness
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500/40" />
                Where it shows up in relationships, work, and self-image
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500/40" />
                What it protects you from — and what it quietly costs
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500/40" />
                The internal logic that keeps you trapped inside it
              </li>
            </ul>
          </FadeIn>

          <FadeIn delay={250}>
            <Link
              href="/atlas"
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-semibold tracking-wider uppercase text-white/60 transition-all hover:border-cyan-500/20 hover:text-cyan-400 hover:bg-cyan-500/[0.05]"
              aria-label="Browse the Atlas of psychological traps"
            >
              <BrainIcon className="w-4 h-4 text-purple-400/70" />
              Browse the Atlas
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ─── Section 4: Why People Use This ─── */}
      <section className="border-y border-white/5 bg-white/[0.01]" aria-label="Why people use Quietly Cursed">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
          <FadeIn>
            <h3 className="mb-8 text-lg font-semibold tracking-tight text-white/60 md:text-xl">
              Why People Use This
            </h3>
          </FadeIn>
          <div className="mx-auto max-w-xl space-y-5">
            {EMOTIONAL_DRIVERS.map((line, i) => (
              <FadeIn key={i} delay={i * 120}>
                <p className="text-sm leading-relaxed text-white/50 italic">
                  &ldquo;{line}&rdquo;
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 5: FAQ ─── */}
      <HomepageFAQ />
    </>
  );
}
