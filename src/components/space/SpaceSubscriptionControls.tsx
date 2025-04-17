"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { buttonHover, buttonTap } from "@/lib/animations";
import {
  subscribeToSpace,
  unsubscribeFromSpace,
  toggleNewsletter,
} from "@/lib/apis/space";
import { showMessage } from "@/components/ui/MessageBox";
import { useAppSelector } from "@/redux/hooks";

interface SpaceSubscriptionControlsProps {
  spaceId: string;
  isSubscribed: boolean;
  isNewsletter: boolean;
  onSubscriptionChange: (isSubscribed: boolean, isNewsletter: boolean) => void;
}

const SpaceSubscriptionControls = ({
  spaceId,
  isSubscribed,
  isNewsletter,
  onSubscriptionChange,
}: SpaceSubscriptionControlsProps) => {
  const user = useAppSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);

  const handleSubscriptionToggle = async () => {
    if (!user) {
      showMessage({
        type: "info",
        message: "Please log in to subscribe to this space",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isSubscribed) {
        const response = await unsubscribeFromSpace(spaceId);
        if (response.success) {
          onSubscriptionChange(false, false);
          showMessage({
            type: "success",
            message: "Unsubscribed successfully",
          });
        } else {
          showMessage({
            type: "error",
            message: "Failed to unsubscribe. Please try again.",
          });
        }
      } else {
        const response = await subscribeToSpace(spaceId);
        if (response.success) {
          onSubscriptionChange(true, false);
          showMessage({
            type: "success",
            message: "Subscribed successfully",
          });
        } else {
          showMessage({
            type: "error",
            message: "Failed to subscribe. Please try again.",
          });
        }
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

  const handleNewsletterToggle = async () => {
    if (!isSubscribed) {
      showMessage({
        type: "info",
        message: "You need to subscribe first to enable the newsletter",
      });
      return;
    }

    setIsNewsletterLoading(true);
    try {
      const response = await toggleNewsletter(spaceId, !isNewsletter);
      if (response.success) {
        onSubscriptionChange(isSubscribed, !isNewsletter);
        showMessage({
          type: "success",
          message: isNewsletter ? "Newsletter disabled" : "Newsletter enabled",
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
        message: "An unexpected error occurred",
      });
    } finally {
      setIsNewsletterLoading(false);
    }
  };

  if (!user || user.role === "O" || user.role === "E") return null;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4">
      <motion.button
        onClick={handleSubscriptionToggle}
        disabled={isLoading}
        className={`px-4 py-2 rounded-md font-medium flex items-center justify-center ${
          isSubscribed
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-purple-500 text-white hover:bg-purple-600"
        }`}
        whileHover={!isLoading ? buttonHover : undefined}
        whileTap={!isLoading ? buttonTap : undefined}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
        <span>{isSubscribed ? "Unsubscribe" : "Subscribe"}</span>
      </motion.button>

      {isSubscribed && (
        <motion.button
          onClick={handleNewsletterToggle}
          disabled={isNewsletterLoading}
          className={`px-4 py-2 rounded-md font-medium flex items-center justify-center ${
            isNewsletter
              ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          whileHover={!isNewsletterLoading ? buttonHover : undefined}
          whileTap={!isNewsletterLoading ? buttonTap : undefined}
        >
          {isNewsletterLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : isNewsletter ? (
            <BellOff size={18} className="mr-2" />
          ) : (
            <Bell size={18} className="mr-2" />
          )}
          <span>
            {isNewsletter ? "Disable Newsletter" : "Enable Newsletter"}
          </span>
        </motion.button>
      )}
    </div>
  );
};

export default SpaceSubscriptionControls;
