"use client";

import { useState } from "react";
import {
  questions,
  scoreQuiz,
  getRankedArchetypes,
  buildShareText,
  type Archetype,
  type ArchetypeProfile,
} from "@/data/trait-index";
import { getTrapBySlug } from "@/data/traps";
import { getSupabase } from "@/lib/supabase/client";
import TrapCard from "./TrapCard";
import YouTubeEmbed from "./YouTubeEmbed";
import BrainIcon from "./BrainIcon";
import TraumaLens from "./TraumaLens";

type Answers = Record<number, number | string>;

const LIKERT_LABELS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

export default function TraitQuiz() {
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [results, setResults] = useState<{
    primary: ArchetypeProfile;
    secondary: ArchetypeProfile;
    scores: Record<Archetype, number>;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [quizResultId, setQuizResultId] = useState<string | undefined>();

  const question = questions[currentQ];
  const progress = Object.keys(answers).length;
  const isAnswered = answers[question?.id] !== undefined;

  function handleLikert(value: number) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function handleChoice(text: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: text }));
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  }

  function handleSubmit() {
    const scores = scoreQuiz(answers);
    const ranked = getRankedArchetypes(scores);
    setResults({
      primary: ranked[0],
      secondary: ranked[1],
      scores,
    });

    // Track quiz completion and capture result ID for module linking
    const supabase = getSupabase();
    if (supabase) {
      supabase
        .from("quiz_results")
        .insert({
          primary_archetype: ranked[0].id,
          secondary_archetype: ranked[1].id,
          scores,
        })
        .select("id")
        .single()
        .then(({ data }: { data: { id: string } | null }) => {
          if (data?.id) setQuizResultId(data.id);
        });
    }
  }

  async function handleCopy() {
    if (!results) return;
    const text = buildShareText(results.primary, results.secondary);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
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

  function handleRetake() {
    setAnswers({});
    setCurrentQ(0);
    setResults(null);
  }

  // ─── Results view ───
  if (results) {
    const { primary, secondary, scores } = results;
    const maxScore = Math.max(...Object.values(scores), 1);
    const recommendedTraps = primary.recommendedSlugs
      .map((s) => getTrapBySlug(s))
      .filter(Boolean);

    return (
      <div className="space-y-12 animate-fade-in-up" aria-live="polite">
        {/* Primary archetype */}
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-6 md:p-10">
          <p className="mb-2 text-xs tracking-widest uppercase text-cyan-400/60">
            Primary Archetype
          </p>
          <h2 className="mb-1 text-3xl font-bold text-white md:text-4xl">
            {primary.name}
          </h2>
          <p className="mb-6 text-lg text-cyan-400/70 italic">
            {primary.title}
          </p>
          <p className="mb-6 text-base leading-[1.8] text-white/60">
            {primary.description}
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-white/60">
                Strengths
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                {primary.strengths}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold tracking-wider uppercase text-white/60">
                Blind Spot
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                {primary.blindSpot}
              </p>
            </div>
          </div>
        </div>

        {/* Secondary archetype */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8">
          <p className="mb-2 text-xs tracking-widest uppercase text-purple-400/60">
            Secondary Archetype
          </p>
          <h3 className="mb-1 text-2xl font-bold text-white/90">
            {secondary.name}
          </h3>
          <p className="mb-4 text-base text-white/60 italic">
            {secondary.title}
          </p>
          <p className="text-sm leading-[1.8] text-white/60">
            {secondary.description}
          </p>
        </div>

        {/* Score breakdown */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-8">
          <h3 className="mb-6 text-sm font-semibold tracking-wider uppercase text-white/40">
            Trait Breakdown
          </h3>
          <div className="space-y-4">
            {Object.entries(scores)
              .sort(([, a], [, b]) => b - a)
              .map(([id, score]) => (
                <div key={id} className="flex items-center gap-4">
                  <span className="w-32 text-sm text-white/50 capitalize">
                    {id === "prototype"
                      ? "Prototype"
                      : id === "peacemaker"
                        ? "Peacemaker"
                        : id.charAt(0).toUpperCase() + id.slice(1)}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500/60 to-cyan-400/80 transition-all duration-700"
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

        {/* Recommended video */}
        {primary.youtubeId && (
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-white/40">
              Recommended Watch
            </h3>
            <YouTubeEmbed
              videoId={primary.youtubeId}
              title={`${primary.name} | Recommended`}
            />
          </div>
        )}

        {/* Recommended traps */}
        {recommendedTraps.length > 0 && (
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-white/40">
              Traps to Explore
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedTraps.map(
                (trap) => trap && <TrapCard key={trap.slug} trap={trap} />
              )}
            </div>
          </div>
        )}

        {/* Trauma Response Lens module */}
        <TraumaLens
          primaryArchetype={primary.name}
          quizResultId={quizResultId}
        />

        {/* Share + Retake */}
        <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-10">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-cyan-400 transition-all hover:bg-cyan-500/20 hover:border-cyan-400/50 cursor-pointer"
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
            {copied ? "Copied!" : "Copy Result"}
          </button>

          <button
            onClick={handleRetake}
            className="text-sm text-white/30 hover:text-white/50 transition-colors cursor-pointer"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    );
  }

  // ─── Quiz view ───
  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span aria-live="polite">
            Question {currentQ + 1} of {questions.length}
          </span>
          <span>{progress} answered</span>
        </div>
        <div
          className="h-1 rounded-full bg-white/5 overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-label={`Quiz progress: ${progress} of ${questions.length} questions answered`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500/50 to-cyan-400/70 transition-all duration-500"
            style={{
              width: `${(progress / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 md:p-10">
        <p className="mb-8 text-lg leading-relaxed text-white/80 md:text-xl">
          {question.text}
        </p>

        {question.type === "likert" ? (
          <div className="space-y-3" role="radiogroup" aria-label={question.text}>
            {LIKERT_LABELS.map((label, i) => {
              const value = i + 1;
              const isSelected = answers[question.id] === value;
              return (
                <button
                  key={value}
                  onClick={() => handleLikert(value)}
                  role="radio"
                  aria-checked={isSelected}
                  className={`flex w-full items-center gap-4 rounded-xl border px-5 py-3.5 text-left text-sm transition-all cursor-pointer ${
                    isSelected
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                      : "border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:bg-white/[0.03]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400"
                        : "border-white/20"
                    }`}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-neutral-950" />
                    )}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3" role="radiogroup" aria-label={question.text}>
            {question.options?.map((option) => {
              const isSelected = answers[question.id] === option.text;
              return (
                <button
                  key={option.text}
                  onClick={() => handleChoice(option.text)}
                  role="radio"
                  aria-checked={isSelected}
                  className={`flex w-full items-center gap-4 rounded-xl border px-5 py-3.5 text-left text-sm transition-all cursor-pointer ${
                    isSelected
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                      : "border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:bg-white/[0.03]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400"
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
        )}
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

        {currentQ === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={progress < questions.length}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-6 py-3 text-sm font-semibold tracking-wider uppercase text-cyan-400 transition-all hover:bg-cyan-500/20 hover:border-cyan-400/50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <BrainIcon className="w-4 h-4 text-purple-400" />
            See Results
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="text-sm text-cyan-400/70 transition-colors hover:text-cyan-400 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
          >
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
