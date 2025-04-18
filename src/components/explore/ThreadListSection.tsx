"use client";

import { motion } from "framer-motion";
import { stagger } from "@/lib/animations";
import ThreadCard from "./ThreadCard";
import EmptyState from "./EmptyState";
import type { ThreadDetails } from "@/types/thread";

interface ThreadListSectionProps {
  threads: ThreadDetails[];
  searchQuery: string;
  onClearSearch: () => void;
}

const ThreadListSection = ({
  threads,
  searchQuery,
  onClearSearch,
}: ThreadListSectionProps) => {
  if (threads.length === 0) {
    return (
      <EmptyState searchQuery={searchQuery} onClearSearch={onClearSearch} />
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {threads.map((thread, index) => (
        <ThreadCard key={thread.threadId} thread={thread} index={index} />
      ))}
    </motion.div>
  );
};

export default ThreadListSection;
