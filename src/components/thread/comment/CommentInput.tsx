"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Send } from "lucide-react";
import { buttonHover, buttonTap } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";

interface CommentInputProps {
  onSubmit: (comment: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
}

const CommentInput = ({
  onSubmit,
  placeholder = "Add a comment...",
  autoFocus = false,
}: CommentInputProps) => {
  const { user } = useAppSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(comment);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!user) return null;

  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 flex-shrink-0">
        {user.avatar ? (
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 min-h-[100px] resize-none"
          />
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting || !comment.trim()}
            className="absolute right-2 bottom-4 p-2 flex items-center justify-center bg-purple-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={
              !isSubmitting && comment.trim() ? buttonHover : undefined
            }
            whileTap={!isSubmitting && comment.trim() ? buttonTap : undefined}
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </motion.button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Press Ctrl+Enter to submit</p>
      </div>
    </div>
  );
};

export default CommentInput;
