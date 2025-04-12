"use client";

import { useState, useEffect } from "react";
import { getPublicProfile } from "@/lib/apis/user";
import { getOwnedSpacesWithSubscribers, OwnedSpaces } from "@/lib/apis/space";
import { getOwnerThreads } from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import {
  Loader2,
  Calendar,
  Users,
  FileText,
  ImageIcon,
  SquareLibrary,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import SpacesList from "./SpacesList";
import ThreadsList from "./ThreadsList";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideUp, buttonHover, buttonTap } from "@/lib/animations";
import { mapApiErrors } from "@/lib/apis/api";

interface PublicProfileProps {
  ownerId: string;
}

const PublicProfile = ({ ownerId }: PublicProfileProps) => {
  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    createdOn: string;
    totalThreads: number;
    totalSpaces: number;
  } | null>(null);
  const [spaces, setSpaces] = useState<OwnedSpaces[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"spaces" | "threads">("spaces");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile data
        const profileResponse = await getPublicProfile(ownerId);
        if (profileResponse.success && profileResponse.data) {
          setProfile(profileResponse.data);
        } else {
          mapApiErrors(profileResponse.errors);
        }

        // Fetch spaces
        const spacesResponse = await getOwnedSpacesWithSubscribers(ownerId);
        if (spacesResponse.success && spacesResponse.data) {
          setSpaces(spacesResponse.data);
        }

        // Fetch threads
        const threadsResponse = await getOwnerThreads(ownerId);
        if (threadsResponse.success && threadsResponse.data) {
          setThreads(threadsResponse.data);
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

    fetchData();
  }, [ownerId]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            className="-mt-16 h-dvh flex justify-center items-center"
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
        ) : !profile ? (
          <motion.div
            className="-mt-16 h-dvh flex flex-col justify-center text-center"
            {...fadeIn}
          >
            <h2 className="text-2xl font-semibold mb-2">Profile Not Found</h2>
            <p className="text-gray-600">
              The profile you're looking for doesn't exist or has been removed.
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="p-6 rounded-lg border-2 border-dashed border-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex gap-8 ">
                <motion.div
                  className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300"
                  whileHover={{ scale: 1.05, borderColor: "#a855f7" }}
                  transition={{ duration: 0.3 }}
                >
                  {profile.avatar ? (
                    <img
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.name}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="text-gray-400" size={32} />
                    </div>
                  )}
                </motion.div>
                <div className="flex-1">
                  <motion.h1
                    className="text-3xl font-bold mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {profile.name}
                  </motion.h1>
                  <motion.div
                    className="flex flex-wrap justify-center md:justify-start gap-4 mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-1" />
                      <span>
                        Joined{" "}
                        {format(new Date(profile.createdOn), "MMMM yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <SquareLibrary size={16} className="mr-1" />
                      <span>{spaces.length} spaces</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FileText size={16} className="mr-1" />
                      <span>{threads.length} threads</span>
                    </div>
                  </motion.div>
                  {profile.bio && (
                    <motion.p
                      className="text-gray-600 max-w-lg text-justify"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {profile.bio}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="flex border-b border-gray-200">
                <motion.button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "spaces"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("spaces")}
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  Spaces
                </motion.button>
                <motion.button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "threads"
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("threads")}
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  Threads
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === "spaces" ? (
                  <SpacesList spaces={spaces} />
                ) : (
                  <ThreadsList threads={threads} />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicProfile;
