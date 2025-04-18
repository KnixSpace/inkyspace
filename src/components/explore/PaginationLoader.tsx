"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PaginationLoaderProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const PaginationLoader = ({
  onLoadMore,
  hasMore,
  isLoading,
}: PaginationLoaderProps) => {
  const [visible, setVisible] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setVisible(entry.isIntersecting);

        // If the loader is visible, hasMore is true, and we're not already loading, trigger load more
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loaderRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <motion.div
      ref={loaderRef}
      className="flex justify-center items-center py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading ? (
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Loader2 className="w-8 h-8 text-purple-500" />
          </motion.div>
          <p className="mt-2 text-gray-500">Loading more threads...</p>
        </div>
      ) : (
        <div className="h-10" />
      )}
    </motion.div>
  );
};

export default PaginationLoader;
