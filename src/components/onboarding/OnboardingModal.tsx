"use client";

import { setIsCompleted } from "@/redux/features/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import TagSelectionStep from "./TagSelectionStep";
import SpaceSubscriptionStep from "./SpaceSubscriptionStep";
import EditorInvitationStep from "./EditorInvitationStep";
import { X } from "lucide-react";
import CreateSpaceStep from "./CreateSpaceStep";
import { completeOnboarding } from "@/lib/apis/onboarding";
import { showMessage } from "../ui/MessageBox";

const OnboardingModal = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { currentStep, isCompleted } = useAppSelector(
    (state) => state.onboarding
  );
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (!user || user.onboardComplete || isCompleted) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }
  }, [user, isCompleted]);

  const handleClose = async () => {
    if (user?.role === "O") {
      try {
        const response = await completeOnboarding();
        if (response.success) {
          dispatch(setIsCompleted(true));
          setShowModal(false);
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
    }
  };

  if (!showModal || !user) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-auto"
      >
        {user.role === "O" && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        )}

        <div className="mb-6 text-center">
          <h1 className="text-3xl underline-offset-2">
            Welcome to{" "}
            <span className={`underline decoration-rose-400 `}>Inky</span>
            <span className={`underline decoration-purple-500`}>Space</span>
          </h1>
          <p className="text-gray-600 text-lg">
            {user.role === "U" &&
              "Let's personalize your experience by selecting topics you're interested in."}
            {user.role === "O" && currentStep === 0
              ? "Invite editors to your space."
              : "Create your first space."}
          </p>
        </div>
        <AnimatePresence mode="wait">
          {user.role === "U" ? (
            // Reader onboarding flow
            <>
              {currentStep === 0 && <TagSelectionStep key="tags" />}
              {currentStep === 1 && <SpaceSubscriptionStep key="spaces" />}
            </>
          ) : (
            // Owner onboarding flow
            <>
              {currentStep === 0 && <EditorInvitationStep key="editors" />}
              {currentStep === 1 && <CreateSpaceStep key="createSpace" />}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
