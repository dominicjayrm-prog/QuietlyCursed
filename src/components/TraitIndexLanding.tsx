"use client";

import { useRef, useState, useEffect } from "react";
import EyeGlow from "./EyeGlow";
import TraitQuiz from "./TraitQuiz";

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

export default function TraitIndexLanding() {
  const quizRef = useRef<HTMLDivElement>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  function startQuiz() {
    setQuizStarted(true);
    // Wait for DOM update, then scroll
    setTimeout(() => {
      quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* ─── Section 1: Hero ─── */}
      <section
        className={`py-16 md:py-24 text-center transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <EyeGlow size="sm" className="mx-auto mb-6 w-10 h-5 animate-float" />

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
          The Trait Index
        </h1>

        <p className="mb-3 text-lg text-cyan-400/70 italic md:text-xl">
          A psychologically serious archetype assessment.
        </p>

        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/45 md:text-lg">
          Most personality tests sort you into comfortable categories. This one
          maps the psychological patterns you actually live inside — the roles
          you play, the defences you run, the identity you&apos;ve built without
          realising it.
        </p>

        <ul className="mx-auto mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/35">
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-cyan-400/50" />
            12 questions
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

        <button
          onClick={startQuiz}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-cyan-400 transition-all hover:bg-cyan-500/20 hover:border-cyan-400/50 animate-glow-pulse cursor-pointer"
        >
          Begin The Trait Index
        </button>
      </section>

      {/* ─── Section 2: Why This Is Different ─── */}
      <section
        className={`border-t border-white/5 py-16 md:py-20 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-white md:text-3xl">
          Why This Is Different
        </h2>
        <div className="mx-auto max-w-2xl space-y-4 text-center text-base leading-[1.85] text-white/45">
          <p>
            This is not MBTI. This is not a colour-coded personality label
            designed to make you feel understood in four letters.
          </p>
          <p>
            The Trait Index doesn&apos;t sort you — it exposes you. It identifies
            psychological identity patterns: the roles you unconsciously adopt,
            the survival strategies you mistake for personality, and the internal
            architecture you&apos;ve never had language for.
          </p>
          <p>
            Every question is built around lived internal experience, not
            abstract theory. The result isn&apos;t a label. It&apos;s a mirror.
          </p>
        </div>
      </section>

      {/* ─── Section 3: Archetype Preview Grid ─── */}
      <section
        className={`border-t border-white/5 py-16 md:py-20 transition-all duration-1000 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h2 className="mb-3 text-center text-2xl font-bold tracking-tight text-white md:text-3xl">
          The Six Archetypes
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-center text-sm text-white/30">
          One runs deepest. Find out which.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARCHETYPE_TEASERS.map((arch) => (
            <div
              key={arch.name}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-cyan-500/20 hover:bg-cyan-500/[0.03] hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.15)]"
            >
              <h3 className="mb-2 text-base font-semibold text-white/80 transition-colors group-hover:text-cyan-400">
                {arch.name}
              </h3>
              <p className="text-sm leading-relaxed text-white/35 transition-colors group-hover:text-white/50">
                {arch.teaser}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Section 4: Reassurance ─── */}
      <section
        className={`border-t border-white/5 py-16 md:py-20 text-center transition-all duration-1000 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <ul className="mx-auto mb-8 max-w-md space-y-3 text-sm text-white/40">
          <li className="flex items-center justify-center gap-3">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-cyan-500/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Most users complete this in under 3 minutes.
          </li>
          <li className="flex items-center justify-center gap-3">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-cyan-500/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Private and anonymous. No data leaves your browser.
          </li>
          <li className="flex items-center justify-center gap-3">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-cyan-500/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Designed for psychological self-reflection.
          </li>
        </ul>

        <button
          onClick={startQuiz}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-cyan-400 transition-all hover:bg-cyan-500/20 hover:border-cyan-400/50 animate-glow-pulse cursor-pointer"
        >
          Start The Assessment
        </button>
      </section>

      {/* ─── Quiz Container (hidden until started) ─── */}
      <div
        ref={quizRef}
        className={`border-t border-white/5 py-16 md:py-24 transition-all duration-700 ${
          quizStarted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 h-0 overflow-hidden border-none py-0"
        }`}
      >
        {quizStarted && (
          <div className="mx-auto max-w-3xl">
            <TraitQuiz />
          </div>
        )}
      </div>
    </div>
  );
}
