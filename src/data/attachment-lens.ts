// ─── Attachment Lens ───
// Phase 2 module for the Trait Index system.
// Assesses relational attachment patterns: Anxious, Avoidant, Secure-Guarded,
// Hyper-Independent, Mixed.

export type AttachmentLeaning =
  | "anxious"
  | "avoidant"
  | "secure_guarded"
  | "hyper_independent"
  | "mixed";

export interface AttachmentProfile {
  id: AttachmentLeaning;
  name: string;
  title: string;
  description: string;
}

export interface AttachmentLensOption {
  text: string;
  weights: Record<AttachmentLeaning, number>;
}

export interface AttachmentLensQuestion {
  id: number;
  text: string;
  options: AttachmentLensOption[];
}

// ─── Result Profiles ───

export const attachmentProfiles: Record<AttachmentLeaning, AttachmentProfile> = {
  anxious: {
    id: "anxious",
    name: "Anxious Leaning",
    title: "The Reaching",
    description:
      "Your relational wiring orients toward closeness, but closeness comes loaded with fear. You read silence as rejection and distance as evidence that something is wrong. Reassurance works briefly, then the question returns. This is not neediness. It is a nervous system that learned early that connection is unreliable, so it developed a surveillance system to monitor for withdrawal. You feel most stable when the other person is visibly present, emotionally available, and explicitly clear. Ambiguity is where your anxiety lives. The pattern is exhausting because the thing you want most, secure attachment, is the thing your system trusts least.",
  },
  avoidant: {
    id: "avoidant",
    name: "Avoidant Leaning",
    title: "The Receding",
    description:
      "Closeness triggers a quiet alarm in your system. Not panic, more like pressure. When someone moves toward you emotionally, your instinct is to create space, not because you do not care, but because proximity feels like exposure. You value autonomy. You process alone. You associate emotional distance with safety. This pattern often develops in environments where vulnerability was met with dismissal or where self-reliance was the only dependable strategy. Relationships feel manageable at arm's length. The cost is that the distance you maintain to feel safe is the same distance that prevents you from feeling fully known.",
  },
  secure_guarded: {
    id: "secure_guarded",
    name: "Secure but Guarded",
    title: "The Measured",
    description:
      "You are capable of healthy attachment, and you know it. But you do not offer it freely. There is a threshold people must cross before you let them in, and that threshold exists for a reason. Your relational instincts are sound: you communicate, you show up, you can tolerate discomfort without spiralling. But underneath the stability is a calibrated caution, a learned awareness that not everyone deserves the version of you that trusts fully. This is not avoidance. It is discernment shaped by experience. The pattern is functional, but the guardedness occasionally prevents connection from reaching the depth you are actually capable of.",
  },
  hyper_independent: {
    id: "hyper_independent",
    name: "Hyper-Independent",
    title: "The Self-Contained",
    description:
      "Your relational coping strategy is total self-sufficiency. You do not ask for help. You do not lean. You handle your own logistics, emotions, and crises without involving others, not because you are incapable of intimacy but because depending on someone feels structurally unsafe. This pattern often forms when early reliance on others led to disappointment, inconsistency, or harm. The result is a person who appears strong and capable but who has quietly removed themselves from the exchange that relationships require. Emotional distance masquerades as resilience. The cost is that people around you often have no idea what you actually need, because you have trained yourself never to show it.",
  },
  mixed: {
    id: "mixed",
    name: "Mixed Pattern",
    title: "The Oscillating",
    description:
      "Your attachment system does not settle into one mode. It shifts. You move toward connection and then pull back from it. You crave reassurance and then resist the vulnerability it requires. This oscillation is not confusion. It is two competing survival strategies running simultaneously: one that learned closeness is necessary, and one that learned closeness is dangerous. The result is a relational experience that feels contradictory from the inside, wanting intimacy and fearing it in the same breath. People around you may find you difficult to read, not because you are guarded, but because your system genuinely has not resolved which direction is safer.",
  },
};

// ─── Questions ───
// Each question offers 4 options. Weights distribute across all 5 attachment types.
// Primary match scores 3, adjacent or related patterns receive 1.

