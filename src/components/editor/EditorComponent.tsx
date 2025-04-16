"use client";

import { uploadImageForEditor } from "@/lib/editor-image-upload";
import { OutputData } from "@editorjs/editorjs";
import { useEffect, useRef } from "react";

interface EditorProps {
  data?: OutputData | null;
  onChange?: (data: OutputData) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export default function EditorComponent({
  data,
  onChange,
  readOnly = false,
  placeholder = "Ink your thoughts...",
}: EditorProps) {
  const editorInstanceRef = useRef<any>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isInitializedRef.current || typeof window === "undefined") return;

    let isMounted = true;

    const initEditor = async () => {
      try {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const Image = (await import("@editorjs/image")).default;
        const Embed = (await import("@editorjs/embed")).default;
        const Table = (await import("@editorjs/table")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Code = (await import("@editorjs/code")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;
        const Marker = (await import("@editorjs/marker")).default;
        const Raw = (await import("@editorjs/raw")).default;
        const LinkTool = (await import("@editorjs/link")).default;

        if (!isMounted || !elementRef.current) return;

        const editor = new EditorJS({
          holder: elementRef.current,
          data: data || { blocks: [] },
          readOnly,
          placeholder,
          autofocus: true,
          tools: {
            header: {
              class: Header,
              config: {
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            },
            list: List,
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            image: {
              class: Image,
              config: {
                uploader: {
                  uploadByFile: uploadImageForEditor,
                },
                captionPlaceholder: "Image caption",
              },
            },
            embed: {
              class: Embed,
              config: {
                services: {
                  youtube: true,
                  twitter: true,
                  facebook: true,
                  instagram: true,
                  codepen: true,
                  bitly: true,
                },
                placeholder: "Paste a link to embed",
                captionPlaceholder: "Embed caption",
              },
            },
            table: {
              class: Table,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3,
                withHeadings: true,
              },
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: "Enter a quote",
                captionPlaceholder: "Quote's author",
              },
            },
            code: {
              class: Code,
              config: {
                placeholder: "Enter code",
              },
            },
            inlineCode: InlineCode,
            marker: {
              class: Marker,
              inlineToolbar: true,
              shortcut: "CTRL+SHIFT+M",
            },
            raw: {
              class: Raw,
              inlineToolbar: true,
              shortcut: "CTRL+ALT+R",
              config: {
                placeholder: "Enter raw HTML",
              },
            },
            linkTool: {
              class: LinkTool,
              config: {
                endpoint: "/api/editor/link", // Your backend endpoint for url data fetching
                field: "link",
                inputPlaceholder: "Paste a link to embed",
                captionPlaceholder: "Link caption",
              },
            },
          },
          onChange: async () => {
            if (editor && onChange) {
              try {
                const outputData = await editor.save();
                onChange(outputData);
              } catch (e) {
                console.error("Error saving editor data", e);
              }
            }
          },
          minHeight: 200,
        });

        editorInstanceRef.current = editor;
        isInitializedRef.current = true;
      } catch (error) {
        console.error("Error initializing Editor.js:", error);
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []);

  return (
    <div className="w-full rounded-lg border-2 border-dashed border-gray-300 py-8">
      <div ref={elementRef} className="w-full" />
    </div>
  );
}
