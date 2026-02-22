"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback, useState } from "react";

export type TipTapJSON = {
  type: "doc";
  content: Record<string, unknown>[];
};

interface RichTextEditorProps {
  initialContent?: TipTapJSON | null;
  onChange: (json: TipTapJSON) => void;
  placeholder?: string;
}

function ToolbarBtn({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded px-2 py-1.5 text-xs transition-colors cursor-pointer ${
        active
          ? "bg-cyan-500/20 text-cyan-400"
          : "text-white/40 hover:bg-white/10 hover:text-white/60"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const [panel, setPanel] = useState<"link" | "youtube" | "image" | null>(null);
  const [inputVal, setInputVal] = useState("");

  const togglePanel = (p: "link" | "youtube" | "image") => {
    setPanel(panel === p ? null : p);
    setInputVal("");
  };

  const applyLink = useCallback(() => {
    if (!inputVal) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: inputVal }).run();
    }
    setPanel(null);
    setInputVal("");
  }, [editor, inputVal]);

  const embedYoutube = useCallback(() => {
    if (inputVal) editor.commands.setYoutubeVideo({ src: inputVal });
    setPanel(null);
    setInputVal("");
  }, [editor, inputVal]);

  const insertImage = useCallback(() => {
    if (inputVal) editor.chain().focus().setImage({ src: inputVal }).run();
    setPanel(null);
    setInputVal("");
  }, [editor, inputVal]);

  return (
    <div className="border-b border-white/10 bg-white/[0.02]">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5">
        {/* Headings */}
        <ToolbarBtn title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolbarBtn>
        <ToolbarBtn title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarBtn>

        <div className="mx-1 h-5 w-px bg-white/10" />

        {/* Inline */}
        <ToolbarBtn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></ToolbarBtn>
        <ToolbarBtn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></ToolbarBtn>
        <ToolbarBtn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><span className="underline">U</span></ToolbarBtn>
        <ToolbarBtn title="Inline Code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>{"</>"}</ToolbarBtn>

        <div className="mx-1 h-5 w-px bg-white/10" />

        {/* Lists */}
        <ToolbarBtn title="Bullet List" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Ordered List" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
        </ToolbarBtn>

        <div className="mx-1 h-5 w-px bg-white/10" />

        {/* Block */}
        <ToolbarBtn title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Code Block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"{ }"}</ToolbarBtn>
        <ToolbarBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</ToolbarBtn>

        <div className="mx-1 h-5 w-px bg-white/10" />

        {/* Inserts */}
        <ToolbarBtn title="Link" active={editor.isActive("link")} onClick={() => { if (editor.isActive("link")) { editor.chain().focus().unsetLink().run(); } else { togglePanel("link"); } }}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="YouTube Video" onClick={() => togglePanel("youtube")}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Image" onClick={() => togglePanel("image")}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
        </ToolbarBtn>

        <div className="mx-1 h-5 w-px bg-white/10" />

        {/* Undo/Redo */}
        <ToolbarBtn title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>
        </ToolbarBtn>
        <ToolbarBtn title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.13-9.36L23 10" /></svg>
        </ToolbarBtn>
      </div>

      {/* Input panels */}
      {panel && (
        <div className="flex items-center gap-2 border-t border-white/5 px-3 py-2">
          <span className="text-[10px] uppercase tracking-wider text-white/30">
            {panel === "link" ? "URL" : panel === "youtube" ? "YouTube" : "Image URL"}
          </span>
          <input
            type="url"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              panel === "link"
                ? "https://example.com"
                : panel === "youtube"
                ? "https://youtube.com/watch?v=..."
                : "https://example.com/image.jpg"
            }
            className="flex-1 rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (panel === "link") applyLink();
                else if (panel === "youtube") embedYoutube();
                else insertImage();
              }
            }}
            autoFocus
          />
          <button
            onClick={() => {
              if (panel === "link") applyLink();
              else if (panel === "youtube") embedYoutube();
              else insertImage();
            }}
            className="rounded bg-cyan-500/20 px-3 py-1.5 text-xs text-cyan-400 hover:bg-cyan-500/30 cursor-pointer"
          >
            {panel === "link" ? "Apply" : panel === "youtube" ? "Embed" : "Insert"}
          </button>
          <button onClick={() => setPanel(null)} className="text-xs text-white/30 hover:text-white/50 cursor-pointer">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default function RichTextEditor({
  initialContent,
  onChange,
  placeholder = "Start writing your article...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-cyan-400 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg mx-auto max-w-full" },
      }),
      Youtube.configure({
        HTMLAttributes: { class: "rounded-lg overflow-hidden mx-auto" },
        width: 640,
        height: 360,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: initialContent ?? { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none px-4 py-4 min-h-[320px] focus:outline-none text-white/70 " +
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4 " +
          "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-cyan-400 [&_h2]:mt-6 [&_h2]:mb-3 " +
          "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white/80 [&_h3]:mt-5 [&_h3]:mb-2 " +
          "[&_p]:leading-relaxed [&_p]:mb-3 " +
          "[&_blockquote]:border-l-2 [&_blockquote]:border-cyan-500/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/45 " +
          "[&_code]:bg-white/5 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-cyan-400/80 [&_code]:font-mono [&_code]:text-sm " +
          "[&_pre]:bg-white/5 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto " +
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 " +
          "[&_li]:mb-1 " +
          "[&_hr]:border-white/10 [&_hr]:my-8 " +
          "[&_a]:text-cyan-400 [&_a]:underline " +
          "[&_img]:rounded-lg [&_img]:mx-auto [&_img]:max-w-full " +
          "[&_.tiptap.ProseMirror_p.is-editor-empty:first-child::before]:text-white/20",
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getJSON() as TipTapJSON);
    },
    immediatelyRender: false,
  });

  // Sync content when switching between posts
  useEffect(() => {
    if (editor && initialContent) {
      const cur = JSON.stringify(editor.getJSON());
      const next = JSON.stringify(initialContent);
      if (cur !== next) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [editor, initialContent]);

  if (!editor) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center text-sm text-white/20">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
