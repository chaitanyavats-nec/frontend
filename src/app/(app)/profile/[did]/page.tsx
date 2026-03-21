"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { useMockData } from "@/hooks/useMockData";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ReputationMeter } from "@/components/features/profile/ReputationMeter";
import { FeedCard } from "@/components/features/feed/FeedCard";

export default function UserProfilePage() {
  const params = useParams();
  const did = params.did as string;
  const { profiles, posts } = useMockData();
  
  const profile = profiles.find((p) => p.did === did);

  if (!profile) {
    return (
      <div className="py-12 text-center">
        <p className="font-editorial text-base text-slate">Profile not found.</p>
        <Link
          href="/home"
          className="inline-flex items-center gap-1 font-mono text-xs text-sage hover:text-sage-dark mt-4"
        >
          <ArrowLeft size={14} />
          Back to feed
        </Link>
      </div>
    );
  }

  // Get posts by this user
  const userPosts = posts.filter((p) => p.authorDid === profile.did)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <Link
        href="/home"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate hover:text-ink mb-2 transition-colors duration-150"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Feed */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h2 className="font-mono text-sm text-ink mb-4 pb-2 border-b border-paper-dark">
            Recent Posts
          </h2>
          {userPosts.length === 0 ? (
            <p className="font-editorial text-sm text-slate py-8 text-center">
              This user hasn&apos;t posted anything yet.
            </p>
          ) : (
            <div>
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
