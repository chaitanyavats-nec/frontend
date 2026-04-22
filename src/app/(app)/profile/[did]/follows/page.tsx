"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, UserPlus } from "phosphor-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowList } from "@/components/features/profile/FollowList";
import { useProfile } from "@/hooks/useProfile";
import { getFollowers, getFollowing } from "@/lib/queries/users";

export default function FollowsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const did = params.did as string;
  const initialTab = searchParams.get("tab") || "followers";

  const { profile, loading } = useProfile(did);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-20 w-20 bg-paper-dark/20 rounded-full mb-4" />
          <div className="h-6 w-32 bg-paper-dark/20 rounded mb-2" />
          <div className="h-4 w-48 bg-paper-dark/20 rounded" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-paper-raised border border-neutral-200 dark:border-neutral-800 rounded-lg p-8">
          <p className="text-sm font-sans text-neutral-500 mb-4">User not found.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-cyan-600 uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-paper-dark/50 transition-colors text-neutral-500"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="font-sans font-bold text-xl text-neutral-900 dark:text-neutral-50 truncate">
            {profile.display_name}
          </h1>
          <p className="font-mono text-xs text-neutral-400">
            {profile.did}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="w-full bg-paper-raised border border-neutral-200 dark:border-neutral-800 p-1 mb-6">
          <TabsTrigger 
            value="followers" 
            className="flex-1 gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            <Users size={14} />
            Followers
            <span className="ml-1 opacity-60">({profile.follower_count})</span>
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className="flex-1 gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
          >
            <UserPlus size={14} />
            Following
            <span className="ml-1 opacity-60">({profile.following_count})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="mt-0 focus-visible:ring-0">
          <FollowList 
            userId={profile.did} 
            type="followers" 
            fetchFn={getFollowers} 
          />
        </TabsContent>
        <TabsContent value="following" className="mt-0 focus-visible:ring-0">
          <FollowList 
            userId={profile.did} 
            type="following" 
            fetchFn={getFollowing} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
