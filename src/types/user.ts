import { Tag } from "@/components/ui/form/TagInput";

export interface User {
  userId: string;
  ownerId?: string;
  avatar?: string;
  name: string;
  email: string;
  bio?: string;
  role: "O" | "A" | "U" | "E";
  onboardComplete: boolean;
  subscribedTags?: Tag[];
}