export const attachmentLensQuestions: AttachmentLensQuestion[] = [
  {
    id: 1,
    text: "Someone you are close to becomes unexpectedly distant for a few days. No explanation. What surfaces first?",
    options: [
      {
        text: "I replay our last interaction looking for what I did wrong",
        weights: { anxious: 3, avoidant: 0, secure_guarded: 0, hyper_independent: 0, mixed: 1 },
      },
      {
        text: "I feel relieved by the space, even if I know I shouldn't",
        weights: { anxious: 0, avoidant: 3, secure_guarded: 0, hyper_independent: 1, mixed: 0 },
      },
      {
        text: "I notice it, register it, and wait to see if a pattern forms before reacting",
        weights: { anxious: 0, avoidant: 0, secure_guarded: 3, hyper_independent: 1, mixed: 0 },
      },
      {
        text: "I feel a pull to reach out and a simultaneous urge to withdraw first",
        weights: { anxious: 1, avoidant: 1, secure_guarded: 0, hyper_independent: 0, mixed: 3 },
      },
    ],
  },
  {
    id: 2,
    text: "In your closest relationships, what is the pattern you fall into most often?",
    options: [
      {
        text: "I give more than I receive and struggle to ask for what I need",
        weights: { anxious: 3, avoidant: 0, secure_guarded: 0, hyper_independent: 1, mixed: 1 },
      },
      {
        text: "I keep a part of myself held back, even when things are going well",
        weights: { anxious: 0, avoidant: 3, secure_guarded: 1, hyper_independent: 1, mixed: 0 },
      },
      {
        text: "I engage fully but set limits quietly when I sense the dynamic shifting",
        weights: { anxious: 0, avoidant: 0, secure_guarded: 3, hyper_independent: 1, mixed: 0 },
      },
      {
        text: "I oscillate between wanting to merge and wanting to disappear",
        weights: { anxious: 1, avoidant: 1, secure_guarded: 0, hyper_independent: 0, mixed: 3 },
      },
    ],
  },
  {
    id: 3,
    text: "When someone you trust asks you for emotional vulnerability, what happens internally?",
    options: [
      {
        text: "I open up quickly, sometimes too quickly, because I want them to stay close",
        weights: { anxious: 3, avoidant: 0, secure_guarded: 0, hyper_independent: 0, mixed: 1 },
      },
      {
        text: "Something in me resists. I change the subject or deflect with humour",
        weights: { anxious: 0, avoidant: 3, secure_guarded: 0, hyper_independent: 1, mixed: 0 },
      },
      {
        text: "I can do it, but I choose carefully what to share and what to hold back",
        weights: { anxious: 0, avoidant: 0, secure_guarded: 3, hyper_independent: 1, mixed: 0 },
      },
      {
        text: "I handle my own emotions. I don't see the point in putting that on someone else",
        weights: { anxious: 0, avoidant: 1, secure_guarded: 0, hyper_independent: 3, mixed: 0 },
      },
    ],
  },
  {
    id: 4,
    text: "When a relationship ends or someone pulls away, your default coping pattern is:",
    options: [
      {
        text: "I fixate. I analyse what went wrong and whether I could have prevented it",
        weights: { anxious: 3, avoidant: 0, secure_guarded: 0, hyper_independent: 0, mixed: 1 },
      },
      {
        text: "I move on faster than expected. I compartmentalise and carry on",
        weights: { anxious: 0, avoidant: 3, secure_guarded: 0, hyper_independent: 1, mixed: 0 },
      },
      {
        text: "I grieve it, process it, and eventually redirect my energy",
        weights: { anxious: 0, avoidant: 0, secure_guarded: 3, hyper_independent: 0, mixed: 0 },
      },
      {
        text: "I tell myself I don't need anyone. I double down on independence",
        weights: { anxious: 0, avoidant: 1, secure_guarded: 0, hyper_independent: 3, mixed: 1 },
      },
    ],
  },
  {
    id: 5,
    text: "When conflict arises in a relationship that matters to you, your instinct is to:",
    options: [
      {
        text: "Resolve it immediately. Unresolved tension feels unbearable",
        weights: { anxious: 3, avoidant: 0, secure_guarded: 1, hyper_independent: 0, mixed: 0 },
      },
      {
        text: "Step back. I need space before I can process what happened",
        weights: { anxious: 0, avoidant: 3, secure_guarded: 0, hyper_independent: 1, mixed: 0 },
      },
      {
        text: "Address it directly but at the right moment, not reactively",
        weights: { anxious: 0, avoidant: 0, secure_guarded: 3, hyper_independent: 0, mixed: 0 },
      },
      {
        text: "I swing between wanting to fix it and wanting to walk away entirely",
        weights: { anxious: 1, avoidant: 1, secure_guarded: 0, hyper_independent: 0, mixed: 3 },
      },
    ],
  },
  {
    id: 6,
    text: "Which of these statements feels most true about how you experience closeness?",
    options: [
      {
        text: "I want it more than I trust it. The closer someone gets, the more I fear losing them",
        weights: { anxious: 3, avoidant: 0, secure_guarded: 0, hyper_independent: 0, mixed: 1 },
      },
      {
        text: "I can handle it in measured amounts. Too much feels like pressure",
        weights: { anxious: 0, avoidant: 3, secure_guarded: 1, hyper_independent: 0, mixed: 0 },
      },
      {
        text: "I value it deeply but I don't chase it. I let it develop at a pace that feels safe",
        weights: { anxious: 0, avoidant: 0, secure_guarded: 3, hyper_independent: 1, mixed: 0 },
      },
      {
        text: "I have built a life that doesn't require it. I am fine on my own",
        weights: { anxious: 0, avoidant: 1, secure_guarded: 0, hyper_independent: 3, mixed: 0 },
      },
    ],
  },
];

