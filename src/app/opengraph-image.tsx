import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Quietly Cursed — Psychological Atlas of Mind Traps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #171717 50%, #0a0a0a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Eye icon */}
        <div
          style={{
            fontSize: 64,
            marginBottom: 24,
            display: "flex",
          }}
        >
          👁️
        </div>
        {/* Site name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.025em",
            marginBottom: 16,
            display: "flex",
          }}
        >
          Quietly Cursed
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(34, 211, 238, 0.8)",
            fontWeight: 500,
            display: "flex",
          }}
        >
          Psychological Atlas of Mind Traps
        </div>
        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #22d3ee, transparent)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
