"use client";

import type { Thread } from "@/lib/apis/thread";
import { Calendar, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { stagger, cardHover } from "@/lib/animations";

interface ThreadsListProps {
  threads: Thread[];
}

const ThreadsList = ({ threads }: ThreadsListProps) => {
  // Only show published threads
  const publishedThreads = threads.filter(
    (thread) => thread.status === "published"
  );

  if (publishedThreads.length === 0) {
    return (
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-gray-500">No published threads found</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {publishedThreads.map((thread) => (
        <motion.div
          key={thread.id}
          variants={stagger.item}
          whileHover={cardHover}
        >
          <Link
            href={`/thread/${thread.id}`}
            className="flex gap-4 bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 transition-shadow"
          >
            <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
              {thread.coverImage ? (
                <Image
                  src={thread.coverImage || "/placeholder.svg"}
                  alt={thread.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="text-gray-400" size={24} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{thread.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {thread.excerpt}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-3">In {thread.spaceTitle}</span>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    {thread.publishedAt
                      ? format(new Date(thread.publishedAt), "MMM d, yyyy")
                      : format(new Date(thread.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ThreadsList;
