export interface TrapSection {
  whatItIs: string;
  howItShowsUp: string;
  hiddenCost: string;
  whatItProtects: string;
}

export interface Trap {
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  summary: string;
  sections: TrapSection;
  youtubeId?: string;
  publishedAt: string;
  relatedSlugs: [string, string, string];
}

export const traps: Trap[] = [
  {
    slug: "sunk-cost-spiral",
    title: "The Sunk Cost Spiral",
    subtitle: "Case File #001: Escalation of Commitment",
    tagline: "Why you keep pouring into what's already lost.",
    summary:
      "The sunk cost fallacy is one of the most quietly destructive patterns in human decision-making. It whispers a simple lie: because you've already invested so much, you must keep going. Time, money, emotional energy. Once spent, they become invisible chains. The truth is brutal. What you've already spent is gone. No amount of future investment will recover it. Yet the mind resists this truth with extraordinary force. Casinos understand this. Abusive relationships thrive on it. Entire careers are built on its foundation.\n\nThe spiral begins innocently. You buy a ticket to a show you no longer want to attend. You stay because you paid. Then the pattern scales. You stay in a degree program that drains you because you're \"already three years in.\" You stay in a relationship that's eroding your identity because \"we've been together so long.\"\n\nWhat makes the sunk cost spiral a genuine psychological trap is its emotional logic. It feels rational. It feels like perseverance, like loyalty, like wisdom. But it's none of those things. It's fear wearing the mask of commitment.\n\nBreaking free requires a single, painful question: \"If I were starting fresh today, with none of my past investment, would I choose this?\" If the answer is no, the only rational move is to walk away. Everything else is the spiral tightening its grip. The cost of staying is always higher than the cost of what you've already lost.",
    sections: {
      whatItIs:
        "The sunk cost fallacy is a cognitive bias where past investments (time, money, effort, emotion) irrationally influence your decision to continue something. The more you've put in, the harder it becomes to walk away, even when continuing makes no logical sense. Your brain treats past costs as future reasons, turning every investment into a chain.",
      howItShowsUp:
        "You stay in a dead-end job because you've been there five years. You finish a terrible book because you're halfway through. You keep repairing a car that costs more in maintenance than it's worth. You maintain a friendship that drains you because of \"all the history.\" In relationships, the spiral is devastating. Years invested become reasons to endure mistreatment. In business, failed projects receive more funding precisely because they've already consumed so much.",
      hiddenCost:
        "The spiral doesn't just waste resources. It consumes the future. Every hour spent continuing something you should have abandoned is an hour stolen from something that could actually work. The hidden cost isn't what you've already lost. It's what you'll never start because you're too busy justifying what you should have left behind. Over time, the spiral erodes your ability to make clear decisions at all, because every choice carries the weight of everything that came before it.",
      whatItProtects:
        "The sunk cost spiral protects you from the pain of admitting waste. Walking away means accepting that your past investment was, in some sense, meaningless. The ego cannot tolerate this easily. By continuing, you maintain the illusion that everything you've done had purpose. The spiral protects you from grief: the grief of time lost, potential wasted, and the terrifying freedom of starting over.",
    },
    publishedAt: "2025-01-15",
    relatedSlugs: ["confirmation-cage", "anchoring-abyss", "normalcy-veil"],
  },
  {
    slug: "confirmation-cage",
    title: "The Confirmation Cage",
    subtitle: "Case File #002: Selective Evidence Processing",
    tagline: "You only see what you already believe.",
    summary:
      "Confirmation bias isn't just a flaw in reasoning. It's an architecture of self-deception. The mind doesn't search for truth. It searches for agreement. And it's terrifyingly efficient at finding it. Every piece of information you encounter passes through an invisible filter. Evidence that supports your existing beliefs slides through effortlessly. Evidence that contradicts them meets resistance, scrutiny, and ultimately dismissal. You don't notice this process. That's what makes it a cage.\n\nConsider how you read the news. You gravitate toward sources that echo your worldview. When you encounter a dissenting perspective, your first instinct isn't curiosity. It's defense. You look for flaws, for reasons to reject it. This isn't critical thinking. It's intellectual self-preservation.\n\nThe cage tightens with every confirmation. Social media algorithms accelerate the process, feeding you an endless stream of agreement. Your beliefs calcify. Your world shrinks. You become more certain and less correct simultaneously. The most dangerous aspect of the confirmation cage is that intelligence doesn't protect you. Smarter people are often better at rationalizing their biases.\n\nEscaping requires deliberate discomfort. Seek out the strongest arguments against your beliefs. Ask yourself regularly: \"What evidence would change my mind?\" If you can't answer that question, you're not holding a belief. A belief is holding you. The cage is invisible. The bars are made of everything you're certain about.",
    sections: {
      whatItIs:
        "Confirmation bias is the mind's tendency to favor information that confirms pre-existing beliefs while dismissing contradictory evidence. It's not a conscious choice. It's an automatic filtering system baked into cognition. Your brain literally processes agreeable information faster and with less scrutiny than disagreeable information. It shapes what you notice, what you remember, and what you consider credible.",
      howItShowsUp:
        "You read a news headline and immediately know whether it's \"true\" based on whether it fits your worldview. You hire people who remind you of yourself. You argue with your partner by remembering every example that proves your point while forgetting every example that disproves it. Online, algorithms create feedback loops: you click what you agree with, platforms show you more of it, and your worldview narrows without you realizing. In medicine, doctors anchor on initial diagnoses and filter subsequent symptoms to match.",
      hiddenCost:
        "The cage makes you progressively more wrong while feeling progressively more right. Relationships fracture because you only see evidence of your partner's flaws. Businesses fail because leaders filter market signals through existing strategy. Societies polarize because everyone is consuming different curated realities. The deepest cost is the death of curiosity. Once the cage is sealed, you stop asking genuine questions because you already believe you have the answers.",
      whatItProtects:
        "The confirmation cage protects your identity. Your beliefs aren't just ideas. They're the scaffolding of who you think you are. Contradictory evidence doesn't just challenge a position; it threatens your sense of self. The cage keeps your world coherent and predictable. Without it, you'd have to tolerate ambiguity, uncertainty, and the exhausting possibility that you might be fundamentally wrong about things that matter to you.",
    },
    publishedAt: "2025-02-01",
    relatedSlugs: ["sunk-cost-spiral", "dunning-kruger-mirror", "halo-distortion"],
  },
  {
    slug: "dunning-kruger-mirror",
    title: "The Dunning-Kruger Mirror",
    subtitle: "Case File #003: The Competence Illusion",
    tagline: "The less you know, the more you think you see.",
    summary:
      "There is a particular cruelty in the Dunning-Kruger effect: the people most afflicted by incompetence are the least equipped to recognize it. The mirror doesn't reflect reality. It reflects confidence, and confidence is cheapest when knowledge is thinnest. The pattern is deceptively simple. When you know almost nothing about a subject, you lack the tools to evaluate your own ignorance. You don't know what you don't know. So you feel competent.\n\nThis creates a world where the loudest voices in any room are often the least informed. Social media amplifies this exponentially. A person who read one article on economics feels qualified to declare economic theory dead. A weekend meditation practitioner pronounces themselves spiritually awakened. The expert who spent decades studying the nuance stays quiet, aware of how much they still don't understand.\n\nThe mirror is dangerous because it inverts everything. The ignorant feel wise. The wise feel ignorant. And everyone watching has to decide who to trust: the confident voice or the hesitant one.\n\nBreaking the mirror requires intellectual humility, a willingness to sit with the uncomfortable truth that your current understanding might be catastrophically incomplete. The antidote isn't less confidence. It's calibrated confidence. Know what you know. Know what you don't. And be honest about the difference. The mirror lies most convincingly to those who stare into it the longest.",
    sections: {
      whatItIs:
        "The Dunning-Kruger effect is a cognitive bias where people with limited knowledge or skill in a domain dramatically overestimate their competence, while true experts tend to underestimate theirs. It's not about stupidity. It's about metacognition. To accurately judge your skill level, you need the very skills you lack. The result is a distorted mirror: beginners see experts, and experts see beginners.",
      howItShowsUp:
        "The new investor who calls themselves a trading genius after one lucky month. The first-year medical student who diagnoses everyone at dinner. The manager who took one leadership seminar and now overhauls the entire team's workflow. It shows up in comment sections, where people with no domain expertise argue confidently with specialists. It shows up in hiring, where unqualified candidates project the most confidence. And it shows up in you, in every field where you feel certain but haven't done the deep work.",
      hiddenCost:
        "The mirror prevents growth. If you already believe you're competent, you have no reason to improve. Learning requires acknowledging a gap between where you are and where you could be, and the mirror erases that gap. On a societal level, the cost is the elevation of confident ignorance over quiet expertise. Policy gets shaped by the loudest voice, not the most informed one. Decisions get made by people who don't know enough to know they're making mistakes.",
      whatItProtects:
        "The mirror protects you from the vertigo of genuine understanding. True competence reveals how vast and complex any domain really is, and that revelation can be paralyzing. The Dunning-Kruger mirror lets you operate with comfortable certainty. It protects you from the humility required to say \"I don't know,\" which, in most social environments, feels like weakness. The mirror lets you feel powerful in a world that rewards confidence over accuracy.",
    },
    publishedAt: "2025-02-20",
    relatedSlugs: ["confirmation-cage", "anchoring-abyss", "halo-distortion"],
  },
  {
    slug: "anchoring-abyss",
    title: "The Anchoring Abyss",
    subtitle: "Case File #004: First-Number Domination",
    tagline: "The first number you hear controls every number after.",
    summary:
      "Anchoring is the invisible hand on the scale of every decision you make. The first piece of information you receive about anything (a price, a statistic, a judgment) becomes a reference point that distorts everything that follows. And you almost never realize it's happening. Walk into a store. The first jacket you see costs $2,000. The next one costs $400. Suddenly $400 feels reasonable, a deal. But without that $2,000 anchor, you might have balked.\n\nThe abyss runs deeper than shopping. Salary negotiations are shaped by the first number on the table. Legal judgments are influenced by the initial damages requested. Medical diagnoses are colored by the first symptom reported. In every case, the anchor drops, and your reasoning sinks with it.\n\nWhat makes anchoring so insidious is that awareness doesn't immunize you. Studies have shown that even when people are told about anchoring bias and warned to resist it, they still fall prey to it. The first number doesn't just influence your thinking. It becomes the foundation your thinking is built on.\n\nTo resist anchoring, you must actively generate your own reference points before encountering external ones. Research independently. Form preliminary judgments in isolation. And when someone offers you the first number, recognize it for what it is: not information, but influence. The first number you hear is rarely the truth. It's the beginning of a negotiation you didn't know you'd entered.",
    sections: {
      whatItIs:
        "Anchoring bias is the cognitive tendency to rely disproportionately on the first piece of information encountered when making decisions. This initial \"anchor\" creates a reference point that all subsequent judgments are adjusted from, but the adjustments are almost always insufficient. Even completely arbitrary anchors measurably influence decisions in experiments. Your rational mind adjusts from the anchor, but never escapes it.",
      howItShowsUp:
        "A car dealership shows you the most expensive model first. A restaurant puts the $60 steak at the top of the menu so the $35 fish feels like a bargain. During salary negotiations, whoever names a number first sets the entire range. In courtrooms, prosecutors who request higher sentences get higher sentences, even when judges know they should ignore the request. You even anchor against yourself: if you expected a task to take an hour, you'll feel behind at 90 minutes even if the task legitimately requires three hours.",
      hiddenCost:
        "Anchoring warps your baseline reality. Over time, anchored decisions compound. You overpay for everything because the first price you saw was inflated. You undervalue your own work because your first salary was too low. Relationships suffer because the first impression, positive or negative, filters every future interaction. The abyss isn't the anchor itself. It's the invisible chain of distorted decisions that follow, each one built on a foundation you never chose.",
      whatItProtects:
        "Anchoring protects you from the cognitive cost of evaluating everything from scratch. Genuine independent judgment is exhausting. It requires research, comparison, and sustained mental effort for every single decision. The anchor gives you a starting point, a shortcut through complexity. It protects you from the overwhelming paralysis of having no reference frame at all. The problem is that the starting point was chosen for you, usually by someone who benefits from your destination.",
    },
    publishedAt: "2025-03-10",
    relatedSlugs: ["sunk-cost-spiral", "dunning-kruger-mirror", "normalcy-veil"],
  },
  {
    slug: "normalcy-veil",
    title: "The Normalcy Veil",
    subtitle: "Case File #005: Stability Assumption Bias",
    tagline: "Everything is fine. Until it isn't.",
    summary:
      "The normalcy bias is the mind's sedative. When faced with evidence that something catastrophic is approaching, the brain defaults to a comforting assumption: this has never happened before, so it probably won't happen now. It's a veil draped over reality, transforming clear danger into background noise. History is littered with its victims. Residents who refused to evacuate before hurricanes. Investors who ignored every warning sign before market crashes.\n\nThe mechanism is evolutionary. For most of human history, dramatic change was rare. The brain learned to assume stability because stability was the norm. But we no longer live in that world. Change is constant, exponential, and often catastrophic. The brain hasn't caught up.\n\nWhat makes the normalcy veil particularly dangerous is its social reinforcement. When everyone around you is calm, your own alarm bells get muted. You look to others for cues about how to react, and when they're all wearing the same veil, collective denial becomes indistinguishable from collective wisdom.\n\nThe veil thickens with comfort. The more stable your life has been, the harder it becomes to imagine disruption. Prosperity becomes its own trap, breeding a fragility that only reveals itself when the disruption finally arrives. Piercing the veil doesn't mean living in fear. It means maintaining a clear-eyed relationship with probability. The veil is comfortable. Reality is not. Choose which one you'd rather face on your own terms.",
    sections: {
      whatItIs:
        "Normalcy bias is the cognitive tendency to underestimate the likelihood and impact of unprecedented events. The brain uses past experience as a template for the future, and when the past has been stable, it projects that stability forward, even in the face of clear warning signs. It's not optimism; it's a failure of imagination. The mind literally cannot process that the rules have changed until it's too late.",
      howItShowsUp:
        "People in the path of a hurricane who refuse to evacuate because \"it's never been that bad here.\" Employees who ignore layoff rumors because \"this company has always been stable.\" Partners who dismiss escalating red flags because \"they would never actually do that.\" Investors who hold through a market crash because \"it always comes back.\" The veil shows up wherever past stability creates a false sense of future safety.",
      hiddenCost:
        "The normalcy veil doesn't just delay your response. It eliminates preparation entirely. When you assume stability, you don't build contingency plans, emergency funds, or exit strategies. When disruption arrives, you're not just caught off guard. You're completely unequipped. The hidden cost compounds socially: entire communities wrapped in the veil reinforce each other's denial, creating collective vulnerability. The cost isn't just personal damage. It's the lost opportunity to have been ready.",
      whatItProtects:
        "The veil protects you from anxiety. If you truly internalized the probability of catastrophic events (natural disasters, economic collapse, personal betrayal) daily life would become unbearable. The normalcy veil lets you function by filtering out threats that feel too large to prepare for. It protects your sense of control in a world that offers very little. Removing the veil means accepting vulnerability, and vulnerability is something the human psyche fights against with everything it has.",
    },
    publishedAt: "2025-04-05",
    relatedSlugs: ["confirmation-cage", "sunk-cost-spiral", "halo-distortion"],
  },
  {
    slug: "halo-distortion",
    title: "The Halo Distortion",
    subtitle: "Case File #006: Single-Trait Generalization",
    tagline: "One good trait blinds you to everything else.",
    summary:
      "The halo effect is a cognitive shortcut that transforms a single positive impression into a blanket judgment. Someone is attractive, so they must be intelligent. A company produces one great product, so all their products must be great. A person is charming, so they must be trustworthy. One light blinds you to every shadow.\n\nThis distortion operates beneath conscious awareness. You don't decide to judge attractive people as more competent. Your brain does it automatically, and then constructs rationalizations to support the conclusion. It's not lazy thinking. It's the brain's efficiency turned against you.\n\nThe halo distortion shapes entire industries. Marketing depends on it. Celebrity endorsements work because the halo of fame transfers to products that have nothing to do with the celebrity's expertise. Political campaigns understand that likability often matters more than policy. The distortion is a feature of human cognition that others have learned to exploit.\n\nIn personal relationships, the halo effect can be devastating. The early glow of attraction creates a comprehensive positive impression that can take months or years to fade. Red flags get reinterpreted. Concerning behaviors get excused. The halo doesn't just color perception. It rewrites it. Resisting the distortion requires separating traits. Judge competence independently from likability. Not every light is a sun. Some are just reflections.",
    sections: {
      whatItIs:
        "The halo effect is a cognitive bias where a single positive trait (attractiveness, charisma, status, one impressive achievement) creates a \"halo\" that colors your entire perception of a person or entity. Your brain generalizes from one data point to every data point, assuming that excellence in one area implies excellence in all areas. The reverse (the horn effect) does the same with negative traits. Both operate automatically, beneath conscious awareness.",
      howItShowsUp:
        "Attractive defendants receive lighter sentences. Tall people are disproportionately represented in CEO positions. A teacher who likes a student's first essay grades their subsequent work more favorably. Brands leverage the halo relentlessly. Apple's reputation for design makes people assume their pricing is fair. In relationships, the early infatuation phase creates a halo so strong that genuine red flags get reinterpreted as charming quirks. The effect is everywhere: job interviews, political campaigns, and every first impression you've ever formed.",
      hiddenCost:
        "The halo distortion prevents accurate judgment. You trust people you shouldn't because they're likable. You invest in companies because of their brand rather than their fundamentals. You stay in relationships long past the point of health because the original glow hasn't faded from memory. On a societal level, the halo elevates style over substance: charismatic leaders over competent ones, attractive candidates over qualified ones. The cost is a world where appearance consistently triumphs over reality.",
      whatItProtects:
        "The halo protects you from the overwhelming complexity of complete evaluation. Truly assessing every trait of every person or product independently would be cognitively exhausting and socially paralyzing. The halo provides a shortcut: if this one thing is good, everything is probably good. It lets you make quick social judgments, form alliances, and navigate a complex world without drowning in analysis. The halo also protects your emotional investments. Once you've decided someone is good, the halo prevents the painful work of discovering they might not be.",
    },
    publishedAt: "2025-05-01",
    relatedSlugs: ["dunning-kruger-mirror", "normalcy-veil", "confirmation-cage"],
  },
];

export function getTrapBySlug(slug: string): Trap | undefined {
  return traps.find((t) => t.slug === slug);
}

export function getRelatedTraps(trap: Trap): Trap[] {
  return trap.relatedSlugs
    .map((s) => getTrapBySlug(s))
    .filter((t): t is Trap => t !== undefined);
}
