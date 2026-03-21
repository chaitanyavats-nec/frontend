"use client";

import { useMockData } from "@/hooks/useMockData";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ReputationMeter } from "@/components/features/profile/ReputationMeter";
import { FeedCard } from "@/components/features/feed/FeedCard";

export default function MyProfilePage() {
  const { profiles, posts } = useMockData();
  const myProfile = profiles[0]; // Assume first profile is 'me' for mock purposes

  if (!myProfile) {
    return <div className="p-8 text-center text-slate">Profile not found</div>;
  }

  // Get posts by this user
  const myPosts = posts.filter((p) => p.authorDid === myProfile.did)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="font-display text-2xl text-ink hidden sm:block">My Profile</h1>
      </div>

      <ProfileHeader profile={myProfile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Feed */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h2 className="font-mono text-sm text-ink mb-4 pb-2 border-b border-paper-dark">
            Recent Posts
          </h2>
          {myPosts.length === 0 ? (
            <p className="font-editorial text-sm text-slate py-8 text-center">
              You haven&apos;t posted anything yet.
            </p>
          ) : (
            <div>
              {myPosts.map((post) => (
                <FeedCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Reputation */}
        <div className="order-1 lg:order-2">
          <ReputationMeter score={myProfile.reputationScore} />
        </div>
      </div>
    </div>
  );
}
