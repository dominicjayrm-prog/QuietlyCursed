export type Archetype =
  | "watcher"
  | "prototype"
  | "container"
  | "climber"
  | "ghost"
  | "peacemaker";

export interface ArchetypeProfile {
  id: Archetype;
  name: string;
  title: string;
  description: string;
  strengths: string;
  blindSpot: string;
  recommendedSlugs: [string, string, string];
  youtubeId?: string;
}

export interface QuizOption {
  text: string;
  weights: Partial<Record<Archetype, number>>;
}

export interface QuizQuestion {
  id: number;
  text: string;
  type: "likert" | "choice";
  /** For likert questions, which archetypes get scored at each end */
  likertAxis?: { low: Partial<Record<Archetype, number>>; high: Partial<Record<Archetype, number>> };
  /** For choice questions */
  options?: QuizOption[];
}

export const archetypes: Record<Archetype, ArchetypeProfile> = {
  watcher: {
    id: "watcher",
    name: "The Watcher",
    title: "The one who sees everything but says nothing.",
    description:
      "You observe more than you participate. While others rush into decisions, you stand back, cataloguing patterns and reading between lines. Your awareness is your superpower, and your prison. You notice what others miss, but your reluctance to act means you often watch your own life from the outside.",
    strengths:
      "Pattern recognition, emotional intelligence, threat detection. You rarely get blindsided because you're always scanning the horizon.",
    blindSpot:
      "Analysis paralysis. You can see every angle so clearly that choosing one feels like a loss. You mistake observation for participation and awareness for control.",
    recommendedSlugs: ["confirmation-cage", "normalcy-veil", "anchoring-abyss"],
  },
  prototype: {
    id: "prototype",
    name: "The Prototype",
    title: "The one who's always becoming, never arriving.",
    description:
      "You live in a state of perpetual self-improvement. Every version of you is a draft, never the final product. You read, optimize, iterate, and reinvent, but the finish line keeps moving. Your identity is built on potential rather than presence, and 'good enough' feels like failure.",
    strengths:
      "Adaptability, growth mindset, resilience. You recover from setbacks faster than anyone because you treat everything as data for the next version.",
    blindSpot:
      "You can't rest in who you are right now. Self-improvement becomes self-rejection. The person you are today is never enough because you're always comparing them to the person you could become.",
    recommendedSlugs: ["sunk-cost-spiral", "dunning-kruger-mirror", "anchoring-abyss"],
  },
  container: {
    id: "container",
    name: "The Container",
    title: "The one who holds everything for everyone.",
    description:
      "You absorb other people's emotions, problems, and pain. You're the person everyone calls when things fall apart, and you answer every time. Your capacity to hold space for others is extraordinary, but it comes at a cost: you've forgotten how to put anything down.",
    strengths:
      "Emotional endurance, empathy, reliability. People trust you with their worst moments because you've proven you can carry them.",
    blindSpot:
      "You confuse being needed with being loved. You've built your identity around holding others together, which means you can't let go without feeling like you're abandoning them, or losing yourself.",
    recommendedSlugs: ["sunk-cost-spiral", "halo-distortion", "normalcy-veil"],
  },
  climber: {
    id: "climber",
    name: "The Climber",
    title: "The one who measures life in achievements.",
    description:
      "You're driven by an invisible scoreboard. Status, accomplishment, recognition. These aren't just nice to have; they're how you know you exist. Every rung you reach reveals another above it. Rest feels like falling behind. Your ambition is genuine, but so is the emptiness that follows every win.",
    strengths:
      "Drive, focus, execution. You get things done that others only dream about. You turn vision into reality through sheer force of will.",
    blindSpot:
      "You can't distinguish between wanting something and needing to prove something. Your achievements are real, but the validation they provide is always temporary. The next goal isn't ambition. It's anxiety wearing a trophy.",
    recommendedSlugs: ["anchoring-abyss", "dunning-kruger-mirror", "halo-distortion"],
  },
  ghost: {
    id: "ghost",
    name: "The Ghost",
    title: "The one who's present but never fully there.",
    description:
      "You've mastered the art of strategic absence. You're in the room but not in the conversation. You're in the relationship but not fully committed. You keep one foot out of everything, not because you don't care, but because full presence feels dangerous. Disappearing is your defense mechanism.",
    strengths:
      "Independence, emotional self-regulation, low vulnerability to manipulation. You're hard to trap because you're hard to pin down.",
    blindSpot:
      "You mistake detachment for freedom. You avoid being hurt by avoiding being known. The safety of distance becomes a prison of disconnection, and you lose the ability to tell whether you're protecting yourself or punishing yourself.",
    recommendedSlugs: ["normalcy-veil", "confirmation-cage", "sunk-cost-spiral"],
  },
  peacemaker: {
    id: "peacemaker",
    name: "The Peacemaker",
    title: "The one who'd rather bleed than cause a wound.",
    description:
      "Conflict is your kryptonite. You'll absorb an insult, swallow a boundary violation, and smile through disrespect, all to keep the peace. Your tolerance isn't weakness; it's a survival strategy. But the peace you maintain is always someone else's, never your own.",
    strengths:
      "Diplomacy, de-escalation, social harmony. You read tension in a room before anyone speaks and instinctively know how to dissolve it.",
    blindSpot:
      "You sacrifice your own needs so consistently that you've lost track of what they are. Peace-at-all-costs isn't peace. It's suppression. The anger you refuse to express doesn't disappear; it turns inward.",
    recommendedSlugs: ["halo-distortion", "normalcy-veil", "confirmation-cage"],
  },
};

