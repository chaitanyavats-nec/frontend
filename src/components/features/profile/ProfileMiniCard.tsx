"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFollows } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { UserWithReputation } from "@/types";

interface ProfileMiniCardProps {
  profile: UserWithReputation;
}

function getInitials(name?: string): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";
}

function truncateDid(did: string): string {
  if (!did) return "";
  return did.length > 24 ? `${did.slice(0, 12)}…${did.slice(-6)}` : did;
}

export function ProfileMiniCard({ profile }: ProfileMiniCardProps) {
  const { user } = useAuth();
  const { isFollowing, follow, unfollow, isFollowingLoading } = useFollows(profile.id);

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isFollowing) {
        await unfollow();
      } else {
        await follow();
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to toggle follow status";
      alert(message);
    }
  };

  const isOwnProfile = user?.id === profile.id;

  return (
    <Link 
      href={`/profile/${profile.did}`}
      className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-paper-raised hover:border-cyan-500/30 transition-all group"
    >
      <Avatar className="h-12 w-12 border border-neutral-200 dark:border-neutral-800 shadow-sm shrink-0">
        {profile.avatar_url && (
          <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
        )}
        <AvatarFallback className="text-sm font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
          {getInitials(profile.display_name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h3 className="font-sans font-bold text-[14px] text-neutral-900 dark:text-neutral-50 truncate group-hover:text-cyan-600 transition-colors">
          {profile.display_name}
        </h3>
        <p className="font-mono text-[10px] text-neutral-400 truncate">
          {profile.did ? truncateDid(profile.did) : "Identity pending"}
        </p>
      </div>

      {!isOwnProfile && user && (
        <Button
          onClick={handleFollowToggle}
          disabled={isFollowingLoading}
          size="sm"
          className={cn(
            "rounded-md px-3 h-8 font-mono font-bold uppercase tracking-wider text-[10px] transition-all shrink-0",
            isFollowing 
              ? "bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-red-500 hover:border-red-500/30" 
              : "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-900 hover:bg-cyan-600 dark:hover:bg-cyan-500"
          )}
        >
          {isFollowingLoading ? "..." : isFollowing ? "Following" : "Follow"}
        </Button>
      )}
    </Link>
  );
}
