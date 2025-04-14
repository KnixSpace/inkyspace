import { Tag } from "@/components/ui/form/TagInput";
import { OutputData } from "@editorjs/editorjs";

export type ThreadStatus = "D" | "P" | "R" | "A";

export interface Thread {
  threadId: string;
  title: string;
  coverImage?: string;
  content: OutputData | null;
  tags: Tag[];
  editorId: string;
  editorName: string;
  editorAvatar?: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  spaceId: string;
  spaceTitle: string;
  status: ThreadStatus;
  createdOn: string;
  updatedOn: string;
  publishedOn?: string;
  rejectionReason?: string;
}

export interface ThreadFormData {
  title: string;
  coverImage?: string | null;
  tags: Tag[];
  spaceId: string;
}

export interface ThreadUpdateData extends ThreadFormData {
  threadId: string;
  status?: ThreadStatus;
}

export interface ThreadStatusUpdateData {
  threadId: string;
  status: ThreadStatus;
  rejectionReason?: string;
}

export interface ThreadDraftData {
  spaceId?: string;
  title?: string;
  content?: string | null;
  coverImage?: string | null;
  tags?: Tag[];
  status?: ThreadStatus;
  rejectionReason?: string;
}
