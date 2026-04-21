/**
 * src/hooks/useFeed.ts
 * 
 * Hook for managing the main content feed, switching between mock data
 * and real Supabase queries based on configuration.
 */

import { useQuery } from "@tanstack/react-query";
import { USE_MOCK_DATA } from "@/lib/config";
import { getFeedPosts } from "@/lib/queries/posts";
import { normalisePost } from "@/lib/normalise";
import { mockPosts } from "@/lib/mockData";
import { PostWithProvenance, FeedMode } from "@/types";

export function useFeed(mode: FeedMode, topicTags?: string[]) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["feed", mode, topicTags],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        // Simple mock filtering
        let filtered = [...mockPosts];
        if (mode === "topics" && topicTags && topicTags.length > 0) {
          filtered = filtered.filter(p => 
            p.topicTags.some((tag: string) => topicTags.includes(tag))
          );
        }
        return filtered.map(normalisePost);
      }
      
      return getFeedPosts({
        topicTags,
        authorId: mode === "following" ? "TODO_AUTH_USER_ID" : undefined, // Handled by auth logic usually
      });
    },
  });

  return {
    posts: data || [],
    loading: isLoading,
    error: error as Error | null,
  };
}
