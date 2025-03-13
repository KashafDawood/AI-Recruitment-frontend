"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LinkIcon,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AILoadingAnimation } from "./ailoader";

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  showToolbar?: boolean;
  onAiGenerate?: () => void;
  isGenerating?: boolean;
}

export function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Start writing...",
  showToolbar = true,
  isGenerating,
  onAiGenerate,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "min-h-[150px] w-full rounded-md border-none bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  };

  return (
    <div className="rich-text-editor relative">
      {showToolbar && (
        <div className="toolbar bg-muted/40 rounded-t-md border border-b-0 border-border p-1 flex flex-wrap gap-1 items-center">
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            aria-label="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>

          <Separator orientation="vertical" className="h-6" />

          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 1 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            aria-label="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            aria-label="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("heading", { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            aria-label="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>

          <Separator orientation="vertical" className="h-6" />

          <Toggle
            size="sm"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            aria-label="Bullet List"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            aria-label="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>

          <Separator orientation="vertical" className="h-6" />

          <Toggle
            size="sm"
            pressed={editor.isActive("blockquote")}
            onPressedChange={() =>
              editor.chain().focus().toggleBlockquote().run()
            }
            aria-label="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("codeBlock")}
            onPressedChange={() =>
              editor.chain().focus().toggleCodeBlock().run()
            }
            aria-label="Code Block"
          >
            <Code className="h-4 w-4" />
          </Toggle>

          <Separator orientation="vertical" className="h-6" />

          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "left" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
            aria-label="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "center" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
            aria-label="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "right" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
            aria-label="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive({ textAlign: "justify" })}
            onPressedChange={() =>
              editor.chain().focus().setTextAlign("justify").run()
            }
            aria-label="Align Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Toggle>

          <Separator orientation="vertical" className="h-6" />

          <Popover>
            <PopoverTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive("link")}
                className="bg-muted/60 data-[state=on]:bg-muted"
                aria-label="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Toggle>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-popover">
              <div className="flex flex-col gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .unsetLink()
                        .run();
                      setLinkUrl("");
                    }}
                    disabled={!editor.isActive("link")}
                  >
                    Remove
                  </Button>
                  <Button size="sm" onClick={setLink}>
                    {editor.isActive("link") ? "Update" : "Add"} Link
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              aria-label="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              aria-label="Redo"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 100,
            placement: "bottom",
            offset: [0, 10],
          }}
          className="bg-gray-700 dark:bg-gray-200 dark:text-black text-white bg-background rounded-md shadow-md border border-border p-1 flex gap-1"
        >
          <Toggle
            size="sm"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            pressed={editor.isActive("underline")}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            aria-label="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Toggle>
        </BubbleMenu>
      )}

      <div
        className={`relative ${
          showToolbar
            ? "border border-t-0 border-border rounded-b-md"
            : "border border-border rounded-md border-gray-400 dark:border-gray-600"
        }`}
      >
        <div className="pb-12">
          {" "}
          {/* Add padding at the bottom to prevent text overlay */}
          <EditorContent editor={editor} />
        </div>

        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
            <div className="dark:text-white text-gray-800 p-4">
              <AILoadingAnimation />
            </div>
          </div>
        ) : (
          <Button
            onClick={onAiGenerate}
            className="absolute bottom-2 right-2 text-transparent bg-clip-text 
            bg-gradient-to-r from-pink-600 to-purple-700
            hover:from-purple-600 hover:to-pink-500 
            dark:text-pink-600
            dark:hover:text-purple-600
            p-0 shadow-none"
            size="sm"
            disabled={isGenerating}
            variant="link"
          >
            Generate using AI
          </Button>
        )}
      </div>

      <style jsx global>{`
        .ProseMirror {
          min-height: 150px;
          padding: 0.5rem;
          outline: none;
        }

        /* Add placeholder styling */
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        /* List styling */
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }

        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }

        /* Blockquote styling */
        .ProseMirror blockquote {
          border-left: 3px solid #e2e8f0;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
        }

        /* Code block styling */
        .ProseMirror pre {
          background-color: #f1f5f9;
          color: #334155;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-family: monospace;
          overflow-x: auto;
        }

        /* Heading styling */
        .ProseMirror h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        .ProseMirror h3 {
          font-size: 1.125rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }

        /* Paragraph spacing */
        .ProseMirror p {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        /* Sparkle loader animation - no longer needed */
        .sparkle-loader {
          display: flex;
          align-items: center;
        }

        .sparkle {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: white;
          margin: 0 2px;
          opacity: 0.6;
          animation: sparkle-pulse 1.5s infinite ease-in-out;
        }

        .sparkle:nth-child(1) {
          animation-delay: 0s;
        }

        .sparkle:nth-child(2) {
          animation-delay: 0.2s;
        }

        .sparkle:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes sparkle-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        /* New animation styles for the AILoadingAnimation */
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.95);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0);
            transform: translate(10px, -10px);
          }
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out forwards;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
