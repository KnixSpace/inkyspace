"use client";

import { useState, useEffect } from "react";
import {
  getPendingThreads,
  publishThread,
  requestThreadCorrections,
} from "@/lib/apis/thread";
import { showMessage } from "@/components/ui/MessageBox";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  ImageIcon,
  Eye,
  User2,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { slideUp, buttonHover, buttonTap, stagger } from "@/lib/animations";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import { mapApiErrors } from "@/lib/apis/api";
import { Thread } from "@/types/thread";

const ThreadApprovals = () => {
  const { user } = useAppSelector((state) => state.user);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [threadToReject, setThreadToReject] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingThreads();
  }, []);

  const fetchPendingThreads = async () => {
    setIsLoading(true);
    try {
      const response = await getPendingThreads();
      if (response.success) {
        setThreads(response.data || []);
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

  const handleApproveThread = async (threadId: string) => {
    setActionInProgress(threadId);
    try {
      const response = await publishThread(threadId);
      if (response.success) {
        setThreads(threads.filter((thread) => thread.threadId !== threadId));
        showMessage({
          type: "success",
          message: "Thread approved successfully!",
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

  const openRejectDialog = (threadId: string) => {
    setThreadToReject(threadId);
    setRejectReason("");
  };

  const handleRejectThread = async () => {
    if (!threadToReject) return;

    if (!rejectReason.trim()) {
      showMessage({
        type: "error",
        message: "Please provide a reason for rejection.",
      });
      return;
    }

    setActionInProgress(threadToReject);
    try {
      const response = await requestThreadCorrections(
        threadToReject,
        rejectReason
      );
      if (response.success) {
        setThreads(
          threads.filter((thread) => thread.threadId !== threadToReject)
        );
        setThreadToReject(null);
        showMessage({
          type: "success",
          message: "Thread rejected successfully!",
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

  const isOwner = user?.role === "O";

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
          <h2 className="text-2xl font-semibold mb-6">Thread Approvals</h2>

          {threads.length === 0 ? (
            <motion.div
              className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-gray-500">No pending threads to review.</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              variants={stagger.container}
              initial="initial"
              animate="animate"
            >
              {threads.map((thread) => (
                <motion.div
                  key={thread.threadId}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg"
                  variants={stagger.item}
                  layout
                  exit={{
                    opacity: 0,
                    x: -20,
                    transition: { duration: 0.3 },
                  }}
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
                      <h3 className="font-semibold text-lg">{thread.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span className="mr-3 px-1 py-0.5 rounded bg-purple-100 text-purple-500">
                          {thread.spaceTitle}
                        </span>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>
                            {format(new Date(thread.createdOn), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      {user?.role === "O" && (
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                          {thread.editorAvatar ? (
                            <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0 mr-2">
                              <img
                                src={thread.editorAvatar || "/placeholder.svg"}
                                alt={thread.editorName}
                                className="object-cover w-full h-full"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded bg-gray-100 flex justify-center items-center">
                              {thread.editorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="mr-3">{thread.editorName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <Link href={`/thread/view/${thread.threadId}`}>
                      <motion.button
                        className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                        whileHover={buttonHover}
                        whileTap={buttonTap}
                      >
                        <Eye size={16} className="mr-1" /> Preview
                      </motion.button>
                    </Link>

                    {isOwner && (
                      <>
                        <motion.button
                          onClick={() => openRejectDialog(thread.threadId)}
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
                              <XCircle size={16} className="mr-1" /> Reject
                            </>
                          )}
                        </motion.button>
                        <motion.button
                          onClick={() => handleApproveThread(thread.threadId)}
                          disabled={actionInProgress === thread.threadId}
                          className="px-3 py-1 rounded-md text-sm font-medium flex items-center justify-center bg-green-100 text-green-700 hover:bg-green-200"
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
                              <CheckCircle size={16} className="mr-1" /> Approve
                            </>
                          )}
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <AnimatePresence>
            {threadToReject && (
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
                  <h3 className="text-xl font-semibold mb-4">Reject Thread</h3>
                  <p className="text-gray-600 mb-4">
                    Please provide a reason for rejecting this thread. This will
                    be sent to the author.
                  </p>
                  <div className="mb-4">
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:border-rose-500"
                      rows={4}
                      placeholder="Enter rejection reason..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <motion.button
                      onClick={() => setThreadToReject(null)}
                      className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-md"
                      whileHover={buttonHover}
                      whileTap={buttonTap}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleRejectThread}
                      disabled={
                        !rejectReason.trim() ||
                        actionInProgress === threadToReject
                      }
                      className="px-4 py-2 bg-rose-500 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      whileHover={
                        rejectReason.trim() &&
                        actionInProgress !== threadToReject
                          ? buttonHover
                          : undefined
                      }
                      whileTap={
                        rejectReason.trim() &&
                        actionInProgress !== threadToReject
                          ? buttonTap
                          : undefined
                      }
                    >
                      {actionInProgress === threadToReject ? (
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
                          Rejecting...
                        </>
                      ) : (
                        "Confirm Rejection"
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

export default ThreadApprovals;
