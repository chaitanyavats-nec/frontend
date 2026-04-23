"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { PostDetail } from "@/components/features/feed/PostDetail";
import { FeedCard } from "@/components/features/feed/FeedCard";

import { usePost } from "@/hooks/usePost";
import { useFeed } from "@/hooks/useFeed";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { post, replies, loading: isPostLoading, error } = usePost(params.id as string);

  if (isPostLoading) {
    return (
      <div className="max-w-[720px] mx-auto py-20 px-4">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16" />
          <div className="bg-paper-raised rounded-md border border-[var(--border-subtle)] p-6 space-y-4">
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
      <div className="max-w-[720px] mx-auto py-12 text-center px-4">
        <div className="bg-paper-raised border border-[var(--border-subtle)] rounded-md p-8">
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

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 mb-4 transition-colors duration-150 py-1"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="max-w-[720px] mx-auto space-y-8 min-w-0">
        {/* Post Detail */}
        <PostDetail post={post} />
 
        {/* Reply Thread */}
        <div className="space-y-6">
          <h3 className="eyebrow flex items-center gap-2">
            Replies <span className="text-[10px] bg-paper-sunken px-1.5 py-0.5 rounded border border-neutral-100 dark:border-neutral-800">{replies.length}</span>
          </h3>
          
          <div className="space-y-4">
            {replies.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md">
                <p className="text-[12px] font-mono text-neutral-400 uppercase tracking-widest">No replies yet. Witness the conversation.</p>
              </div>
            ) : (
              replies.map((reply) => (
                <div key={reply.id} className="space-y-4">
                  <FeedCard post={reply} isReply />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
