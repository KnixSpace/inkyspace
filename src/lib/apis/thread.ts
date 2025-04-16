import { apiRequest } from "./api";
import type {
  ThreadDetails,
  ThreadFormData,
  ThreadUpdateData,
} from "@/types/thread";
import type {
  CommentList,
  CommentReplyList,
  ThreadInteraction,
} from "@/types/comment";

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
  apiRequest<ThreadDetails>(
    `/thread/update/${data.threadId}`,
    "PUT",
    data,
    {},
    true
  );

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
) =>
  apiRequest(
    `/thread/interact/${threadId}?interaction=${type}`,
    "POST",
    undefined,
    {},
    true
  );

export const getThreadInteractions = (threadId: string) =>
  apiRequest<ThreadInteraction>(
    `/thread/stats/interactions/${threadId}`,
    "GET",
    undefined,
    {},
    true
  );

export const commentOnThread = (threadId: string, comment: string) =>
  apiRequest<{ commentId: string }>(
    `/thread/comment/${threadId}`,
    "POST",
    { comment },
    {},
    true
  );

export const replyToComment = (
  threadId: string,
  parentId: string,
  reply: string
) =>
  apiRequest<{ replyId: string }>(
    `/thread/comment/reply/${threadId}/?parentId=${parentId}`,
    "POST",
    { reply },
    {},
    true
  );

export const getThreadComments = (
  threadId: string,
  pageSize = 5,
  nextPagetoken?: string
) => {
  const url = nextPagetoken
    ? `/thread/list/comments/${threadId}?pageSize=${pageSize}&nextPagetoken=${nextPagetoken}`
    : `/thread/list/comments/${threadId}?pageSize=${pageSize}`;

  return apiRequest<CommentList>(url, "GET");
};

export const getCommentReplies = (
  commentId: string,
  threadId: string,
  pageSize = 5,
  nextPagetoken?: string
) => {
  const url = nextPagetoken
    ? `/thread/list/comment/replies/${threadId}?parentId=${commentId}&pageSize=${pageSize}&nextPagetoken=${nextPagetoken}`
    : `/thread/list/comment/replies/${threadId}?parentId=${commentId}&pageSize=${pageSize}`;

  return apiRequest<CommentReplyList>(url, "GET");
};

export const deleteComment = (commentId: string) =>
  apiRequest(`/thread/comment/${commentId}`, "DELETE", undefined, {}, true);

export const deleteReply = (replyId: string) =>
  apiRequest(`/thread/comment/${replyId}`, "DELETE", undefined, {}, true);

export const getThread = (threadId: string) =>
  apiRequest<ThreadDetails>(`/thread/details/${threadId}`, "GET");

export const getMyThreads = () =>
  apiRequest<ThreadDetails[]>(
    `/thread/list/my-threads`,
    "GET",
    undefined,
    {},
    true
  );

export const getPendingThreads = () =>
  apiRequest<ThreadDetails[]>(
    `/thread/list/pending-approval`,
    "GET",
    undefined,
    {},
    true
  );

export const getThreadDataForEdit = (threadId: string) =>
  apiRequest<ThreadDetails>(
    `/thread/details/edit/${threadId}`,
    "GET",
    undefined,
    {},
    true
  );

export const getThreadDataForPreview = (threadId: string) =>
  apiRequest<ThreadDetails>(
    `/thread/details/preview/${threadId}`,
    "GET",
    undefined,
    {},
    true
  );
