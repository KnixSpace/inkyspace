"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ImageIcon, Tag, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { getSpaceThreads } from "@/lib/apis/space";
import { showMessage } from "@/components/ui/MessageBox";
import { buttonHover, stagger } from "@/lib/animations";
import type { ThreadPreview } from "@/types/thread";
import LoadMoreButton from "../thread/comment/LoadMoreButton";

interface SpaceThreadListProps {
  spaceId: string;
}

const SpaceThreadList = ({ spaceId }: SpaceThreadListProps) => {
  const [threads, setThreads] = useState<ThreadPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPagetoken, setNextPagetoken] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 5;

  useEffect(() => {
    fetchThreads();
  }, [spaceId]);

  const fetchThreads = async () => {
    setIsLoading(true);
    try {
      const response = await getSpaceThreads(spaceId, PAGE_SIZE);
      if (response.success && response.data) {
        setThreads(response.data.list);
        setNextPagetoken(response.data.nextPagetoken || null);
        setTotalCount(response.data.totalCount || response.data.list.length);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load threads",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreThreads = async () => {
    if (!nextPagetoken) return;

    setIsLoadingMore(true);
    try {
      const response = await getSpaceThreads(spaceId, PAGE_SIZE, nextPagetoken);
      if (response.success && response.data) {
        setThreads([...threads, ...response.data.list]);
        setNextPagetoken(response.data.nextPagetoken || null);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load more threads",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No threads published in this space yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-4">Threads ({totalCount})</h2>
      <motion.div
        className="space-y-6"
        variants={stagger.container}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence>
          {threads.map((thread) => (
            <motion.div
              key={thread.threadId}
              className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors"
              variants={stagger.item}
              whileHover={buttonHover}
              layout
            >
              <Link href={`/thread/view/${thread.threadId}`} className="block">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                    {thread.coverImage ? (
                      <img
                        src={thread.coverImage || "/placeholder.svg"}
                        alt={thread.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {thread.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-3">
                      {thread.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {thread.tags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                        >
                          {/* <Tag size={12} className="mr-1" /> */}
                          <span>{tag.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        <span>
                          {format(new Date(thread.publishedOn), "MMM d, yyyy")}
                        </span>
                      </div>
                      {/* <div className="flex items-center">
                        <User size={12} className="mr-1" />
                        <span>{thread.editorName}</span>
                      </div> */}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {nextPagetoken && (
          <LoadMoreButton
            onClick={loadMoreThreads}
            isLoading={isLoadingMore}
            label="Load More Threads"
          />
        )}
      </motion.div>
    </div>
  );
};

export default SpaceThreadList;
