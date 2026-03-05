"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

type AnswerBlock =
  | { type: "text"; content: string }
  | { type: "rich"; content: ReactNode; plain: string }
  | { type: "bullets"; items: string[] };

interface FAQItem {
  question: string;
  answer: AnswerBlock[];
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is the Trait Index personality quiz?",
    answer: [
      {
        type: "text",
        content:
          "The Trait Index is a psychologically weighted personality quiz designed to identify which of six identity archetypes runs deepest in your behaviour. Unlike conventional personality tests that sort you into broad categories, the Trait Index focuses on the specific psychological patterns you developed, often unconsciously, as survival strategies.",
      },
      {
        type: "text",
        content:
          "It examines how you relate to control, connection, visibility, and emotional regulation to surface the role you default to under pressure. The quiz takes two to three minutes and requires no sign-up or personal information.",
      },
      {
        type: "text",
        content:
          "Each archetype (The Watcher, The Prototype, The Climber, The Ghost, The Container, and The Peacemaker) represents a distinct coping architecture built around a core emotional need. Your result doesn't tell you who you are. It shows you the pattern you've been running, the one shaping your decisions, relationships, and sense of self before you even notice it's operating.",
      },
    ],
  },
  {
    question: "Is this a clinical personality test?",
    answer: [
      {
        type: "text",
        content:
          "No. The Trait Index is not a clinical diagnostic tool, and it's not designed to replace professional psychological assessment. It's a self-awareness framework; a structured reflection exercise grounded in recognised psychological concepts including attachment patterns, trauma response styles, and identity formation theory.",
      },
      {
        type: "text",
        content:
          "Clinical personality tests like the MMPI or NEO-PI-R are administered and interpreted by licensed professionals within therapeutic settings. The Trait Index operates differently. It's built for people who sense that something is running beneath their conscious decisions. A pattern they can feel but haven't been able to name.",
      },
      {
        type: "text",
        content:
          "The questions are psychologically weighted to surface behavioural tendencies, not to diagnose conditions. Think of it as a mirror with higher resolution than most self-reflection offers. It won't tell you what's wrong with you. It will show you what you built to survive, and what that architecture is quietly costing you now.",
      },
    ],
  },
  {
    question: "What is the fawn response in psychology?",
    answer: [
      {
        type: "text",
        content:
          "The fawn response is a trauma response characterised by compulsive people-pleasing, excessive agreeableness, and the automatic suppression of your own needs in favour of others'. While most people are familiar with fight, flight, and freeze, fawning is the fourth survival strategy, and arguably the hardest to detect because it looks like kindness.",
      },
      {
        type: "text",
        content:
          "In practice, the fawn response means you instinctively read what others need and shape yourself around it. You avoid conflict not because you're peaceful, but because disagreement feels existentially unsafe. You may struggle with setting boundaries, feel responsible for other people's emotional states, or lose track of your own preferences entirely.",
      },
      {
        type: "rich",
        plain:
          "The fawn response typically develops in environments where emotional safety depended on keeping someone else calm or pleased. Over time, it stops being something you do and becomes something you are. Recognising it is the first step toward distinguishing genuine empathy from automatic self-erasure. We explore this pattern in depth in The Psychological Trap of Being Too Nice.",
        content: (
          <>
            The fawn response typically develops in environments where emotional
            safety depended on keeping someone else calm or pleased. Over time,
            it stops being something you do and becomes something you are.
            Recognising it is the first step toward distinguishing genuine
            empathy from automatic self-erasure. We explore this pattern in
            depth in{" "}
            <Link
              href="/atlas/the-psychological-trap-of-being-too-nice"
              className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 transition-colors hover:text-cyan-300"
            >
              The Psychological Trap of Being Too Nice
            </Link>
            .
          </>
        ),
      },
    ],
  },
  {
    question: "What are signs you might be a people pleaser?",
    answer: [
      {
        type: "text",
        content:
          "People-pleasing goes far beyond being kind or considerate. It's a psychological pattern where your sense of safety, identity, or worth becomes dependent on how others perceive you.",
      },
      {
        type: "text",
        content: "Common signs include:",
      },
      {
        type: "bullets",
        items: [
          "Difficulty saying no, even when you genuinely want to",
          "Chronic over-apologising or preemptive guilt",
          "Anxiety about how others feel after interactions with you",
          "A persistent sense that your own needs are less valid than everyone else's",
          "Rehearsing conversations to avoid upsetting people",
          "Feeling drained after socialising because you spent the entire time managing someone else's emotional experience",
        ],
      },
      {
        type: "text",
        content:
          "People-pleasing is often rooted in early attachment patterns where love or safety was conditional. Given when you performed well; withdrawn when you didn't. It's a coping mechanism that once served a real purpose, but in adulthood it becomes a trap: the more you accommodate, the less visible your actual self becomes.",
      },
    ],
  },
  {
    question: "Why do some people struggle with setting boundaries?",
    answer: [
      {
        type: "text",
        content:
          "Boundary difficulty rarely comes from not understanding what boundaries are. Most people who struggle with setting boundaries understand the concept perfectly; they just can't execute it without overwhelming guilt, anxiety, or fear of abandonment.",
      },
      {
        type: "text",
        content:
          "That's because boundaries aren't primarily an intellectual skill. They're an emotional one, and they require tolerating the discomfort of someone else's displeasure. For many people, that discomfort links directly to early survival strategies. If you grew up in an environment where asserting your needs caused conflict, withdrawal, or punishment, your nervous system learned that boundaries equal danger.",
      },
      {
        type: "text",
        content:
          "The fawn response is heavily implicated here. It trains you to prioritise others' comfort as a form of self-protection. Overthinking every interaction, replaying conversations, and preemptively adjusting your behaviour are all symptoms of a system that learned it wasn't safe to take up space.",
      },
      {
        type: "rich",
        plain:
          "Real boundary work isn't about scripts or assertiveness techniques. It's about rewiring the belief that your needs are an inconvenience. If this pattern started early, our piece on Oldest Sibling Syndrome explores how it takes root.",
        content: (
          <>
            Real boundary work isn&apos;t about scripts or assertiveness
            techniques. It&apos;s about rewiring the belief that your needs are
            an inconvenience. If this pattern started early, our piece on{" "}
            <Link
              href="/atlas/oldest-sibling-syndrome-how-you-got-recruited-into-adulthood"
              className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 transition-colors hover:text-cyan-300"
            >
              Oldest Sibling Syndrome
            </Link>{" "}
            explores how it takes root.
          </>
        ),
      },
    ],
  },
  {
    question: "What are the four trauma response types?",
    answer: [
      {
        type: "text",
        content:
          "The four primary trauma responses are fight, flight, freeze, and fawn. Each represents a distinct survival strategy your nervous system developed in response to perceived threat.",
      },
      {
        type: "bullets",
        items: [
          "Fight: anger, control, confrontation, or the need to dominate situations",
          "Flight: overworking, overthinking, perfectionism, or staying perpetually busy to avoid discomfort",
          "Freeze: emotional shutdown, dissociation, numbness, or inability to make decisions under stress",
          "Fawn: people-pleasing, conflict avoidance, and compulsive agreeableness (the least discussed, but extremely common)",
        ],
      },
      {
        type: "text",
        content:
          "Most people don't operate from just one response. You likely have a dominant pattern with secondary tendencies that shift depending on context. These aren't conscious choices; they're automatic programmes running beneath awareness.",
      },
      {
        type: "text",
        content:
          "What feels like personality is often your nervous system's preferred defence. Identifying your dominant trauma response is the starting point for understanding why you react the way you do in relationships, conflict, and moments of vulnerability.",
      },
    ],
  },
  {
    question: "Can emotional suppression affect your relationships?",
    answer: [
      {
        type: "text",
        content:
          "Profoundly. Emotional suppression, the habitual dampening or concealment of what you actually feel, doesn't make emotions disappear. It redirects them. Suppressed feelings surface as irritability, emotional withdrawal, physical tension, or sudden disproportionate reactions to minor events.",
      },
      {
        type: "text",
        content:
          "In relationships, emotional suppression creates a specific kind of distance. Your partner or close connections sense something is withheld but can't reach it. You may appear calm, composed, even stable, while internally tracking every emotional signal without revealing your own.",
      },
      {
        type: "text",
        content:
          "Over time, this pattern erodes intimacy because real connection requires emotional visibility. If you learned early that expressing vulnerability was unsafe, weak, or burdensome, suppression became your default coping mechanism. It protected you then. But in adult relationships, it means the person closest to you is bonding with a managed version of who you are, not the actual one.",
      },
      {
        type: "rich",
        plain:
          "Recognising emotional suppression is where you start understanding why relationships may feel close in proximity but distant in depth. We unpack this pattern further in The Hidden Cost of Being the \"Strong One\".",
        content: (
          <>
            Recognising emotional suppression is where you start understanding
            why relationships may feel close in proximity but distant in depth.
            We unpack this pattern further in{" "}
            <Link
              href="/atlas/the-hidden-cost-of-being-the-strong-one"
              className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 transition-colors hover:text-cyan-300"
            >
              The Hidden Cost of Being the &ldquo;Strong One&rdquo;
            </Link>
            .
          </>
        ),
      },
    ],
  },
  {
    question: "How does self-awareness actually change behaviour?",
    answer: [
      {
        type: "text",
        content:
          "Self-awareness alone doesn't change behaviour, but it changes the relationship you have with your behaviour. That's where transformation begins.",
      },
      {
        type: "text",
        content:
          "Most psychological patterns operate automatically. You react, then rationalise. You repeat cycles and only recognise them in retrospect. Self-awareness introduces a gap between stimulus and response; a moment where you can observe the pattern before it completes.",
      },
      {
        type: "text",
        content:
          "This is particularly relevant for deeply embedded coping mechanisms like people-pleasing, emotional suppression, or identity confusion, where the behaviour feels so natural it seems like personality rather than programming.",
      },
      {
        type: "text",
        content:
          "The Trait Index and the Atlas are designed to accelerate this process by naming the architecture you're running. When you can identify that you're defaulting to a fawn response or retreating into strategic absence, you gain something powerful: choice. Not instant change, but the capacity to interrupt automatic patterns. Over time, that interruption compounds.",
      },
      {
        type: "rich",
        plain:
          "Self-awareness doesn't fix you. It gives you the option to stop operating on autopilot. For a deeper look at how this plays out in high-functioning minds, see Gifted Minds: How Intelligence Becomes Your Worst Enemy.",
        content: (
          <>
            Self-awareness doesn&apos;t fix you. It gives you the option to stop
            operating on autopilot. For a deeper look at how this plays out in
            high-functioning minds, see{" "}
            <Link
              href="/atlas/Gifted-Minds-How-Intelligence-Becomes-Your-Worst-Enemy"
              className="text-cyan-400 underline decoration-cyan-400/30 underline-offset-2 transition-colors hover:text-cyan-300"
            >
              Gifted Minds: How Intelligence Becomes Your Worst Enemy
            </Link>
            .
          </>
        ),
      },
    ],
  },
];