export const questions: QuizQuestion[] = [
  {
    id: 1,
    text: "In a group conversation, I notice dynamics that others seem completely unaware of.",
    type: "likert",
    likertAxis: {
      low: { climber: 2, prototype: 1 },
      high: { watcher: 3, ghost: 1 },
    },
  },
  {
    id: 2,
    text: "I find it difficult to feel satisfied with who I am right now. There's always a better version I should be working toward.",
    type: "likert",
    likertAxis: {
      low: { peacemaker: 1, container: 1 },
      high: { prototype: 3, climber: 1 },
    },
  },
  {
    id: 3,
    text: "People regularly come to me with their problems, even when I haven't offered to help.",
    type: "likert",
    likertAxis: {
      low: { ghost: 2, watcher: 1 },
      high: { container: 3, peacemaker: 1 },
    },
  },
  {
    id: 4,
    text: "I measure my worth by what I've accomplished, not by who I am.",
    type: "likert",
    likertAxis: {
      low: { peacemaker: 1, ghost: 1 },
      high: { climber: 3, prototype: 1 },
    },
  },
  {
    id: 5,
    text: "When things get emotionally intense, my instinct is to create distance.",
    type: "likert",
    likertAxis: {
      low: { container: 2, peacemaker: 1 },
      high: { ghost: 3, watcher: 1 },
    },
  },
  {
    id: 6,
    text: "I would rather accept something unfair than risk a confrontation.",
    type: "likert",
    likertAxis: {
      low: { climber: 2, prototype: 1 },
      high: { peacemaker: 3, container: 1 },
    },
  },
  {
    id: 7,
    text: "A close friend does something that hurts you but doesn't realize it. What's your first instinct?",
    type: "choice",
    options: [
      { text: "Observe and file it away. See if a pattern emerges", weights: { watcher: 3 } },
      { text: "Analyze what it says about you and how to handle it better", weights: { prototype: 3 } },
      { text: "Absorb it. They're probably going through something", weights: { container: 3 } },
      { text: "Let it fuel you. Channel it into something productive", weights: { climber: 3 } },
      { text: "Quietly withdraw. Reduce your emotional exposure", weights: { ghost: 3 } },
      { text: "Let it go. It's not worth creating tension", weights: { peacemaker: 3 } },
    ],
  },
  {
    id: 8,
    text: "I often feel like I'm watching my own life rather than living it.",
    type: "likert",
    likertAxis: {
      low: { climber: 1, container: 1 },
      high: { watcher: 3, ghost: 2 },
    },
  },
  {
    id: 9,
    text: "When I achieve a goal, the satisfaction fades quickly and I start looking for the next one.",
    type: "likert",
    likertAxis: {
      low: { peacemaker: 1, container: 1 },
      high: { climber: 3, prototype: 2 },
    },
  },
  {
    id: 10,
    text: "You're offered a dream opportunity, but it requires leaving behind everything familiar. What weighs on you most?",
    type: "choice",
    options: [
      { text: "Whether I've seen enough information to make the right call", weights: { watcher: 3 } },
      { text: "Whether this is the optimal next step in my growth", weights: { prototype: 3 } },
      { text: "Who will need me if I'm gone", weights: { container: 3 } },
      { text: "Whether this opportunity leads somewhere bigger", weights: { climber: 3 } },
      { text: "Whether I'm ready to be that visible and committed", weights: { ghost: 3 } },
      { text: "Whether leaving will hurt anyone", weights: { peacemaker: 3 } },
    ],
  },
  {
    id: 11,
    text: "I have a hard time saying 'no' to people, even when I know I should.",
    type: "likert",
    likertAxis: {
      low: { ghost: 2, watcher: 1 },
      high: { peacemaker: 2, container: 2 },
    },
  },
  {
    id: 12,
    text: "If your friends described you honestly in three words, which set would they most likely choose?",
    type: "choice",
    options: [
      { text: "Perceptive, quiet, intense", weights: { watcher: 3 } },
      { text: "Driven, restless, evolving", weights: { prototype: 3 } },
      { text: "Reliable, selfless, tired", weights: { container: 3 } },
      { text: "Ambitious, focused, relentless", weights: { climber: 3 } },
      { text: "Independent, elusive, guarded", weights: { ghost: 3 } },
      { text: "Easy-going, patient, agreeable", weights: { peacemaker: 3 } },
    ],
  },
];

