import {
  OwnedSpaces,
  Space,
  SpaceSubscribersResponse,
  SpaceThreadsResponse,
  SubscribedSpace,
  UpdateSpaceData,
} from "@/types/space";
import { apiRequest } from "./api";
import { Tag } from "@/components/ui/form/TagInput";

export const getSubscribedSpaces = () =>
  apiRequest<SubscribedSpace[]>(
    "/space/list/subscribed",
    "GET",
    undefined,
    {},
    true
  );

export const unsubscribeFromSpace = (spaceId: string) =>
  apiRequest("/space/unsubscribe", "POST", { spaceId }, {}, true);

export const subscribeToSpace = (spaceId: string) =>
  apiRequest(`/space/subscribe/${spaceId}`, "POST", {}, {}, true);

export const toggleNewsletter = (spaceId: string) =>
  apiRequest(`/space/newsletter/${spaceId}`, "POST", {}, {}, true);

export const getOwnedSpaces = (ownerId: string) =>
  apiRequest<OwnedSpaces[]>(
    `/space/list/owned-with-subscribers/${ownerId}`,
    "GET"
  );

export const getOwnedSpacesWithSubscribers = (ownerId: string) =>
  apiRequest<OwnedSpaces[]>(
    `/space/list/owned-with-subscribers/${ownerId}`,
    "GET"
  );

export const getOwnerSpacesName = (ownerId: string) =>
  apiRequest<{ spaceId: string; title: string }[]>(
    `/space/list/owned-names/${ownerId}`,
    "GET"
  );

export const createSpace = (data: {
  title: string;
  description: string;
  coverImage?: string;
  isPrivate: boolean;
}) => apiRequest<{ spaceId: string }>("/space/create", "POST", data, {}, true);

export const updateSpace = (spaceId: string, data: UpdateSpaceData) =>
  apiRequest<Space>(`/space/update/${spaceId}`, "PUT", data, {}, true);

export const deleteSpace = (spaceId: string) =>
  apiRequest("/space/delete", "DELETE", { spaceId }, {}, true);

export const getSpaceById = (spaceId: string) =>
  apiRequest<Space>(`/space/${spaceId}`, "GET");

export const getSpaceThreads = (
  spaceId: string,
  pageSize = 5,
  nextPagetoken?: string
) => {
  const url = nextPagetoken
    ? `/space/list/threads/${spaceId}?pageSize=${pageSize}&nextPagetoken=${nextPagetoken}`
    : `/space/list/threads/${spaceId}?pageSize=${pageSize}`;

  return apiRequest<SpaceThreadsResponse>(url, "GET");
};

export const getSpaceSubscriptionStatus = (spaceId: string) =>
  apiRequest<{
    isSubscribed: boolean;
    isNewsletter: boolean;
  }>(`/space/subscription/status/${spaceId}`, "GET", undefined, {}, true);

export const getSpaceSubscribers = (
  spaceId: string,
  pageSize = 10,
  nextPagetoken?: string
) => {
  const url = nextPagetoken
    ? `/space/stats/subscribers/${spaceId}?pageSize=${pageSize}&nextPagetoken=${nextPagetoken}`
    : `/space/stats/subscribers/${spaceId}?pageSize=${pageSize}`;

  return apiRequest<SpaceSubscribersResponse>(url, "GET", undefined, {}, true);
};

export const getAvailableTags = () =>
  apiRequest<Tag[]>("/tags/list", "GET", undefined, {}, true);
