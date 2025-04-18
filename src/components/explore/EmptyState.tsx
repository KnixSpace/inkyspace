"use client";

import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  searchQuery: string;
  onClearSearch: () => void;
}

const EmptyState = ({ searchQuery, onClearSearch }: EmptyStateProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-6 text-gray-300"
      >
        <SearchX size={80} />
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        No threads found
      </h3>

      <p className="text-gray-600 mb-6 max-w-md">
        {searchQuery
          ? `We couldn't find any threads matching "${searchQuery}". Try a different search term or clear your search.`
          : "There are no trending threads available at the moment. Check back later!"}
      </p>

      {searchQuery && (
        <motion.button
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          onClick={onClearSearch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear Search
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
