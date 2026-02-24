import BrainIcon from "./BrainIcon";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40">
        <div className="flex items-center gap-2">
          <BrainIcon className="w-5 h-5 text-purple-500/60" />
          <span>&copy; {new Date().getFullYear()} Quietly Cursed</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/rss.xml"
            aria-label="RSS Feed"
            className="text-white/30 transition-colors hover:text-cyan-400"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
            </svg>
          </a>
          <p className="text-center md:text-right max-w-md">
            A psychological atlas. Every trap described here lives inside you.
          </p>
        </div>
      </div>
    </footer>
  );
}
