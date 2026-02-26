// ─── Boundary Strength Lens ───
// Phase 3A module for the Trait Index system.
// Assesses boundary patterns: how someone navigates saying no,
// conflict, guilt, compliance, and self-sacrifice.

export type BoundaryPattern =
  | "passive_compliance"
  | "guilt_collapse"
  | "assertive_anxious"
  | "healthy_selective"
  | "conflict_avoidant";

export interface BoundaryProfile {
  id: BoundaryPattern;
  name: string;
  title: string;
  description: string;
}

export interface BoundaryLensOption {
  text: string;
  weights: Record<BoundaryPattern, number>;
}

export interface BoundaryLensQuestion {
  id: number;
  text: string;
  options: BoundaryLensOption[];
}

// ─── Result Profiles ───

export const boundaryProfiles: Record<BoundaryPattern, BoundaryProfile> = {
  passive_compliance: {
    id: "passive_compliance",
    name: "Passive Compliance",
    title: "The Yielding",
    description:
      "Your boundary pattern defaults to agreement. When someone makes a request, your system says yes before your mind has finished evaluating whether it should. This is not weakness. It is a deeply conditioned response, often developed in environments where refusal carried social or emotional consequences. You accommodate automatically, and the cost surfaces later as resentment, exhaustion, or a quiet sense of being used. People pleaser behaviour runs beneath the surface here, not as a personality trait but as a survival strategy that never got updated. The pattern persists because compliance still feels safer than the alternative.",
  },
  guilt_collapse: {
    id: "guilt_collapse",
    name: "Guilt-Driven Collapse",
    title: "The Crumbling",
    description:
      "You are capable of setting a boundary. The problem is holding it. The moment you say no, guilt arrives like a physiological event, tightening the chest, flooding the mind with justifications for why you should have said yes. So you retract. You soften. You re-open the door you just closed. This pattern is not about lacking conviction. It is about a nervous system that interprets boundary-setting as causing harm, and causing harm as intolerable. The collapse is not intellectual. It is somatic. Your body overrides your logic, and the boundary dissolves before you fully understand why.",
  },
  assertive_anxious: {
    id: "assertive_anxious",
    name: "Assertive but Anxious",
    title: "The Bracing",
    description:
      "You set boundaries. You also pay for them internally. Every time you hold a line, there is an aftershock of anxiety: replaying the conversation, scanning for signs of damage, wondering whether you went too far. The boundary itself is sound. The emotional processing that follows is where the cost accumulates. You are not conflict-avoidant. You engage. But the engagement comes with a private tax that others rarely see. Over time, this pattern can lead to selective boundary fatigue, where you protect some areas of your life firmly while letting others erode because you lack the emotional reserves to hold them all.",
  },
  healthy_selective: {
    id: "healthy_selective",
    name: "Healthy but Selective",
    title: "The Calibrated",
    description:
      "Your boundary system is largely functional. You can say no without spiralling. You can tolerate mild conflict without interpreting it as rejection. But you apply this capacity selectively. In certain contexts, with certain people, or under certain pressures, the system is sound. In others, it quietly deactivates. This is not inconsistency. It is a pattern that developed through experience: you learned which environments reward honesty and which punish it, and you adjusted accordingly. The selectivity is intelligent, but it also means that the people or situations that most need your boundaries are often the ones least likely to receive them.",
  },
  conflict_avoidant: {
    id: "conflict_avoidant",
    name: "Conflict Avoidant but Controlled",
    title: "The Circumventing",
    description:
      "You do not confront. You navigate. When a boundary needs to be set, your instinct is to find a route that avoids direct friction: withdrawing, deflecting, restructuring the situation so the conflict never technically occurs. This is not passivity. It is a sophisticated coping mechanism pattern, often refined over years in environments where direct confrontation produced unpredictable or unsafe outcomes. The control is real. You manage your exposure to conflict with precision. But the cost is that your actual position remains unspoken, and the people around you may never know where you actually stand.",
  },
};

// ─── Questions ───

