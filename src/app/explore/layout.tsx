import Auth from "@/hoc/Auth";
import { ReactNode } from "react";

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return <Auth>{children}</Auth>;
}
