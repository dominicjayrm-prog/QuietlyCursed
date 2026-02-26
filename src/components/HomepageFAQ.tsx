"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is the Trait Index personality quiz?",
    answer:
      "The Trait Index is a psychologically weighted personality quiz designed to identify which of six identity archetypes runs deepest in your behaviour. Unlike conventional personality tests that sort you into broad categories, the Trait Index focuses on the specific psychological patterns you developed — often unconsciously — as survival strategies. It examines how you relate to control, connection, visibility, and emotional regulation to surface the role you default to under pressure. The quiz takes two to three minutes and requires no sign-up or personal information. Each archetype — The Watcher, The Prototype, The Climber, The Ghost, The Container, and The Peacemaker — represents a distinct coping architecture built around a core emotional need. Your result doesn't tell you who you are. It shows you the pattern you've been running — the one shaping your decisions, relationships, and sense of self before you even notice it's operating.",
  },
  {
    question: "Is this a clinical personality test?",
    answer:
      "No. The Trait Index is not a clinical diagnostic tool, and it's not designed to replace professional psychological assessment. It's a self-awareness framework — a structured reflection exercise grounded in recognised psychological concepts including attachment patterns, trauma response styles, and identity formation theory. Clinical personality tests like the MMPI or NEO-PI-R are administered and interpreted by licensed professionals within therapeutic settings. The Trait Index operates differently. It's built for people who sense that something is running beneath their conscious decisions — a pattern they can feel but haven't been able to name. The questions are psychologically weighted to surface behavioural tendencies, not to diagnose conditions. Think of it as a mirror with higher resolution than most self-reflection offers. It won't tell you what's wrong with you. It will show you what you built to survive — and what that architecture is quietly costing you now.",
  },
  {
    question: "What is the fawn response in psychology?",
    answer:
      "The fawn response is a trauma response characterised by compulsive people-pleasing, excessive agreeableness, and the automatic suppression of your own needs in favour of others'. While most people are familiar with fight, flight, and freeze, fawning is the fourth survival strategy — and arguably the hardest to detect because it looks like kindness. In practice, the fawn response means you instinctively read what others need and shape yourself around it. You avoid conflict not because you're peaceful, but because disagreement feels existentially unsafe. You may struggle with setting boundaries, feel responsible for other people's emotional states, or lose track of your own preferences entirely. The fawn response typically develops in environments where emotional safety depended on keeping someone else calm or pleased. Over time, it stops being something you do and becomes something you are. Recognising it is the first step toward distinguishing genuine empathy from automatic self-erasure.",
  },
  {
    question: "What are signs you might be a people pleaser?",
    answer:
      "People-pleasing goes far beyond being kind or considerate — it's a psychological pattern where your sense of safety, identity, or worth becomes dependent on how others perceive you. Common signs include difficulty saying no even when you want to, chronic over-apologising, anxiety about how others feel after interactions, and a persistent sense that your own needs are less valid than everyone else's. You might rehearse conversations to avoid upsetting people, suppress your real opinions to maintain harmony, or feel drained after socialising because you spent the entire time managing someone else's emotional experience. People-pleasing is often rooted in early attachment patterns where love or safety was conditional — given when you performed well, withdrawn when you didn't. It's a coping mechanism that once served a real purpose. But in adulthood it becomes a trap: the more you accommodate, the less visible your actual self becomes — even to you.",
  },
  {
    question: "Why do some people struggle with setting boundaries?",
    answer:
      "Boundary difficulty rarely comes from not understanding what boundaries are. Most people who struggle with setting boundaries understand the concept perfectly — they just can't execute it without overwhelming guilt, anxiety, or fear of abandonment. That's because boundaries aren't primarily an intellectual skill. They're an emotional one, and they require tolerating the discomfort of someone else's displeasure. For many people, that discomfort links directly to early survival strategies. If you grew up in an environment where asserting your needs caused conflict, withdrawal, or punishment, your nervous system learned that boundaries equal danger. The fawn response is heavily implicated here — it trains you to prioritise others' comfort as a form of self-protection. Overthinking every interaction, replaying conversations, and preemptively adjusting your behaviour are all symptoms of a system that learned it wasn't safe to take up space. Real boundary work isn't about scripts or assertiveness techniques. It's about rewiring the belief that your needs are an inconvenience.",
  },
  {
    question: "What are the four trauma response types?",
    answer:
      "The four primary trauma responses are fight, flight, freeze, and fawn. Each represents a distinct survival strategy your nervous system developed in response to perceived threat. Fight manifests as anger, control, confrontation, or the need to dominate situations. Flight shows up as overworking, overthinking, perfectionism, or staying perpetually busy to avoid sitting with discomfort. Freeze looks like emotional shutdown, dissociation, numbness, or an inability to make decisions under stress. Fawn — the least discussed but extremely common — presents as people-pleasing, conflict avoidance, and compulsive agreeableness. Most people don't operate from just one response. You likely have a dominant pattern with secondary tendencies that shift depending on context. These aren't conscious choices — they're automatic programmes running beneath awareness. What feels like personality is often your nervous system's preferred defence. Identifying your dominant trauma response is the starting point for understanding why you react the way you do in relationships, conflict, and moments of vulnerability.",
  },
  {
    question: "Can emotional suppression affect your relationships?",
    answer:
      "Profoundly. Emotional suppression — the habitual dampening or concealment of what you actually feel — doesn't make emotions disappear. It redirects them. Suppressed feelings surface as irritability, emotional withdrawal, physical tension, or sudden disproportionate reactions to minor events. In relationships, emotional suppression creates a specific kind of distance. Your partner or close connections sense something is withheld but can't reach it. You may appear calm, composed, even stable — while internally tracking every emotional signal without revealing your own. Over time, this pattern erodes intimacy because real connection requires emotional visibility. If you learned early that expressing vulnerability was unsafe, weak, or burdensome, suppression became your default coping mechanism. It protected you then. But in adult relationships, it means the person closest to you is bonding with a managed version of who you are — not the actual one. Recognising emotional suppression is where you start understanding why relationships may feel close in proximity but distant in depth.",
  },
  {
    question: "How does self-awareness actually change behaviour?",
    answer:
      "Self-awareness alone doesn't change behaviour — but it changes the relationship you have with your behaviour, which is where transformation begins. Most psychological patterns operate automatically. You react, then rationalise. You repeat cycles and only recognise them in retrospect. Self-awareness introduces a gap between stimulus and response — a moment where you can observe the pattern before it completes. This is particularly relevant for deeply embedded coping mechanisms like people-pleasing, emotional suppression, or identity confusion, where the behaviour feels so natural it seems like personality rather than programming. The Trait Index and the Atlas are designed to accelerate this process by naming the architecture you're running. When you can identify that you're defaulting to a fawn response or retreating into strategic absence, you gain something powerful: choice. Not instant change — but the capacity to interrupt automatic patterns. Over time, that interruption compounds. Self-awareness doesn't fix you. It gives you the option to stop operating on autopilot.",
  },
];

function FAQItem({
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
        <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-cyan-400 md:text-base">
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
          isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-sm leading-[1.85] text-white/50">{item.answer}</p>
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
                text: item.answer,
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
                <FAQItem
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
