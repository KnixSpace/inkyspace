"use client";

import { Users, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { stagger, cardHover } from "@/lib/animations";
import { OwnedSpaces } from "@/types/space";

interface SpacesListProps {
  spaces: OwnedSpaces[];
}

const SpacesList = ({ spaces }: SpacesListProps) => {
  if (spaces.length === 0) {
    return (
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-gray-500">No spaces found</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={stagger.container}
      initial="initial"
      animate="animate"
    >
      {spaces.map((space) => (
        <motion.div
          key={space.spaceId}
          variants={stagger.item}
          whileHover={cardHover}
        >
          <Link
            href={`/space/view/${space.spaceId}`}
            className="block bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden transition-shadow"
          >
            <div className="relative h-40 w-full bg-gray-100">
              {space.coverImage ? (
                <Image
                  src={space.coverImage || "/placeholder.svg"}
                  alt={space.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="text-gray-400" size={32} />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{space.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {space.description}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  Created {format(new Date(space.createdOn), "MMM d, yyyy")}
                </span>
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  <span>{space.subscribers} subscribers</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SpacesList;
