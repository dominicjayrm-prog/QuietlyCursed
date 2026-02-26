"use client";

import { useState } from "react";
import {
  traumaLensQuestions,
  scoreTraumaLens,
  getTraumaLensResult,
  buildTraumaShareText,
  type TraumaLensResult,
  type TraumaResponse,
} from "@/data/trauma-lens";
import { getSupabase } from "@/lib/supabase/client";

interface TraumaLensProps {
  /** The user's primary archetype name, e.g. "The Peacemaker" */
  primaryArchetype: string;
  /** The quiz_results row ID, if available, for linking module results */
  quizResultId?: string;
}

export default function TraumaLens({
  primaryArchetype,
  quizResultId,
}: TraumaLensProps) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<TraumaLensResult | null>(null);
  const [copied, setCopied] = useState(false);

  const question = traumaLensQuestions[currentQ];
  const progress = Object.keys(answers).length;
  const isAnswered = answers[question?.id] !== undefined;

  function handleChoice(text: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: text }));
  }

  function handleNext() {
    if (currentQ < traumaLensQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  }

  function handleSubmit() {
    const scores = scoreTraumaLens(answers);
    const lensResult = getTraumaLensResult(scores);
    setResult(lensResult);

    // Store module result (fire-and-forget)
    const supabase = getSupabase();
    if (supabase) {
      supabase
        .from("assessment_modules")
        .insert({
          quiz_result_id: quizResultId || null,
          module_type: "trauma_lens",
          primary_result: lensResult.primary.id,
          secondary_result: lensResult.secondary.id,
          scores: lensResult.scores,
        })
        .then(() => {});
    }
  }

  async function handleCopy() {
    if (!result) return;
    const text = buildTraumaShareText(
      primaryArchetype,
      result.primary,
      result.secondary
    );
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

  // ─── Prompt state (not yet started) ───
  if (!started) {
    return (
      <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-6 md:p-10 text-center">
        <p className="mb-2 text-xs tracking-widest uppercase text-purple-400/60">
          Deepening Module
        </p>
        <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          Explore Your Trauma Response Pattern
        </h3>
        <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-white/50">
          Your archetype describes the role you play. This maps the nervous
          system response underneath it. Six questions. Same depth. No
          clinical claims.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-purple-400 transition-all hover:bg-purple-500/20 hover:border-purple-400/50 cursor-pointer"
        >
          Start Trauma Lens
        </button>
      </div>
    );
  }

  // ─── Result state ───
  if (result) {
    const { primary, secondary, scores } = result;
    const maxScore = Math.max(...Object.values(scores), 1);

    const RESPONSE_COLOURS: Record<TraumaResponse, string> = {
      fawn: "from-purple-500/60 to-purple-400/80",
      freeze: "from-blue-500/60 to-blue-400/80",
      flight: "from-amber-500/60 to-amber-400/80",
      fight: "from-red-500/60 to-red-400/80",
    };

    const LABEL_COLOURS: Record<TraumaResponse, string> = {
      fawn: "text-purple-400/60",
      freeze: "text-blue-400/60",
      flight: "text-amber-400/60",
      fight: "text-red-400/60",
    };

    return (
      <div className="space-y-10 animate-fade-in-up">
        {/* Identity Map */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-6 md:p-10">
          <h3 className="mb-6 text-sm font-semibold tracking-wider uppercase text-purple-400/60">
            Identity Map
          </h3>
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
              <span className="text-xs tracking-widest uppercase text-white/40">
                Primary Archetype
              </span>
              <span className="text-base font-semibold text-white/80">
                {primaryArchetype}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
              <span className="text-xs tracking-widest uppercase text-white/40">
                Dominant Trauma Response
              </span>
              <span className="text-base font-semibold text-purple-400">
                {primary.name}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
              <span className="text-xs tracking-widest uppercase text-white/40">
                Secondary Response
              </span>
              <span className="text-base font-semibold text-white/60">
                {secondary.name}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs tracking-widest uppercase text-white/40">
                Cognitive Tendency
              </span>
              <span className="text-sm italic text-white/30">
                Coming soon
              </span>
            </div>
          </div>
        </div>

        {/* Primary result */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] p-6 md:p-10">
          <p className="mb-2 text-xs tracking-widest uppercase text-purple-400/60">
            Dominant Response Pattern
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
            Secondary Tendency
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
            Response Pattern Breakdown
          </h3>
          <div className="space-y-4">
            {(Object.entries(scores) as [TraumaResponse, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([id, score]) => (
                <div key={id} className="flex items-center gap-4">
                  <span
                    className={`w-20 text-sm capitalize ${LABEL_COLOURS[id]}`}
                  >
                    {id}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${RESPONSE_COLOURS[id]} transition-all duration-700`}
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

        {/* SEO-relevant contextual paragraph */}
        <div className="text-center text-sm leading-[1.85] text-white/35">
          <p>
            The Trauma Response Lens identifies patterns rooted in your nervous
            system, not your conscious choices. Fawn, freeze, flight, and fight
            are not personality types. They are stress coping mechanisms that
            became habitual. Understanding your dominant trauma response type
            alongside your archetype creates a more complete map of your
            psychological patterns and attachment tendencies.
          </p>
        </div>

        {/* Future modules placeholder */}
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 text-center">
          <p className="text-xs tracking-widest uppercase text-white/25">
            More Lenses Coming Soon
          </p>
          <p className="mt-2 text-sm text-white/35">
            Attachment Lens, Boundary Lens, and Overthinking Lens are in
            development.
          </p>
        </div>

        {/* Share + Copy */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-purple-400 transition-all hover:bg-purple-500/20 hover:border-purple-400/50 cursor-pointer"
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
            {copied ? "Copied!" : "Copy Identity Map"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Quiz state ───
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span aria-live="polite">
            Trauma Lens: Question {currentQ + 1} of{" "}
            {traumaLensQuestions.length}
          </span>
          <span>{progress} answered</span>
        </div>
        <div
          className="h-1 rounded-full bg-white/5 overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={traumaLensQuestions.length}
          aria-label={`Trauma Lens progress: ${progress} of ${traumaLensQuestions.length} questions answered`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500/50 to-purple-400/70 transition-all duration-500"
            style={{
              width: `${(progress / traumaLensQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question card */}
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
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-400"
                    : "border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:bg-white/[0.03]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-purple-400 bg-purple-400"
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

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentQ === 0}
          className="text-sm text-white/30 transition-colors hover:text-white/50 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
        >
          &larr; Back
        </button>

        {currentQ === traumaLensQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={progress < traumaLensQuestions.length}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-purple-400 transition-all hover:bg-purple-500/20 hover:border-purple-400/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            See Response Pattern
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="text-sm text-purple-400/70 transition-colors hover:text-purple-400 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
