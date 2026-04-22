"use client";

import { CheckCircle } from "phosphor-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UserWithReputation } from "@/types";
import { useFollows } from "@/hooks/useFollows";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface ProfileHeaderProps {
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
  return `${did.slice(0, 16)}…${did.slice(-8)}`;
}

const LADDER_COLORS = {
  new: "bg-slate-light/20 text-slate",
  established: "bg-sage/10 text-sage hover:bg-sage/20 border border-sage/20",
  trusted: "bg-sage text-white-0",
  steward: "bg-gold text-white-0",
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user } = useAuth();
  const { isFollowing, follow, unfollow, isFollowingLoading } = useFollows(profile.id);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollow();
      } else {
        await follow();
      }
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Failed to toggle follow status");
    }
  };

  const isOwnProfile = user?.id === profile.id;

  return (
    <div className="bg-surface p-6 rounded-lg border border-paper-dark">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <Avatar className="h-24 w-24 border-2 border-surface shadow-sm">
          {profile.avatar_url && (
            <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
          )}
          <AvatarFallback className="text-2xl font-semibold bg-paper-dark/10">
            {getInitials(profile.display_name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-sans font-bold text-2xl text-ink truncate tracking-tight leading-tight">
                  {profile.display_name}
                </h1>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
                    LADDER_COLORS[profile.ladder_level || "new"]
                  )}
                >
                  {profile.ladder_level || "new"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate text-xs font-medium">
                <span className="font-mono opacity-60 truncate">
                  {profile.did ? truncateDid(profile.did) : "Identity pending"}
                </span>
                <span>·</span>
                <span>
                  Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "Recently"}
                </span>
              </div>
            </div>

            {!isOwnProfile && user && (
              <Button
                onClick={handleFollowToggle}
                disabled={isFollowingLoading}
                className={cn(
                  "rounded-full px-6 font-bold uppercase tracking-widest text-[10px] transition-all duration-300 shadow-sm",
                  isFollowing 
                    ? "bg-transparent border border-paper-dark text-ink hover:text-terracotta hover:border-terracotta/30" 
                    : "bg-ink text-paper hover:bg-teal"
                )}
              >
                {isFollowingLoading ? "..." : isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-6 mb-4">
            <Link 
              href={`/profile/${profile.did}/follows?tab=followers`}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <span className="font-bold text-ink text-sm">{profile.follower_count || 0}</span>
              <span className="text-slate text-xs uppercase tracking-widest font-medium opacity-70">Followers</span>
            </Link>
            <Link 
              href={`/profile/${profile.did}/follows?tab=following`}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
            >
              <span className="font-bold text-ink text-sm">{profile.following_count || 0}</span>
              <span className="text-slate text-xs uppercase tracking-widest font-medium opacity-70">Following</span>
            </Link>
          </div>

          {profile.bio && (
            <p className="font-sans text-sm text-ink mb-4 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Affiliations */}
          {profile.affiliations && profile.affiliations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.affiliations.map((aff) => (
                <div
                  key={aff.id}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-paper-dark/30 hover:bg-paper-dark/50 transition-colors border border-paper-dark rounded-lg"
                >
                  <CheckCircle size={14} className="text-sage shrink-0" weight="fill" />
                  <span className="font-medium text-xs text-ink">
                    {aff.organization_name}
                  </span>
                  <span className="font-medium text-[10px] text-slate uppercase bg-surface px-1.5 py-0.5 rounded-md border border-paper-dark shadow-sm">
                    {aff.affiliation_type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
