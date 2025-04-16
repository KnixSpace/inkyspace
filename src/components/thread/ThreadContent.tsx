"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const EditorComponent = dynamic(
  () => import("@/components/editor/EditorComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin">
          <Loader2 className="w-8 h-8 text-purple-500" />
        </div>
      </div>
    ),
  }
);

interface ThreadContentProps {
  content: any;
}

const ThreadContent = ({ content }: ThreadContentProps) => {
  return (
    <div className="prose prose-lg max-w-none mb-8">
      <EditorComponent
        data={content ? JSON.parse(content) : null}
        readOnly={true}
      />
    </div>
  );
};

export default ThreadContent;
