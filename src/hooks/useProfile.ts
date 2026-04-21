"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function useProfile(did: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["profile", did],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          follower_count:follows!following_id(count),
          following_count:follows!follower_id(count)
        `)
        .eq("did", did)
        .single();
      
      if (error) throw error;

      // Extract counts correctly from the joined data
      return {
        ...data,
        followersCount: data.follower_count?.[0]?.count || 0,
        followingCount: data.following_count?.[0]?.count || 0,
        // Map to UserProfile compatibility
        reputationScore: { ladderLevel: data.reputation_score > 100 ? 'trusted' : 'established' },
        joinedAt: data.created_at,
      };
    },
    enabled: !!did,
  });
}

export function useMyProfile() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}
