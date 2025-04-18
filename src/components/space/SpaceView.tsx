"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getSpaceById,
  getSpaceSubscriptionStatus,
  getSpaceThreads,
} from "@/lib/apis/space";
import { useAppSelector } from "@/redux/hooks";
import { showMessage } from "@/components/ui/MessageBox";
import { mapApiErrors } from "@/lib/apis/api";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fadeIn } from "@/lib/animations";
import SpaceHeader from "./SpaceHeader";
import SpaceThreadList from "./SpaceThreadList";
import SpaceSubscriptionControls from "./SpaceSubscriptionControls";
import InviteEditorsButton from "./InviteEditorsButton";
import type { Space, SpaceThreadsResponse } from "@/types/space";
import SubscriberListModal from "./SubscriberListModal";

interface SpaceViewProps {
  spaceId: string;
}

const SpaceView = ({ spaceId }: SpaceViewProps) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);

  const [space, setSpace] = useState<Space | null>(null);
  const [threads, setThreads] = useState<SpaceThreadsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isNewsletter, setIsNewsletter] = useState(false);
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessDeniedReason, setAccessDeniedReason] = useState("");

  useEffect(() => {
    fetchSpaceData();
  }, [spaceId, user]);

  // Helper functions for access control
  const isOwner = () => user?.userId === space?.ownerId;
  const isEditorOwner = () => user?.ownerId === space?.ownerId;
  const hasThreads = () => threads?.list && threads.list.length > 0;

  // Check access rights based on rules
  const checkAccessRights = () => {
    setAccessDenied(false);
    setAccessDeniedReason("");
    // If user is not logged in
    if (!user) {
      if (!hasThreads()) {
        // No threads, redirect to explore
        router.push("/explore");
        return false;
      }

      if (space?.isPrivate) {
        // Unauthorized users can't access private spaces - redirect to login
        router.push("/login");
        return false;
      }
      // Public spaces are accessible to unauthorized users

      return true;
    }

    const userRole = user.role;
    const spaceHasThreads = hasThreads();
    const userIsOwner = isOwner();
    const isOwnerOfEditor = isEditorOwner();

    // OWNER ROLE
    if (userRole === "O") {
      if (userIsOwner) {
        // Owner always has access to their own space
        return true;
      } else {
        // Owner accessing someone else's space
        if (!spaceHasThreads) {
          // No threads, redirect to explore
          router.push("/explore");
          return false;
        } else if (space?.isPrivate && !isSubscribed) {
          // Private space requires subscription
          setAccessDenied(true);
          setAccessDeniedReason(
            "This is a private space. Please subscribe to access content."
          );
          return false;
        } else {
          // Public space or private with subscription
          return true;
        }
      }
    }

    // EDITOR ROLE
    else if (userRole === "E") {
      if (isOwnerOfEditor) {
        // Editor in their own space
        if (space?.isPrivate && !spaceHasThreads) {
          router.push("/explore");
          return false;
        }
        return true;
      } else {
        // Editor in someone else's space
        if (!spaceHasThreads) {
          // No threads, redirect to explore
          router.push("/explore");
          return false;
        } else if (space?.isPrivate && !isSubscribed) {
          // Private space requires subscription
          setAccessDenied(true);
          setAccessDeniedReason(
            "This is a private space. Please subscribe to access content."
          );
          return false;
        } else {
          // Public space or private with subscription
          return true;
        }
      }
    }

    // USER ROLE
    else if (userRole === "U") {
      if (!spaceHasThreads) {
        // No threads, redirect to explore
        router.push("/explore");
        return false;
      } else if (space?.isPrivate && !isSubscribed) {
        // Private space requires subscription
        setAccessDenied(true);
        setAccessDeniedReason(
          "This is a private space. Please subscribe to access content."
        );
        return false;
      } else {
        // Public space or private with subscription
        return true;
      }
    }

    return false;
  };

  const fetchSpaceData = async () => {
    setIsLoading(true);
    setAccessDenied(false);

    try {
      // 1. Get space details
      const spaceResponse = await getSpaceById(spaceId);
      if (!spaceResponse.success || !spaceResponse.data) {
        mapApiErrors(spaceResponse.errors);
        router.push("/explore");
        return;
      }

      const spaceData = spaceResponse.data;
      setSpace(spaceData);

      // Check if user is logged in and set subscription status
      if (user) {
        const subscriptionResponse = await getSpaceSubscriptionStatus(spaceId);
        if (subscriptionResponse.success && subscriptionResponse.data) {
          setIsSubscribed(subscriptionResponse.data.isSubscribed);
          setIsNewsletter(subscriptionResponse.data.isNewsletter);
        }
      }

      // 2. Check if space has published threads
      const threadsResponse = await getSpaceThreads(spaceId, 10);
      if (!threadsResponse.success || !threadsResponse.data) {
        mapApiErrors(threadsResponse.errors);
        return;
      }
      const hasPublishedThreadsData = threadsResponse.data;
      setThreads(hasPublishedThreadsData);
    } catch (error) {
      console.error(error);
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
      router.push("/explore");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && space && threads) {
      checkAccessRights();
    }
  }, [isLoading, space, threads, isSubscribed, user]);

  const handleSubscriptionChange = (
    subscribed: boolean,
    newsletter: boolean
  ) => {
    setIsSubscribed(subscribed);
    setIsNewsletter(newsletter);

    // If user unsubscribes from a private space, check access again
    if (!subscribed && space?.isPrivate) {
      checkAccessRights();
    }
  };

  // Determine if user is reader (not owner)
  // const isReader = user && !isOwner();

  // Determine if we should show the invite editors button
  const shouldShowInviteEditors = isOwner() && !hasThreads();

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          className="h-dvh flex justify-center items-center py-12"
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
      ) : accessDenied ? (
        <motion.div
          className="flex flex-col items-center justify-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">{accessDeniedReason}</p>

          {space?.isPrivate && !isSubscribed && (
            <SpaceSubscriptionControls
              isOwner={isOwner()}
              isEditor={isEditorOwner()}
              spaceId={spaceId}
              isSubscribed={isSubscribed}
              isNewsletter={isNewsletter}
              onSubscriptionChange={handleSubscriptionChange}
            />
          )}

          <motion.button
            onClick={() => router.push("/explore")}
            className="mt-6 px-4 py-2 bg-gray-200 rounded-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Explore
          </motion.button>
        </motion.div>
      ) : space ? (
        <motion.div
          key="space-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Space Header */}
          <SpaceHeader
            space={space}
            onSubscribersClick={() => {
              if (!user) {
                showMessage({
                  type: "info",
                  message: "You need to be logged in to view subscribers.",
                });
                return;
              }
              setShowSubscribers(true);
            }}
          />

          {/* Subscription Controls for readers */}
          <div className="max-w-4xl mx-auto px-4">
            <SpaceSubscriptionControls
              isOwner={isOwner()}
              isEditor={isEditorOwner()}
              spaceId={spaceId}
              isSubscribed={isSubscribed}
              isNewsletter={isNewsletter}
              onSubscriptionChange={handleSubscriptionChange}
            />
          </div>

          {/* Content Section */}
          <div className="max-w-4xl mx-auto px-4 mt-8">
            {hasThreads() ? (
              <SpaceThreadList spaceId={spaceId} />
            ) : shouldShowInviteEditors ? (
              <InviteEditorsButton spaceId={spaceId} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No threads published in this space yet.
                </p>
              </div>
            )}
          </div>

          {/* Subscribers Modal */}
          <SubscriberListModal
            spaceId={spaceId}
            isOpen={showSubscribers}
            onClose={() => setShowSubscribers(false)}
          />
        </motion.div>
      ) : (
        <motion.div className="text-center py-12" {...fadeIn}>
          <p className="text-gray-600">Space not found or not available.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpaceView;
