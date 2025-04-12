"use client";

import { getSpaceById, Space } from "@/lib/apis/space";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showMessage } from "../ui/MessageBox";
import { mapApiErrors } from "@/lib/apis/api";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Calendar, Edit, Loader2, Lock, Users } from "lucide-react";
import Link from "next/link";
import { buttonHover, buttonTap, fadeIn, slideUp } from "@/lib/animations";
import { format } from "date-fns";

interface SpaceViewProps {
  spaceId: string;
}

const SpaceView = ({ spaceId }: SpaceViewProps) => {
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = useAppSelector((state) => state.user.user);
  const isOwner = user?.userId === space?.ownerId;

  const fetchSpace = async () => {
    setIsLoading(true);
    try {
      const response = await getSpaceById(spaceId);
      if (response.success && response.data) {
        setSpace(response.data);
      } else {
        mapApiErrors(response.errors);
        router.push("/explore");
      }
    } catch (error) {
      console.log(error);
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
    fetchSpace();
  }, [spaceId]);

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
      ) : (
        <motion.div
          key="space-view"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Notion-style cover image */}
          <motion.div
            className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden"
            variants={fadeIn}
          >
            {space?.coverImage ? (
              <img
                src={space?.coverImage || "/placeholder.svg"}
                alt={space?.coverImage}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-200 to-pink-300" />
            )}

            {/* Back button */}
            <div className="absolute top-4 left-4 z-10">
              <Link href="/explore">
                <motion.button
                  className="p-2 bg-white rounded-full shadow-md"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <ArrowLeft size={20} />
                </motion.button>
              </Link>
            </div>

            {/* Edit button for owners */}
            {isOwner && (
              <div className="absolute top-4 right-4 z-10">
                <Link href={`/space/edit/${spaceId}`}>
                  <motion.button
                    className="px-3 py-1.5 bg-white rounded-md shadow-md flex items-center gap-1.5 text-sm font-medium"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <Edit size={14} />
                    <span>Edit Space</span>
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Space content */}
          <motion.div
            className="max-w-4xl mx-auto px-4 -mt-16 relative z-10"
            variants={slideUp}
          >
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300  p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="max-w-none">
                  <h1 className="text-3xl font-bold">{space?.title}</h1>
                  <p className="text-gray-700 whitespace-pre-line">
                    {space?.description}
                  </p>
                </div>
                <Link href={`/profile/${space?.ownerId}`}>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-lg font-medium">{space?.ownerName}</p>
                      <p className="text-sm text-gray-500">Owner</p>
                    </div>
                    <div className="w-12 h-12 rounded overflow-hidden">
                      {space?.ownerAvatar ? (
                        <img
                          src={space?.ownerAvatar || "/placeholder.svg"}
                          alt={space?.ownerName || "Owner"}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                          <span className="text-purple-500 font-medium">
                            {space?.ownerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>

              <div>
                <div className="flex items-center gap-4 text-gray-600">
                  {space?.isPrivate && (
                    <div className="flex items-center text-sm">
                      <Lock size={14} className="mr-1 text-rose-500" />
                      <span className="text-rose-500">Private Space</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Users size={14} className="mr-1 text-purple-500" />
                    <span className="text-purple-500">
                      {space?.subscribers} subscribers
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      Created{" "}
                      {space &&
                        format(new Date(space.createdOn), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Placeholder for threads/content */}
              <div className="mt-2 border-t border-gray-200 pt-6">
                <h2 className="text-xl font-semibold mb-4">Recent Threads</h2>
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">No threads yet in this space.</p>
                  {isOwner && (
                    <motion.button
                      className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md font-medium"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                    >
                      Create First Thread
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpaceView;
