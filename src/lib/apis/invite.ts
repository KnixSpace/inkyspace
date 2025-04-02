import { apiRequest } from "./api";

export interface Invite {
  inviteId: string;
  userEmail: string;
  isAccepted: boolean;
  createdOn: string;
  updatedOn: string;
}

export interface Editor {
  inviteId: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  createdOn: string;
}

export const createInvite = (emails: string[]) =>
  apiRequest<{ success: boolean; invited: number; failed: number }>(
    "/invite/create",
    "POST",
    { emails },
    {},
    true
  );

export const acceptInvite = (token: string, name: string, password: string) =>
  apiRequest(`/invite/accept/${token}`, "POST", { name, password }, {}, true);

export const resendInvite = (inviteId: string) =>
  apiRequest(`/invite/resend/${inviteId}`, "POST", {}, {}, true);

export const verifyEditorInvite = (token: string) =>
  apiRequest<{ isAccepted: boolean }>(`/invite/verify/${token}`, "GET");

export const deleteInvite = (inviteId: string) =>
  apiRequest(`/invite/delete/${inviteId}`, "DELETE", {}, {}, true);

export const removeEditor = (inviteId: string) =>
  apiRequest(
    `/invite/delete/editor/${inviteId}`,
    "DELETE",
    undefined,
    {},
    true
  );

export const getPendingInvites = () =>
  apiRequest<Invite[]>("/invite/list/pending", "GET", undefined, {}, true);

export const getEditors = () =>
  apiRequest<Editor[]>(
    "/invite/list/invited-editors",
    "GET",
    undefined,
    {},
    true
  );
