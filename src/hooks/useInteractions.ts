"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function useInteractions(postId?: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Get interaction counts and current user status
  const { data: interactionStatus, isLoading } = useQuery({
    queryKey: ["interactions", postId],
    queryFn: async () => {
      if (!postId) return null;
      
      const { data: { user } } = await supabase.auth.getUser();

      // Get total likes
      const { count: likeCount } = await supabase
        .from("post_interactions")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId)
        .eq("type", "like");

      // Check if current user likes this post
      let userHasLiked = false;
      if (user) {
        const { data } = await supabase
          .from("post_interactions")
          .select("*")
          .eq("post_id", postId)
          .eq("user_id", user.id)
          .eq("type", "like")
          .single();
        userHasLiked = !!data;
      }

      return {
        likeCount: likeCount || 0,
        userHasLiked,
      };
    },
    enabled: !!postId,
  });

  // Toggle Like
  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !postId) throw new Error("Auth required");

      if (interactionStatus?.userHasLiked) {
        // Unlike
        const { error } = await supabase
          .from("post_interactions")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId)
          .eq("type", "like");
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase.from("post_interactions").insert({
          user_id: user.id,
          post_id: postId,
          type: "like",
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions", postId] });
    },
  });

  return {
    likeCount: interactionStatus?.likeCount || 0,
    userHasLiked: interactionStatus?.userHasLiked || false,
    isInteracting: isLoading || toggleLikeMutation.isPending,
    toggleLike: toggleLikeMutation.mutateAsync,
  };
}
