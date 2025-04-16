import { Tag } from "@/components/ui/form/TagInput";

export type ThreadStatus = "D" | "P" | "R" | "A";

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

export interface ThreadDraftData {
  spaceId?: string;
  title?: string;
  content?: string | null;
  coverImage?: string | null;
  tags?: Tag[];
  status?: ThreadStatus;
  rejectionReason?: string;
}

export interface ThreadDetails {
  threadId: string;
  spaceId: string;
  ownerId: string;
  editorId: string;
  title: string;
  content: string;
  coverImage?: string;
  tags: Tag[];
  status: ThreadStatus;
  createdOn: string;
  updatedOn: string;
  publishedOn?: string;
  rejectionReason?: string;
  ownerDetails: {
    name: string;
    avatar?: string;
  };
  editorDetails: {
    name: string;
    avatar?: string;
  };
  spaceDetails: {
    title: string;
    coverImage?: string;
  };
  subscribersCount: number;
  interactionsCount: number;
}
