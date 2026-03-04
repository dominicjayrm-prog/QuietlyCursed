"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0a0a0a", color: "#ededed", fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                marginBottom: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(34,211,238,0.6)",
              }}
            >
              Critical Error
            </p>
            <h1 style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: 700 }}>
              Something went wrong
            </h1>
            <p style={{ marginBottom: "2rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>
              The application encountered a critical error. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                padding: "0.625rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#22d3ee",
                background: "rgba(34,211,238,0.1)",
                border: "1px solid rgba(34,211,238,0.3)",
                borderRadius: "9999px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
