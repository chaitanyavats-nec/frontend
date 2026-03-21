"use client";

import { ChatCircle, Flag, ShareNetwork } from "phosphor-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProvenanceTag } from "@/components/features/provenance/ProvenanceTag";
import type { Post, ProvenanceRecord } from "@/types";

interface PostDetailProps {
  post: Post;
  provenance: ProvenanceRecord;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PostDetail({ post, provenance }: PostDetailProps) {
  return (
    <article className="pb-6" role="article" aria-label={`Post by ${post.authorDisplayName}`}>
      {/* Author Row — larger avatar */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-12 w-12">
          {post.authorAvatarUrl && (
            <AvatarImage src={post.authorAvatarUrl} alt={post.authorDisplayName} />
          )}
          <AvatarFallback className="text-sm">{getInitials(post.authorDisplayName)}</AvatarFallback>
        </Avatar>

        <div>
          <span className="font-mono text-sm text-ink font-medium block">
            {post.authorDisplayName}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate">
              {post.authorDid.length > 30
                ? `${post.authorDid.slice(0, 20)}…${post.authorDid.slice(-8)}`
                : post.authorDid}
            </span>
            <time
              className="font-mono text-xs text-slate-light"
              dateTime={post.timestamp}
            >
              {new Date(post.timestamp).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        </div>
      </div>

      {/* Full Content — no line clamp */}
      <div className="mb-4">
        <p className="font-editorial text-base text-ink leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      {/* Media — full width */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4 rounded-md overflow-hidden">
          {post.media.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={item.url}
              alt={item.altText}
              className="w-full object-cover"
            />
          ))}
        </div>
      )}

      {/* Citations — expandable */}
      {post.citations && post.citations.length > 0 && (
        <div className="mb-4">
          <h3 className="font-mono text-xs text-slate mb-2">Citations</h3>
          <div className="border border-paper-dark rounded-md overflow-hidden">
            {post.citations.map((citation, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 px-3 py-2.5 ${
                  i > 0 ? "border-t border-paper-dark" : ""
                }`}
              >
                <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-paper-dark text-slate shrink-0 mt-0.5">
                  {citation.sourceType}
                </span>
                <div className="min-w-0">
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-editorial text-sm text-sage hover:text-sage-dark block"
                  >
                    {citation.title}
                  </a>
                  <span className="font-mono text-xs text-slate-light">
                    Accessed {new Date(citation.accessedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ProvenanceTag — expanded by default (STATE 2) */}
      <div className="mb-4">
        <ProvenanceTag provenance={provenance} postId={post.id} expanded={true} />
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 pt-2 border-t border-paper-dark">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate hover:text-ink hover:bg-paper-dark transition-colors duration-150 font-mono text-xs"
          aria-label={`${post.replyCount} replies. Click to reply.`}
        >
          <ChatCircle size={18} />
          <span>{post.replyCount} replies</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate hover:text-terracotta hover:bg-terracotta-light/30 transition-colors duration-150 font-mono text-xs"
          aria-label="Flag this post"
        >
          <Flag size={18} />
          <span>Flag</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate hover:text-ink hover:bg-paper-dark transition-colors duration-150 font-mono text-xs"
          aria-label="Share this post"
        >
          <ShareNetwork size={18} />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}
