import Auth from "@/hoc/Auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thread",
  description: "Thread management page",
};

export default function ThreadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Auth>
      <div className="outerContainer">
        <div className="innerContainer">{children}</div>
      </div>
    </Auth>
  );
}
