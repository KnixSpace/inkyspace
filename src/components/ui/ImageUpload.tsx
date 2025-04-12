"use client";

import { buttonHover, buttonTap } from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface ImageUploadProps {
  onImageChange: (imageUrl: string | null) => void;
  initialImage?: string | null;
  aspectRatio?: "square" | "cover" | "banner";
  uploadFunction: (file: File) => Promise<string>;
}

const ImageUpload = ({
  onImageChange,
  initialImage = null,
  aspectRatio = "square",
  uploadFunction,
}: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: "aspect-square",
    cover: "aspect-[5/1]",
    banner: "aspect-[5/2]",
  };

  useEffect(() => {
    if (initialImage) {
      setImageUrl(initialImage);
    } else {
      setImageUrl(null);
    }
  }, [initialImage]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const url = await uploadFunction(file);
      setImageUrl(url);
      onImageChange(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <AnimatePresence mode="wait">
        <div className="w-full h-full">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`${aspectRatioClasses[aspectRatio]} bg-gray-100 rounded-lg flex items-center justify-center`}
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
          ) : imageUrl ? (
            <motion.div
              key="image"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`relative ${aspectRatioClasses[aspectRatio]} rounded-lg overflow-hidden group`}
            >
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Uploaded image"
                className="object-cover"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gray-400/80 flex items-center justify-center gap-2"
              >
                <motion.button
                  onClick={triggerFileInput}
                  className="p-2 bg-white rounded-full text-gray-700"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <Upload size={16} />
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={triggerFileInput}
              className={`${aspectRatioClasses[aspectRatio]} border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition-colors`}
            >
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to upload image</p>
              <p className="text-xs text-gray-400 mt-1">
                JPEG, PNG, WebP (max 5MB)
              </p>
            </motion.div>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs mt-1"
            >
              {error}
            </motion.p>
          )}
        </div>
      </AnimatePresence>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
