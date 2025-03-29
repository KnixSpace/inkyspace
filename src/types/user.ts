export interface User {
  userId: string;
  name: string;
  email: string;
  role: "O" | "A" | "U";
  onboardComplete: boolean;
  subscribedTags: string[];
}
