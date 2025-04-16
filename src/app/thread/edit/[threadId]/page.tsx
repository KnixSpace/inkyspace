"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getThreadDataForEdit } from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import { useAppSelector } from "@/redux/hooks";
import ThreadForm from "@/components/thread/ThreadForm";
import type { ThreadDetails } from "@/types/thread";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonHover, buttonTap, slideUp } from "@/lib/animations";
import Link from "next/link";
import { getOwnerSpacesName } from "@/lib/apis/space";

const ThreadEditPage = () => {
  const router = useRouter();
  const { threadId } = useParams() as { threadId: string };
  const { user } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [thread, setThread] = useState<ThreadDetails | null>(null);
  const [availableSpaces, setAvailableSpaces] = useState<
    { spaceId: string; title: string }[]
  >([]);

  useEffect(() => {
    // Check if user is an editor
    if (user && user.role !== "E") {
      showMessage({
        type: "error",
        message: "Only editors can edit threads",
      });
      router.push("/");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const threadResponse = await getThreadDataForEdit(threadId);
        if (threadResponse.success && threadResponse.data) {
          const threadData = threadResponse.data;
          setThread(threadData);
        } else {
          showMessage({
            type: "error",
            message: "Failed to load thread. Please try again.",
          });
          router.push("/settings/threads");
        }

        const spacesResponse = await getOwnerSpacesName(user?.ownerId || "");
        if (spacesResponse.success && spacesResponse.data) {
          setAvailableSpaces(spacesResponse.data);
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

    fetchData();
  }, [user, router, threadId]);

  const canEdit = () => {
    if (!thread || !user) return false;
    if (user.role !== "E") return false;

    return (
      ["D", "R", "A", "P"].includes(thread.status) &&
      thread.editorId === user.userId
    );
  };

  if (!canEdit() && thread) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          You don't have permission to edit this thread.
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
      ) : (
        <motion.div key="thread-edit-form" {...slideUp}>
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
            <h2 className="text-2xl font-semibold">Edit Thread</h2>
            {thread && (
              <div className="ml-4">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    thread.status === "D"
                      ? "bg-gray-100 text-gray-700"
                      : thread.status === "R"
                        ? "bg-rose-100 text-rose-700"
                        : thread.status === "A"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                  }`}
                >
                  {thread.status === "D"
                    ? "Draft"
                    : thread.status === "R"
                      ? "Revision"
                      : thread.status === "A"
                        ? "Awaiting Approval"
                        : "Published"}
                </span>
              </div>
            )}
          </div>

          {thread && thread.status === "R" && thread.rejectionReason && (
            <motion.div
              className="mb-6 p-4 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="font-semibold text-yellow-700 mb-1">
                Revision Requested
              </h3>
              <p className="text-gray-700">{thread.rejectionReason}</p>
            </motion.div>
          )}

          {thread && (
            <ThreadForm
              mode="edit"
              threadId={threadId}
              initialData={{
                title: thread.title,
                coverImage: thread.coverImage,
                tags: thread.tags,
                spaceId: thread.spaceId,
                content: thread.content as any,
                status: thread.status,
                rejectionReason: thread.rejectionReason,
              }}
              availableSpaces={availableSpaces}
              backLink="/settings/threads"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThreadEditPage;
