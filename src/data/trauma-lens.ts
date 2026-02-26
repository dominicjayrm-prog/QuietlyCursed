// ─── Trauma Response Lens ───
// A deepening module for the Trait Index system.
// Assesses dominant trauma response patterns: Fawn, Freeze, Flight, Fight.

export type TraumaResponse = "fawn" | "freeze" | "flight" | "fight";

export interface TraumaResponseProfile {
  id: TraumaResponse;
  name: string;
  title: string;
  description: string;
}

export interface TraumaLensOption {
  text: string;
  weights: Record<TraumaResponse, number>;
}

export interface TraumaLensQuestion {
  id: number;
  text: string;
  options: TraumaLensOption[];
}

// ─── Result Profiles ───

export const traumaProfiles: Record<TraumaResponse, TraumaResponseProfile> = {
  fawn: {
    id: "fawn",
    name: "Fawn",
    title: "The Appeaser",
    description:
      "Your nervous system learned that safety comes from managing other people's emotions. You read the room before you read yourself. Agreement became your reflex, not because you lacked opinions, but because expressing them felt dangerous. Over time, people-pleasing became indistinguishable from personality. You accommodate, pre-empt, and smooth over conflict with a precision that looks like kindness but operates like a stress coping mechanism. The cost is quiet: you have spent so long calibrating to others that your own preferences have become difficult to locate.",
  },
  freeze: {
    id: "freeze",
    name: "Freeze",
    title: "The Suspended",
    description:
      "When the system gets overwhelmed, yours shuts down. Not dramatically. Quietly. You go still, mentally vacant, emotionally flatlined. Decisions stall. Tasks pile up. You are present in body but absent in agency. This is not laziness. It is a nervous system response that learned to play dead when the threat was too large to fight or flee. The freeze pattern creates a distinctive internal experience: you can see what needs to happen, but the bridge between knowing and doing has collapsed. You wait for the paralysis to pass, unsure whether you chose stillness or it chose you.",
  },
  flight: {
    id: "flight",
    name: "Flight",
    title: "The Evader",
    description:
      "Your threat response is motion. When pressure builds, you move. Not always physically. You switch tasks, pivot plans, over-schedule, overthink, or throw yourself into productivity that looks impressive but functions as avoidance. The flight pattern is the most socially rewarded trauma response because it often resembles ambition. Busyness becomes a shield. Constant forward momentum prevents you from sitting with whatever you are running from. You are not escaping danger. You are escaping stillness, because stillness is where the feelings catch up.",
  },
  fight: {
    id: "fight",
    name: "Fight",
    title: "The Defender",
    description:
      "Your system responds to threat by pushing back. This does not always look like aggression. More often it surfaces as control, rigidity, critique, or a low tolerance for perceived incompetence. You set firm boundaries, but sometimes the firmness is less about clarity and more about keeping the world at a manageable distance. The fight response can also turn inward: harsh self-criticism, impossible standards, a punishing internal voice that treats every mistake as evidence of failure. Whether directed outward or inward, the pattern is the same. Your nervous system learned that the safest position is the strongest one.",
  },
};

// ─── Questions ───
// Each question offers four options, one per trauma response.
// Weights are distributed so the primary choice scores 3 and
// adjacent patterns receive fractional secondary weight.

