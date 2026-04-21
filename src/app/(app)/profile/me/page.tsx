"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useFeed } from "@/hooks/useFeed";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ReputationMeter } from "@/components/features/profile/ReputationMeter";
import { FeedCard } from "@/components/features/feed/FeedCard";

export default function MyProfilePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, loading: isProfileLoading } = useProfile(user?.id || "");
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

  if (!user) {
    return (
      <div className="py-12 text-center bg-surface border border-paper-dark rounded-lg">
        <p className="font-sans text-sm text-slate">Please sign in to view your profile.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-12 text-center bg-surface border border-paper-dark rounded-lg">
        <p className="font-sans text-sm text-slate">Profile is being initialized. This usually takes just a second.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-sage text-white-0 rounded-lg text-sm font-bold"
        >
          Refresh Page
        </button>
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
      <div className="mb-6 lg:mb-8">
        <h1 className="font-sans font-bold text-3xl tracking-tight text-ink hidden lg:block">My Profile</h1>
      </div>

      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
  );
}
