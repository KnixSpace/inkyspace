"use client";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import { useAppSelector } from "@/redux/hooks";

export default function ExplorePage() {
  const { user } = useAppSelector((state) => state.user);

  // Check if user needs onboarding
  const needsOnboarding = user && !user.onboardComplete;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>

      {/* Explore page content goes here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          {/* Main content */}
          <p>Explore content will be displayed here</p>
        </div>
        <div>
          {/* Sidebar */}
          <p>Sidebar content</p>
        </div>
      </div>

      {/* Onboarding modal */}
      {needsOnboarding && <OnboardingModal />}
    </div>
  );
}
