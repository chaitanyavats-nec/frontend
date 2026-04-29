/**
 * src/hooks/useProfile.ts
 * 
 * Hook for retrieving a user profile and its associated data.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/queries/users";
import { createClient } from "@/utils/supabase/client";

export interface ReputationEvent {
  id: string;
  user_id: string;
  event_type: string;
  dimension_affected: string;
  delta: number;
  previous_value: number;
  new_value: number;
  triggered_by: string | null;
  created_at: string;
}

export function useProfile(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      return getUserProfile(userId);
    },
    enabled: !!userId,
  });

  return {
    profile: data || null,
    loading: isLoading,
    error: error as Error | null,
  };
}

export function useReputationHistory(userId: string) {
  const supabase = createClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["reputation_history", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reputation_events")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
        
      if (error) throw error;
      return data as ReputationEvent[];
    },
    enabled: !!userId,
  });

  return {
    events: data || [],
    loading: isLoading,
    error: error as Error | null,
  };
}

export function useRefreshReputation() {
  const queryClient = useQueryClient();

  return async (userId: string) => {
    // Call server action to bypass client RLS for recalculation
    const { refreshReputationAction } = await import("@/app/actions/reputation");
    const data = await refreshReputationAction(userId);
    
    // Invalidate the profile query so the UI automatically updates
    queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    
    return data;
  };
}
