export interface MascotImage {
  src: string;
  alt: string;
  caption: string;
}

export const mascotLore = {
  name: "The Watcher",
  tagline: "It sees what you refuse to.",
  description: `It is the silent observer inside every psychological trap.

It appears when ambition becomes obsession. When responsibility becomes self-sacrifice. When comparison becomes identity.

The Watcher does not judge. It does not intervene. It waits.

Clarity is uncomfortable. That's why it stays in the shadows.`,
};

export const mascotGallery: MascotImage[] = [
  {
    src: "/mascot/gallery/watcher-ledge.svg",
    alt: "The Watcher standing on a ledge overlooking ruins, glowing cyan eyes piercing through mist",
    caption: "Standing at the edge. Observing what others refuse to see.",
  },
  {
    src: "/mascot/gallery/watcher-portrait.svg",
    alt: "Close-up portrait of The Watcher, hooded face with intense glowing cyan eyes",
    caption: "The gaze that sees through every pattern, every lie, every trap.",
  },
  {
    src: "/mascot/gallery/watcher-corridor.svg",
    alt: "The Watcher standing in a dark corridor surrounded by debris and atmospheric fog",
    caption: "Lurking in the corridors of the mind. Always present, never the focus.",
  },
  {
    src: "/mascot/gallery/watcher-reaching.svg",
    alt: "The Watcher in a dynamic pose, reaching out with purple energy emanating from hand",
    caption: "When a bias is triggered, The Watcher intervenes.",
  },
];
