"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { buttonHover, buttonTap } from "@/lib/animations";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  label?: string;
}

const LoadMoreButton = ({
  onClick,
  isLoading,
  label = "Load More",
}: LoadMoreButtonProps) => {
  return (
    <div className="flex justify-center my-4">
      <motion.button
        onClick={onClick}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        whileHover={!isLoading ? buttonHover : undefined}
        whileTap={!isLoading ? buttonTap : undefined}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        <span>{label}</span>
      </motion.button>
    </div>
  );
};

export default LoadMoreButton;
