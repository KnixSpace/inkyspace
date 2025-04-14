"use client";

import ThreadForm from "@/components/thread/ThreadForm";
import { showMessage } from "@/components/ui/MessageBox";
import { slideUp } from "@/lib/animations";
import { getOwnerSpacesName } from "@/lib/apis/space";
import { useAppSelector } from "@/redux/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateThreadPage = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [availableSpaces, setAvailableSpaces] = useState<
    { spaceId: string; title: string }[]
  >([]);

  useEffect(() => {
    if (user && user.role !== "E") {
      showMessage({
        type: "error",
        message: "Only editors can create threads",
      });
      router.push("/");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const spacesResponse = await getOwnerSpacesName(user?.ownerId || "");
        if (spacesResponse.success && spacesResponse.data) {
          setAvailableSpaces(spacesResponse.data);
        }
      } catch (error) {
        showMessage({
          type: "error",
          message: "Failed to load data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, router]);

  if (user && user.role !== "E") {
    return null;
  }

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
        <motion.div key="thread-create-form" {...slideUp}>
          <div className="flex items-center mb-6">
            <Link href="/settings/threads">
              <motion.button
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <h2 className="text-2xl font-semibold">Create New Thread</h2>
          </div>
          <ThreadForm
            mode="create"
            availableSpaces={availableSpaces}
            backLink="/settings/threads"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateThreadPage;
