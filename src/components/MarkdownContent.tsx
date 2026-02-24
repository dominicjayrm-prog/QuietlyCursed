/**
 * Lightweight Markdown renderer.
 * Supports: headings (##, ###), bold (**), italic (*), links [text](url),
 * paragraphs, blockquotes (>), horizontal rules (---), and inline code (`).
 */
export default function MarkdownContent({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split("\n");
  const blocks: { type: string; content: string }[] = [];
  let current = "";

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      if (current) {
        blocks.push({ type: "p", content: current });
        current = "";
      }
      continue;
    }

    if (trimmed === "---" || trimmed === "***") {
      if (current) {
        blocks.push({ type: "p", content: current });
        current = "";
      }
      blocks.push({ type: "hr", content: "" });
      continue;
    }

    if (trimmed.startsWith("### ")) {
      if (current) {
        blocks.push({ type: "p", content: current });
        current = "";
      }
      blocks.push({ type: "h3", content: trimmed.slice(4) });
      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (current) {
        blocks.push({ type: "p", content: current });
        current = "";
      }
      blocks.push({ type: "h2", content: trimmed.slice(3) });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      if (current) {
        blocks.push({ type: "p", content: current });
        current = "";
      }
      blocks.push({ type: "blockquote", content: trimmed.slice(2) });
      continue;
    }

    current += (current ? " " : "") + trimmed;
  }
  if (current) blocks.push({ type: "p", content: current });

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === "hr") {
          return (
            <hr
              key={i}
              className="border-white/5 my-8"
            />
          );
        }
        if (block.type === "h2") {
          return (
            <h2
              key={i}
              className="text-xl font-semibold text-cyan-400 md:text-2xl mt-10 mb-4 flex items-center gap-3"
            >
              <span
                className="inline-block h-px w-6 bg-cyan-500/40"
                aria-hidden
              />
              {block.content}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={i}
              className="text-lg font-semibold text-white/80 mt-8 mb-3"
            >
              {block.content}
            </h3>
          );
        }
        if (block.type === "blockquote") {
          return (
            <blockquote
              key={i}
              className="border-l-2 border-cyan-500/30 pl-5 text-base italic text-white/45 leading-[1.8]"
            >
              <InlineMarkdown text={block.content} />
            </blockquote>
          );
        }
        return (
          <p
            key={i}
            className="text-base leading-[1.8] text-white/60 md:text-lg"
          >
            <InlineMarkdown text={block.content} />
          </p>
        );
      })}
    </div>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  // Process inline markdown: bold, italic, code, links
  const parts: (string | React.ReactElement)[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Link: [text](url)
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic: *text* (but not **)
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    // Code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/);

    // Find the earliest match
    const matches = [
      linkMatch ? { type: "link", match: linkMatch } : null,
      boldMatch ? { type: "bold", match: boldMatch } : null,
      italicMatch ? { type: "italic", match: italicMatch } : null,
      codeMatch ? { type: "code", match: codeMatch } : null,
    ]
      .filter(Boolean)
      .sort((a, b) => (a!.match.index ?? 0) - (b!.match.index ?? 0));

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const first = matches[0]!;
    const idx = first.match.index ?? 0;

    if (idx > 0) {
      parts.push(remaining.slice(0, idx));
    }

    if (first.type === "link") {
      parts.push(
        <a
          key={key++}
          href={first.match[2]}
          className="text-cyan-400/80 underline underline-offset-2 hover:text-cyan-400 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {first.match[1]}
        </a>
      );
    } else if (first.type === "bold") {
      parts.push(
        <strong key={key++} className="font-semibold text-white/80">
          {first.match[1]}
        </strong>
      );
    } else if (first.type === "italic") {
      parts.push(
        <em key={key++} className="italic text-white/50">
          {first.match[1]}
        </em>
      );
    } else if (first.type === "code") {
      parts.push(
        <code
          key={key++}
          className="rounded bg-white/5 px-1.5 py-0.5 text-sm text-cyan-400/80 font-mono"
        >
          {first.match[1]}
        </code>
      );
    }

    remaining = remaining.slice(idx + first.match[0].length);
  }

  return <>{parts}</>;
}