export const traumaLensQuestions: TraumaLensQuestion[] = [
  {
    id: 1,
    text: "Someone important to you is visibly upset but hasn't said why. What happens inside you first?",
    options: [
      {
        text: "I start running through what I might have done wrong and how to fix it",
        weights: { fawn: 3, freeze: 0, flight: 1, fight: 0 },
      },
      {
        text: "I go blank. I know I should respond but I can't find the right reaction",
        weights: { fawn: 0, freeze: 3, flight: 0, fight: 1 },
      },
      {
        text: "I get restless. I want to leave the room or change the subject",
        weights: { fawn: 0, freeze: 0, flight: 3, fight: 1 },
      },
      {
        text: "I feel a flash of irritation. If something is wrong, they should just say it",
        weights: { fawn: 0, freeze: 1, flight: 0, fight: 3 },
      },
    ],
  },
  {
    id: 2,
    text: "You realise you have been tolerating a situation that genuinely isn't working. What do you do?",
    options: [
      {
        text: "I keep adjusting myself to make it more bearable. Maybe I'm the problem",
        weights: { fawn: 3, freeze: 1, flight: 0, fight: 0 },
      },
      {
        text: "I think about changing things but can't seem to take the first step",
        weights: { fawn: 0, freeze: 3, flight: 1, fight: 0 },
      },
      {
        text: "I start planning my exit. I research alternatives and keep moving",
        weights: { fawn: 0, freeze: 0, flight: 3, fight: 1 },
      },
      {
        text: "I confront it directly, even if it makes things uncomfortable",
        weights: { fawn: 1, freeze: 0, flight: 0, fight: 3 },
      },
    ],
  },
  {
    id: 3,
    text: "After a disagreement with someone you care about, what is your most honest internal experience?",
    options: [
      {
        text: "Guilt. Even if I was right, I feel responsible for the tension",
        weights: { fawn: 3, freeze: 0, flight: 0, fight: 1 },
      },
      {
        text: "Numbness. The emotional charge disappears and I feel oddly detached",
        weights: { fawn: 0, freeze: 3, flight: 0, fight: 1 },
      },
      {
        text: "Urgency. I need to do something, fix something, move on to something else",
        weights: { fawn: 1, freeze: 0, flight: 3, fight: 0 },
      },
      {
        text: "Frustration. I replay it and think about what I should have said",
        weights: { fawn: 0, freeze: 0, flight: 1, fight: 3 },
      },
    ],
  },
  {
    id: 4,
    text: "When you feel overwhelmed by responsibility, your default pattern is usually to:",
    options: [
      {
        text: "Take on more. If everyone else is okay, I'll be okay eventually",
        weights: { fawn: 3, freeze: 0, flight: 1, fight: 0 },
      },
      {
        text: "Shut down quietly. I stop responding to messages and withdraw",
        weights: { fawn: 0, freeze: 3, flight: 0, fight: 1 },
      },
      {
        text: "Overwork. I bury myself in tasks and schedules until the feeling passes",
        weights: { fawn: 0, freeze: 0, flight: 3, fight: 1 },
      },
      {
        text: "Push back. I get short with people and need control of my space",
        weights: { fawn: 0, freeze: 1, flight: 0, fight: 3 },
      },
    ],
  },
  {
    id: 5,
    text: "Someone crosses a boundary you haven't explicitly stated. What is your instinct?",
    options: [
      {
        text: "Let it go. I should have been clearer. It's partly my fault",
        weights: { fawn: 3, freeze: 1, flight: 0, fight: 0 },
      },
      {
        text: "Freeze. I notice it happened but I can't respond in the moment",
        weights: { fawn: 1, freeze: 3, flight: 0, fight: 0 },
      },
      {
        text: "Avoid them. I quietly reduce contact without explaining why",
        weights: { fawn: 0, freeze: 0, flight: 3, fight: 1 },
      },
      {
        text: "Address it. If not now, then soon. I don't let things slide easily",
        weights: { fawn: 0, freeze: 0, flight: 1, fight: 3 },
      },
    ],
  },
  {
    id: 6,
    text: "When you think about the version of yourself that others see, what comes up?",
    options: [
      {
        text: "They see someone easier, warmer, and more agreeable than I actually feel",
        weights: { fawn: 3, freeze: 0, flight: 1, fight: 0 },
      },
      {
        text: "They probably don't see much at all. I keep the real version hidden",
        weights: { fawn: 0, freeze: 3, flight: 0, fight: 1 },
      },
      {
        text: "They see someone who has it together. The motion hides the mess",
        weights: { fawn: 0, freeze: 0, flight: 3, fight: 1 },
      },
      {
        text: "They see someone strong. Maybe too strong. I don't let vulnerability show",
        weights: { fawn: 1, freeze: 0, flight: 0, fight: 3 },
      },
    ],
  },
];

// ─── Scoring Logic ───

export interface TraumaLensScores {
  fawn: number;
  freeze: number;
  flight: number;
  fight: number;
}

export interface TraumaLensResult {
  primary: TraumaResponseProfile;
  secondary: TraumaResponseProfile;
  scores: TraumaLensScores;
}

export function scoreTraumaLens(
  answers: Record<number, string>
): TraumaLensScores {
  const scores: TraumaLensScores = { fawn: 0, freeze: 0, flight: 0, fight: 0 };

  for (const q of traumaLensQuestions) {
    const answer = answers[q.id];
    if (!answer) continue;

    const selected = q.options.find((o) => o.text === answer);
    if (selected) {
      for (const [response, weight] of Object.entries(selected.weights)) {
        scores[response as TraumaResponse] += weight;
      }
    }
  }

  return scores;
}

export function getTraumaLensResult(
  scores: TraumaLensScores
): TraumaLensResult {
  const ranked = (Object.entries(scores) as [TraumaResponse, number][]).sort(
    ([, a], [, b]) => b - a
  );

  return {
    primary: traumaProfiles[ranked[0][0]],
    secondary: traumaProfiles[ranked[1][0]],
    scores,
  };
}

export function buildTraumaShareText(
  primaryArchetype: string,
  traumaPrimary: TraumaResponseProfile,
  traumaSecondary: TraumaResponseProfile
): string {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://quietlycursed.com"
  ).replace(/^https?:\/\//, "");
  return `My Identity Map on Quietly Cursed:\n\nPrimary Archetype: ${primaryArchetype}\nDominant Trauma Response: ${traumaPrimary.name}\nSecondary Response: ${traumaSecondary.name}\n\nExplore yours at ${siteUrl}/trait-index`;
}
