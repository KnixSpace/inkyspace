"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MessageSquare, Heart, Tag } from "lucide-react";
import { format } from "date-fns";
import { buttonHover, buttonTap, cardHover } from "@/lib/animations";
import type { ThreadDetails } from "@/types/thread";

interface ThreadCardProps {
  thread: ThreadDetails;
  index: number;
}

const ThreadCard = ({ thread, index }: ThreadCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Create a truncated excerpt from content if not provided
  const excerpt = "Read this interesting thread...";

  return (
    <motion.div
      className="bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={cardHover}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/thread/view/${thread.threadId}`} className="block h-full">
        <div className="h-full flex flex-col">
          {/* Cover Image */}
          {thread.coverImage && (
            <div className="relative h-40 overflow-hidden">
              <motion.img
                src={thread.coverImage}
                alt={thread.title}
                className="w-full h-full object-cover"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-5 flex-grow flex flex-col">
            {/* Space info */}
            <div className="inline-block mb-2">
              <motion.div
                className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded text-sm"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                {thread.spaceDetails.title}
              </motion.div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold line-clamp-2 text-gray-800">
              {thread.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
              {excerpt}
            </p>

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {thread.tags.slice(0, 3).map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    {/* <Tag size={12} className="mr-1" /> */}
                    <span>{tag.name}</span>
                  </div>
                ))}
                {thread.tags.length > 3 && (
                  <div className="flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{thread.tags.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Meta information */}
            <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 mr-2">
                  {thread.ownerDetails?.avatar ? (
                    <img
                      src={thread.ownerDetails.avatar || "/placeholder.svg"}
                      alt={thread.ownerDetails.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-medium">
                      {thread.ownerDetails.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="truncate max-w-[100px] pe-2">
                  {thread.ownerDetails.name}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>
                    {thread.publishedOn
                      ? format(new Date(thread.publishedOn), "MMM d, yyyy")
                      : format(new Date(thread.createdOn), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with stats */}
          <div className="px-5 py-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Heart size={14} className="mr-1" />
              <span>{thread.interactionsCount || 0}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ThreadCard;
