"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import ExploreSearchBar from "@/components/explore/ExploreSearchBar";
import ThreadListSection from "@/components/explore/ThreadListSection";
import PaginationLoader from "@/components/explore/PaginationLoader";
import { getFeaturedThreads } from "@/lib/apis/thread";
import { useAppSelector } from "@/redux/hooks";
import { pageTransition } from "@/lib/animations";
import type { ThreadDetails } from "@/types/thread";

export default function ExplorePage() {
  const { user } = useAppSelector((state) => state.user);
  const needsOnboarding = user && !user.onboardComplete && user.role !== "E";

  const [threads, setThreads] = useState<ThreadDetails[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<ThreadDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [nextPagetoken, setNextPagetoken] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial threads
  const fetchThreads = useCallback(
    async (pageToken?: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getFeaturedThreads("TRENDING", 12, pageToken);

        if (response.success && response.data) {
          if (pageToken) {
            // Append new threads to existing ones
            setThreads((prevThreads) => [
              ...prevThreads,
              ...(response.data?.list || []),
            ]);
            setFilteredThreads((prevThreads) => {
              const newThreads = [...prevThreads, ...response.data?.list || []];
              return filterThreads(newThreads, searchQuery);
            });
          } else {
            // Initial load
            setThreads(response.data?.list || []);
            setFilteredThreads(response.data?.list || []);
          }

          // Update pagination state
          setNextPagetoken(response.data?.nextPagetoken);
          setHasMore(!!response.data?.nextPagetoken);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching threads:", err);
        setError("Failed to load threads. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery]
  );

  // Load more threads when scrolling
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore && nextPagetoken) {
      fetchThreads(nextPagetoken);
    }
  }, [fetchThreads, hasMore, isLoading, nextPagetoken]);

  // Filter threads based on search query
  const filterThreads = (
    threadsToFilter: ThreadDetails[],
    query: string
  ): ThreadDetails[] => {
    if (!query.trim()) return threadsToFilter;

    const lowercaseQuery = query.toLowerCase().trim();

    return threadsToFilter.filter((thread) => {
      // Check title match
      const titleMatch = thread.title.toLowerCase().includes(lowercaseQuery);

      // Check tag match
      const tagMatch = thread.tags.some((tag) =>
        tag.name.toLowerCase().includes(lowercaseQuery)
      );

      return titleMatch || tagMatch;
    });
  };

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setFilteredThreads(filterThreads(threads, query));
    },
    [threads]
  );

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setFilteredThreads(threads);
  }, [threads]);

  // Initial fetch
  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return (
    <motion.div className="container mx-auto px-4 py-8" {...pageTransition}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore</h1>
        <p className="text-gray-600">
          Discover trending threads from the InkySpace community
        </p>
      </div>

      {/* Search bar */}
      <ExploreSearchBar onSearch={handleSearch} searchQuery={searchQuery} />

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Thread list */}
      <ThreadListSection
        threads={filteredThreads}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
      />

      {/* Pagination loader */}
      <PaginationLoader
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />

      {/* Onboarding modal */}
      {needsOnboarding && <OnboardingModal />}
    </motion.div>
  );
}