/** Flatten answer blocks to plain text for JSON-LD structured data. */
function flattenAnswer(blocks: AnswerBlock[]): string {
  return blocks
    .map((b) =>
      b.type === "text"
        ? b.content
        : b.type === "rich"
          ? b.plain
          : b.items.map((i) => `• ${i}`).join(" "),
    )
    .join(" ");
}

function FAQItemCard({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-cyan-400"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-medium text-white/80 md:text-base">
          {item.question}
        </span>
        <span
          className={`shrink-0 text-white/30 transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 pb-6"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3">
            {item.answer.map((block, i) =>
              block.type === "text" ? (
                <p
                  key={i}
                  className="text-sm leading-[1.85] text-white/50"
                >
                  {block.content}
                </p>
              ) : block.type === "rich" ? (
                <p
                  key={i}
                  className="text-sm leading-[1.85] text-white/50"
                >
                  {block.content}
                </p>
              ) : (
                <ul
                  key={i}
                  className="ml-1 space-y-1.5 text-sm leading-[1.85] text-white/50"
                >
                  {block.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* FAQ JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: flattenAnswer(item.answer),
              },
            })),
          }),
        }}
      />

      <section
        className="border-t border-white/5 bg-white/[0.01]"
        aria-label="Frequently asked questions about psychological patterns and personality"
      >
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <FadeIn>
            <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-white md:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mb-12 max-w-lg text-center text-sm text-white/40">
              Common questions about personality patterns, trauma responses, and
              the psychology behind how we operate.
            </p>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 md:px-8">
              {FAQ_ITEMS.map((item, i) => (
                <FAQItemCard
                  key={i}
                  item={item}
                  isOpen={openIndex === i}
                  onToggle={() => toggle(i)}
                />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
