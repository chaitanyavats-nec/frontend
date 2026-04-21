/**
 * src/hooks/usePost.ts
 * 
 * Hook for retrieving a single post and its provenance data.
 */

import { useQuery } from "@tanstack/react-query";
import { getPostById, getProvenanceSummary } from "@/lib/queries/posts";
import { normalisePost } from "@/lib/normalise";
import { USE_MOCK_DATA } from "@/lib/config";
import { mockPosts } from "@/lib/mockData";
import { PostWithProvenance, ProvenanceSummary } from "@/types";

export function usePost(postId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        const mock = mockPosts.find(p => p.id === postId);
        if (!mock) throw new Error("Mock post not found");
        return normalisePost(mock);
      }
      return getPostById(postId);
    },
    enabled: !!postId,
  });

  const provenanceSummary: ProvenanceSummary | null = data 
    ? getProvenanceSummary(data)
    : null;

  return {
    post: data || null,
    provenanceSummary,
    loading: isLoading,
    error: error as Error | null,
  };
}
