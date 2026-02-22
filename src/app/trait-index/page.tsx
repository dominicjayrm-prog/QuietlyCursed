import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import TraitIndexLanding from "@/components/TraitIndexLanding";

export const metadata: Metadata = buildMetadata({
  title: "The Trait Index — Dark Psychology Personality Quiz",
  description:
    "A psychologically serious archetype assessment. 12 questions. 6 archetypes. Discover which psychological identity pattern runs deepest — The Watcher, The Prototype, The Climber, The Ghost, The Container, or The Peacemaker.",
  path: "/trait-index",
});

function TraitIndexJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "The Trait Index — Psychological Archetype Quiz",
    description:
      "A 12-question psychological archetype assessment that identifies your dominant identity pattern across six archetypes: The Watcher, The Prototype, The Climber, The Ghost, The Container, and The Peacemaker.",
    url: "https://quietlycursed.com/trait-index",
    provider: {
      "@type": "Organization",
      name: "Quietly Cursed",
      url: "https://quietlycursed.com",
    },
    about: {
      "@type": "Thing",
      name: "Psychological Archetypes",
      description:
        "Dark psychology personality quiz exploring psychological identity patterns and archetype assessment.",
    },
    numberOfQuestions: 12,
    timeRequired: "PT3M",
    educationalLevel: "General",
    keywords:
      "dark psychology personality quiz, psychological archetype quiz, what type of person am I quiz psychology, personality assessment, archetype test",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function TraitIndexPage() {
  return (
    <>
      <TraitIndexJsonLd />
      <TraitIndexLanding />
    </>
  );
}
