import Link from "next/link";
import type { Trap } from "@/data/traps";
import BrainIcon from "./BrainIcon";

interface TrapCardProps {
  trap: Trap;
}

export default function TrapCard({ trap }: TrapCardProps) {
  return (
    <Link
      href={`/atlas/${trap.slug}`}
      className="group relative block rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.04] hover:shadow-[0_0_40px_-12px_rgba(34,211,238,0.15)]"
    >
      <div className="mb-4 flex items-center gap-3">
        <BrainIcon className="w-5 h-5 text-purple-400/70 transition-colors group-hover:text-purple-400" />
        <time
          dateTime={trap.publishedAt}
          className="text-xs text-white/30 tracking-wider uppercase"
        >
          {new Date(trap.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white/90 transition-colors group-hover:text-cyan-400">
        {trap.title}
      </h3>
      <p className="text-sm leading-relaxed text-white/50">
        {trap.tagline}
      </p>
      <div className="mt-4 text-xs font-medium text-cyan-500/60 tracking-wider uppercase transition-colors group-hover:text-cyan-400">
        Enter trap &rarr;
      </div>
    </Link>
  );
}
