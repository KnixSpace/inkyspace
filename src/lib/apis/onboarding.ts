import { Tag } from "@/components/ui/form/TagInput";
import { apiRequest } from "./api";

export const fetchTags = () =>
  apiRequest<{ id: string; name: string }[]>(
    "/thread/list/tags",
    "GET",
    undefined,
    {},
    true
  );

export const submitTags = (tags: Tag[]) =>
  apiRequest("/user/selected/tags", "POST", { tags }, {}, true);

export const fetchSuggestedSpaces = (tags: string[]) =>
  apiRequest<
    {
      spaceId: string;
      title: string;
      coverImage: string | null;
      description: string;
      ownerName: string;
      subscribers: number;
    }[]
  >("/space/list/suggested", "POST", { tags }, {}, true);

export const subscribeToSpaces = (
  spaces: {
    spaceId: string;
    isNewsletter: boolean;
  }[]
) => apiRequest(`/space/multi/subscribe`, "POST", { spaces }, {}, true);

export const completeOnboarding = () =>
  apiRequest("/user/onboarding", "POST", {}, {}, true);
