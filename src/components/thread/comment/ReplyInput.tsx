"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, X } from "lucide-react";
import { buttonHover, buttonTap } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";

interface ReplyInputProps {
  onSubmit: (reply: string) => Promise<void>;
  onCancel: () => void;
  replyingTo: string;
}

const ReplyInput = ({ onSubmit, onCancel, replyingTo }: ReplyInputProps) => {
  const { user } = useAppSelector((state) => state.user);
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async () => {
    if (!reply.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(reply);
      setReply("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  if (!user) return null;

  return (
    <motion.div
      className="ml-12 mt-3"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 flex-shrink-0">
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
          <div className="mb-2 flex items-center">
            <span className="text-sm text-gray-600">
              Replying to <span className="font-medium">{replyingTo}</span>
            </span>
            <motion.button
              onClick={onCancel}
              className="ml-2 text-xs text-rose-500 flex rounded items-center bg-red-50 py-1 px-1.5"
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              Cancel
            </motion.button>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Reply to ${replyingTo}...`}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 min-h-[80px] resize-none"
            />
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting || !reply.trim()}
              className="absolute bottom-4 right-2 p-2 bg-purple-500 text-white rounded flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={
                !isSubmitting && reply.trim() ? buttonHover : undefined
              }
              whileTap={!isSubmitting && reply.trim() ? buttonTap : undefined}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Press Ctrl+Enter to submit, Esc to cancel
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReplyInput;
