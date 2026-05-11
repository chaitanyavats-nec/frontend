"use client";

import { CheckCircle, PencilSimple, CalendarBlank, MagnifyingGlass, ArrowLeft } from "phosphor-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UserWithReputation } from "@/types";
import { useFollows } from "@/hooks/useFollows";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { AvatarEditor } from "./AvatarEditor";
import { useRouter } from "next/navigation";
import { ReputationMeter } from "./ReputationMeter";
import { ReputationBadge } from "./ReputationBadge";

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



export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { isFollowing, follow, unfollow, isFollowingLoading } = useFollows(profile.id);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(profile.avatar_url);

  const handleFollowToggle = async () => {
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

  const reputationScore = {
    total: profile.reputation_total,
    moderationAccuracy: profile.reputation_moderation_accuracy,
    contentLongevity: profile.reputation_content_longevity,
    disputeParticipation: profile.reputation_dispute_participation,
    accountAgeWeight: profile.reputation_account_age_weight,
    ladderLevel: profile.ladder_level,
    voiceWeight: profile.voice_weight,
  };

  return (
    <div className="bg-transparent">
      {/* ── Banner Area ── */}
      <div className="relative h-32 sm:h-40 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] bg-teal/5 border-b border-paper-dark/30 -mx-4 sm:-mx-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/40" />
      </div>

      <div className="px-4 sm:px-6 pb-0">
        {/* ── Profile Actions (Avatar + Button) ── */}
        <div className="relative flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
          <div 
            className={cn(
              "relative group rounded-full p-1.5 bg-surface",
              isOwnProfile && "cursor-pointer"
            )}
            onClick={() => isOwnProfile && setIsEditorOpen(true)}
          >
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-2 border-surface shadow-md">
              {currentAvatarUrl && (
                <AvatarImage src={currentAvatarUrl} alt={profile.display_name} className="object-cover" />
              )}
              <AvatarFallback className="text-3xl font-bold bg-paper-dark/10">
                {getInitials(profile.display_name)}
              </AvatarFallback>
            </Avatar>
            
            {isOwnProfile && (
              <div className="absolute inset-1.5 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <PencilSimple size={28} className="text-white" weight="bold" />
              </div>
            )}
          </div>

          <div className="mb-4">
            {!isOwnProfile && user && (
              <Button
                onClick={handleFollowToggle}
                disabled={isFollowingLoading}
                className={cn(
                  "rounded-full px-6 font-bold uppercase tracking-widest text-[9px] transition-all duration-300 h-8",
                  isFollowing 
                    ? "bg-transparent border border-paper-dark text-ink hover:text-terracotta hover:border-terracotta/30" 
                    : "bg-ink text-paper hover:bg-teal"
                )}
              >
                {isFollowingLoading ? "..." : isFollowing ? "Following" : "Follow"}
              </Button>
            )}

            {isOwnProfile && (
              <Button
                asChild
                className="rounded-full px-6 font-bold uppercase tracking-widest text-[9px] bg-transparent text-ink hover:bg-paper-dark border border-paper-dark transition-all active:scale-95 h-8"
              >
                <Link href="/settings/account">
                  Edit Profile
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* ── User Information ── */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="font-sans font-bold text-3xl text-ink tracking-tight">
              {profile.display_name}
            </h1>
            <ReputationBadge 
              level={profile.ladder_level} 
              score={profile.reputation_total} 
              size="md"
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col leading-tight">
              <span className="text-slate text-xs font-mono opacity-80">
                @{profile.did ? profile.did.split(':').pop() : 'anonymous'}
              </span>
              <span className="text-slate text-[9px] font-mono opacity-40 truncate">
                {profile.did || 'Identity pending'}
              </span>
            </div>

            {profile.bio && (
              <p className="font-sans text-[13px] text-ink leading-relaxed max-w-xl">
                {profile.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate text-[11px] font-medium">
              <div className="flex items-center gap-1.5 opacity-80">
                <CalendarBlank size={14} weight="regular" />
                <span>
                  Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "Recently"}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-teal font-bold uppercase tracking-widest text-[8px] bg-teal/5 px-2 py-0.5 rounded border border-teal/10">
                <CheckCircle size={10} weight="fill" />
                <span>Verified Humanity</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Social Stats ── */}
        <div className="flex items-center gap-6 mb-8">
          <Link 
            href={`/profile/${profile.did}/follows?tab=followers`}
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
          >
            <span className="font-bold text-ink text-sm">{profile.follower_count || 0}</span>
            <span className="text-slate text-[9px] uppercase tracking-widest font-bold opacity-70">Followers</span>
          </Link>
          <Link 
            href={`/profile/${profile.did}/follows?tab=following`}
            className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
          >
            <span className="font-bold text-ink text-sm">{profile.following_count || 0}</span>
            <span className="text-slate text-[9px] uppercase tracking-widest font-bold opacity-70">Following</span>
          </Link>
        </div>

        {/* ── Affiliations Section ── */}
        <div className="space-y-3 mb-8">
          <h3 className="font-sans text-[10px] font-bold tracking-[0.12em] text-neutral-400 dark:text-neutral-500 uppercase">Affiliations</h3>
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-1 no-scrollbar">
            {(profile.affiliations && profile.affiliations.length > 0 ? profile.affiliations : [
              { id: "mock-1", organization_name: "Vought Intl", role: "Patriot", affiliation_type: "Corporate" },
              { id: "mock-2", organization_name: "The Seven", role: "Leader", affiliation_type: "Team" },
              { id: "mock-3", organization_name: "Vought Tower", role: "Resident", affiliation_type: "Institutional" }
            ]).map((aff) => (
              <div
                key={aff.id}
                className="bg-[#121212] dark:bg-[#121212] border border-[#1e1e1e] rounded-xl px-4 py-3 min-w-[160px] sm:min-w-[180px] flex flex-col justify-between shadow-md"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#222120] pb-1.5 mb-1.5">
                  <span className="font-sans font-bold text-neutral-200 text-[11px] uppercase tracking-wider truncate">{aff.organization_name}</span>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[#10b981] dark:bg-[#2ec4bb] shrink-0" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[9.5px] text-neutral-400 font-sans">
                    <span className="text-neutral-500 font-bold tracking-wider">ROLE:</span>
                    <span className="font-medium truncate text-neutral-300">{(aff as any).role || aff.affiliation_type || "Member"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9.5px] text-neutral-400 font-sans">
                    <span className="text-neutral-500 font-bold tracking-wider">STATUS:</span>
                    <span className="font-mono font-bold text-[#10b981] dark:text-[#2ec4bb] text-[9px]">ACTIVE</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Reputation Meter Integrated ── */}
        <div className="-mx-4 sm:-mx-6 border-t border-paper-dark/30">
          <ReputationMeter score={reputationScore} />
        </div>

        {/* ── Tabs Placeholder ── */}
        <div className="flex items-center border-b border-paper-dark overflow-x-auto no-scrollbar pt-2">
          {['Posts', 'Replies', 'Highlights', 'Articles'].map((tab, i) => (
            <button 
              key={tab} 
              className={cn(
                "px-5 py-4 text-[11px] font-bold tracking-widest uppercase transition-all relative shrink-0",
                i === 0 ? "text-ink" : "text-slate opacity-60 hover:opacity-100"
              )}
            >
              {tab}
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal shadow-[0_-2px_6px_rgba(20,184,166,0.3)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <AvatarEditor 
        userId={profile.id}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSuccess={(url) => setCurrentAvatarUrl(url)}
        initialImage={currentAvatarUrl}
      />
    </div>
  );
}
