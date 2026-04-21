"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChatCircle,
  GitCommit,
  ArrowUpRight,
} from 'phosphor-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useInteractions } from '@/hooks/useInteractions';
import { useAuthModalStore } from '@/stores/useAuthModalStore';

interface FeedCardProps {
  post: Post;
  showProvenance?: boolean;
  isReply?: boolean;
}

export function FeedCard({ post, isReply = false }: FeedCardProps) {
  const { user } = useAuth();
  const { open: openAuthModal } = useAuthModalStore();
  const { likeCount, userHasLiked, toggleLike } = useInteractions(post.id);

  const withAuth = (action: () => void) => {
    if (!user) {
      openAuthModal();
      return;
    }
    action();
  };

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
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo`;
    return `${Math.floor(diffInMonths / 12)}y`;
  };

  return (
    <article
      className={cn(
        'group transition-all duration-140 overflow-hidden',
        isReply
          ? 'border-l-2 border-cyan-400/20 pl-3 py-3 pr-4 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10'
          : 'bg-paper-raised rounded-md border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
      )}
    >
      {!isReply && (
        <div className="h-[3px] flex w-full">
          <div className="flex-1 bg-cyan-300" />
          <div className="flex-1 bg-magenta-300" />
          <div className="flex-1 bg-yellow-300" />
        </div>
      )}
      <div className={cn("p-3.5 sm:p-5", isReply && "p-0")}>
        <div className="flex items-start gap-4">
          {/* ── Avatar ── */}
          <Link href={`/profile/${post.authorDid}`} className="shrink-0">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
              <Avatar className="h-full w-full">
                <AvatarImage src={post.authorAvatarUrl} alt={post.authorDisplayName || ''} />
                <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono text-xs">
                  {getInitials(post.authorDisplayName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            {/* ── Header Row ── */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href={`/profile/${post.authorDid}`}
                  className="font-sans font-bold text-[14px] text-neutral-900 dark:text-neutral-50 hover:text-cyan-600 transition-colors truncate"
                >
                  {post.authorDisplayName}
                </Link>
                <span className="text-[10px] font-mono text-neutral-400 truncate hidden sm:inline tracking-tighter">
                  @{post.authorDid.substring(0, 8)}...
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>
                <time className="text-[10px] font-mono text-neutral-400 shrink-0">
                  {getRelativeTime(post.timestamp)}
                </time>
              </div>
            </div>

            {/* ── Content Body ── */}
            <div className="mb-4">
              <div
                className={cn(
                  'text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed break-words overflow-hidden font-sans',
                  isReply ? 'text-sm' : 'text-[15px]'
                )}
              >
                {post.content}
              </div>
            </div>

            {/* ── Multimedia ── */}
            {post.media && post.media.length > 0 && (
              <div
                className={cn(
                  "grid gap-1 mb-4 overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800",
                  post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
                )}
              >
                {post.media.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "relative bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden",
                      post.media && post.media.length === 1 ? "aspect-auto max-h-[500px]" : "aspect-square"
                    )}
                  >
                    {item.type === "image" ? (
                      <Image
                        src={item.url}
                        alt={item.altText || "Post image"}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                      />
                    ) : item.type === "video" ? (
                      <video src={item.url} controls className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {/* ── Topic Tags ── */}
            {post.topicTags && post.topicTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.topicTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-xs bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Provenance Signature Box ── */}
            {post.provenance && (
              <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-sm p-2 flex items-center gap-3 mb-4">
                <div className="relative w-5 h-5 shrink-0">
                  <div className="absolute top-0 left-0.5 w-3 h-3 bg-cyan-300/60 rounded-full" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 bg-magenta-300/60 rounded-full" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-300/60 rounded-full" />
                </div>
                <div className="grow min-w-0">
                  <div className="text-[8px] font-mono font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
                    Cryptographic Witness
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 truncate leading-none">
                    sha256:{post.id.substring(0, 32)}...
                  </div>
                </div>
                <div className="text-[9px] font-mono font-bold text-success uppercase shrink-0">
                  Signed ✓
                </div>
              </div>
            )}

            {/* ── Action Footer ── */}
            <div className="flex items-center justify-between pt-3 border-t border-dotted border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-neutral-400">
                  {post.provenance?.socialContext?.sourceNode || 'agora.io'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => withAuth(() => { })}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-xs font-mono text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                >
                  <ChatCircle size={16} />
                  <span>{post.replyCount || 0}</span>
                </button>

                <button
                  onClick={() => withAuth(toggleLike)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1.5 rounded-xs font-mono text-[10px] transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700",
                    userHasLiked
                      ? "text-magenta-600 dark:text-magenta-400 bg-magenta-50 dark:bg-magenta-900/20 border-magenta-200 dark:border-magenta-800"
                      : "text-neutral-400 hover:text-magenta-600 hover:bg-magenta-50 dark:hover:bg-magenta-900/20"
                  )}
                >
                  <ArrowUpRight size={16} weight={userHasLiked ? "bold" : "regular"} />
                  <span>{likeCount}</span>
                </button>

                <button
                  onClick={() => withAuth(() => { })}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-xs font-mono text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                >
                  <GitCommit size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

  );
}
