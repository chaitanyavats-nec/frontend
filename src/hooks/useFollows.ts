"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function useFollows(targetUserId?: string) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Get current user follow status for a specific profile
  const { data: isFollowing, isLoading: isCheckingFollow } = useQuery({
    queryKey: ["is-following", targetUserId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !targetUserId) return false;

      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId)
        .single();
      
      return !!data && !error;
    },
    enabled: !!targetUserId,
  });

  // Follow Action
  const followMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !targetUserId) throw new Error("Auth required");

      const { error } = await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: targetUserId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["is-following", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["profile", targetUserId] });
    },
  });

  // Unfollow Action
  const unfollowMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !targetUserId) throw new Error("Auth required");

      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["is-following", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["profile", targetUserId] });
    },
  });

  return {
    isFollowing,
    isCheckingFollow,
    follow: followMutation.mutateAsync,
    unfollow: unfollowMutation.mutateAsync,
    isFollowingLoading: followMutation.isPending || unfollowMutation.isPending,
  };
}
