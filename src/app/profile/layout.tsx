import Auth from "@/hoc/Auth";

export default function ProfileLayout({
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
