"use client";

interface EyeGlowProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { eye: 6, gap: 14, viewBox: "0 0 40 20" },
  md: { eye: 10, gap: 24, viewBox: "0 0 64 32" },
  lg: { eye: 16, gap: 40, viewBox: "0 0 100 48" },
};

export default function EyeGlow({ size = "md", className = "" }: EyeGlowProps) {
  const s = sizes[size];
  const cy = Number(s.viewBox.split(" ")[3]) / 2;
  const cx1 = Number(s.viewBox.split(" ")[2]) / 2 - s.gap / 2;
  const cx2 = Number(s.viewBox.split(" ")[2]) / 2 + s.gap / 2;

  return (
    <svg
      viewBox={s.viewBox}
      className={`animate-eye-pulse ${className}`}
      aria-hidden
    >
      <defs>
        <radialGradient id={`glow-${size}`}>
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx1} cy={cy} r={s.eye} fill={`url(#glow-${size})`} />
      <circle cx={cx2} cy={cy} r={s.eye} fill={`url(#glow-${size})`} />
    </svg>
  );
}
