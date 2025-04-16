"use client";

import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { buttonHover, buttonTap } from "@/lib/animations";
import type { ThreadDetails } from "@/types/thread";

interface ThreadHeaderProps {
  thread: ThreadDetails;
  isPreview?: boolean;
}

const ThreadHeader = ({ thread, isPreview = false }: ThreadHeaderProps) => {
  return (
    <div className="mb-8">
      {isPreview && (
        <div className="mb-4 w-full">
          <span
            className={`px-3 py-1 text-sm rounded flex w-full justify-center ${
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
                ? "Revision Needed"
                : thread.status === "A"
                  ? "Awaiting Approval"
                  : "Published"}
          </span>
        </div>
      )}

      {/* Cover Image */}
      {thread.coverImage && (
        <div className="mb-6">
          <img
            src={thread.coverImage || "/placeholder.svg"}
            alt={thread.title}
            className="w-full h-auto rounded-lg object-cover max-h-36"
            loading="lazy"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{thread.title}</h1>

      {/* Meta information */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <Calendar size={16} className="mr-2" />
          <span>
            {thread.publishedOn
              ? format(new Date(thread.publishedOn), "MMMM d, yyyy")
              : format(new Date(thread.createdOn), "MMMM d, yyyy")}
          </span>
        </div>

        {/* Space info */}
        <Link href={`/space/view/${thread.spaceId}`}>
          <motion.div
            className="flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded gap-2"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <span>{thread.spaceDetails.title}</span>
          </motion.div>
        </Link>

        <motion.div
          className="flex items-center px-3 py-1 bg-rose-50 text-rose-500 rounded gap-2"
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <span>{isPreview ? "12k" : thread.subscribersCount} subscribers</span>
        </motion.div>
      </div>

      {/* Owner info */}
      <div className="flex items-center mb-6">
        <Link href={`/profile/${thread.ownerId}`}>
          <motion.div
            className="flex items-center gap-3"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 flex-shrink-0">
              {thread.ownerDetails?.avatar ? (
                <img
                  src={thread.ownerDetails.avatar || "/placeholder.svg"}
                  alt={thread.ownerDetails.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-medium">
                  {thread.ownerDetails.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{thread.ownerDetails.name}</p>
              <p className="text-xs text-gray-500">Owner</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Tags */}
      {thread.tags && thread.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {thread.tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
            >
              <span>{tag.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Revision reason (if applicable) */}
      {thread.status === "R" && thread.rejectionReason && (
        <motion.div
          className="mb-6 p-4 bg-rose-50 border-2 border-dashed border-rose-300 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-semibold text-rose-700 mb-1">
            Revision Requested
          </h3>
          <p className="text-gray-700">{thread.rejectionReason}</p>
        </motion.div>
      )}
    </div>
  );
};

export default ThreadHeader;
