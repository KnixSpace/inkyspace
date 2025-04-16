"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, Loader2, X } from "lucide-react";
import {
  getThreadInteractions,
  toggleThreadInteraction,
} from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import { buttonHover, buttonTap } from "@/lib/animations";
import type { ThreadInteraction } from "@/types/comment";
import { useAppSelector } from "@/redux/hooks";

interface InteractionBarProps {
  threadId: string;
  likeCount: number;
}

const ThreadInteractionBar = ({ threadId, likeCount }: InteractionBarProps) => {
  const { user } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [showInteractions, setShowInteractions] = useState<boolean>(false);
  const [interactions, setInteractions] = useState<ThreadInteraction | null>(
    null
  );
  const [interactionsLoading, setInteractionsLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const checkUserInteraction = async () => {
      if (!user) return;

      try {
        const response = await getThreadInteractions(threadId);
        if (response.success && response.data) {
          const userInteraction = response.data.list.find(
            (interaction) =>
              interaction.userId === user.userId &&
              interaction.interaction === "like"
          );

          if (userInteraction) {
            setUserLiked(true);
          }
        }
      } catch (error) {
        console.error("Error checking user interaction:", error);
      }
    };

    checkUserInteraction();
  }, [threadId, user]);

  useEffect(() => {
    setLikesCount(likeCount);
  }, [likeCount]);

  const handleLikeToggle = async () => {
    if (!user) {
      showMessage({
        type: "info",
        message: "Please log in to like this thread",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await toggleThreadInteraction("like", threadId);
      if (response.success) {
        // Toggle like status
        if (userLiked) {
          setUserLiked(false);
          setLikesCount((prev) => prev - 1);
        } else {
          setUserLiked(true);
          setLikesCount((prev) => prev + 1);
        }
      } else {
        showMessage({
          type: "error",
          message: "Failed to update like",
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

  const fetchLikeInteractions = async () => {
    setInteractionsLoading(true);
    try {
      const response = await getThreadInteractions(threadId);
      if (response.success && response.data) {
        setInteractions(response.data);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load likes",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred",
      });
    } finally {
      setInteractionsLoading(false);
    }
  };

  const handleShowLikes = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showInteractions) {
      fetchLikeInteractions();
    }
    setShowInteractions(!showInteractions);
  };

  return (
    <div className="py-2 mb-2">
      <div className="flex items-center">
        <motion.button
          className={`flex items-center gap-1 ${userLiked ? "text-purple-600" : "text-gray-600"}`}
          onClick={handleLikeToggle}
          whileHover={buttonHover}
          whileTap={buttonTap}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ThumbsUp
              size={20}
              className={userLiked ? "fill-purple-600" : ""}
            />
          )}
          <motion.span className="cursor-pointer" onClick={handleShowLikes}>
            {likesCount}
          </motion.span>
        </motion.button>
      </div>

      {/* Likes popup */}
      <AnimatePresence>
        {showInteractions && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInteractions(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Likes</h3>
                <motion.button
                  onClick={() => setShowInteractions(false)}
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {interactionsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : interactions?.list.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No likes yet</p>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {interactions?.list.map((interaction) => (
                    <div
                      key={interaction.userId}
                      className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {interaction.userAvatar ? (
                          <img
                            src={interaction.userAvatar || "/placeholder.svg"}
                            alt={interaction.userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-medium">
                            {interaction.userName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{interaction.userName}</p>
                        {/* <p className="text-xs text-gray-500">
                          {new Date(interaction.createdAt).toLocaleDateString()}
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThreadInteractionBar;