// ─── Scoring Logic ───

export interface AttachmentLensScores {
  anxious: number;
  avoidant: number;
  secure_guarded: number;
  hyper_independent: number;
  mixed: number;
}

export interface AttachmentLensResult {
  primary: AttachmentProfile;
  secondary: AttachmentProfile;
  scores: AttachmentLensScores;
}

export function scoreAttachmentLens(
  answers: Record<number, string>
): AttachmentLensScores {
  const scores: AttachmentLensScores = {
    anxious: 0,
    avoidant: 0,
    secure_guarded: 0,
    hyper_independent: 0,
    mixed: 0,
  };

  for (const q of attachmentLensQuestions) {
    const answer = answers[q.id];
    if (!answer) continue;

    const selected = q.options.find((o) => o.text === answer);
    if (selected) {
      for (const [leaning, weight] of Object.entries(selected.weights)) {
        scores[leaning as AttachmentLeaning] += weight;
      }
    }
  }

  return scores;
}

export function getAttachmentLensResult(
  scores: AttachmentLensScores
): AttachmentLensResult {
  const ranked = (
    Object.entries(scores) as [AttachmentLeaning, number][]
  ).sort(([, a], [, b]) => b - a);

  return {
    primary: attachmentProfiles[ranked[0][0]],
    secondary: attachmentProfiles[ranked[1][0]],
    scores,
  };
}

export const ATTACHMENT_DISPLAY_NAMES: Record<AttachmentLeaning, string> = {
  anxious: "Anxious",
  avoidant: "Avoidant",
  secure_guarded: "Secure-Guarded",
  hyper_independent: "Hyper-Independent",
  mixed: "Mixed",
};

export function buildAttachmentShareText(
  primaryArchetype: string,
  traumaPrimary: string,
  attachmentPrimary: AttachmentProfile,
  attachmentSecondary: AttachmentProfile
): string {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://quietlycursed.com"
  ).replace(/^https?:\/\//, "");
  return `My Identity Map on Quietly Cursed:\n\nPrimary Archetype: ${primaryArchetype}\nDominant Trauma Response: ${traumaPrimary}\nAttachment Leaning: ${attachmentPrimary.name}\nSecondary Tendency: ${attachmentSecondary.name}\n\nExplore yours at ${siteUrl}/trait-index`;
}
