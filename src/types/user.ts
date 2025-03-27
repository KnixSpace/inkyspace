export interface User {
  userId: string;
  name: string;
  email: string;
  role: "O" | "A" | "U";
  subscribedTags: string[];
}
