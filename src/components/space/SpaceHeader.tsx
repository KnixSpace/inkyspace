"use client";
import { motion } from "framer-motion";
import { Calendar, Lock, Users, ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { buttonHover, buttonTap, fadeIn } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";
import { Space } from "@/types/space";

interface SpaceHeaderProps {
  space: Space;
  onSubscribersClick: () => void;
}

const SpaceHeader = ({ space, onSubscribersClick }: SpaceHeaderProps) => {
  const user = useAppSelector((state) => state.user.user);
  const isOwner = user?.userId === space.ownerId;
  const isEditor = user?.role === "E";

  return (
    <>
      {/* Cover image */}
      <motion.div
        className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden"
        variants={fadeIn}
      >
        {space.coverImage ? (
          <img
            src={space.coverImage || "/placeholder.svg"}
            alt={space.title}
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
            <Link href={`/space/edit/${space.spaceId}`}>
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
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="max-w-none">
              <h1 className="text-3xl font-bold">{space.title}</h1>
              <p className="text-gray-700 whitespace-pre-line">
                {space.description}
              </p>
            </div>
            <Link href={`/profile/${space.ownerId}`}>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-lg font-medium">{space.ownerName}</p>
                  <p className="text-sm text-gray-500">Owner</p>
                </div>
                <div className="w-12 h-12 rounded overflow-hidden">
                  {space.ownerAvatar ? (
                    <img
                      src={space.ownerAvatar || "/placeholder.svg"}
                      alt={space.ownerName || "Owner"}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-500 font-medium">
                        {space.ownerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              {space.isPrivate && (
                <div className="flex items-center text-sm">
                  <Lock size={14} className="mr-1 text-rose-500" />
                  <span className="text-rose-500">Private Space</span>
                </div>
              )}
              <motion.button
                className="flex items-center text-sm"
                onClick={onSubscribersClick}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <Users size={14} className="mr-1 text-purple-500" />
                <span className="text-purple-500">
                  {space.subscribers} subscribers
                </span>
              </motion.button>
              <div className="flex items-center text-sm">
                <Calendar size={14} className="mr-1" />
                <span>
                  Created{" "}
                  {space && format(new Date(space.createdOn), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpaceHeader;
