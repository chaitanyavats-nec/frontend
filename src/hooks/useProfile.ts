/**
 * src/hooks/useProfile.ts
 * 
 * Hook for retrieving a user profile and its associated data.
 */

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/queries/users";
import { UserProfile } from "@/types";

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
