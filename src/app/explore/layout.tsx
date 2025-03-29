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
      <main className="min-h-screen bg-gray-50">{children}</main>
    </Auth>
  );
}
