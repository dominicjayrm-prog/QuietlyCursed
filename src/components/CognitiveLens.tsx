"use client";

import { useState } from "react";
import {
  cognitiveLensQuestions,
  scoreCognitiveLens,
  getCognitiveLensResult,
  COGNITIVE_DISPLAY_NAMES,
  type CognitiveLensResult,
  type CognitivePattern,
} from "@/data/cognitive-lens";
import { getSupabase } from "@/lib/supabase/client";

interface CognitiveLensProps {
  primaryArchetype: string;
  traumaPrimary: string;
  attachmentPrimary: string;
  boundaryPrimary: string;
  quizResultId?: string;
  onComplete?: (result: CognitiveLensResult) => void;
}

export default function CognitiveLens({
  primaryArchetype,
  traumaPrimary,
  attachmentPrimary,
  boundaryPrimary,
  quizResultId,
  onComplete,
}: CognitiveLensProps) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<CognitiveLensResult | null>(null);
  const [copied, setCopied] = useState(false);

  const question = cognitiveLensQuestions[currentQ];
  const progress = Object.keys(answers).length;
  const isAnswered = answers[question?.id] !== undefined;

  function handleChoice(text: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: text }));
  }

  function handleNext() {
    if (currentQ < cognitiveLensQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  }

  function handleSubmit() {
    const scores = scoreCognitiveLens(answers);
    const lensResult = getCognitiveLensResult(scores);
    setResult(lensResult);
    onComplete?.(lensResult);

    const supabase = getSupabase();
    if (supabase) {
      supabase
        .from("assessment_modules")
        .insert({
          quiz_result_id: quizResultId || null,
          module_type: "cognitive_lens",
          primary_result: lensResult.primary.id,
          secondary_result: lensResult.secondary.id,
          scores: lensResult.scores,
        })
        .then(() => {});
    }
  }

  async function handleCopy() {
    if (!result) return;
    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL || "https://quietlycursed.com"
    ).replace(/^https?:\/\//, "");
    const text = `My Identity Map on Quietly Cursed:\n\nPrimary Archetype: ${primaryArchetype}\nDominant Trauma Response: ${traumaPrimary}\nAttachment Leaning: ${attachmentPrimary}\nBoundary Pattern: ${boundaryPrimary}\nCognitive Style: ${result.primary.name}\n\nExplore yours at ${siteUrl}/trait-index`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // ─── Prompt state ───
  if (!started) {
    return (
      <div className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.04] p-6 md:p-10 text-center">
        <p className="mb-2 text-xs tracking-widest uppercase text-teal-400/60">
          Cognitive Module
        </p>
        <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          Explore Your Cognitive Style
        </h3>
        <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-white/50">
          Your boundary pattern describes what you protect. This maps how
          your mind processes everything it takes in. Six questions about
          overthinking, rumination, pattern-detection, and the way your
          internal system manages cognitive load.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-teal-400 transition-all hover:bg-teal-500/20 hover:border-teal-400/50 cursor-pointer"
        >
          Start Cognitive Lens
        </button>
      </div>
    );
  }

  // ─── Result state ───
  if (result) {
    const { primary, secondary, scores } = result;
    const maxScore = Math.max(...Object.values(scores), 1);

    const PATTERN_COLOURS: Record<CognitivePattern, string> = {
      high_simulation: "from-teal-500/60 to-teal-400/80",
      emotional_rumination: "from-pink-500/60 to-pink-400/80",
      hyper_aware: "from-sky-500/60 to-sky-400/80",
      detached_analytical: "from-slate-500/60 to-slate-400/80",
      balanced_regulation: "from-emerald-500/60 to-emerald-400/80",
    };

    const LABEL_COLOURS: Record<CognitivePattern, string> = {
      high_simulation: "text-teal-400/60",
      emotional_rumination: "text-pink-400/60",
      hyper_aware: "text-sky-400/60",
      detached_analytical: "text-slate-400/60",
      balanced_regulation: "text-emerald-400/60",
    };

    return (
      <div className="space-y-10 animate-fade-in-up">
        {/* Full Identity Map */}
        <div className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.04] p-6 md:p-10">
          <h3 className="mb-6 text-sm font-semibold tracking-wider uppercase text-teal-400/60">
            Complete Identity Map
          </h3>
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
              <span className="text-xs tracking-widest uppercase text-white/40">
                Primary Archetype
              </span>
              <span className="text-base font-semibold text-cyan-400">
                {primaryArchetype}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
              <span className="text-xs tracking-widest uppercase text-white/40">
                Trauma Response
              </span>
              <span className="text-base font-semibold text-purple-400">
                {traumaPrimary}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
              <span className="text-xs tracking-widest uppercase text-white/40">
                Attachment Leaning
              </span>
              <span className="text-base font-semibold text-rose-400">
                {attachmentPrimary}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
              <span className="text-xs tracking-widest uppercase text-white/40">
                Boundary Pattern
              </span>
              <span className="text-base font-semibold text-amber-400">
                {boundaryPrimary}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs tracking-widest uppercase text-white/40">
                Cognitive Style
              </span>
              <span className="text-base font-semibold text-teal-400">
                {primary.name}
              </span>
            </div>
          </div>
        </div>

        {/* Primary result */}
        <div className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.04] p-6 md:p-10">
          <p className="mb-2 text-xs tracking-widest uppercase text-teal-400/60">
            Primary Cognitive Style
          </p>
          <h3 className="mb-1 text-2xl font-bold text-white md:text-3xl">
            {primary.name}: {primary.title}
          </h3>
          <p className="mt-4 text-base leading-[1.85] text-white/60">
            {primary.description}
          </p>
        </div>

        {/* Secondary result */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8">
          <p className="mb-2 text-xs tracking-widest uppercase text-white/40">
            Secondary Cognitive Tendency
          </p>
          <h3 className="mb-1 text-xl font-bold text-white/80">
            {secondary.name}: {secondary.title}
          </h3>
          <p className="mt-4 text-sm leading-[1.85] text-white/55">
            {secondary.description}
          </p>
        </div>

        {/* Score breakdown */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8">
          <h3 className="mb-6 text-sm font-semibold tracking-wider uppercase text-white/40">
            Cognitive Pattern Breakdown
          </h3>
          <div className="space-y-4">
            {(Object.entries(scores) as [CognitivePattern, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([id, score]) => (
                <div key={id} className="flex items-center gap-4">
                  <span className={`w-32 text-sm ${LABEL_COLOURS[id]}`}>
                    {COGNITIVE_DISPLAY_NAMES[id]}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${PATTERN_COLOURS[id]} transition-all duration-700`}
                      style={{ width: `${(score / maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs text-white/30">
                    {Math.round(score)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* SEO paragraph */}
        <div className="text-center text-sm leading-[1.85] text-white/35">
          <p>
            The Cognitive Lens maps your thinking patterns at the structural
            level. Overthinking personality tendencies, emotional rumination,
            and high self-awareness are not disorders. They are cognitive
            processing styles shaped by experience, environment, and nervous
            system calibration. Understanding whether your mind defaults to
            catastrophic simulation, emotional replay, or analytical
            detachment creates the final layer of a psychological profile
            that accounts for how you think, not just what you feel.
          </p>
        </div>

        {/* Assessment complete */}
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 text-center">
          <p className="text-xs tracking-widest uppercase text-white/25">
            Identity Mapping Complete
          </p>
          <p className="mt-2 text-sm text-white/35">
            Five layers assessed. Your full psychological profile is above.
            Future modules will expand this map further.
          </p>
        </div>

        {/* Copy Identity Map */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-teal-400 transition-all hover:bg-teal-500/20 hover:border-teal-400/50 cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            {copied ? "Copied!" : "Copy Full Identity Map"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Quiz state ───
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span aria-live="polite">
            Cognitive Lens: Question {currentQ + 1} of{" "}
            {cognitiveLensQuestions.length}
          </span>
          <span>{progress} answered</span>
        </div>
        <div
          className="h-1 rounded-full bg-white/5 overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={cognitiveLensQuestions.length}
          aria-label={`Cognitive Lens progress: ${progress} of ${cognitiveLensQuestions.length} questions answered`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500/50 to-teal-400/70 transition-all duration-500"
            style={{
              width: `${(progress / cognitiveLensQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-10">
        <p className="mb-8 text-lg leading-relaxed text-white/80 md:text-xl">
          {question.text}
        </p>

        <div className="space-y-3" role="radiogroup" aria-label={question.text}>
          {question.options.map((option) => {
            const isSelected = answers[question.id] === option.text;
            return (
              <button
                key={option.text}
                onClick={() => handleChoice(option.text)}
                role="radio"
                aria-checked={isSelected}
                className={`flex w-full items-center gap-4 rounded-xl border px-5 py-3.5 text-left text-sm transition-all cursor-pointer ${
                  isSelected
                    ? "border-teal-500/40 bg-teal-500/10 text-teal-400"
                    : "border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:bg-white/[0.03]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-teal-400 bg-teal-400"
                      : "border-white/20"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-neutral-950" />
                  )}
                </span>
                {option.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentQ === 0}
          className="text-sm text-white/30 transition-colors hover:text-white/50 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
        >
          &larr; Back
        </button>

        {currentQ === cognitiveLensQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={progress < cognitiveLensQuestions.length}
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-teal-400 transition-all hover:bg-teal-500/20 hover:border-teal-400/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            See Cognitive Style
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="text-sm text-teal-400/70 transition-colors hover:text-teal-400 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
