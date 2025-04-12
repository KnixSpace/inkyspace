"use client";

import {
  completeOnboarding,
  fetchSuggestedSpaces,
  subscribeToSpaces,
} from "@/lib/apis/onboarding";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { showMessage } from "../ui/MessageBox";
import {
  setCurrentStep,
  setIsCompleted,
  setIsLoading,
  toggleNewsletter,
  toggleSpaceSubscription,
} from "@/redux/features/onboardingSlice";
import { motion } from "framer-motion";
import {
  Bell,
  BellRing,
  Check,
  Loader2,
  Users,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";

interface Space {
  spaceId: string;
  title: string;
  image: string | null;
  description: string;
  ownerName: string;
  subscribers: number;
}

const SpaceSubscriptionStep = () => {
  const dispatch = useAppDispatch();
  const { selectedTags, subscribedSpaces, isLoading } = useAppSelector(
    (state) => state.onboarding
  );
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [fetchingSpaces, setFetchingSpaces] = useState(true);

  useEffect(() => {
    const getSpaces = async () => {
      if (!selectedTags.length) {
        setFetchingSpaces(false);
        return;
      }

      try {
        const response = await fetchSuggestedSpaces(selectedTags);
        if (response.success && response.data?.length) {
          setSpaces(response.data);
        } else {
          showMessage({
            type: "error",
            message: "Failed to load suggested spaces. Please try again.",
          });
        }
      } catch (error) {
        showMessage({
          type: "error",
          message: "An unexpected error occurred.",
        });
      } finally {
        setFetchingSpaces(false);
      }
    };

    getSpaces();
  }, [selectedTags]);

  const handleSubscribe = async () => {
    if (!selectedTags.length) {
      dispatch(setIsCompleted(true));
      return;
    }

    dispatch(setIsLoading(true));
    try {
      const response = await subscribeToSpaces(subscribedSpaces);
      if (response.success) {
        showMessage({
          type: "success",
          message: "Your preferences have been saved successfully!",
        });
        const onboardingResponse = await completeOnboarding();
        if (onboardingResponse.success) {
          dispatch(setIsCompleted(true));
        } else {
          showMessage({
            type: "error",
            message: "Failed to subscribe to the spaces. Please try again.",
          });
        }
      } else {
        showMessage({
          type: "error",
          message: "Failed to subscribe to the space. Please try again.",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleSkip = async () => {
    try {
      const response = await completeOnboarding();
      if (response.success) {
        dispatch(setIsCompleted(true));
      } else {
        showMessage({
          type: "error",
          message: "Failed to complete onboarding. Please try again.",
        });
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Discover spaces you might like
        </h3>
      </div>
      {fetchingSpaces ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-8 mb-8">
          <p className="text-gray-500">
            No suggested spaces found based on your interests.
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-8 overflow-y-auto max-h-[48vh]">
          {spaces.map((space) => (
            <motion.div
              key={space.spaceId}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ">
                {space.image ? (
                  <Image
                    src={space.image || "/placeholder.svg?height=64&width=64"}
                    alt={space.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                    <ImageIcon className="text-gray-400" size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{space.title}</h4>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {space.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="mr-4 text-rose-400">
                    By {space.ownerName}
                  </span>
                  <span className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {space.subscribers} subscribers
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <motion.button
                  whileTap={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() =>
                    dispatch(toggleSpaceSubscription(space.spaceId))
                  }
                  className={`px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center ${
                    subscribedSpaces.some(
                      (item) => item.spaceId === space.spaceId
                    )
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {subscribedSpaces.some(
                    (item) => item.spaceId === space.spaceId
                  ) ? (
                    <>
                      <Check size={14} className="mr-1" /> Subscribed
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </motion.button>
                {subscribedSpaces.some(
                  (item) => item.spaceId === space.spaceId
                ) && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch(toggleNewsletter(space.spaceId))}
                    className={`px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center ${
                      subscribedSpaces.some(
                        (item) =>
                          item.spaceId === space.spaceId && item.isNewsletter
                      )
                        ? "bg-rose-100 text-rose-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {subscribedSpaces.some(
                      (item) =>
                        item.spaceId === space.spaceId && item.isNewsletter
                    ) ? (
                      <BellRing size={14} className="mr-1" />
                    ) : (
                      <Bell size={14} className="mr-1" />
                    )}
                    Newsletter
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleSkip}
          className="px-6 py-1.5 border-2 border-dashed border-gray-300 rounded-md font-medium hover:bg-gray-50"
        >
          Skip
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => dispatch(setCurrentStep(0))}
            disabled={isLoading}
            className="px-6 py-1.5 rounded-md font-medium border-2 border-dashed border-purple-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            Back
          </button>
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="px-6 py-1.5 bg-purple-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Continue to Explore
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SpaceSubscriptionStep;
