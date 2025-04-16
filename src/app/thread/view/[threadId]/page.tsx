"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getThread } from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import type { ThreadDetails } from "@/types/thread";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp } from "@/lib/animations";
import { mapApiErrors } from "@/lib/apis/api";
import ThreadHeader from "@/components/thread/ThreadHeader";
import ThreadContent from "@/components/thread/ThreadContent";
import CommentSection from "@/components/thread/comment/CommentSection";
import ThreadInteractionBar from "@/components/thread/ThreadInteractionBar";

const ThreadViewPage = () => {
  const router = useRouter();
  const { threadId } = useParams() as { threadId: string };
  const [isLoading, setIsLoading] = useState(true);
  const [thread, setThread] = useState<ThreadDetails | null>(null);

  useEffect(() => {
    const fetchThread = async () => {
      setIsLoading(true);
      try {
        const response = await getThread(threadId); // Debugging line
        if (response.success && response.data) {
          const threadData = response.data;

          // Only published threads are visible to the public
          if (threadData.status !== "P") {
            showMessage({
              type: "error",
              message: "This thread is not available for public viewing",
            });
            // router.push("/");
            return;
          }

          setThread(threadData);
        } else {
          mapApiErrors(response.errors);
          // router.push("/");
        }
      } catch (error) {
        showMessage({
          type: "error",
          message: "An unexpected error occurred.",
        });
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThread();
  }, [threadId, router]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          className="flex justify-center items-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{
              rotate: 360,
              transition: {
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
          >
            <Loader2 className="w-8 h-8 text-purple-500" />
          </motion.div>
        </motion.div>
      ) : thread ? (
        <motion.div key="thread-view" {...slideUp}>
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden p-6">
            {/* Thread Header */}
            <ThreadHeader thread={thread} />

            {/* Interaction Bar */}
            <ThreadInteractionBar
              threadId={thread.threadId}
              likeCount={thread.interactionsCount}
            />

            {/* Thread Content */}
            <ThreadContent content={thread.content} />

            {/* Comment Section */}
            <CommentSection threadId={thread.threadId} />
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-600">Thread not found or not available.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThreadViewPage;
