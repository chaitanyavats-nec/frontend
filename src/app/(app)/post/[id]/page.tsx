"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { PostDetail } from "@/components/features/feed/PostDetail";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { AuthorSidebarCard } from "@/components/features/feed/AuthorSidebarCard";
import { useMockData } from "@/hooks/useMockData";

import { usePost } from "@/hooks/usePost";
import { useFeed } from "@/hooks/useFeed";

export default function PostDetailPage() {
  const params = useParams();
  const { post, loading: isPostLoading, error } = usePost(params.id as string);
  const { posts: allPosts, loading: isFeedLoading } = useFeed("chronological");

  if (isPostLoading) {
    return <div className="py-20 text-center animate-pulse text-slate">Loading post details...</div>;
  }

  if (error || !post) {
    return (
      <div className="py-12 text-center bg-surface border border-paper-dark rounded-lg">
        <p className="font-sans text-sm text-slate">Post not found.</p>
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

  // Mock replies: use other posts as mock replies
  const mockReplies = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Back navigation */}
      <Link
        href="/home"
        className="inline-flex items-center gap-1.5 font-medium text-xs text-slate hover:text-ink mb-2 transition-colors duration-150 bg-surface px-3 py-1.5 rounded-lg border border-paper-dark"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-4">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Post Detail */}
          <PostDetail post={post} />

          {/* Reply Thread */}
          {(isFeedLoading || mockReplies.length > 0) && (
            <div>
              <h3 className="font-semibold text-lg text-ink mb-4 tracking-tight">
                Replies
              </h3>
              <div className="space-y-4">
                {isFeedLoading ? (
                  [1, 2].map(i => <div key={i} className="h-32 bg-surface rounded-lg animate-pulse" />)
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
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <AuthorSidebarCard 
            post={post} 
            topicPosts={allPosts.filter(p => !post.topic_tags || (p.topic_tags && p.topic_tags.some(tag => post.topic_tags!.includes(tag))) && p.id !== post.id).slice(0, 3)} 
          />
        </div>
      </div>
    </div>
  );
}
