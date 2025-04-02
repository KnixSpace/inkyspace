import type React from "react";
import Auth from "@/hoc/Auth";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - InkySpace",
  description: "Manage your InkySpace account settings",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Auth>
      <div className="outerContainer">
        <div className="innerContainer py-20">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <SettingsSidebar />
            </div>
            <div className="md:w-3/4">
              <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Auth>
  );
}
