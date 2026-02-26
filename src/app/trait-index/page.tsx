import type { Metadata } from "next";
import { buildMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import TraitIndexLanding from "@/components/TraitIndexLanding";

export const metadata: Metadata = buildMetadata({
  title:
    "The Trait Index | Free Personality Quiz — Trauma Responses, Attachment Patterns & Psychological Archetypes",
  description:
    "A free online personality test that maps your psychological patterns, trauma responses, and coping strategies across six archetypes. 12 questions. Private results. Identify people-pleasing behaviour, attachment tendencies, and the survival roles you mistake for personality.",
  path: "/trait-index",
});

function TraitIndexJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: "The Trait Index | Free Personality Quiz — Psychological Patterns & Trauma Responses",
    description:
      "A free 12-question personality quiz that identifies your dominant psychological pattern, trauma response type, and coping strategies across six archetypes: The Watcher, The Prototype, The Climber, The Ghost, The Container, and The Peacemaker.",
    url: `${SITE_URL}/trait-index`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Psychological Archetypes & Personality Patterns",
      description:
        "Personality quiz exploring psychological patterns, trauma response types, attachment styles, people-pleasing behaviour, and coping mechanisms.",
    },
    numberOfQuestions: 12,
    timeRequired: "PT3M",
    educationalLevel: "General",
    keywords:
      "personality quiz, personality test online, psychological patterns test, trauma response quiz, people pleaser test, attachment style quiz, self awareness test, psychological quiz, coping strategies, free personality test",
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
