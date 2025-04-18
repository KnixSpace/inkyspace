"use client";

import { createSpace } from "@/lib/apis/space";
import { spaceSchema } from "@/lib/validations/space";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { showMessage } from "../ui/MessageBox";
import { mapApiErrors } from "@/lib/apis/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { buttonHover, buttonTap } from "@/lib/animations";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import ImageUpload from "../ui/ImageUpload";
import { useRouter } from "next/navigation";
import { uploadSpaceCoverImage } from "@/lib/cloudinary";
import { CreateSpaceData } from "@/types/space";

type SpaceFormData = {
  title: string;
  description: string;
  coverImage?: string | null;
  isPrivate: boolean;
};

const SpaceCreationForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SpaceFormData>({
    resolver: yupResolver(spaceSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: null,
      isPrivate: false,
    },
  });

  const onSubmit = async (data: SpaceFormData) => {
    setIsSubmitting(true);
    try {
      const spaceData: CreateSpaceData = {
        title: data.title,
        description: data.description,
        isPrivate: data.isPrivate,
      };

      if (data.coverImage) {
        spaceData.coverImage = data.coverImage;
      }

      const response = await createSpace(spaceData);
      if (response.success && response.data) {
        showMessage({
          type: "success",
          message: "Space created successfully!",
        });

        router.push(`/space/view/${response.data.spaceId}`);
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <Link href="/settings/space-management">
          <motion.button
            className="flex items-center text-gray-600 hover:text-gray-900"
            whileHover={buttonHover}
            whileTap={buttonTap}
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Space Management</span>
          </motion.button>
        </Link>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="py-6 space-y-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Cover Image
            </label>
            <Controller
              name="coverImage"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  onImageChange={(url) => field.onChange(url)}
                  initialImage={field.value}
                  aspectRatio="cover"
                  uploadFunction={uploadSpaceCoverImage}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Space Title *
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <motion.input
                  {...field}
                  type="text"
                  className={`w-full px-4 py-1 text-lg border-2 border-dashed rounded-md focus:outline-none  focus:border-purple-500 transition-all ${
                    errors.title ? "border-rose-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Description *
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <motion.textarea
                  {...field}
                  rows={4}
                  className={`w-full px-4 py-1 text-lg border-2 border-dashed rounded-md focus:outline-none  focus:border-purple-500 transition-all ${
                    errors.description ? "border-rose-500" : "border-gray-300"
                  }`}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center">
              <Controller
                name="isPrivate"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                )}
              />
              <label
                htmlFor="isPrivate"
                className="ml-2 block text-sm text-gray-700"
              >
                Make this space private
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Private spaces are only visible to invited editors and
              subscribers.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Link href="/settings/space-management">
              <motion.button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Cancel
              </motion.button>
            </Link>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={!isSubmitting ? buttonHover : undefined}
              whileTap={!isSubmitting ? buttonTap : undefined}
            >
              {isSubmitting ? (
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
                  >
                    <Loader2 size={16} />
                  </motion.div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Create Space</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SpaceCreationForm;
