"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { PostDetail } from "@/components/features/feed/PostDetail";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { AuthorSidebarCard } from "@/components/features/feed/AuthorSidebarCard";

import { usePost } from "@/hooks/usePost";
import { useFeed } from "@/hooks/useFeed";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { post, loading: isPostLoading, error } = usePost(params.id as string);
  const { posts: allPosts, loading: isFeedLoading } = useFeed("chronological");

  if (isPostLoading) {
    return (
      <div className="max-w-[680px] mx-auto py-20">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16" />
          <div className="bg-paper-raised rounded-md border border-neutral-200 dark:border-neutral-700 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="space-y-2">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-32" />
                <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded w-48" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-[680px] mx-auto py-12 text-center">
        <div className="bg-paper-raised border border-neutral-200 dark:border-neutral-700 rounded-md p-8">
          <p className="font-sans text-sm text-neutral-500 mb-4">This post could not be found.</p>
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-cyan-600 hover:text-cyan-700"
          >
            <ArrowLeft size={14} />
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  // Mock replies: use other posts as mock replies
  const mockReplies = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto pb-20 px-0 sm:px-0">
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 mb-4 transition-colors duration-150 py-1"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start" style={{ display: "flex", flexDirection: "column" }}>
        {/* Main Column */}
        <div className="hidden lg:block sticky top-24">
          <AuthorSidebarCard
            post={post}
            topicPosts={allPosts.filter(p => !post.topic_tags || (p.topic_tags && p.topic_tags.some(tag => post.topic_tags!.includes(tag))) && p.id !== post.id).slice(0, 3)}
          />
        </div>
        <div className="space-y-8 min-w-0">
          {/* Post Detail */}
          <PostDetail post={post} />

          {/* Reply Thread */}
          {(isFeedLoading || mockReplies.length > 0) && (
            <div>
              <h3 className="eyebrow mb-4">
                Replies
              </h3>
              <div className="space-y-3">
                {isFeedLoading ? (
                  [1, 2].map(i => <div key={i} className="h-32 bg-paper-raised rounded-md animate-pulse border border-neutral-200 dark:border-neutral-700" />)
                ) : (
                  mockReplies.map((reply) => (
                    <FeedCard key={reply.id} post={reply} showProvenance={false} isReply />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
      </div>
    </div>
  );
}
