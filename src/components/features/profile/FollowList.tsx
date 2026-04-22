"use client";

import { useQuery } from "@tanstack/react-query";
import { ProfileMiniCard } from "./ProfileMiniCard";
import type { UserWithReputation } from "@/types";

interface FollowListProps {
  userId: string;
  type: "followers" | "following";
  fetchFn: (userId: string) => Promise<UserWithReputation[]>;
}

export function FollowList({ userId, type, fetchFn }: FollowListProps) {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["follows-list", type, userId],
    queryFn: () => fetchFn(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="h-16 bg-paper-raised rounded-lg border border-neutral-200 dark:border-neutral-800 animate-pulse" 
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-paper-raised rounded-lg border border-red-100 dark:border-red-900/20">
        <p className="text-sm font-sans text-red-500">Failed to load {type}.</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-12 text-center bg-paper-raised rounded-lg border border-neutral-200 dark:border-neutral-800">
        <p className="text-sm font-sans text-neutral-500">
          No {type} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((profile) => (
        <ProfileMiniCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}
