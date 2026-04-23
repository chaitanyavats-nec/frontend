/**
 * src/hooks/usePost.ts
 * 
 * Hook for retrieving a single post and its provenance data.
 */

import { useQuery } from "@tanstack/react-query";
import { getPostById, getProvenanceSummary, getRepliesByPostId } from "@/lib/queries/posts";
import { normalisePost } from "@/lib/normalise";
import { USE_MOCK_DATA } from "@/lib/config";
import { mockPosts } from "@/lib/mockData";
import { PostWithProvenance, ProvenanceSummary } from "@/types";

export function usePost(postId: string) {
  const { data: post, isLoading: isPostLoading, error: postError } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        const mock = mockPosts.find(p => p.id === postId);
        if (!mock) throw new Error("Mock post not found");
        return normalisePost(mock as any);
      }
      return getPostById(postId);
    },
    enabled: !!postId,
  });

  const { data: replies, isLoading: isRepliesLoading } = useQuery({
    queryKey: ["replies", postId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return mockPosts.slice(0, 3).map(p => normalisePost(p as any));
      }
      return getRepliesByPostId(postId);
    },
    enabled: !!postId,
  });

  const provenanceSummary: ProvenanceSummary | null = post 
    ? getProvenanceSummary(post)
    : null;

  return {
    post: post || null,
    replies: replies || [],
    provenanceSummary,
    loading: isPostLoading || isRepliesLoading,
    error: postError as Error | null,
  };
}