export const boundaryLensQuestions: BoundaryLensQuestion[] = [
  {
    id: 1,
    text: "Someone asks you to do something you genuinely do not have capacity for. What happens first?",
    options: [
      {
        text: "I say yes before I've finished thinking about it",
        weights: { passive_compliance: 3, guilt_collapse: 1, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 0 },
      },
      {
        text: "I say no, then immediately feel a wave of guilt",
        weights: { passive_compliance: 0, guilt_collapse: 3, assertive_anxious: 1, healthy_selective: 0, conflict_avoidant: 0 },
      },
      {
        text: "I decline, but I rehearse how they took it for hours afterwards",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 3, healthy_selective: 1, conflict_avoidant: 0 },
      },
      {
        text: "I find a way to redirect the request so I never have to say no directly",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 3 },
      },
    ],
  },
  {
    id: 2,
    text: "After setting a limit with someone important, your most honest internal experience is:",
    options: [
      {
        text: "Regret. I usually end up undoing the boundary within hours",
        weights: { passive_compliance: 1, guilt_collapse: 3, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 0 },
      },
      {
        text: "Relief mixed with unease. I know it was right but it doesn't feel settled",
        weights: { passive_compliance: 0, guilt_collapse: 1, assertive_anxious: 3, healthy_selective: 0, conflict_avoidant: 0 },
      },
      {
        text: "Neutral. I set it, it holds, and I move on without much residue",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 0, healthy_selective: 3, conflict_avoidant: 1 },
      },
      {
        text: "I rarely get to this point. I manage things so the confrontation doesn't happen",
        weights: { passive_compliance: 1, guilt_collapse: 0, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 3 },
      },
    ],
  },
  {
    id: 3,
    text: "When you notice someone consistently taking more than they give in a relationship, your pattern is:",
    options: [
      {
        text: "I adjust. I give more to compensate rather than address it",
        weights: { passive_compliance: 3, guilt_collapse: 1, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 0 },
      },
      {
        text: "I try to raise it, but I back down the moment there's pushback",
        weights: { passive_compliance: 0, guilt_collapse: 3, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 1 },
      },
      {
        text: "I address it directly, even though the conversation costs me emotionally",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 3, healthy_selective: 1, conflict_avoidant: 0 },
      },
      {
        text: "I quietly reduce my investment without ever explaining why",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 0, healthy_selective: 1, conflict_avoidant: 3 },
      },
    ],
  },
  {
    id: 4,
    text: "Someone reacts negatively to a boundary you set. What does your system do?",
    options: [
      {
        text: "I apologise and reverse the boundary to restore peace",
        weights: { passive_compliance: 1, guilt_collapse: 3, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 0 },
      },
      {
        text: "I hold the boundary but absorb their reaction as evidence I did something wrong",
        weights: { passive_compliance: 0, guilt_collapse: 1, assertive_anxious: 3, healthy_selective: 0, conflict_avoidant: 0 },
      },
      {
        text: "I hold it. Their reaction is their responsibility, not mine",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 0, healthy_selective: 3, conflict_avoidant: 0 },
      },
      {
        text: "This scenario rarely happens because I avoid creating it in the first place",
        weights: { passive_compliance: 1, guilt_collapse: 0, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 3 },
      },
    ],
  },
  {
    id: 5,
    text: "When you think about the word 'no', what is the feeling most attached to it?",
    options: [
      {
        text: "Danger. Saying no feels like risking the relationship",
        weights: { passive_compliance: 3, guilt_collapse: 1, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 1 },
      },
      {
        text: "Guilt. I can say it but the aftermath is punishing",
        weights: { passive_compliance: 0, guilt_collapse: 3, assertive_anxious: 1, healthy_selective: 0, conflict_avoidant: 0 },
      },
      {
        text: "Necessity. Uncomfortable but something I've learned to do",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 1, healthy_selective: 3, conflict_avoidant: 0 },
      },
      {
        text: "Avoidable. I can usually structure things so a direct no isn't required",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 3 },
      },
    ],
  },
  {
    id: 6,
    text: "Honestly, how often do the people closest to you know where your actual limits are?",
    options: [
      {
        text: "Rarely. I don't think I've ever fully expressed them",
        weights: { passive_compliance: 3, guilt_collapse: 1, assertive_anxious: 0, healthy_selective: 0, conflict_avoidant: 1 },
      },
      {
        text: "Sometimes. I express them but often walk them back",
        weights: { passive_compliance: 0, guilt_collapse: 3, assertive_anxious: 1, healthy_selective: 0, conflict_avoidant: 0 },
      },
      {
        text: "Most of the time. I communicate them clearly, even when it's hard",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 1, healthy_selective: 3, conflict_avoidant: 0 },
      },
      {
        text: "They think they know, but I've curated what they see",
        weights: { passive_compliance: 0, guilt_collapse: 0, assertive_anxious: 0, healthy_selective: 1, conflict_avoidant: 3 },
      },
    ],
  },
];

// ─── Scoring Logic ───

export interface BoundaryLensScores {
  passive_compliance: number;
  guilt_collapse: number;
  assertive_anxious: number;
  healthy_selective: number;
  conflict_avoidant: number;
}

export interface BoundaryLensResult {
  primary: BoundaryProfile;
  secondary: BoundaryProfile;
  scores: BoundaryLensScores;
}

export function scoreBoundaryLens(
  answers: Record<number, string>
): BoundaryLensScores {
  const scores: BoundaryLensScores = {
    passive_compliance: 0,
    guilt_collapse: 0,
    assertive_anxious: 0,
    healthy_selective: 0,
    conflict_avoidant: 0,
  };

  for (const q of boundaryLensQuestions) {
    const answer = answers[q.id];
    if (!answer) continue;
    const selected = q.options.find((o) => o.text === answer);
    if (selected) {
      for (const [pattern, weight] of Object.entries(selected.weights)) {
        scores[pattern as BoundaryPattern] += weight;
      }
    }
  }

  return scores;
}

export function getBoundaryLensResult(
  scores: BoundaryLensScores
): BoundaryLensResult {
  const ranked = (
    Object.entries(scores) as [BoundaryPattern, number][]
  ).sort(([, a], [, b]) => b - a);

  return {
    primary: boundaryProfiles[ranked[0][0]],
    secondary: boundaryProfiles[ranked[1][0]],
    scores,
  };
}

export const BOUNDARY_DISPLAY_NAMES: Record<BoundaryPattern, string> = {
  passive_compliance: "Passive Compliance",
  guilt_collapse: "Guilt Collapse",
  assertive_anxious: "Assertive-Anxious",
  healthy_selective: "Healthy-Selective",
  conflict_avoidant: "Conflict Avoidant",
};
