"use client";

import { useState } from "react";
import {
  attachmentLensQuestions,
  scoreAttachmentLens,
  getAttachmentLensResult,
  buildAttachmentShareText,
  ATTACHMENT_DISPLAY_NAMES,
  type AttachmentLensResult,
  type AttachmentLeaning,
} from "@/data/attachment-lens";
import { getSupabase } from "@/lib/supabase/client";

interface AttachmentLensProps {
  primaryArchetype: string;
  traumaPrimary: string;
  quizResultId?: string;
  /** Called when the attachment lens completes, so the parent can update Identity Map */
  onComplete?: (result: AttachmentLensResult) => void;
}

export default function AttachmentLens({
  primaryArchetype,
  traumaPrimary,
  quizResultId,
  onComplete,
}: AttachmentLensProps) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<AttachmentLensResult | null>(null);
  const [copied, setCopied] = useState(false);

  const question = attachmentLensQuestions[currentQ];
  const progress = Object.keys(answers).length;
  const isAnswered = answers[question?.id] !== undefined;

  function handleChoice(text: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: text }));
  }

  function handleNext() {
    if (currentQ < attachmentLensQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  }

  function handleSubmit() {
    const scores = scoreAttachmentLens(answers);
    const lensResult = getAttachmentLensResult(scores);
    setResult(lensResult);
    onComplete?.(lensResult);

    // Store module result (fire-and-forget)
    const supabase = getSupabase();
    if (supabase) {
      supabase
        .from("assessment_modules")
        .insert({
          quiz_result_id: quizResultId || null,
          module_type: "attachment_lens",
          primary_result: lensResult.primary.id,
          secondary_result: lensResult.secondary.id,
          scores: lensResult.scores,
        })
        .then(() => {});
    }
  }

  async function handleCopy() {
    if (!result) return;
    const text = buildAttachmentShareText(
      primaryArchetype,
      traumaPrimary,
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
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-6 md:p-10 text-center">
        <p className="mb-2 text-xs tracking-widest uppercase text-rose-400/60">
          Relational Module
        </p>
        <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          Explore Your Relational Attachment Pattern
        </h3>
        <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-white/50">
          Your trauma response describes how your nervous system reacts. This
          maps how it connects. Six questions about relational patterns,
          emotional distance, and the way you hold or release closeness.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-8 py-4 text-sm font-semibold tracking-wider uppercase text-rose-400 transition-all hover:bg-rose-500/20 hover:border-rose-400/50 cursor-pointer"
        >
          Start Attachment Lens
        </button>
      </div>
    );
  }

  // ─── Result state ───
  if (result) {
    const { primary, secondary, scores } = result;
    const maxScore = Math.max(...Object.values(scores), 1);

    const LEANING_COLOURS: Record<AttachmentLeaning, string> = {
      anxious: "from-rose-500/60 to-rose-400/80",
      avoidant: "from-slate-500/60 to-slate-400/80",
      secure_guarded: "from-emerald-500/60 to-emerald-400/80",
      hyper_independent: "from-amber-500/60 to-amber-400/80",
      mixed: "from-violet-500/60 to-violet-400/80",
    };

    const LABEL_COLOURS: Record<AttachmentLeaning, string> = {
      anxious: "text-rose-400/60",
      avoidant: "text-slate-400/60",
      secure_guarded: "text-emerald-400/60",
      hyper_independent: "text-amber-400/60",
      mixed: "text-violet-400/60",
    };

    return (
      <div className="space-y-10 animate-fade-in-up">
        {/* Primary result */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-6 md:p-10">
          <p className="mb-2 text-xs tracking-widest uppercase text-rose-400/60">
            Primary Attachment Leaning
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
            Secondary Attachment Tendency
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
            Attachment Pattern Breakdown
          </h3>
          <div className="space-y-4">
            {(Object.entries(scores) as [AttachmentLeaning, number][])
              .sort(([, a], [, b]) => b - a)
              .map(([id, score]) => (
                <div key={id} className="flex items-center gap-4">
                  <span
                    className={`w-32 text-sm ${LABEL_COLOURS[id]}`}
                  >
                    {ATTACHMENT_DISPLAY_NAMES[id]}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${LEANING_COLOURS[id]} transition-all duration-700`}
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
            The Attachment Lens maps relational patterns that shape how you
            bond, withdraw, and navigate emotional closeness. Anxious
            attachment, avoidant attachment, and hyper-independence are not
            personality flaws. They are relational coping strategies that
            developed in response to early and ongoing interpersonal
            experience. Understanding your attachment patterns alongside your
            trauma response type and archetype creates a layered psychological
            profile that moves beyond surface-level personality labels.
          </p>
        </div>

        {/* Future modules placeholder */}
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-6 text-center">
          <p className="text-xs tracking-widest uppercase text-white/25">
            More Lenses Coming Soon
          </p>
          <p className="mt-2 text-sm text-white/35">
            Boundary Lens and Overthinking Lens are in development.
          </p>
        </div>

        {/* Share + Copy */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-rose-400 transition-all hover:bg-rose-500/20 hover:border-rose-400/50 cursor-pointer"
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
            Attachment Lens: Question {currentQ + 1} of{" "}
            {attachmentLensQuestions.length}
          </span>
          <span>{progress} answered</span>
        </div>
        <div
          className="h-1 rounded-full bg-white/5 overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={attachmentLensQuestions.length}
          aria-label={`Attachment Lens progress: ${progress} of ${attachmentLensQuestions.length} questions answered`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500/50 to-rose-400/70 transition-all duration-500"
            style={{
              width: `${(progress / attachmentLensQuestions.length) * 100}%`,
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
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                    : "border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:bg-white/[0.03]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-rose-400 bg-rose-400"
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

        {currentQ === attachmentLensQuestions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={progress < attachmentLensQuestions.length}
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-rose-400 transition-all hover:bg-rose-500/20 hover:border-rose-400/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            See Attachment Pattern
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="text-sm text-rose-400/70 transition-colors hover:text-rose-400 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
