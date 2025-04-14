import { apiRequest } from "./api";
import type { Thread, ThreadFormData, ThreadUpdateData } from "@/types/thread";

export const createThread = (
  data: ThreadFormData & {
    content: string;
  }
) => apiRequest<{ threadId: string }>("/thread/create", "POST", data, {}, true);

export const updateThread = (
  data: ThreadUpdateData & {
    content: string;
  }
) =>
  apiRequest<Thread>(`/thread/update/${data.threadId}`, "PUT", data, {}, true);

export const deleteThread = (threadId: string) =>
  apiRequest(`/thread/delete/${threadId}`, "DELETE", undefined, {}, true);

export const sendForApproval = (threadId: string) =>
  apiRequest(
    `/thread/send-for-approval/${threadId}`,
    "POST",
    undefined,
    {},
    true
  );

export const requestThreadCorrections = (
  threadId: string,
  rejectionReason: string
) =>
  apiRequest(
    `/thread/request-correction/${threadId}`,
    "POST",
    { rejectionReason },
    {},
    true
  );

export const publishThread = (threadId: string) =>
  apiRequest(`/thread/publish/${threadId}`, "POST", undefined, {}, true);

export const toggleThreadInteraction = (
  type: "like" | "unlike",
  threadId: string
) => apiRequest(`/thread/${threadId}?${type}`, "POST", undefined, {}, true);

export const commentOnThread = (
  threadId: string,
  comment: string,
  parentId?: string
) =>
  apiRequest(
    `/thread/comment/${threadId}`,
    "POST",
    { comment, parentId },
    {},
    true
  );

export const replyToComment = (
  threadId: string,
  parentId: string,
  reply: string
) =>
  apiRequest(
    `/thread/comment/reply/${threadId}/?${parentId}`,
    "POST",
    { reply },
    {},
    true
  );

export const deleteComment = (commentId: string) =>
  apiRequest(`/thread/comment/${commentId}`, "DELETE", undefined, {}, true);

export const deleteReply = (replyId: string) =>
  apiRequest(`/thread/comment/${replyId}`, "DELETE", undefined, {}, true);

export const getMyThreads = () =>
  apiRequest<Thread[]>(`/thread/list/my-threads`, "GET", undefined, {}, true);

export const getPendingThreads = () =>
  apiRequest<Thread[]>(
    `/thread/list/pending-approval`,
    "GET",
    undefined,
    {},
    true
  );

export const getThreadDataForEdit = (threadId: string) =>
  apiRequest<Thread>(
    `/thread/details/edit/${threadId}`,
    "GET",
    undefined,
    {},
    true
  );
