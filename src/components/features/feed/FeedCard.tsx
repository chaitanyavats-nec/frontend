"use client";

import Link from 'next/link';
import Image from 'next/image';
import { PostWithProvenance } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChatCircle,
  GitCommit,
  ArrowUpRight,
  ShieldCheck,
} from 'phosphor-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useInteractions } from '@/hooks/useInteractions';
import { useAuthModalStore } from '@/stores/useAuthModalStore';
import { ProvenanceTag } from '../provenance/ProvenanceTag';

interface FeedCardProps {
  post: PostWithProvenance;
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
          {/* ── Author Avatar ── */}
          <div className="shrink-0 pt-1">
            <Link href={`/profile/${post.author.did}`}>
              <Avatar className="h-10 w-10 border-2 border-surface shadow-sm hover:opacity-90 transition-opacity">
                {post.author.avatar_url && (
                  <AvatarImage src={post.author.avatar_url} alt={post.author.display_name} />
                )}
                <AvatarFallback className="text-[14px] font-bold bg-paper-dark/10">
                  {getInitials(post.author.display_name)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            {/* ── Header Row ── */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href={`/profile/${post.author.did}`}
                  className="font-sans font-bold text-[14px] text-neutral-900 dark:text-neutral-50 hover:text-cyan-600 transition-colors truncate"
                >
                  {post.author.display_name}
                </Link>
                {post.coordination_survived && (
                  <ShieldCheck size={14} className="text-teal" weight="fill" />
                )}
                <span className="text-[10px] font-mono text-neutral-400 truncate hidden sm:inline tracking-tighter">
                  @{post.author.did?.substring(0, 8) ?? 'unknown'}...
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>
                <time className="text-[10px] font-mono text-neutral-400 shrink-0">
                  {getRelativeTime(post.created_at)}
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
                {post.body}
              </div>
            </div>

            {/* ── Visual Media ── */}
            {post.media_urls && post.media_urls.length > 0 && (
              <div
                className={cn(
                  'relative rounded-sm overflow-hidden mb-4 border border-paper-dark bg-paper-dark/30',
                  post.media_urls.length > 1 ? 'grid grid-cols-2 gap-1' : 'block'
                )}
              >
                {post.media_urls.map((url: string, idx: number) => (
                  <div
                    key={idx}
                    className={cn(
                      'relative',
                      post.media_urls!.length === 1 ? 'aspect-[16/9]' : 'aspect-square'
                    )}
                  >
                    <Image
                      src={url}
                      alt={`Media ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ── Topic Tags ── */}
            {post.topic_tags && post.topic_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.topic_tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-full text-[10px] font-mono leading-none"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Provenance Tag ── */}
            <div className="mb-4">
              <ProvenanceTag post={post} />
            </div>

            {/* ── Action Footer ── */}
            <div className="flex items-center justify-between pt-3 border-t border-dotted border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-neutral-400">
                  {post.origin_label || 'agora.io'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => withAuth(() => { })}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-xs font-mono text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                >
                  <ChatCircle size={16} />
                  <span>{post.reply_count || 0}</span>
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
