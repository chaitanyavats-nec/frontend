/**
 * src/hooks/useFeed.ts
 * 
 * Hook for managing the main content feed, switching between mock data
 * and real Supabase queries based on configuration.
 */

import { useQuery } from "@tanstack/react-query";
import { getFeedPosts } from "@/lib/queries/posts";
import { FeedMode } from "@/types";

export function useFeed(mode: FeedMode, topicTags?: string[]) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["feed", mode, topicTags],
    queryFn: async () => {
      return getFeedPosts({
        topicTags,
        authorId: mode === "following" ? "TODO_AUTH_USER_ID" : undefined,
      });
    },
  });

  return {
    posts: data || [],
    loading: isLoading,
    error: error as Error | null,
  };
}
