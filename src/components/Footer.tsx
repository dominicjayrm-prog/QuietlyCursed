import BrainIcon from "./BrainIcon";
import { getSocialLinks } from "@/lib/settings";

export default async function Footer() {
  let socials = { twitter: null as string | null, youtube: null as string | null };
  try {
    socials = await getSocialLinks();
  } catch {
    // Settings table may not exist yet
  }

  return (
    <footer className="border-t border-white/5 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40">
        <div className="flex items-center gap-2">
          <BrainIcon className="w-5 h-5 text-purple-500/60" />
          <span>&copy; {new Date().getFullYear()} Quietly Cursed</span>
        </div>
        <div className="flex items-center gap-4">
          {socials.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="text-white/30 transition-colors hover:text-cyan-400"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          )}
          {socials.youtube && (
            <a
              href={socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-white/30 transition-colors hover:text-cyan-400"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          )}
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
