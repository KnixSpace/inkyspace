import { Tag } from "@/components/ui/form/TagInput";
import { apiRequest } from "./api";

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  subscribedTags?: Tag[] | null;
}

export interface OwnerDetails {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdOn: string;
}

export const getUserProfile = () =>
  apiRequest<UserProfile>("/user/me", "GET", undefined, {}, true);

export const updateUserProfile = (profile: Partial<UserProfile>) =>
  apiRequest<UserProfile>("/user/update", "POST", profile, {}, true);

export const getPublicProfile = (userId: string) =>
  apiRequest<{
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    createdOn: string;
    totalThreads: number;
    totalSpaces: number;
  }>(`/user/public-profile/${userId}`, "GET");

export const getOwnerInfo = () =>
  apiRequest<OwnerDetails>(
    "/user/editor/owner-info",
    "GET",
    undefined,
    {},
    true
  );

export const deleteAccount = () =>
  apiRequest("/user/delete", "DELETE", undefined, {}, true);
