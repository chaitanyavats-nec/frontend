"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { PostDetail } from "@/components/features/feed/PostDetail";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { useMockData } from "@/hooks/useMockData";

export default function PostDetailPage() {
  const params = useParams();
  const { getPostById, posts } = useMockData();
  const post = getPostById(params.id as string);

  if (!post) {
    return (
      <div className="py-12 text-center">
        <p className="font-editorial text-base text-slate">Post not found.</p>
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

  // Mock replies: use other posts as mock replies
  const mockReplies = posts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div>
      {/* Back navigation */}
      <Link
        href="/home"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate hover:text-ink mb-4 transition-colors duration-150"
      >
        <ArrowLeft size={14} />
        Back
      </Link>

      {/* Post Detail */}
      <PostDetail post={post} provenance={post.provenance} />

      {/* Reply Thread */}
      {mockReplies.length > 0 && (
        <div className="mt-6">
          <h3 className="font-mono text-xs text-slate mb-3">
            {post.replyCount} replies
          </h3>
          <div className="border-t border-paper-dark">
            {mockReplies.map((reply) => (
              <FeedCard key={reply.id} post={reply} showProvenance={false} isReply />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
