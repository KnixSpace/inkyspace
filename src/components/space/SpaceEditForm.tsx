"use client";

import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getSpaceById,
  Space,
  updateSpace,
  UpdateSpaceData,
} from "@/lib/apis/space";
import { spaceSchema } from "@/lib/validations/space";
import { yupResolver } from "@hookform/resolvers/yup";
import { mapApiErrors } from "@/lib/apis/api";
import { showMessage } from "../ui/MessageBox";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { buttonHover, buttonTap, slideUp } from "@/lib/animations";
import Link from "next/link";
import ImageUpload from "../ui/ImageUpload";
import { uploadSpaceCoverImage } from "@/lib/cloudinary";

type SpaceFormData = {
  title: string;
  description: string;
  coverImage?: string | null;
  isPrivate: boolean;
};

interface SpaceEditFormProps {
  spaceId: string;
}

const SpaceEditForm = ({ spaceId }: SpaceEditFormProps) => {
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SpaceFormData>({
    resolver: yupResolver(spaceSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImage: null,
      isPrivate: false,
    },
  });

  const fetchSpace = async () => {
    setIsLoading(true);
    try {
      const response = await getSpaceById(spaceId);
      if (response.success && response.data) {
        setSpace(response.data);
        reset({
          title: response.data.title,
          description: response.data.description,
          coverImage: response.data.coverImage || null,
          isPrivate: response.data.isPrivate,
        });
      } else {
        mapApiErrors(response.errors);
        router.push("/settings/space-management");
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
      router.push("/settings/space-management");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpace();
  }, [spaceId]);

  const onSubmit = async (data: SpaceFormData) => {
    if (!space) return;
    try {
      const spaceData: UpdateSpaceData = {
        spaceId,
        title: data.title,
        description: data.description,
        isPrivate: data.isPrivate,
      };

      if (data.coverImage) {
        spaceData.coverImage = data.coverImage;
      }

      const response = await updateSpace(spaceId, spaceData);
      if (response.success) {
        showMessage({
          type: "success",
          message: "Space updated successfully.",
        });
        router.push(`/space/view/${spaceId}`);
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
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
        <motion.div key="space-edit-form" {...slideUp}>
          <div className="flex items-center mb-6">
            <Link href={`/space/view/${spaceId}`}>
              <motion.button
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <h2 className="text-2xl font-semibold">Edit Space</h2>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
              <div>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      whileFocus={{
                        boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.2)",
                      }}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      whileFocus={{
                        boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.2)",
                      }}
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

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <Link href={`/space/view/${spaceId}`}>
                  <motion.button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                    whileHover={buttonHover}
                    whileTap={buttonTap}
                  >
                    Cancel
                  </motion.button>
                </Link>
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  whileHover={
                    !isSubmitting && isDirty ? buttonHover : undefined
                  }
                  whileTap={!isSubmitting && isDirty ? buttonTap : undefined}
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpaceEditForm;
