export interface BaseComment {
  commentId: string;
  threadId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdOn: string;
}

export interface CommentReplyItem extends BaseComment {
  parentId: string;
  reply: string;
}

export interface CommentItem extends BaseComment {
  comment: string;
  replies?: number;
  repliesList?: CommentReplyItem[];
}

export interface CommentList {
  list: CommentItem[];
  nextPagetoken?: string | null;
}

export interface CommentReplyList {
  list: CommentReplyItem[];
  nextPagetoken?: string | null;
}

export interface ThreadInteractionItem {
  threadId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  interaction: "like" | "unlike";
}

export interface ThreadInteraction {
  list: ThreadInteractionItem[];
  nextPagetoken?: string | null;
}
