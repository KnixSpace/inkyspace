"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { buttonHover, buttonTap, stagger } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";
import { getCommentReplies, deleteReply } from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import type { CommentReplyItem } from "@/types/comment";
import LoadMoreButton from "./LoadMoreButton";

interface ReplySectionProps {
  commentId: string;
  threadId: string;
  onDelete: (replyId: string) => Promise<void>;
}

const ReplySection = ({ commentId, threadId, onDelete }: ReplySectionProps) => {
  const { user } = useAppSelector((state) => state.user);
  const [replies, setReplies] = useState<CommentReplyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPagetoken, setNextPagetoken] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const PAGE_SIZE = 5;

  useEffect(() => {
    fetchReplies();
  }, [commentId, threadId]);

  const fetchReplies = async (token?: string) => {
    setIsLoading(true);
    try {
      const response = await getCommentReplies(
        commentId,
        threadId,
        PAGE_SIZE,
        token
      );
      if (response.success && response.data) {
        setReplies(response.data.list);
        setNextPagetoken(response.data.nextPagetoken || null);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load replies",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreReplies = async () => {
    if (!nextPagetoken) return;

    setIsLoadingMore(true);
    try {
      const response = await getCommentReplies(
        commentId,
        threadId,
        PAGE_SIZE,
        nextPagetoken
      );
      if (response.success && response.data) {
        setReplies([...replies, ...response.data.list]);
        setNextPagetoken(response.data.nextPagetoken || null);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load more replies",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      const response = await deleteReply(replyId);
      if (response.success) {
        // Optimistically remove the reply from the UI
        setReplies(replies.filter((reply) => reply.commentId !== replyId));
        showMessage({
          type: "success",
          message: "Reply deleted successfully",
        });
      } else {
        showMessage({
          type: "error",
          message: "Failed to delete reply",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    }
    setActiveDropdown(null);
  };

  if (isLoading) {
    return (
      <div className="ml-12 mt-4 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <motion.div
      className="ml-12 mt-4 space-y-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      {replies.length === 0 ? (
        <p className="text-sm text-gray-500">No replies yet</p>
      ) : (
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {replies.map((reply) => (
            <motion.div
              key={reply.commentId}
              variants={stagger.item}
              className="flex gap-2"
            >
              <div className="w-8 h-8 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                {reply.userAvatar ? (
                  <img
                    src={reply.userAvatar || "/placeholder.svg"}
                    alt={reply.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-medium">
                    {reply.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{reply.userName}</p>
                    <p className="text-xs text-gray-500">
                      {format(
                        new Date(reply.createdOn),
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>

                  {user && (
                    <div className="relative">
                      <motion.button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === reply.commentId
                              ? null
                              : reply.commentId
                          )
                        }
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical size={14} />
                      </motion.button>

                      {activeDropdown === reply.commentId &&
                        (user.userId === reply.userId || user.role === "O") && (
                          <motion.div
                            className="absolute right-0 mt-1 bg-white shadow-md rounded-md py-1 z-10 w-32"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <motion.button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-rose-500 flex items-center"
                              onClick={() => handleDeleteReply(reply.commentId)}
                              whileHover={{ backgroundColor: "#f3f4f6" }}
                            >
                              <Trash2 size={14} className="mr-2" />
                              Delete
                            </motion.button>
                          </motion.div>
                        )}
                    </div>
                  )}
                </div>

                <p className="mt-1 text-gray-800 text-sm">{reply.reply}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {nextPagetoken && (
        <LoadMoreButton
          onClick={loadMoreReplies}
          isLoading={isLoadingMore}
          label="Load More Replies"
        />
      )}
    </motion.div>
  );
};

export default ReplySection;
