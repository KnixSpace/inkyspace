// components/thread/ThreadForm.jsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OutputData } from "@editorjs/editorjs";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Loader2, Save, SendHorizonal } from "lucide-react";

import ImageUpload from "@/components/ui/ImageUpload";
import { buttonHover, buttonTap } from "@/lib/animations";
import { uploadSpaceCoverImage } from "@/lib/cloudinary";
import { threadSchema } from "@/lib/validations/thread";
import { createThread, sendForApproval } from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import { ThreadFormData } from "@/types/thread";
import TagInput, { Tag } from "../ui/form/TagInput";
import { mapApiErrors } from "@/lib/apis/api";

const EditorComponent = dynamic(
  () => import("@/components/editor/EditorComponent"),
  {
    ssr: false,
    loading: () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-lg"
      >
        Loading editor...
      </motion.div>
    ),
  }
);

interface ThreadFormProps {
  availableSpaces: { spaceId: string; title: string }[];
}

const ThreadCreateForm = ({ availableSpaces }: ThreadFormProps) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [threadTags, setThreadTags] = useState<Tag[]>([]);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorData, setEditorData] = useState<OutputData | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ThreadFormData>({
    resolver: yupResolver(threadSchema),
    defaultValues: {
      title: "",
      coverImage: null,
      tags: [],
      spaceId: availableSpaces.length === 1 ? availableSpaces[0].spaceId : "",
    },
  });

  const handleEditorChange = (data: OutputData) => {
    setEditorError(null);
    setEditorData(data);
  };

  const validateEditorContent = (data: OutputData | null) => {
    if (!data || !data.blocks || data.blocks.length === 0) {
      setEditorError("Content is required");
      return false;
    }

    const hasContent = data.blocks.some((block) => {
      if (block.type === "paragraph" && block.data.text.trim() === "") {
        return false;
      }
      return true;
    });

    if (!hasContent) {
      setEditorError("Content cannot be empty");
      return false;
    }

    return true;
  };

  const handleTagsChange = (newTags: Tag[]) => {
    setThreadTags(newTags);
    setValue("tags", newTags);
  };

  const saveAsDraft = async (data: ThreadFormData) => {
    setIsSaving(true);
    try {
      const response = await createThread({
        ...data,
        content: JSON.stringify(editorData),
      });

      if (response.success && response.data) {
        showMessage({
          type: "success",
          message: "Thread saved as draft successfully!",
        });
        router.push("/settings/threads");
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

  const submitForApproval = async (data: ThreadFormData) => {
    if (!validateEditorContent(editorData)) return;
    setIsSubmitting(true);
    try {
      const createResponse = await createThread({
        ...data,
        content: JSON.stringify(editorData),
      });

      if (createResponse.success && createResponse.data) {
        // Then submit it for approval
        const submitResponse = await sendForApproval(
          createResponse.data.threadId
        );
        if (submitResponse.success) {
          showMessage({
            type: "success",
            message: "Thread submitted for approval successfully!",
          });
          router.push("/settings/threads");
        } else {
          showMessage({
            type: "error",
            message: "Failed to submit thread for approval. Please try again.",
          });
        }
      } else {
        showMessage({
          type: "error",
          message: "Failed to create thread. Please try again.",
        });
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <form className="space-y-6 p-6">
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
            Thread Title *
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <motion.input
                {...field}
                type="text"
                className={`w-full px-4 py-2 border-2 border-dashed rounded-md focus:outline-none focus:border-purple-500 ${
                  errors.title ? "border-rose-500" : "border-gray-300"
                }`}
                whileFocus={{ borderColor: "#a855f7" }}
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Select Space *
          </label>
          <Controller
            name="spaceId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full px-4 py-2 border-2 border-dashed rounded-md focus:outline-none focus:border-purple-500 ${
                  errors.spaceId ? "border-rose-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a space</option>
                {availableSpaces.map((space) => (
                  <option key={space.spaceId} value={space.spaceId}>
                    {space.title}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.spaceId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.spaceId.message}
            </p>
          )}
        </div>

        <TagInput onChange={handleTagsChange} error={errors.tags?.message} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Content *
          </label>
          <EditorComponent onChange={handleEditorChange} />
          {editorError && (
            <p className="text-red-500 text-xs mt-1">{editorError}</p>
          )}
        </motion.div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
          <Link href="/settings/threads">
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
            type="button"
            onClick={handleSubmit(saveAsDraft)}
            disabled={isSaving || isSubmitting}
            className="px-4 py-2 bg-gray-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={!isSaving && !isSubmitting ? buttonHover : undefined}
            whileTap={!isSaving && !isSubmitting ? buttonTap : undefined}
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
                >
                  <Loader2 size={16} />
                </motion.div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save as Draft</span>
              </>
            )}
          </motion.button>
          <motion.button
            type="button"
            onClick={handleSubmit(submitForApproval)}
            disabled={isSaving || isSubmitting}
            className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={!isSaving && !isSubmitting ? buttonHover : undefined}
            whileTap={!isSaving && !isSubmitting ? buttonTap : undefined}
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
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <SendHorizonal size={16} />
                <span>Submit for Approval</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ThreadCreateForm;
