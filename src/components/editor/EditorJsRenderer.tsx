"use client";

import type React from "react";
import parse from "html-react-parser";

interface EditorJsRendererProps {
  data: any;
}

const EditorJsRenderer: React.FC<EditorJsRendererProps> = ({ data }) => {
  if (!data || !data.blocks) {
    return <div>No content to display</div>;
  }

  const renderBlock = (block: any) => {
    switch (block.type) {
      case "header":
        const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
        return <HeaderTag key={block.id}>{block.data.text}</HeaderTag>;

      case "paragraph":
        return <p key={block.id}>{parse(block.data.text)}</p>;

      case "list":
        const ListTag = block.data.style === "ordered" ? "ol" : "ul";
        return (
          <ListTag key={block.id}>
            {block.data.items.map((item: string, index: number) => (
              <li key={index}>{parse(item)}</li>
            ))}
          </ListTag>
        );

      case "checklist":
        return (
          <div key={block.id} className="checklist">
            {block.data.items.map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                  className="mt-1"
                />
                <div>{parse(item.text)}</div>
              </div>
            ))}
          </div>
        );

      case "quote":
        return (
          <blockquote
            key={block.id}
            className="border-l-4 border-gray-300 pl-4 italic"
          >
            <p>{parse(block.data.text)}</p>
            {block.data.caption && <cite>— {block.data.caption}</cite>}
          </blockquote>
        );

      case "image":
        return (
          <figure key={block.id} className="my-4">
            <img
              src={block.data.file.url || "/placeholder.svg"}
              alt={block.data.caption || "Image"}
              className="rounded-lg max-w-full"
            />
            {block.data.caption && (
              <figcaption className="text-center text-gray-500 mt-2">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );

      case "embed":
        return (
          <div key={block.id} className="embed-container my-4">
            <iframe
              src={block.data.embed}
              className="w-full"
              height="320"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            {block.data.caption && (
              <p className="text-center text-gray-500 mt-2">
                {block.data.caption}
              </p>
            )}
          </div>
        );

      case "code":
        return (
          <pre
            key={block.id}
            className="bg-gray-100 p-4 rounded-lg overflow-x-auto"
          >
            <code>{block.data.code}</code>
          </pre>
        );

      case "delimiter":
        return (
          <hr key={block.id} className="my-6 border-t-2 border-gray-200" />
        );

      case "table":
        return (
          <div key={block.id} className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border border-gray-300">
              <tbody>
                {block.data.content.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 p-2"
                      >
                        {parse(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div key={block.id} className="text-gray-500">
            Unsupported block type: {block.type}
          </div>
        );
    }
  };

  return (
    <div className="editor-js-renderer">{data.blocks.map(renderBlock)}</div>
  );
};

export default EditorJsRenderer;
