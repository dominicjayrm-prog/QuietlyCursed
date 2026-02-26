// ─── Cognitive Load / Overthinking Lens ───
// Phase 3B module for the Trait Index system.
// Assesses cognitive processing patterns: rumination, hyper-awareness,
// catastrophic simulation, emotional replay, and analytical detachment.

export type CognitivePattern =
  | "high_simulation"
  | "emotional_rumination"
  | "hyper_aware"
  | "detached_analytical"
  | "balanced_regulation";

export interface CognitiveProfile {
  id: CognitivePattern;
  name: string;
  title: string;
  description: string;
}

export interface CognitiveLensOption {
  text: string;
  weights: Record<CognitivePattern, number>;
}

export interface CognitiveLensQuestion {
  id: number;
  text: string;
  options: CognitiveLensOption[];
}

// ─── Result Profiles ───

export const cognitiveProfiles: Record<CognitivePattern, CognitiveProfile> = {
  high_simulation: {
    id: "high_simulation",
    name: "High Simulation Thinker",
    title: "The Forecaster",
    description:
      "Your mind runs scenarios before they happen. Conversations, confrontations, outcomes, failures. You pre-live experiences in exhaustive detail, rehearsing what could go wrong and how you would respond. This is not standard planning. It is catastrophic simulation running on a loop, generating contingencies for events that may never occur. The cognitive load is substantial. Your nervous system responds to simulated threats as though they are real, producing anxiety about situations that exist only in projection. The pattern often masquerades as preparedness, but the cost is that you are perpetually bracing for impact, spending mental energy on futures that never arrive while the present moment passes unremarked.",
  },
  emotional_rumination: {
    id: "emotional_rumination",
    name: "Emotional Rumination Loop",
    title: "The Replaying",
    description:
      "Your cognitive pattern is retrospective. Where the simulator looks forward, you look back. Conversations replay. Emotional moments cycle through memory with the volume turned up. You revisit interactions days or weeks later, re-experiencing the feeling as though it is happening now. This is rumination psychology at its most persistent. The loop is not analytical. It is emotional. You are not processing the event. You are reliving it, searching for a resolution that the replay can never provide. The pattern creates a distinctive exhaustion: you are tired not from what happened, but from how many times your mind forced you to experience it again.",
  },
  hyper_aware: {
    id: "hyper_aware",
    name: "Hyper-Aware Observer",
    title: "The Scanning",
    description:
      "You notice everything. Micro-expressions, tonal shifts, the energy in a room before anyone speaks. Your cognitive system runs a constant environmental scan, processing social and emotional data at a level most people never access. This high self-awareness personality pattern is both a strength and a burden. The strength is perception. The burden is that you cannot turn it off. You absorb information that was never meant for you, read between lines that others never wrote, and carry the weight of noticing what everyone else misses. The result is a form of cognitive vigilance that keeps you informed but rarely at rest.",
  },
  detached_analytical: {
    id: "detached_analytical",
    name: "Detached Analytical Processor",
    title: "The Abstracting",
    description:
      "Your mind converts emotional experience into intellectual frameworks. When something painful happens, you do not feel it first. You analyse it. You categorise, contextualise, and distance yourself from the raw affect by turning it into a problem to be solved. This is emotional suppression operating through the mechanism of intelligence. It looks like composure. It functions as avoidance. The pattern is effective in crisis, where detachment enables clear thinking under pressure. But in sustained relational or emotional contexts, it creates a gap between what you understand and what you have actually processed. You know what happened. You have not let yourself feel it.",
  },
  balanced_regulation: {
    id: "balanced_regulation",
    name: "Balanced Cognitive Regulation",
    title: "The Modulating",
    description:
      "Your thinking patterns are largely self-aware and self-correcting. You notice when rumination begins and can redirect. You are capable of emotional processing without being consumed by it. You think ahead without catastrophising. This does not mean the system is effortless. Regulation is active, not passive. It requires energy to maintain, and under sustained stress it can degrade. But in baseline conditions, your cognitive load is managed with reasonable efficiency. The balance is not the absence of overthinking. It is the capacity to recognise it, interrupt it, and choose a different mental posture before the loop takes hold.",
  },
};

// ─── Questions ───

