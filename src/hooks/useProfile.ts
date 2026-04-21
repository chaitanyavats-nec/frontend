/**
 * src/hooks/useProfile.ts
 * 
 * Hook for retrieving a user profile and its associated data.
 */

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/queries/users";
import { normaliseProfile } from "@/lib/normalise";
import { USE_MOCK_DATA } from "@/lib/config";
import { mockProfiles } from "@/lib/mockData";
import { UserWithReputation } from "@/types";

export function useProfile(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        const mock = (mockProfiles as any).find((p: any) => p.id === userId || p.did === userId);
        if (!mock) throw new Error("Mock profile not found");
        return normaliseProfile(mock);
      }
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
