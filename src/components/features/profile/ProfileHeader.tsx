"use client";

import { CheckCircle } from "phosphor-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

interface ProfileHeaderProps {
  profile: UserProfile;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function truncateDid(did: string): string {
  return `${did.slice(0, 16)}…${did.slice(-8)}`;
}

const LADDER_COLORS = {
  new: "bg-slate-light text-slate",
  established: "bg-sage-light text-sage-dark border border-sage-light",
  trusted: "bg-sage text-paper",
  steward: "bg-gold text-paper",
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="bg-paper p-6 rounded-md border border-paper-dark">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <Avatar className="h-24 w-24 border-2 border-paper">
          {profile.avatarUrl && (
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          )}
          <AvatarFallback className="text-2xl">
            {getInitials(profile.displayName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-2xl text-ink truncate">
              {profile.displayName}
            </h1>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-xs font-mono capitalize shrink-0",
                LADDER_COLORS[profile.reputationScore.ladderLevel]
              )}
            >
              {profile.reputationScore.ladderLevel}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs text-slate truncate">
              {truncateDid(profile.did)}
            </span>
            <span className="text-slate opacity-50">·</span>
            <span className="font-mono text-xs text-slate">
              Joined {new Date(profile.joinedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
            </span>
          </div>

          {profile.bio && (
            <p className="font-editorial text-sm text-ink mb-4 max-w-2xl">
              {profile.bio}
            </p>
          )}

          {/* Affiliations */}
          {profile.verifiedAffiliations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.verifiedAffiliations.map((aff) => (
                <div
                  key={aff.organizationName}
                  className="flex items-center gap-1.5 px-2 py-1 bg-paper-dark border border-paper-dark rounded-md"
                >
                  <CheckCircle size={14} className="text-sage" weight="fill" />
                  <span className="font-mono text-xs text-ink">
                    {aff.organizationName}
                  </span>
                  <span className="font-mono text-[10px] text-slate uppercase bg-paper px-1 rounded">
                    {aff.affiliationType}
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
