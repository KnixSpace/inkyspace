"use client";

import { useState, useEffect } from "react";
import { showMessage } from "@/components/ui/MessageBox";
import {
  Loader2,
  Mail,
  Calendar,
  UserCircle2,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp, stagger } from "@/lib/animations";
import { getOwnerInfo, OwnerDetails } from "@/lib/apis/user";
import { mapApiErrors } from "@/lib/apis/api";

const OwnerInfo = () => {
  const [owner, setOwner] = useState<OwnerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      setIsLoading(true);
      try {
        const response = await getOwnerInfo();
        console.log(response);
        if (response.success && response.data) {
          setOwner({
            userId: response.data?.userId,
            name: response.data?.name,
            email: response.data?.email,
            avatar: response.data?.avatar,
            bio: response.data?.bio,
            createdOn: response.data?.createdOn,
          });
        } else {
          mapApiErrors(response.errors);
        }
      } catch (error) {
        showMessage({
          type: "error",
          message: "Failed to load owner information. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnerInfo();
  }, []);

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
      ) : !owner ? (
        <motion.div className="text-center py-8" {...slideUp}>
          <p className="text-gray-500">Owner information not available.</p>
        </motion.div>
      ) : (
        <motion.div key="owner-content" {...slideUp}>
          <h2 className="text-2xl font-semibold mb-6">Owner</h2>

          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              className="md:w-1/3 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-dashed border-gray-300 mb-4">
                {owner.avatar ? (
                  <Image
                    src={owner.avatar || "/placeholder.svg"}
                    alt={owner.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <UserCircle2 className="text-gray-400" size={64} />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold">{owner.name}</h3>
            </motion.div>

            <motion.div
              className="md:w-2/3"
              variants={stagger.container}
              initial="initial"
              animate="animate"
            >
              <motion.div className="mb-6" variants={stagger.item}>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-600">
                  {owner.bio || "No bio available."}
                </p>
              </motion.div>

              <motion.div className="space-y-3" variants={stagger.item}>
                <h3 className="text-lg font-semibold mb-2">
                  Contact Information
                </h3>

                <div className="flex items-center gap-2">
                  <Mail className="text-gray-400" size={18} />
                  <span>{owner.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-400" size={18} />
                  <span>
                    Joined {format(new Date(owner.createdOn), "MMMM yyyy")}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OwnerInfo;
