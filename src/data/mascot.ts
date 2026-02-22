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
    src: "/mascot/watcher-default.svg",
    alt: "The Watcher — default pose with glowing cyan eyes",
    caption: "The default silhouette. Cyan eyes, purple mind.",
  },
  {
    src: "/mascot/watcher-watching.svg",
    alt: "The Watcher observing from the shadows",
    caption: "Lurking at the edges. Always present, never the focus.",
  },
  {
    src: "/mascot/watcher-glitch.svg",
    alt: "The Watcher glitching — distorted silhouette",
    caption: "When a bias is triggered, The Watcher distorts.",
  },
  {
    src: "/mascot/watcher-emblem.svg",
    alt: "The Watcher emblem — brain symbol with eye motif",
    caption: "The emblem. Clarity and complexity intertwined.",
  },
];
