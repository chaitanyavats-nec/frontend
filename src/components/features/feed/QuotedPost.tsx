"use client";

import { PostWithAuthor } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MediaGrid } from "./MediaGrid";
import { MapPin } from "phosphor-react";

interface QuotedPostProps {
  post: PostWithAuthor;
}

export function QuotedPost({ post }: QuotedPostProps) {
  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || '??';
  };

  const getRelativeTime = (dateString: string) => {
    const timestamp = new Date(dateString).getTime();
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d`;
    return `${Math.floor(diffInDays / 30)}mo`;
  };

  if (!post || !post.id) return null;

  return (
    <div className="mt-2 mb-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-paper-sunken/30 overflow-hidden hover:bg-paper-sunken/50 transition-colors">
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Avatar className="h-4 w-4 border border-surface shadow-sm">
            {post.author?.avatar_url && (
              <AvatarImage src={post.author.avatar_url} alt={post.author.display_name} />
            )}
            <AvatarFallback className="text-[8px] font-bold">
              {getInitials(post.author?.display_name || "??")}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-sans font-bold text-[12px] text-neutral-900 dark:text-neutral-50 truncate">
              {post.author?.display_name || "Unknown Author"}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <span className="font-mono text-[9px] text-neutral-400 truncate max-w-[80px]">
              {post.author?.did || 'did:agora:unknown'}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">·</span>
            <time className="text-[9px] font-mono text-neutral-400">
              {getRelativeTime(post.created_at)}
            </time>
          </div>
        </div>
        <div className="text-[12px] text-neutral-800 dark:text-neutral-200 line-clamp-3 font-sans leading-normal">
          {post.body}
        </div>

        {/* ── Location Badge ── */}
        {post.location_data?.name && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center gap-1 px-1 py-0.5 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800 rounded-sm text-cyan-600 dark:text-cyan-400">
              <MapPin size={8} weight="fill" />
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider">{post.location_data.name}</span>
            </div>
          </div>
        )}

        {/* ── Media ── */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mt-2">
            <MediaGrid urls={post.media_urls} compact={true} />
          </div>
        )}
      </div>
    </div>
  );
}
