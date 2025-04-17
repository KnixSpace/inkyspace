"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Bell } from "lucide-react";
import { format } from "date-fns";
import { getSpaceSubscribers } from "@/lib/apis/space";
import { showMessage } from "@/components/ui/MessageBox";
import { buttonHover, buttonTap } from "@/lib/animations";
import LoadMoreButton from "../thread/comment/LoadMoreButton";
import { SpaceSubscriber } from "@/types/space";

interface SubscriberListModalProps {
  spaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

const SubscriberListModal = ({
  spaceId,
  isOpen,
  onClose,
}: SubscriberListModalProps) => {
  const [subscribers, setSubscribers] = useState<SpaceSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPagetoken, setNextPagetoken] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (isOpen) {
      fetchSubscribers();
    }
  }, [isOpen, spaceId]);

  const fetchSubscribers = async (token?: string) => {
    setIsLoading(true);
    try {
      const response = await getSpaceSubscribers(spaceId, PAGE_SIZE);
      if (response.success && response.data) {
        setSubscribers(response.data.list);
        setNextPagetoken(response.data.nextPagetoken || null);
        setTotalCount(response.data.totalCount || response.data.list.length);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load subscribers",
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

  const loadMoreSubscribers = async () => {
    if (!nextPagetoken) return;

    setIsLoadingMore(true);
    try {
      const response = await getSpaceSubscribers(
        spaceId,
        PAGE_SIZE,
        nextPagetoken
      );
      if (response.success && response.data) {
        setSubscribers([...subscribers, ...response.data.list]);
        setNextPagetoken(response.data.nextPagetoken || null);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load more subscribers",
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold">
                Subscribers ({totalCount})
              </h3>
              <motion.button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : subscribers.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  No subscribers yet
                </p>
              ) : (
                <div className="space-y-4">
                  {subscribers.map((subscriber) => (
                    <div
                      key={subscriber.userId}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {subscriber.avatar ? (
                          <img
                            src={subscriber.avatar || "/placeholder.svg"}
                            alt={subscriber.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500 font-medium">
                            {subscriber.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{subscriber.name}</p>
                        <p className="text-xs text-gray-500">
                          Subscribed{" "}
                          {format(
                            new Date(subscriber.subscribedOn),
                            "MMM d, yyyy"
                          )}
                        </p>
                      </div>
                      {subscriber.isNewsletter && (
                        <div className="text-rose-500 flex items-center">
                          <Bell size={16} className="mr-1" />
                          <span className="text-sm">Newsletter</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {nextPagetoken && (
                <LoadMoreButton
                  onClick={loadMoreSubscribers}
                  isLoading={isLoadingMore}
                  label="Load More Subscribers"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriberListModal;