export const cognitiveLensQuestions: CognitiveLensQuestion[] = [
  {
    id: 1,
    text: "When a difficult conversation is approaching, what does your mind do in the hours before?",
    options: [
      {
        text: "I run through every possible version of how it could go, including the worst",
        weights: { high_simulation: 3, emotional_rumination: 0, hyper_aware: 1, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "I replay past conversations that went badly, feeling the same tension again",
        weights: { high_simulation: 0, emotional_rumination: 3, hyper_aware: 0, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "I monitor for cues about their current mood so I can calibrate my approach",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 3, detached_analytical: 1, balanced_regulation: 0 },
      },
      {
        text: "I prepare my points logically and try to remove the emotional charge from it",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 0, detached_analytical: 3, balanced_regulation: 1 },
      },
    ],
  },
  {
    id: 2,
    text: "At the end of a socially intense day, what is your mind most likely doing?",
    options: [
      {
        text: "Reviewing what I said and whether any of it landed wrong",
        weights: { high_simulation: 1, emotional_rumination: 3, hyper_aware: 1, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "Processing the emotional undercurrents I picked up from everyone around me",
        weights: { high_simulation: 0, emotional_rumination: 1, hyper_aware: 3, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "Categorising the interactions and filing away useful observations",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 1, detached_analytical: 3, balanced_regulation: 0 },
      },
      {
        text: "Winding down. I might reflect briefly but I can let it go",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 0, detached_analytical: 0, balanced_regulation: 3 },
      },
    ],
  },
  {
    id: 3,
    text: "When you make a mistake that affects someone else, how long does it stay with you?",
    options: [
      {
        text: "Days. I keep running alternate versions of what I should have done",
        weights: { high_simulation: 3, emotional_rumination: 1, hyper_aware: 0, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "It cycles for a long time. I can still feel the original emotion weeks later",
        weights: { high_simulation: 0, emotional_rumination: 3, hyper_aware: 0, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "I process it intellectually, learn the lesson, and move on relatively quickly",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 0, detached_analytical: 3, balanced_regulation: 1 },
      },
      {
        text: "It bothers me, but I can usually resolve it internally within a day or two",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 1, detached_analytical: 0, balanced_regulation: 3 },
      },
    ],
  },
  {
    id: 4,
    text: "Which statement most honestly describes your relationship with your own thinking?",
    options: [
      {
        text: "My mind rarely stops planning for things that haven't happened yet",
        weights: { high_simulation: 3, emotional_rumination: 0, hyper_aware: 0, detached_analytical: 1, balanced_regulation: 0 },
      },
      {
        text: "I get stuck in emotional loops that logic alone can't resolve",
        weights: { high_simulation: 0, emotional_rumination: 3, hyper_aware: 1, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "I notice patterns in everything, sometimes more than I want to",
        weights: { high_simulation: 1, emotional_rumination: 0, hyper_aware: 3, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "I can usually observe my thoughts without being pulled into them",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 0, detached_analytical: 1, balanced_regulation: 3 },
      },
    ],
  },
  {
    id: 5,
    text: "Someone says something ambiguous to you. Your mind's first response is to:",
    options: [
      {
        text: "Generate five interpretations and fixate on the most threatening one",
        weights: { high_simulation: 3, emotional_rumination: 1, hyper_aware: 0, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "Feel the emotional charge of it before understanding what was actually said",
        weights: { high_simulation: 0, emotional_rumination: 3, hyper_aware: 0, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "Read their body language and context clues to decode the real meaning",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 3, detached_analytical: 1, balanced_regulation: 0 },
      },
      {
        text: "Ask for clarification rather than assume",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 0, detached_analytical: 1, balanced_regulation: 3 },
      },
    ],
  },
  {
    id: 6,
    text: "If someone described your inner world honestly, what would they say?",
    options: [
      {
        text: "Always three steps ahead, bracing for what could go wrong",
        weights: { high_simulation: 3, emotional_rumination: 0, hyper_aware: 1, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "Carrying conversations and moments long after they've ended",
        weights: { high_simulation: 0, emotional_rumination: 3, hyper_aware: 1, detached_analytical: 0, balanced_regulation: 0 },
      },
      {
        text: "Calm on the surface, actively processing underneath",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 0, detached_analytical: 3, balanced_regulation: 1 },
      },
      {
        text: "Reflective but not overwhelmed. Thoughtful without being trapped",
        weights: { high_simulation: 0, emotional_rumination: 0, hyper_aware: 0, detached_analytical: 0, balanced_regulation: 3 },
      },
    ],
  },
];

// ─── Scoring Logic ───

export interface CognitiveLensScores {
  high_simulation: number;
  emotional_rumination: number;
  hyper_aware: number;
  detached_analytical: number;
  balanced_regulation: number;
}

export interface CognitiveLensResult {
  primary: CognitiveProfile;
  secondary: CognitiveProfile;
  scores: CognitiveLensScores;
}

export function scoreCognitiveLens(
  answers: Record<number, string>
): CognitiveLensScores {
  const scores: CognitiveLensScores = {
    high_simulation: 0,
    emotional_rumination: 0,
    hyper_aware: 0,
    detached_analytical: 0,
    balanced_regulation: 0,
  };

  for (const q of cognitiveLensQuestions) {
    const answer = answers[q.id];
    if (!answer) continue;
    const selected = q.options.find((o) => o.text === answer);
    if (selected) {
      for (const [pattern, weight] of Object.entries(selected.weights)) {
        scores[pattern as CognitivePattern] += weight;
      }
    }
  }

  return scores;
}

export function getCognitiveLensResult(
  scores: CognitiveLensScores
): CognitiveLensResult {
  const ranked = (
    Object.entries(scores) as [CognitivePattern, number][]
  ).sort(([, a], [, b]) => b - a);

  return {
    primary: cognitiveProfiles[ranked[0][0]],
    secondary: cognitiveProfiles[ranked[1][0]],
    scores,
  };
}

export const COGNITIVE_DISPLAY_NAMES: Record<CognitivePattern, string> = {
  high_simulation: "High Simulation",
  emotional_rumination: "Rumination Loop",
  hyper_aware: "Hyper-Aware",
  detached_analytical: "Detached Analytical",
  balanced_regulation: "Balanced Regulation",
};
