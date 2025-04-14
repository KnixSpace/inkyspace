import { apiRequest } from "./api";

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
  createdOn: Date;
}

export interface OwnedSpaces {
  spaceId: string;
  title: string;
  description: string;
  coverImage?: string;
  isPrivate: boolean;
  subscribers: number;
  createdOn: Date;
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

export const toggleNewsletter = (spaceId: string, enable: boolean) =>
  apiRequest("/space/newsletter/toggle", "POST", { spaceId, enable }, {}, true);

export const getOwnerSpacesName = (ownerId: string) =>
  apiRequest<{ spaceId: string; title: string }[]>(
    `/space/list/owned-names/${ownerId}`,
    "GET"
  );

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
