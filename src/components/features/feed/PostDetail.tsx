"use client";

import { ChatCircle, Flag, ShareNetwork } from "phosphor-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProvenanceTag } from "@/components/features/provenance/ProvenanceTag";
import type { PostWithProvenance } from "@/types";

interface PostDetailProps {
  post: PostWithProvenance;
}

function getInitials(name?: string): string {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="bg-surface rounded-lg border border-paper-dark p-5 sm:p-6" role="article" aria-label={`Post by ${post.author.display_name}`}>
      {/* Author Row — larger avatar */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-12 w-12">
          {post.author.avatar_url && (
            <AvatarImage src={post.author.avatar_url} alt={post.author.display_name} />
          )}
          <AvatarFallback className="text-sm">{getInitials(post.author.display_name)}</AvatarFallback>
        </Avatar>

        <div>
          <span className="font-semibold text-sm text-ink block">
            {post.author.display_name}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate">
              {post.author.did && post.author.did.length > 30
                ? `${post.author.did.slice(0, 20)}…${post.author.did.slice(-8)}`
                : post.author.did || 'did:agora:unknown'}
            </span>
            <time
              className="text-xs text-slate"
              dateTime={post.created_at}
            >
              {new Date(post.created_at).toLocaleDateString("en-GB", {
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
        <p className="text-base text-ink leading-relaxed whitespace-pre-wrap">
          {post.body}
        </p>
      </div>

      {/* Media — full width */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="mb-4 rounded-lg overflow-hidden grid gap-2">
          {post.media_urls.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt="Post image"
              className="w-full object-cover"
            />
          ))}
        </div>
      )}

      {/* Citations — expandable */}
      {post.citations && post.citations.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-medium text-slate mb-2">Citations</h3>
          <div className="border border-paper-dark rounded-lg overflow-hidden">
            {post.citations.map((citation, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 px-3 py-2.5 ${
                  i > 0 ? "border-t border-paper-dark" : ""
                }`}
              >
                <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-paper-dark/50 text-slate shrink-0 mt-0.5">
                  {citation.source_type}
                </span>
                <div className="min-w-0">
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sage hover:text-sage-dark block"
                  >
                    {citation.title}
                  </a>
                  <span className="text-xs text-slate">
                    Accessed {new Date(citation.accessed_at).toLocaleDateString("en-GB", {
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

      {/* ProvenanceTag — expanded by default */}
      <div className="mb-4">
        <ProvenanceTag post={post} expanded={true} />
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 pt-3 border-t border-paper-dark">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate hover:text-ink hover:bg-paper-dark/50 transition-colors duration-150 text-xs font-medium"
          aria-label={`${post.reply_count} replies. Click to reply.`}
        >
          <ChatCircle size={18} />
          <span>{post.reply_count} replies</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate hover:text-terracotta hover:bg-terracotta/10 transition-colors duration-150 text-xs font-medium"
          aria-label="Flag this post"
        >
          <Flag size={18} />
          <span>Flag</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate hover:text-ink hover:bg-paper-dark/50 transition-colors duration-150 text-xs font-medium"
          aria-label="Share this post"
        >
          <ShareNetwork size={18} />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
}
