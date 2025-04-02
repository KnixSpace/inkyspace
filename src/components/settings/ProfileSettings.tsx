"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/lib/apis/user";
import { showMessage } from "@/components/ui/MessageBox";
import { setUser } from "@/redux/features/userSlice";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp, buttonHover, buttonTap, stagger } from "@/lib/animations";
import { mapApiErrors } from "@/lib/apis/api";

const ProfileSettings = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    subscribedTags: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableTags, setAvailableTags] = useState([
    { id: "1", name: "Technology" },
    { id: "2", name: "Business" },
    { id: "3", name: "Health" },
    { id: "4", name: "Science" },
    { id: "5", name: "Arts" },
    { id: "6", name: "Sports" },
    { id: "7", name: "Politics" },
    { id: "8", name: "Travel" },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await getUserProfile();
        if (response.success && response.data) {
          setProfile(response.data);
        } else {
          showMessage({
            type: "error",
            message: "Failed to load profile. Please try again.",
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

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tagId: string) => {
    setProfile((prev) => {
      const subscribedTags = prev.subscribedTags || [];
      if (subscribedTags.includes(tagId)) {
        return {
          ...prev,
          subscribedTags: subscribedTags.filter((id) => id !== tagId),
        };
      } else {
        return {
          ...prev,
          subscribedTags: [...subscribedTags, tagId],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await updateUserProfile(profile);
      if (response.success) {
        showMessage({
          type: "success",
          message: "Profile updated successfully!",
        });
        // Update user in Redux store
        if (user) {
          dispatch(
            setUser({
              ...user,
              name: profile.name,
              avatar: profile.avatar,
            })
          );
        }
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsSaving(false);
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
        <motion.div key="profile-content" {...slideUp}>
          <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <motion.div
                className="md:w-1/3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-300 mb-4"
                    whileHover={{ borderColor: "#a855f7", scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    {profile.avatar ? (
                      <Image
                        src={profile.avatar || "/placeholder.svg"}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl text-gray-400">
                          {profile.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </motion.div>
                  <motion.button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    <Upload size={16} />
                    <span>Upload Avatar</span>
                  </motion.button>
                </div>
              </motion.div>
              <motion.div
                className="md:w-2/3 space-y-4"
                variants={stagger.container}
                initial="initial"
                animate="animate"
              >
                <motion.div variants={stagger.item}>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Name
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                    required
                    whileFocus={{ borderColor: "#a855f7" }}
                  />
                </motion.div>
                <motion.div variants={stagger.item}>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                    disabled
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </motion.div>
                <motion.div variants={stagger.item}>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Bio
                  </label>
                  <motion.textarea
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                    placeholder="Tell us about yourself..."
                    whileFocus={{ borderColor: "#a855f7" }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {user?.role === "U" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Interests
                </label>
                <motion.div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  variants={stagger.container}
                  initial="initial"
                  animate="animate"
                >
                  {availableTags.map((tag) => (
                    <motion.button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={`px-3 py-2 rounded-md border-2 border-dashed text-center transition-all ${
                        profile.subscribedTags?.includes(tag.id)
                          ? "border-purple-500 text-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      variants={stagger.item}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="font-medium">{tag.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <motion.button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-purple-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                whileHover={!isSaving ? buttonHover : {}}
                whileTap={!isSaving ? buttonTap : {}}
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{
                        rotate: 360,
                        transition: {
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        },
                      }}
                      className="mr-2"
                    >
                      <Loader2 className="w-4 h-4" />
                    </motion.div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileSettings;
