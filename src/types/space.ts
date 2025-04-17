import type { ThreadPreview } from "@/types/thread";

export interface Space {
  spaceId: string;
  title: string;
  description: string;
  coverImage?: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  subscribers: number;
  isPrivate: boolean;
  createdOn: string;
  isSubscribed?: boolean;
  isNewsletter?: boolean;
}

export interface OwnedSpaces {
  spaceId: string;
  title: string;
  description: string;
  coverImage?: string;
  isPrivate: boolean;
  subscribers: number;
  createdOn: string;
}

export interface SubscribedSpace extends Space {
  isNewsletter: boolean;
}

export interface CreateSpaceData {
  title: string;
  description: string;
  coverImage?: string;
  isPrivate: boolean;
}

export interface UpdateSpaceData {
  spaceId: string;
  title: string;
  description: string;
  coverImage?: string;
  isPrivate: boolean;
}

export interface SpaceThreadsResponse {
  list: ThreadPreview[];
  nextPagetoken?: string | null;
  totalCount?: number;
}

export interface SpaceSubscriber {
  userId: string;
  name: string;
  avatar?: string;
  isNewsletter: boolean;
  subscribedOn: string;
}

export interface SpaceSubscribersResponse {
  list: SpaceSubscriber[];
  nextPagetoken?: string | null;
  totalCount?: number;
}
