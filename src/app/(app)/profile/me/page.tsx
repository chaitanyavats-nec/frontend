"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useFeed } from "@/hooks/useFeed";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ReputationMeter } from "@/components/features/profile/ReputationMeter";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { Users } from "phosphor-react";
import { createClient } from "@/utils/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export default function MyProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, loading: isProfileLoading, error: profileError } = useProfile(user?.id || "");
  const { posts, loading: isPostsLoading } = useFeed("chronological");

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-24 w-24 bg-paper-dark/20 rounded-full mb-4" />
          <div className="h-8 w-48 bg-paper-dark/20 rounded mb-2" />
          <div className="h-4 w-32 bg-paper-dark/20 rounded" />
          <p className="mt-4 font-sans text-sm text-slate">Building your profile...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="py-12 text-center bg-surface border border-terracotta/30 rounded-lg max-w-md mx-auto mt-10">
        <h3 className="text-terracotta font-bold mb-2">Connection Error</h3>
        <p className="font-sans text-xs text-slate mb-4">{profileError.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-paper-dark text-white-0 rounded-lg text-sm font-bold"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-12 text-center bg-surface border border-paper-dark rounded-lg">
        <p className="font-sans text-sm text-slate">Please sign in to view your profile.</p>
      </div>
    );
  }

  const supabase = createClient();
  const queryClient = useQueryClient();

  const initializeProfile = async () => {
    if (!user) return;
    
    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      display_name: user.user_metadata?.display_name || user.email?.split("@")[0] || "User",
      did: `did:agora:z6Mk${Math.random().toString(36).substring(2, 15)}`,
      reputation_total: 0,
      ladder_level: 'new'
    });

    if (error) {
      alert("Failed to initialize: " + error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    }
  };

  if (!profile) {
    return (
      <div className="py-12 text-center bg-surface border border-paper-dark rounded-lg max-w-lg mx-auto mt-10">
        <div className="mb-6">
          <div className="h-16 w-16 bg-paper-dark/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users size={32} className="text-slate opacity-40" />
          </div>
          <p className="font-sans text-sm text-ink font-bold">Profile Not Found</p>
          <p className="font-sans text-xs text-slate mt-2 px-6">
            We couldn&apos;t find a profile record for your account. This can happen if the automatic creation trigger didn&apos;t fire during sign-up.
          </p>
        </div>
        
        <div className="flex flex-col gap-3 px-12">
          <button
            onClick={initializeProfile}
            className="px-4 py-2.5 bg-ink text-white-0 rounded-lg text-sm font-bold shadow-sm hover:bg-black transition-colors"
          >
            Initialize My Profile Now
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-slate rounded-lg text-xs font-medium hover:bg-paper-dark/10 transition-colors"
          >
            I already have one, check again
          </button>
        </div>
      </div>
    );
  }

  // Get posts by this user
  const myPosts = posts?.filter((p) => p.author.did === profile.did) || [];

  // Construct reputation score for sub-component
  const reputationScore = {
    total: profile.reputation_total,
    moderationAccuracy: profile.reputation_moderation_accuracy,
    contentLongevity: profile.reputation_content_longevity,
    disputeParticipation: profile.reputation_dispute_participation,
    accountAgeWeight: profile.reputation_account_age_weight,
    ladderLevel: profile.ladder_level,
  };

  return (
    <div className="space-y-6">

      <ProfileHeader profile={profile} />

      <div className="px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ display: "flex", flexDirection: "column-reverse" }}>
          {/* Left Column: Feed */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <h2 className="font-sans font-semibold text-lg text-ink mb-4 tracking-tight">
              Recent Posts
            </h2>
            {isPostsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-40 bg-surface rounded-xl animate-pulse border border-paper-dark" />)}
              </div>
            ) : myPosts.length === 0 ? (
              <div className="bg-surface rounded-lg border border-paper-dark p-8 text-center">
                <p className="font-sans text-sm text-slate">
                  You haven&apos;t posted anything yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPosts.map((post) => (
                  <FeedCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Reputation */}
          <div className="order-1 lg:order-2">
            <ReputationMeter score={reputationScore} />
          </div>
        </div>
      </div>
    </div>
  );
}
