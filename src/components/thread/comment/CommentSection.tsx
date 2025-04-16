"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Loader2 } from "lucide-react";
import {
  getThreadComments,
  commentOnThread,
  replyToComment,
  deleteComment,
} from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import { stagger } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";
import type { CommentItem as CommentItemType } from "@/types/comment";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import LoadMoreButton from "./LoadMoreButton";

interface CommentSectionProps {
  threadId: string;
}

const CommentSection = ({ threadId }: CommentSectionProps) => {
  const { user } = useAppSelector((state) => state.user);
  const [comments, setComments] = useState<CommentItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPagetoken, setNextPagetoken] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const PAGE_SIZE = 5;

  useEffect(() => {
    fetchComments();
  }, [threadId]);

  const fetchComments = async (token?: string) => {
    setIsLoading(true);
    try {
      const response = await getThreadComments(threadId, PAGE_SIZE, token);
      if (response.success && response.data) {
        setComments(response.data.list);
        setNextPagetoken(response.data.nextPagetoken || null);
        // Update comment count based on the total number of comments
        setCommentCount(response.data.list.length);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load comments",
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

  const loadMoreComments = async () => {
    if (!nextPagetoken) return;

    setIsLoadingMore(true);
    try {
      const response = await getThreadComments(
        threadId,
        PAGE_SIZE,
        nextPagetoken
      );
      if (response.success && response.data) {
        setComments([...comments, ...response.data.list]);
        setNextPagetoken(response.data.nextPagetoken || null);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load more comments",
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

  const handleAddComment = async (comment: string) => {
    try {
      const response = await commentOnThread(threadId, comment);
      if (response.success) {
        showMessage({
          type: "success",
          message: "Comment added successfully",
        });
        // Refresh comments to show the new one
        fetchComments();
      } else {
        showMessage({
          type: "error",
          message: "Failed to add comment",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    }
  };

  const handleReplyToComment = async (commentId: string, reply: string) => {
    try {
      const response = await replyToComment(threadId, commentId, reply);
      if (response.success) {
        showMessage({
          type: "success",
          message: "Reply added successfully",
        });
        // Update the comment's reply count
        setComments(
          comments.map((comment) => {
            if (comment.commentId === commentId) {
              return {
                ...comment,
                replies: (comment.replies || 0) + 1,
              };
            }
            return comment;
          })
        );
      } else {
        showMessage({
          type: "error",
          message: "Failed to add reply",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        // Optimistically remove the comment from the UI
        setComments(
          comments.filter((comment) => comment.commentId !== commentId)
        );
        setCommentCount((prev) => prev - 1);
        showMessage({
          type: "success",
          message: "Comment deleted successfully",
        });
      } else {
        showMessage({
          type: "error",
          message: "Failed to delete comment",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <MessageCircle size={18} className="mr-2" />
        Comments ({commentCount})
      </h3>

      {user ? (
        <div className="mb-8">
          <CommentInput onSubmit={handleAddComment} />
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-2">Please log in to comment</p>
          <motion.button
            className="px-4 py-2 bg-purple-500 text-white rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/auth/login")}
          >
            Log In
          </motion.button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-6"
          variants={stagger.container}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {comments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                threadId={threadId}
                onReply={handleReplyToComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </AnimatePresence>

          {nextPagetoken && (
            <LoadMoreButton
              onClick={loadMoreComments}
              isLoading={isLoadingMore}
              label="Load More Comments"
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CommentSection;
