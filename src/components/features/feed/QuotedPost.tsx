"use client";

import { PostWithAuthor } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DotsThree, MapPin, ShieldCheck, Warning } from "phosphor-react";
import { MediaGrid } from "./MediaGrid";
import { cn } from "@/lib/utils";

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

  const type = (post.source_type || "original").toUpperCase();

  return (
    <div className={cn(
      "mt-3 mb-1 rounded-[14px] border border-neutral-200 dark:border-neutral-600 bg-transparent overflow-hidden hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors cursor-pointer",
      post.coordination_survived && "border-l-4 border-emerald-500/50 bg-emerald-50/[0.005] dark:bg-emerald-950/[0.005]",
      post.coordination_flagged && "border-l-4 border-red-500/50 bg-red-50/[0.005] dark:bg-red-950/[0.005]"
    )}>
      <div className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 border border-neutral-100 dark:border-neutral-800 shadow-sm rounded-full overflow-hidden shrink-0">
              {post.author?.avatar_url && (
                <AvatarImage src={post.author.avatar_url} alt={post.author.display_name} className="object-cover w-full h-full" />
              )}
              <AvatarFallback className="text-[10px] font-bold">
                {getInitials(post.author?.display_name || "??")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-sans font-bold text-[15px] text-neutral-900 dark:text-neutral-100">
                  {post.author?.display_name || "Unknown Author"}
                </span>
                <span className="text-[13px] text-neutral-400 dark:text-neutral-500">
                  {getRelativeTime(post.created_at)}
                </span>

                {post.coordination_survived && (
                  <div 
                    title="Protected from Coordinated Attacks"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold font-sans uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0"
                  >
                    <ShieldCheck size={10} weight="fill" className="text-emerald-500 shrink-0 animate-pulse" />
                    <span>Protected</span>
                  </div>
                )}

                {post.coordination_flagged && (
                  <div 
                    title="Coordinated Disinformation Campaign"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold font-sans uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 shrink-0"
                  >
                    <Warning size={10} weight="fill" className="text-red-500 shrink-0" />
                    <span>Disinfo</span>
                  </div>
                )}
              </div>
              {/* Health Score Indicator Blocks */}
              <div className="flex items-center gap-[3px] mt-0.5">
                <div className="w-2.5 h-2.5 rounded-[2px] bg-danger" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-danger" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-success" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-success" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-danger" />
              </div>
            </div>
          </div>
          <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
            <DotsThree size={20} weight="bold" />
          </button>
        </div>

        {/* Content */}
        <div className="text-[15px] text-neutral-800 dark:text-[#EAE9E7] line-clamp-4 font-sans leading-snug break-words">
          {post.body}
        </div>

        {/* Media */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mt-1">
            <MediaGrid urls={post.media_urls} compact={true} />
          </div>
        )}

        {/* Provenance Tag Capsule */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 dark:bg-[#282828] rounded-full text-[10px] font-sans font-bold text-neutral-300 dark:text-[#A8A7A5] uppercase tracking-widest shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 dark:bg-[#777674]" />
            {type}
          </div>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center gap-4 text-[11px] font-sans text-neutral-400 dark:text-neutral-500/80 mt-1">
          <span>{post.reply_count || 10} Likes</span>
          <span>330 Comments</span>
          <span>45 references</span>
        </div>
      </div>
    </div>
  );
}
