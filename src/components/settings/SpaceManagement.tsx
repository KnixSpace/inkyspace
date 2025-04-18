"use client";

import { useState, useEffect } from "react";
import { getOwnedSpaces, deleteSpace } from "@/lib/apis/space";
import { showMessage } from "@/components/ui/MessageBox";
import { Loader2, Plus, Trash2, ImageIcon, Edit, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp, buttonHover, buttonTap, stagger } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";
import { OwnedSpaces } from "@/types/space";

const SpaceManagement = () => {
  const [spaces, setSpaces] = useState<OwnedSpaces[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.user);

  const fetchSpaces = async () => {
    setIsLoading(true);
    try {
      const response = await getOwnedSpaces(user?.userId || "");
      if (response.success && response.data) {
        setSpaces(response.data);
      } else {
        showMessage({
          type: "error",
          message: "Failed to load spaces. Please try again.",
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

  useEffect(() => {
    if (user?.userId) {
      fetchSpaces();
    }
  }, [user]);

  const handleDeleteSpace = async (spaceId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this space? This action cannot be undone."
      )
    ) {
      return;
    }

    setActionInProgress(spaceId);
    try {
      const response = await deleteSpace(spaceId);
      if (response.success) {
        setSpaces(spaces.filter((space) => space.spaceId !== spaceId));
        showMessage({
          type: "success",
          message: "Space deleted successfully!",
        });
      } else {
        showMessage({
          type: "error",
          message: "Failed to delete space. Please try again.",
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Space Management</h2>
            {spaces.length > 0 && (
              <Link href="/space/new">
                <motion.button
                  className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium flex items-center gap-2"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <Plus size={16} />
                  <span>Create Space</span>
                </motion.button>
              </Link>
            )}
          </div>

          {spaces.length === 0 ? (
            <motion.div
              className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-gray-500 mb-4">
                You haven't created any spaces yet.
              </p>
              <Link href="/space/new">
                <motion.button
                  className="px-6 py-2 bg-purple-500 text-white rounded-md font-medium"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  Create Your First Space
                </motion.button>
              </Link>
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
                      <img
                        src={space.coverImage || "/placeholder.svg"}
                        alt={space.title}
                        className="object-cover w-full h-full"
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
                      <span>
                        Created{" "}
                        {format(new Date(space.createdOn), "MMM d, yyyy")}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{space.subscribers} subscribers</span>
                      {space.isPrivate && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-rose-500 py-1 px-2 rounded bg-rose-100">Private</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href={`/space/view/${space.spaceId}`}>
                      <motion.button
                        className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 w-full"
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                      >
                        <Eye size={14} className="mr-1" /> View
                      </motion.button>
                    </Link>
                    <Link href={`/space/edit/${space.spaceId}`}>
                      <motion.button
                        className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-purple-100 text-purple-700 hover:bg-purple-200 w-full"
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </motion.button>
                    </Link>
                    <motion.button
                      onClick={() => handleDeleteSpace(space.spaceId)}
                      disabled={actionInProgress === space.spaceId}
                      className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-red-100 text-red-500 hover:bg-red-200"
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
                          <Trash2 size={14} className="mr-1" /> Delete
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

export default SpaceManagement;
