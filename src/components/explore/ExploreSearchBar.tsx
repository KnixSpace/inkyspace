"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { buttonHover, buttonTap } from "@/lib/animations";

interface ExploreSearchBarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const ExploreSearchBar = ({ onSearch, searchQuery }: ExploreSearchBarProps) => {
  const [query, setQuery] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounce search to avoid excessive filtering
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <motion.div
      className={`relative flex items-center w-full mx-auto mb-8 rounded-lg  border-2 border-dashed border-gray-300 ${
        isFocused && "border-purple-500"
      } transition-all duration-200`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute left-4 text-gray-400">
        <Search size={20} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search by title or tags..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full py-3 pl-12 pr-10 bg-transparent border-none rounded-lg focus:outline-none text-gray-800"
      />
      {query && (
        <motion.button
          className="absolute right-4 text-gray-400 hover:text-gray-600"
          onClick={handleClear}
          whileHover={buttonHover}
          whileTap={buttonTap}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <X size={18} />
        </motion.button>
      )}
    </motion.div>
  );
};

export default ExploreSearchBar;
