import { apiRequest } from "./api";

export const fetchTags = () =>
  apiRequest<{ id: string; name: string }[]>(
    "/tags/list/trending",
    "GET",
    undefined,
    {},
    true
  );

export const submitTags = (tagIds: string[]) =>
  apiRequest("/tags/user", "POST", { tagIds }, {}, true);

export const fetchSuggestedSpaces = (tagsIds: string[]) =>
  apiRequest<
    {
      spaceId: string;
      title: string;
      image: string | null;
      description: string;
      ownerName: string;
      subscribers: number;
    }[]
  >("/spaces/suggested", "POST", { tagsIds }, {}, true);

export const subscribeToSpaces = (
  spaces: {
    spaceId: string;
    isNewsletter: boolean;
  }[]
) => apiRequest(`/spaces/multi/subscribe`, "POST", { spaces }, {}, true);

export const completeOnboarding = () =>
  apiRequest("/user/onboarding", "POST", {}, {}, true);
