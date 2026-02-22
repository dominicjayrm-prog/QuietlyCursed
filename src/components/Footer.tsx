import BrainIcon from "./BrainIcon";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40">
        <div className="flex items-center gap-2">
          <BrainIcon className="w-5 h-5 text-purple-500/60" />
          <span>&copy; {new Date().getFullYear()} Quietly Cursed</span>
        </div>
        <p className="text-center md:text-right max-w-md">
          A psychological atlas. Every trap described here lives inside you.
        </p>
      </div>
    </footer>
  );
}
