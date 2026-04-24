/**
 * src/hooks/usePost.ts
 * 
 * Hook for retrieving a single post and its provenance data.
 */

import { useQuery } from "@tanstack/react-query";
import { getPostById, getProvenanceSummary, getRepliesByPostId } from "@/lib/queries/posts";
import { PostWithProvenance, ProvenanceSummary } from "@/types";

export function usePost(postId: string) {
  const { data: post, isLoading: isPostLoading, error: postError } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      return getPostById(postId);
    },
    enabled: !!postId,
  });

  const { data: replies, isLoading: isRepliesLoading } = useQuery({
    queryKey: ["replies", postId],
    queryFn: async () => {
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
