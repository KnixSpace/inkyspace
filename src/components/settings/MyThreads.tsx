"use client";

import { useState, useEffect } from "react";
import { getMyThreads, sendForApproval, deleteThread } from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import {
  Loader2,
  Calendar,
  ImageIcon,
  Edit,
  Plus,
  FileText,
  Trash2,
  SendHorizonal,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp, buttonHover, buttonTap, stagger } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";
import { mapApiErrors } from "@/lib/apis/api";
import { Thread, ThreadDetails } from "@/types/thread";

const statusColors = {
  D: "bg-gray-100 text-gray-700",
  A: "bg-yellow-100 text-yellow-700",
  R: "bg-rose-100 text-rose-700",
  P: "bg-green-100 text-green-700",
};

const statusLabels = {
  D: "Draft",
  A: "Awaiting Approval",
  R: "Revision Needed",
  P: "Published",
};

const MyThreads = () => {
  const { user } = useAppSelector((state) => state.user);
  const [threads, setThreads] = useState<ThreadDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "D" | "A" | "R" | "P"
  >("all");
  const [threadToDelete, setThreadToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    setIsLoading(true);
    try {
      const response = await getMyThreads();
      if (response.success && response.data) {
        setThreads(response.data);
      } else {
        mapApiErrors(response.errors);
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

  const handleSubmitForApproval = async (threadId: string) => {
    setActionInProgress(threadId);
    try {
      const response = await sendForApproval(threadId);
      if (response.success) {
        setThreads(
          threads.map((thread) =>
            thread.threadId === threadId ? { ...thread, status: "A" } : thread
          )
        );
        showMessage({
          type: "success",
          message: "Thread submitted for approval successfully!",
        });
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const confirmDeleteThread = (threadId: string) => {
    setThreadToDelete(threadId);
  };

  const handleDeleteThread = async () => {
    if (!threadToDelete) return;

    setActionInProgress(threadToDelete);
    try {
      const response = await deleteThread(threadToDelete);
      if (response.success) {
        setThreads(
          threads.filter((thread) => thread.threadId !== threadToDelete)
        );
        showMessage({
          type: "success",
          message: "Thread deleted successfully!",
        });
        setThreadToDelete(null);
      } else {
        mapApiErrors(response.errors);
      }
    } catch (error) {
      showMessage({
        type: "error",
        message: "An unexpected error occurred.",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const filteredThreads =
    activeFilter === "all"
      ? threads
      : threads.filter((thread) => thread.status === activeFilter);

  const isEditor = user?.role === "E";

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
        <motion.div key="threads-content" {...slideUp}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Threads</h2>
            {isEditor && (
              <Link href="/thread/create">
                <motion.button
                  className="px-4 py-2 bg-purple-500 text-white rounded-md font-medium flex items-center gap-2"
                  whileHover={buttonHover}
                  whileTap={buttonTap}
                >
                  <Plus size={16} />
                  <span>Create Thread</span>
                </motion.button>
              </Link>
            )}
          </div>

          <div className="mb-6 overflow-x-auto">
            <div className="flex border-b border-gray-200 whitespace-nowrap">
              <motion.button
                className={`px-4 py-2 font-medium ${
                  activeFilter === "all"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveFilter("all")}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                All Threads
              </motion.button>
              <motion.button
                className={`px-4 py-2 font-medium ${
                  activeFilter === "D"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveFilter("D")}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Drafts
              </motion.button>
              <motion.button
                className={`px-4 py-2 font-medium ${
                  activeFilter === "A"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveFilter("A")}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Awaiting Approval
              </motion.button>
              <motion.button
                className={`px-4 py-2 font-medium ${
                  activeFilter === "R"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveFilter("R")}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Revision Needed
              </motion.button>
              <motion.button
                className={`px-4 py-2 font-medium ${
                  activeFilter === "P"
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveFilter("P")}
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Published
              </motion.button>
            </div>
          </div>

          {filteredThreads.length === 0 ? (
            <motion.div
              className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {activeFilter === "all" ? (
                <div>
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">
                    You haven't created any threads yet.
                  </p>
                  {isEditor && (
                    <Link href="/thread/create">
                      <motion.button
                        className="px-6 py-2 bg-purple-500 text-white rounded-md font-medium"
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                      >
                        Create Your First Thread
                      </motion.button>
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  No {statusLabels[activeFilter]} threads found.
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={stagger.container}
              initial="initial"
              animate="animate"
            >
              {filteredThreads.map((thread) => (
                <motion.div
                  key={thread.threadId}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg"
                  variants={stagger.item}
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                      {thread.coverImage ? (
                        <img
                          src={thread.coverImage || "/placeholder.svg"}
                          alt={thread.title}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="text-gray-400" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg">
                          {thread.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${statusColors[thread.status]}`}
                        >
                          {statusLabels[thread.status]}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 gap-4 mb-2">
                        <span className="py-0.5 px-1.5 rounded bg-purple-100 text-purple-500">
                          {thread.spaceDetails.title}
                        </span>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {thread.status === "P" && thread.publishedOn
                              ? `Published ${format(new Date(thread.publishedOn), "MMM d, yyyy")}`
                              : `Created ${format(new Date(thread.createdOn), "MMM d, yyyy")}`}
                          </span>
                        </div>
                      </div>
                      {user?.role === "O" && (
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                          {thread.editorDetails.avatar ? (
                            <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0 mr-2">
                              <img
                                src={
                                  thread.editorDetails.avatar ||
                                  "/placeholder.svg"
                                }
                                alt={thread.editorDetails.name}
                                className="object-cover w-full h-full"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded bg-gray-100 flex justify-center items-center">
                              {thread.editorDetails.name
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                          <span className="mr-3">
                            {thread.editorDetails.name}
                          </span>
                        </div>
                      )}

                      {thread.status === "R" && thread.rejectionReason && (
                        <div className="mt-2 p-2 bg-rose-50 rounded text-sm text-rose-700">
                          <strong>Revision reason:</strong>{" "}
                          {thread.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    {isEditor && (
                      <>
                        {thread.status === "D" && (
                          <motion.button
                            onClick={() =>
                              handleSubmitForApproval(thread.threadId)
                            }
                            disabled={actionInProgress === thread.threadId}
                            className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-purple-100 text-purple-700 hover:bg-purple-200"
                            whileHover={
                              actionInProgress !== thread.threadId
                                ? buttonHover
                                : undefined
                            }
                            whileTap={
                              actionInProgress !== thread.threadId
                                ? buttonTap
                                : undefined
                            }
                          >
                            {actionInProgress === thread.threadId ? (
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
                                <Loader2 className="w-4 h-4" />
                              </motion.div>
                            ) : (
                              <>
                                <SendHorizonal size={14} className="mr-1" />{" "}
                                Submit
                              </>
                            )}
                          </motion.button>
                        )}

                        <Link href={`/thread/edit/${thread.threadId}`}>
                          <motion.button
                            className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200"
                            whileHover={buttonHover}
                            whileTap={buttonTap}
                          >
                            <Edit size={14} className="mr-1" /> Edit
                          </motion.button>
                        </Link>
                      </>
                    )}

                    {thread.status !== "P" ? (
                      <Link href={`/thread/preview/${thread.threadId}`}>
                        <motion.button
                          className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                          whileHover={buttonHover}
                          whileTap={buttonTap}
                        >
                          <Eye size={14} className="mr-1" /> Preview
                        </motion.button>
                      </Link>
                    ) : (
                      <Link href={`/thread/view/${thread.threadId}`}>
                        <motion.button
                          className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                          whileHover={buttonHover}
                          whileTap={buttonTap}
                        >
                          <Eye size={14} className="mr-1" /> View
                        </motion.button>
                      </Link>
                    )}

                    {(user?.role === "O" || user?.role === "E") && (
                      <motion.button
                        onClick={() => confirmDeleteThread(thread.threadId)}
                        disabled={actionInProgress === thread.threadId}
                        className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-rose-100 text-rose-700 hover:bg-rose-200"
                        whileHover={
                          actionInProgress !== thread.threadId
                            ? buttonHover
                            : undefined
                        }
                        whileTap={
                          actionInProgress !== thread.threadId
                            ? buttonTap
                            : undefined
                        }
                      >
                        {actionInProgress === thread.threadId ? (
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
                            <Loader2 className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <>
                            <Trash2 size={14} className="mr-1" /> Delete
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <AnimatePresence>
            {threadToDelete && (
              <motion.div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-lg p-6 w-full max-w-md"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <h3 className="text-xl font-semibold mb-4">Delete Thread</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this thread? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end gap-2">
                    <motion.button
                      onClick={() => setThreadToDelete(null)}
                      className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-md"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleDeleteThread}
                      disabled={actionInProgress === threadToDelete}
                      className="px-4 py-2 bg-rose-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      whileHover={
                        actionInProgress !== threadToDelete
                          ? buttonHover
                          : undefined
                      }
                      whileTap={
                        actionInProgress !== threadToDelete
                          ? buttonTap
                          : undefined
                      }
                    >
                      {actionInProgress === threadToDelete ? (
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
                          Deleting...
                        </>
                      ) : (
                        "Delete Thread"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MyThreads;

// {
//   ["D", "A", "R"].includes(thread.status) && (
//     <motion.button
//       onClick={() => confirmDeleteThread(thread.threadId)}
//       disabled={actionInProgress === thread.threadId}
//       className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-rose-100 text-rose-700 hover:bg-rose-200"
//       whileHover={
//         actionInProgress !== thread.threadId ? buttonHover : undefined
//       }
//       whileTap={actionInProgress !== thread.threadId ? buttonTap : undefined}
//     >
//       {actionInProgress === thread.threadId ? (
//         <motion.div
//           animate={{
//             rotate: 360,
//             transition: {
//               duration: 1,
//               repeat: Number.POSITIVE_INFINITY,
//               ease: "linear",
//             },
//           }}
//         >
//           <Loader2 className="w-4 h-4" />
//         </motion.div>
//       ) : (
//         <>
//           <Trash2 size={14} className="mr-1" /> Delete
//         </>
//       )}
//     </motion.button>
//   );
// }
