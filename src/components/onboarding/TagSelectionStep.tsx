"use client";

import { fetchTags, submitTags } from "@/lib/apis/onboarding";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { showMessage } from "../ui/MessageBox";
import {
  setCurrentStep,
  setIsLoading,
  setSelectedTags,
} from "@/redux/features/onboardingSlice";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Tag {
  id: string;
  name: string;
}

const TagSelectionStep = () => {
  const dispatch = useAppDispatch();
  const { selectedTags, isLoading } = useAppSelector(
    (state) => state.onboarding
  );
  const [tags, setTags] = useState<Tag[]>([]);
  const [fetchingTags, setFetchingTags] = useState(true);

  useEffect(() => {
    const getTags = async () => {
      try {
        const response = await fetchTags();
        if (response.success && response.data?.length) {
          setTags(response.data);
        } else {
          showMessage({
            type: "error",
            message: "Failed to load tags. Please try again.",
          });
        }
      } catch (error) {
        showMessage({
          type: "error",
          message: "An unexpected error occurred.",
        });
      } finally {
        setFetchingTags(false);
      }
    };
    getTags();
  }, []);

  const handleTagToggle = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      dispatch(setSelectedTags(selectedTags.filter((id) => id !== tagId)));
    } else {
      dispatch(setSelectedTags([...selectedTags, tagId]));
    }
  };

  const handleContinue = async () => {
    if (tags.length === 0) {
      dispatch(setCurrentStep(1));
      return;
    }

    if (selectedTags.length === 0) {
      showMessage({
        type: "error",
        message: "Please select at least one tag to continue.",
      });
      return;
    }

    dispatch(setIsLoading(true));
    try {
      const response = await submitTags(selectedTags);
      if (response.success) {
        dispatch(setCurrentStep(1));
      } else {
        showMessage({
          type: "error",
          message: "Failed to save your tag preferences. Please try again.",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
    >
      {fetchingTags ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 overflow-auto max-h-60">
            {tags.map((tag) => (
              <motion.button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-2 py-1.5 rounded-md border-2 border-dashed text-center transition-all ${
                  selectedTags.includes(tag.id)
                    ? "border-purple-500 text-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium ">{tag.name}</span>
              </motion.button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              disabled={
                tags.length === 0
                  ? false
                  : selectedTags.length === 0 || isLoading
              }
              className="px-6 py-2 bg-purple-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Continue
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default TagSelectionStep;
