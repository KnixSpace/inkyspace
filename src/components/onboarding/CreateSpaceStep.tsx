import { setIsCompleted } from "@/redux/features/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import { showMessage } from "../ui/MessageBox";
import { completeOnboarding } from "@/lib/apis/onboarding";

const CreateSpaceStep = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleCreateSpace = async () => {
    try {
      const response = await completeOnboarding();
      if (response.success) {
        dispatch(setIsCompleted(true));
        router.push("/spaces/create");
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
    dispatch(setIsCompleted(true));
    router.push("/spaces/create");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold">
          Create your first{" "}
          <span className="decoration-2 underline underline-offset-2 decoration-purple-500">
            Space
          </span>{" "}
          to share and collaborate with others.
        </h3>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCreateSpace}
        type="button"
        aria-label="Create Space"
        title="Create Space"
        className="flex items-center justify-center gap-2 px-4 py-1.5 text-white bg-purple-500 rounded-md hover:bg-purple-600 transition duration-200 mb-6"
      >
        <span className="text-lg font-medium">Create Space</span>
      </motion.button>
    </motion.div>
  );
};

export default CreateSpaceStep;
