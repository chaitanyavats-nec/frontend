"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MagnifyingGlass } from "phosphor-react";
import { useProfile } from "@/hooks/useProfile";
import { useFeed } from "@/hooks/useFeed";
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { Button } from "@/components/ui/button";
import { FeedControls, HealthFilter, SortOption } from "@/components/features/feed/FeedControls";
import { useState } from "react";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const did = params.did as string;

  const { profile, loading: isProfileLoading } = useProfile(did);
  const { posts, loading: isPostsLoading } = useFeed("chronological");
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

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
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 font-medium text-xs text-sage hover:text-sage-dark mt-4"
        >
          <ArrowLeft size={14} />
          Go back
        </button>
      </div>
    );
  }

  // Get posts by this user
  let userPosts = posts?.filter((p) => p.author.did === profile.did) || [];

  // Apply Health Filtering
  if (healthFilter === "high") {
    userPosts = userPosts.filter((p) => (p.trust_score ?? 0) >= 80);
  } else if (healthFilter === "standard") {
    userPosts = userPosts.filter((p) => (p.trust_score ?? 0) >= 50);
  } else if (healthFilter === "unverified") {
    userPosts = userPosts.filter((p) => (p.trust_score ?? 0) < 50);
  }

  // Apply Sorting
  userPosts.sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortOption === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortOption === "highest-health") {
      return (b.trust_score ?? 0) - (a.trust_score ?? 0);
    } else if (sortOption === "lowest-health") {
      return (a.trust_score ?? 0) - (b.trust_score ?? 0);
    }
    return 0;
  });

  return (
    <div className="max-w-[1100px] mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Center Column: Profile Header + Feed */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileHeader profile={profile} />

          <div className="space-y-4">
            <FeedControls
              healthFilter={healthFilter}
              setHealthFilter={setHealthFilter}
              sortOption={sortOption}
              setSortOption={setSortOption}
              postCount={userPosts.length}
            />

            {isPostsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-40 bg-surface rounded-xl animate-pulse border border-paper-dark" />
                ))}
              </div>
            ) : userPosts.length === 0 ? (
              <div className="bg-surface rounded-xl border border-paper-dark p-12 text-center shadow-sm">
                <div className="h-12 w-12 bg-paper-dark/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft size={24} className="text-slate opacity-40 rotate-180" />
                </div>
                <h3 className="font-sans font-bold text-ink mb-1">Silence is gold?</h3>
                <p className="font-sans text-xs text-slate max-w-[200px] mx-auto">
                  This user hasn&apos;t committed any posts to the timeline yet.
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
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          <div className="bg-paper rounded-xl border border-paper-dark overflow-hidden sticky top-6">
            <div className="p-4 border-b border-paper-dark">
              <h3 className="font-sans font-bold text-base text-ink">Who to follow</h3>
            </div>
            <div className="divide-y divide-paper-dark/30">
              {[
                { name: 'AmiAmi English', handle: '@AmiAmi_English', bio: 'Official English X account of amiami.com' },
                { name: 'PlayStation', handle: '@PlayStation', bio: 'Official Sony Interactive Entertainment account.' }
              ].map((u) => (
                <div key={u.handle} className="p-4 hover:bg-paper-dark/5 transition-colors group cursor-pointer">
                  <div className="flex gap-3">
                    <div className="h-10 w-10 bg-slate-light/20 rounded-full shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <div className="min-w-0">
                          <h4 className="font-sans font-bold text-sm text-ink truncate group-hover:text-teal transition-colors">{u.name}</h4>
                          <p className="text-[11px] font-mono text-slate opacity-60 truncate">{u.handle}</p>
                        </div>
                        <Button size="sm" className="h-8 rounded-full px-4 text-[10px] font-bold uppercase tracking-widest bg-ink text-paper hover:bg-teal">Follow</Button>
                      </div>
                      <p className="text-[11px] text-slate line-clamp-2 leading-relaxed">{u.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full p-4 text-left text-[11px] font-bold text-teal hover:bg-teal/5 transition-colors uppercase tracking-widest border-t border-paper-dark/30">
              Show more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
