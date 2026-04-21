"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { useProfile } from "@/hooks/useProfile";
import { usePosts } from "@/hooks/usePosts";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ReputationMeter } from "@/components/features/profile/ReputationMeter";
import { FeedCard } from "@/components/features/feed/FeedCard";

export default function UserProfilePage() {
  const params = useParams();
  const did = params.did as string;
  
  const { data: profile, isLoading: isProfileLoading } = useProfile(did);
  const { posts, isPostsLoading } = usePosts();

  if (isProfileLoading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-24 w-24 bg-paper-dark/20 rounded-full mb-4" />
          <div className="h-8 w-48 bg-paper-dark/20 rounded mb-2" />
          <div className="h-4 w-32 bg-paper-dark/20 rounded" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-12 text-center bg-surface border border-paper-dark rounded-lg">
        <p className="font-sans text-sm text-slate">Profile not found.</p>
        <Link
          href="/home"
          className="inline-flex items-center gap-1 font-medium text-xs text-sage hover:text-sage-dark mt-4"
        >
          <ArrowLeft size={14} />
          Back to feed
        </Link>
      </div>
    );
  }

  // Get posts by this user (filtering from feed for now, ideally fetch by author)
  const userPosts = posts?.filter((p) => p.authorDid === profile.did) || [];

  return (
    <div className="space-y-6">
      <Link
        href="/home"
        className="inline-flex items-center gap-1.5 font-medium text-xs text-slate hover:text-ink mb-2 transition-colors duration-150 bg-surface px-3 py-1.5 rounded-lg border border-paper-dark"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Feed */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h2 className="font-sans font-semibold text-lg text-ink mb-4 tracking-tight">
            Recent Posts
          </h2>
          {isPostsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-surface rounded-xl animate-pulse border border-paper-dark" />
              ))}
            </div>
          ) : userPosts.length === 0 ? (
            <div className="bg-surface rounded-lg border border-paper-dark p-8 text-center">
              <p className="font-sans text-sm text-slate">
                This user hasn&apos;t posted anything yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <FeedCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Reputation */}
        <div className="order-1 lg:order-2">
          <ReputationMeter score={profile.reputationScore} />
        </div>
      </div>
    </div>
  );
}
