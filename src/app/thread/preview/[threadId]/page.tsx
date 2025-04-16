"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getThreadDataForPreview } from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import { useAppSelector } from "@/redux/hooks";
import type { ThreadDetails } from "@/types/thread";
import { Loader2, ArrowLeft, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonHover, buttonTap, slideUp } from "@/lib/animations";
import Link from "next/link";
import { mapApiErrors } from "@/lib/apis/api";
import ThreadHeader from "@/components/thread/ThreadHeader";
import ThreadContent from "@/components/thread/ThreadContent";

const ThreadPreviewPage = () => {
  const router = useRouter();
  const { threadId } = useParams() as { threadId: string };
  const { user } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [thread, setThread] = useState<ThreadDetails | null>(null);

  useEffect(() => {
    if (user && user.role !== "E" && user.role !== "O") {
      showMessage({
        type: "error",
        message: "You don't have permission to preview threads",
      });
      router.push("/");
      return;
    }

    const fetchThread = async () => {
      setIsLoading(true);
      try {
        const response = await getThreadDataForPreview(threadId);
        if (response.success && response.data) {
          setThread(response.data);
        } else {
          mapApiErrors(response.errors);
          router.push("/settings/threads");
        }
      } catch (error) {
        showMessage({
          type: "error",
          message: "An unexpected error occurred.",
        });
        router.push("/settings/threads");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThread();
  }, [threadId, router, user]);

  const canView = () => {
    if (!thread || !user) return false;

    if (user.role === "O") return true;

    if (user.role === "E" && thread.editorId === user.userId) return true;

    return false;
  };

  const canEdit = () => {
    if (!thread || !user) return false;
    if (user.role !== "E") return false;

    return thread.editorId === user.userId;
  };

  if (!canView() && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          You don't have permission to view this thread.
        </p>
        <Link href="/settings/threads">
          <motion.button
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            Back to Threads
          </motion.button>
        </Link>
      </div>
    );
  }

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
        <motion.div key="thread-preview" {...slideUp}>
          <div className="flex items-center mb-6">
            <Link href="/settings/threads">
              <motion.button
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <h2 className="text-2xl font-semibold">Thread Preview</h2>
          </div>

          <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 overflow-hidden p-6">
            {/* Thread Header */}
            <ThreadHeader thread={thread} isPreview={true} />

            {/* Thread Content */}
            <ThreadContent content={thread.content} />

            {/* Actions */}
            {canEdit() && (
              <div className="mt-8 flex justify-end">
                <Link href={`/thread/edit/${thread.threadId}`}>
                  <motion.button
                    className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium flex items-center gap-2"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <Edit size={16} />
                    <span>Edit Thread</span>
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default ThreadPreviewPage;