/** Calculate archetype scores from quiz answers */
export function scoreQuiz(
  answers: Record<number, number | string>
): Record<Archetype, number> {
  const scores: Record<Archetype, number> = {
    watcher: 0,
    prototype: 0,
    container: 0,
    climber: 0,
    ghost: 0,
    peacemaker: 0,
  };

  for (const q of questions) {
    const answer = answers[q.id];
    if (answer === undefined) continue;

    if (q.type === "likert" && typeof answer === "number" && q.likertAxis) {
      // answer is 1-5. 1-2 = low end, 4-5 = high end, 3 = neutral
      const { low, high } = q.likertAxis;
      if (answer <= 2) {
        const multiplier = answer === 1 ? 1 : 0.5;
        for (const [arch, weight] of Object.entries(low)) {
          scores[arch as Archetype] += weight * multiplier;
        }
      } else if (answer >= 4) {
        const multiplier = answer === 5 ? 1 : 0.5;
        for (const [arch, weight] of Object.entries(high)) {
          scores[arch as Archetype] += weight * multiplier;
        }
      }
    } else if (q.type === "choice" && typeof answer === "string" && q.options) {
      const selected = q.options.find((o) => o.text === answer);
      if (selected) {
        for (const [arch, weight] of Object.entries(selected.weights)) {
          scores[arch as Archetype] += weight;
        }
      }
    }
  }

  return scores;
}

/** Get ranked archetypes from scores */
export function getRankedArchetypes(
  scores: Record<Archetype, number>
): ArchetypeProfile[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => archetypes[id as Archetype]);
}

/** Build shareable text */
export function buildShareText(
  primary: ArchetypeProfile,
  secondary: ArchetypeProfile
): string {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://quietlycursed.com").replace(/^https?:\/\//, "");
  return `My Quietly Cursed Trait Index:\n\nPrimary: ${primary.name}: ${primary.title}\nSecondary: ${secondary.name}\n\nDiscover your archetype at ${siteUrl}/trait-index`;
}
