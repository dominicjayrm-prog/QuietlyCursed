export interface MascotImage {
  src: string;
  alt: string;
  caption: string;
}

export const mascotLore = {
  name: "The Watcher",
  tagline: "It sees what you refuse to.",
  description: `The Watcher is the silent mascot of Quietly Cursed — a shadowed figure with glowing cyan eyes and a faintly pulsing purple brain symbol etched into its silhouette. It doesn't speak. It doesn't judge. It simply observes.

Born from the idea that our greatest psychological traps are invisible to us while being painfully obvious to an outside observer, The Watcher represents that outside perspective. It's the part of your mind that knows you're falling into a pattern but can't quite reach the controls.

The cyan glow of its eyes represents clarity — the cold, unblinking awareness of truth. The purple brain symbol represents the complexity of the mind that creates these traps in the first place. Together, they form the central tension of Quietly Cursed: the war between what you see and what you refuse to see.

The Watcher appears throughout the channel's content — lurking in thumbnails, watching from the margins of essays, occasionally flickering in the background of videos. It's never the focus. It's always present. Just like the biases it represents.`,
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
