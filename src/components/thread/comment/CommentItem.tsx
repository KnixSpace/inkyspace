"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  Reply,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { buttonHover, buttonTap } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";
import type { CommentItem as CommentItemType } from "@/types/comment";
import ReplySection from "./ReplySection";
import ReplyInput from "./ReplyInput";

interface CommentItemProps {
  comment: CommentItemType;
  threadId: string;
  onReply: (commentId: string, reply: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

const CommentItem = ({
  comment,
  threadId,
  onReply,
  onDelete,
}: CommentItemProps) => {
  const { user } = useAppSelector((state) => state.user);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleReplyClick = () => {
    setIsReplying(true);
    setShowDropdown(false);
  };

  const handleDeleteClick = async () => {
    await onDelete(comment.commentId);
    setShowDropdown(false);
  };

  const handleReplySubmit = async (reply: string) => {
    await onReply(comment.commentId, reply);
    setIsReplying(false);
    setShowReplies(true); // Show replies after submitting a new one
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <motion.div
      className="flex gap-3 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="w-10 h-10 rounded overflow-hidden bg-gray-200 flex-shrink-0">
        {comment.userAvatar ? (
          <img
            src={comment.userAvatar || "/placeholder.svg"}
            alt={comment.userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-medium">
            {comment.userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{comment.userName}</p>
            <p className="text-xs text-gray-500">
              {format(new Date(comment.createdOn), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>

          {user && (
            <div className="relative">
              <motion.button
                onClick={() => setShowDropdown(!showDropdown)}
                whileHover={buttonHover}
                whileTap={buttonTap}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <MoreVertical size={16} />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    className="absolute right-0 mt-1 bg-white border-2 border-dashed border-gray-300 rounded-md p-1 z-10 w-32"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <motion.button
                      className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 flex items-center transition-all duration-300 ease-in-out"
                      onClick={handleReplyClick}
                    >
                      <Reply size={14} className="mr-2" />
                      Reply
                    </motion.button>

                    {(user.userId === comment.userId || user.role === "O") && (
                      <motion.button
                        className="w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-all duration-300 ease-in-out text-rose-500 flex items-center"
                        onClick={handleDeleteClick}
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <p className="mt-1 text-gray-800">{comment.comment}</p>

        <div className="mt-2 flex items-center">
          <motion.button
            className="text-sm text-purple-600 flex items-center mr-4"
            onClick={handleReplyClick}
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <Reply size={14} className="mr-1" />
            Reply
          </motion.button>

          {comment.replies && comment.replies > 0 && (
            <motion.button
              className="text-sm text-gray-600 flex items-center"
              onClick={toggleReplies}
              whileHover={buttonHover}
              whileTap={buttonTap}
            >
              {showReplies ? (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Hide Replies
                </>
              ) : (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  Show Replies ({comment.replies})
                </>
              )}
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {isReplying && (
            <ReplyInput
              onSubmit={handleReplySubmit}
              onCancel={() => setIsReplying(false)}
              replyingTo={comment.userName}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showReplies && comment.replies && comment.replies > 0 && (
            <ReplySection
              commentId={comment.commentId}
              threadId={threadId}
              onDelete={onDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CommentItem;
