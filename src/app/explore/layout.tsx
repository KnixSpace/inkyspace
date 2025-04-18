import Auth from "@/hoc/Auth";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Explore - InkySpace",
  description: "Discover content from writers around the world",
};

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <Auth>
      <div className="outerContainer">
        <div className="innerContainer">{children}</div>
      </div>
    </Auth>
  );
}
