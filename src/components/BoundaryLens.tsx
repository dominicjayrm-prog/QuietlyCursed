"use client";

import { useState } from "react";
import {
  boundaryLensQuestions,
  scoreBoundaryLens,
  getBoundaryLensResult,
  BOUNDARY_DISPLAY_NAMES,
  type BoundaryLensResult,
  type BoundaryPattern,
} from "@/data/boundary-lens";
import { type CognitiveLensResult } from "@/data/cognitive-lens";
import { getSupabase } from "@/lib/supabase/client";
import CognitiveLens from "./CognitiveLens";

interface BoundaryLensProps {
  primaryArchetype: string;
  traumaPrimary: string;
  attachmentPrimary: string;
  quizResultId?: string;
  onComplete?: (result: BoundaryLensResult) => void;
  onCognitiveComplete?: (result: CognitiveLensResult) => void;
}

export default function BoundaryLens({
  primaryArchetype,
  traumaPrimary,
  attachmentPrimary,
  quizResultId,
  onComplete,
  onCognitiveComplete,
}: BoundaryLensProps) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<BoundaryLensResult | null>(null);

  const question = boundaryLensQuestions[currentQ];
  const progress = Object.keys(answers).length;
  const isAnswered = answers[question?.id] !== undefined;

  function handleChoice(text: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: text }));
  }

  function handleNext() {
    if (currentQ < boundaryLensQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  }

  function handleSubmit() {
    const scores = scoreBoundaryLens(answers);
    const lensResult = getBoundaryLensResult(scores);
    setResult(lensResult);
    onComplete?.(lensResult);

    const supabase = getSupabase();
    if (supabase) {
      supabase
        .from("assessment_modules")
        .insert({
          quiz_result_id: quizResultId || null,
          module_type: "boundary_lens",
          primary_result: lensResult.primary.id,
          secondary_result: lensResult.secondary.id,
          scores: lensResult.scores,
        })
        .then(() => {});
    }
  }

  // ─── Prompt state ───
  if (!started) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6 md:p-10 text-center">
        <p className="mb-2 text-xs tracking-widest uppercase text-amber-400/60">
          Behavioural Module
        </p>
        <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          Explore Your Boundary Pattern
        </h3>
        <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-white/50">
          Your attachment describes how you connect. This maps how you
          protect yourself within those connections. Six questions about
          saying no, guilt, compliance, and where your limits actually hold.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-amber-400 transition-all hover:bg-amber-500/20 hover:border-amber-400/50 cursor-pointer"
        >
          Start Boundary Lens
        </button>
      </div>
    );
  }

  // ─── Result state ───
  if (result) {
    const { primary, secondary, scores } = result;
    const maxScore = Math.max(...Object.values(scores), 1);

    const PATTERN_COLOURS: Record<BoundaryPattern, string> = {
      passive_compliance: "from-amber-500/60 to-amber-400/80",
      guilt_collapse: "from-orange-500/60 to-orange-400/80",
      assertive_anxious: "from-yellow-500/60 to-yellow-400/80",
      healthy_selective: "from-emerald-500/60 to-emerald-400/80",
      conflict_avoidant: "from-slate-500/60 to-slate-400/80",
    };

    const LABEL_COLOURS: Record<BoundaryPattern, string> = {
      passive_compliance: "text-amber-400/60",
      guilt_collapse: "text-orange-400/60",
      assertive_anxious: "text-yellow-400/60",
      healthy_selective: "text-emerald-400/60",
      conflict_avoidant: "text-slate-400/60",
    };

    return (
      <div className="space-y-10 animate-fade-in-up">
        {/* Primary result */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6 md:p-10">
          <p className="mb-2 text-xs tracking-widest uppercase text-amber-400/60">
            Primary Boundary Pattern
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
            Secondary Boundary Tendency
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
            Boundary Pattern Breakdown
          </h3>
          <div className="space-y-4">
            {(Object.entries(scores) as [BoundaryPattern, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([id, score]) => (
                <div key={id} className="flex items-center gap-4">
                  <span className={`w-32 text-sm ${LABEL_COLOURS[id]}`}>
                    {BOUNDARY_DISPLAY_NAMES[id]}
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
            The Boundary Lens identifies the patterns that govern how you
            protect your time, energy, and emotional space. People pleaser
            behaviour, boundary issues, and the inability to say no are not
            character flaws. They are learned responses to environments where
            self-sacrifice was rewarded and refusal carried consequences.
            Understanding your boundary pattern alongside your attachment
            leaning and trauma response creates a more honest picture of how
            your coping mechanism patterns interact in everyday life.
          </p>
        </div>

        {/* Cognitive Lens (next module) */}
        <CognitiveLens
          primaryArchetype={primaryArchetype}
          traumaPrimary={traumaPrimary}
          attachmentPrimary={attachmentPrimary}
          boundaryPrimary={primary.name}
          quizResultId={quizResultId}
          onComplete={onCognitiveComplete}
        />
      </div>
    );
  }

  // ─── Quiz state ───
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span aria-live="polite">
            Boundary Lens: Question {currentQ + 1} of{" "}
            {boundaryLensQuestions.length}
          </span>
          <span>{progress} answered</span>
        </div>
        <div
          className="h-1 rounded-full bg-white/5 overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={boundaryLensQuestions.length}
          aria-label={`Boundary Lens progress: ${progress} of ${boundaryLensQuestions.length} questions answered`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500/50 to-amber-400/70 transition-all duration-500"
            style={{
              width: `${(progress / boundaryLensQuestions.length) * 100}%`,
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
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                    : "border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:bg-white/[0.03]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-amber-400 bg-amber-400"
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

        {currentQ === boundaryLensQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={progress < boundaryLensQuestions.length}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-amber-400 transition-all hover:bg-amber-500/20 hover:border-amber-400/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            See Boundary Pattern
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="text-sm text-amber-400/70 transition-colors hover:text-amber-400 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
