/**
 * Renders TipTap JSON content into SEO-friendly React elements.
 * Outputs real heading tags, paragraph tags, etc. for search engines.
 */

interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
}

interface Props {
  content: { type: string; content?: TipTapNode[] };
}

export default function RichContentRenderer({ content }: Props) {
  if (!content?.content) return null;
  return (
    <div className="space-y-6">
      {content.content.map((node, i) => (
        <RenderNode key={i} node={node} />
      ))}
    </div>
  );
}

function RenderNode({ node }: { node: TipTapNode }) {
  switch (node.type) {
    case "heading":
      return <Heading node={node} />;
    case "paragraph":
      return (
        <p className="text-base leading-[1.8] text-white/60 md:text-lg">
          <InlineContent content={node.content} />
        </p>
      );
    case "bulletList":
      return (
        <ul className="list-disc space-y-1 pl-6 text-base leading-[1.8] text-white/60 md:text-lg">
          {node.content?.map((li, i) => (
            <li key={i}>
              <InlineContent content={li.content?.[0]?.content} />
            </li>
          ))}
        </ul>
      );
    case "orderedList":
      return (
        <ol className="list-decimal space-y-1 pl-6 text-base leading-[1.8] text-white/60 md:text-lg">
          {node.content?.map((li, i) => (
            <li key={i}>
              <InlineContent content={li.content?.[0]?.content} />
            </li>
          ))}
        </ol>
      );
    case "blockquote":
      return (
        <blockquote className="border-l-2 border-cyan-500/30 pl-5 text-base italic text-white/45 leading-[1.8]">
          {node.content?.map((child, i) => (
            <RenderNode key={i} node={child} />
          ))}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre className="overflow-x-auto rounded-lg bg-white/5 p-4 text-sm font-mono text-cyan-400/80 leading-relaxed">
          <code>
            {node.content?.map((c) => c.text).join("") ?? ""}
          </code>
        </pre>
      );
    case "horizontalRule":
      return <hr className="border-white/5 my-8" />;
    case "youtube": {
      const src = node.attrs?.src as string | undefined;
      if (!src) return null;
      // Extract video ID from any YouTube URL format
      const idMatch = src.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
      );
      const videoId = idMatch?.[1];
      if (!videoId) return null;
      return (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/5">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );
    }
    case "image": {
      const src = node.attrs?.src as string | undefined;
      const alt = (node.attrs?.alt as string) || "";
      if (!src) return null;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full rounded-xl border border-white/5"
            loading="lazy"
          />
          {alt && (
            <figcaption className="mt-2 text-center text-xs text-white/30">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    }
    default:
      return null;
  }
}

function Heading({ node }: { node: TipTapNode }) {
  const level = (node.attrs?.level as number) ?? 2;
  const children = <InlineContent content={node.content} />;

  if (level === 1) {
    return (
      <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl mt-10 mb-4">
        {children}
      </h1>
    );
  }
  if (level === 2) {
    return (
      <h2 className="text-xl font-semibold text-cyan-400 md:text-2xl mt-10 mb-4 flex items-center gap-3">
        <span className="inline-block h-px w-6 bg-cyan-500/40" aria-hidden />
        {children}
      </h2>
    );
  }
  return (
    <h3 className="text-lg font-semibold text-white/80 mt-8 mb-3">
      {children}
    </h3>
  );
}

function InlineContent({ content }: { content?: TipTapNode[] }) {
  if (!content) return null;
  return (
    <>
      {content.map((node, i) => {
        if (node.type === "text") {
          return <InlineText key={i} node={node} />;
        }
        if (node.type === "hardBreak") {
          return <br key={i} />;
        }
        return null;
      })}
    </>
  );
}

function InlineText({ node }: { node: TipTapNode }) {
  let el: React.ReactNode = node.text ?? "";

  if (node.marks) {
    for (const mark of node.marks) {
      switch (mark.type) {
        case "bold":
          el = <strong className="font-semibold text-white/80">{el}</strong>;
          break;
        case "italic":
          el = <em className="italic text-white/50">{el}</em>;
          break;
        case "underline":
          el = <span className="underline underline-offset-2">{el}</span>;
          break;
        case "code":
          el = (
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-sm text-cyan-400/80 font-mono">
              {el}
            </code>
          );
          break;
        case "link": {
          const href = (mark.attrs?.href as string) ?? "#";
          el = (
            <a
              href={href}
              className="text-cyan-400/80 underline underline-offset-2 hover:text-cyan-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {el}
            </a>
          );
          break;
        }
      }
    }
  }

  return <>{el}</>;
}
