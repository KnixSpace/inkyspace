"use client";

import { useState, useEffect } from "react";
import {
  getSubscribedSpaces,
  unsubscribeFromSpace,
  toggleNewsletter,
} from "@/lib/apis/space";
import { showMessage } from "@/components/ui/MessageBox";
import { Loader2, Bell, BellOff, Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp, buttonHover, buttonTap, stagger } from "@/lib/animations";
import { SubscribedSpace } from "@/types/space";

const SubscribedSpaces = () => {
  const [spaces, setSpaces] = useState<SubscribedSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      try {
        const response = await getSubscribedSpaces();
        if (response.success && response.data) {
          setSpaces(response.data);
        } else {
          showMessage({
            type: "error",
            message: "Failed to load subscribed spaces. Please try again.",
          });
        }
      } catch (error) {
        showMessage({
          type: "error",
          message: "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const handleUnsubscribe = async (spaceId: string) => {
    setActionInProgress(spaceId);
    try {
      const response = await unsubscribeFromSpace(spaceId);
      if (response.success) {
        setSpaces(spaces.filter((space) => space.spaceId !== spaceId));
        showMessage({
          type: "success",
          message: "Unsubscribed successfully!",
        });
      } else {
        showMessage({
          type: "error",
          message: "Failed to unsubscribe. Please try again.",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleNewsletter = async (
    spaceId: string,
    currentStatus: boolean
  ) => {
    setActionInProgress(spaceId);
    try {
      const response = await toggleNewsletter(spaceId);
      if (response.success) {
        setSpaces(
          spaces.map((space) =>
            space.spaceId === spaceId
              ? { ...space, isNewsletter: !currentStatus }
              : space
          )
        );
        showMessage({
          type: "success",
          message: currentStatus
            ? "Newsletter disabled successfully!"
            : "Newsletter enabled successfully!",
        });
      } else {
        showMessage({
          type: "error",
          message: "Failed to update newsletter preference. Please try again.",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          className="flex justify-center items-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{
              rotate: 360,
              transition: {
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
          >
            <Loader2 className="w-8 h-8 text-purple-500" />
          </motion.div>
        </motion.div>
      ) : (
        <motion.div key="spaces-content" {...slideUp}>
          <h2 className="text-2xl font-semibold mb-6">Subscribed Spaces</h2>
          {spaces.length === 0 ? (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-gray-500 mb-4">
                You haven't subscribed to any spaces yet.
              </p>
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Link
                  href="/explore"
                  className="px-6 py-2 bg-purple-500 text-white rounded-md font-medium"
                >
                  Explore Spaces
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={stagger.container}
              initial="initial"
              animate="animate"
            >
              {spaces.map((space) => (
                <motion.div
                  key={space.spaceId}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center gap-4"
                  variants={stagger.item}
                  layout
                  exit={{
                    opacity: 0,
                    x: -20,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    {space.coverImage ? (
                      <Image
                        src={space.coverImage || "/placeholder.svg"}
                        alt={space.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{space.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {space.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>By {space.ownerName}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <motion.button
                      onClick={() =>
                        handleToggleNewsletter(
                          space.spaceId,
                          space.isNewsletter
                        )
                      }
                      disabled={actionInProgress === space.spaceId}
                      className={`px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center ${
                        space.isNewsletter
                          ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      whileHover={
                        actionInProgress !== space.spaceId
                          ? buttonHover
                          : undefined
                      }
                      whileTap={
                        actionInProgress !== space.spaceId
                          ? buttonTap
                          : undefined
                      }
                    >
                      {actionInProgress === space.spaceId ? (
                        <motion.div
                          animate={{
                            rotate: 360,
                            transition: {
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            },
                          }}
                        >
                          <Loader2 className="w-4 h-4" />
                        </motion.div>
                      ) : space.isNewsletter ? (
                        <>
                          <BellOff size={14} className="mr-1" /> Disable
                          Newsletter
                        </>
                      ) : (
                        <>
                          <Bell size={14} className="mr-1" /> Enable Newsletter
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => handleUnsubscribe(space.spaceId)}
                      disabled={actionInProgress === space.spaceId}
                      className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                      whileHover={
                        actionInProgress !== space.spaceId
                          ? buttonHover
                          : undefined
                      }
                      whileTap={
                        actionInProgress !== space.spaceId
                          ? buttonTap
                          : undefined
                      }
                    >
                      {actionInProgress === space.spaceId ? (
                        <motion.div
                          animate={{
                            rotate: 360,
                            transition: {
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            },
                          }}
                        >
                          <Loader2 className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <>
                          <Trash2 size={14} className="mr-1" /> Unsubscribe
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscribedSpaces;
