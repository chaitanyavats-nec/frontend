"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PostWithProvenance } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChatCircle,
  ArrowUpRight,
  BookmarkSimple,
  ShareNetwork,
  Flag,
  DotsThree,
  Copy,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Quotes,
  LinkSimple as LinkIcon,
} from 'phosphor-react';
import { QuotedPost } from './QuotedPost';
import { MediaGrid } from './MediaGrid';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useInteractions } from '@/hooks/useInteractions';
import { useAuthModalStore } from '@/stores/useAuthModalStore';
import { ProvenanceTag } from '../provenance/ProvenanceTag';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface FeedCardProps {
  post: PostWithProvenance;
  showProvenance?: boolean;
  isReply?: boolean;
}

export function FeedCard({ post, isReply = false }: FeedCardProps) {
  const router = useRouter();
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking an interactive element
    const target = e.target as HTMLElement;
    const interactive = target.closest('a, button, [role="menuitem"], [data-radix-collection-item]');
    if (interactive) return;
    router.push(`/post/${post.id}`);
  };

  return (
    <article
      onClick={handleCardClick}
      className={cn(
        'group transition-all duration-150 overflow-hidden cursor-pointer',
        isReply
          ? 'border-l-2 border-cyan-500/20 pl-3 py-3 pr-4 hover:bg-cyan-500/5'
          : 'bg-paper-raised rounded-md border border-[var(--border-subtle)] hover:border-[var(--border-default)] hover:shadow-sm'
      )}
    >
      {/* Top accent bar */}
      {!isReply && (
        <div className="h-px flex w-full opacity-60 group-hover:opacity-100 transition-opacity">
          <div className="flex-1 bg-cyan-400" />
          <div className="flex-1 bg-magenta-400" />
          <div className="flex-1 bg-yellow-400" />
        </div>
      )}

      <div className={cn("p-3 sm:p-4", isReply && "p-0")}>
        <div className="flex items-start gap-3 sm:gap-4">
          {/* ── Author Avatar ── */}
          <div className="shrink-0 pt-0.5">
            <Link href={`/profile/${post.author.did}`} onClick={e => e.stopPropagation()}>
              <Avatar className={cn(
                "border-2 border-surface shadow-sm hover:opacity-90 transition-opacity",
                isReply ? "h-8 w-8" : "h-10 w-10"
              )}>
                {post.author?.avatar_url && (
                  <AvatarImage src={post.author.avatar_url} alt={post.author.display_name} />
                )}
                <AvatarFallback className={cn("font-bold bg-paper-dark/10", isReply ? "text-[11px]" : "text-[13px]")}>
                  {getInitials(post.author?.display_name || "??")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            {/* ── Header Row ── */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Link
                  href={`/profile/${post.author.did}`}
                  onClick={e => e.stopPropagation()}
                  className="font-sans font-bold text-[14px] text-neutral-900 dark:text-neutral-50 hover:text-cyan-600 transition-colors truncate shrink-0"
                >
                  {post.author?.display_name || "Unknown Author"}
                </Link>
                {post.coordination_survived && (
                  <ShieldCheck size={14} className="text-teal shrink-0" weight="fill" />
                )}
                <span className="text-neutral-300 dark:text-neutral-700 shrink-0">·</span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="hidden sm:inline font-mono text-[10px] text-neutral-400 truncate shrink min-w-0">
                    {post.author.did || 'did:agora:unknown'}
                  </span>
                  <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700 shrink-0">·</span>
                  <time className="text-[10px] font-mono text-neutral-400 shrink-0">
                    {getRelativeTime(post.created_at)}
                  </time>
                </div>
              </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1.5 -mr-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label="Post options"
                    >
                      <DotsThree size={20} weight="bold" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => withAuth(() => {})} className="gap-2.5 cursor-pointer">
                      <BookmarkSimple size={15} />
                      <span>Save post</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)} className="gap-2.5 cursor-pointer">
                      <Copy size={15} />
                      <span>Copy link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => withAuth(() => {})} className="gap-2.5 cursor-pointer">
                      <ShareNetwork size={15} />
                      <span>Share</span>
                    </DropdownMenuItem>
                    {post.origin_url && (
                      <DropdownMenuItem asChild className="gap-2.5 cursor-pointer">
                        <a href={post.origin_url} target="_blank" rel="noopener noreferrer">
                          <LinkIcon size={15} />
                          <span>View original source</span>
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => withAuth(() => {})} className="gap-2.5 cursor-pointer text-red-500 focus:text-red-500">
                      <Flag size={15} />
                      <span>Flag post</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>



            {/* ── Content Body ── */}
            <div className="mb-3">
              <div
                className={cn(
                  'text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed break-words overflow-hidden font-sans',
                  isReply ? 'text-[13px] line-clamp-4' : 'text-[14px] sm:text-[15px] line-clamp-6'
                )}
              >
                {post.body}
              </div>
              
              {/* ── Inline Location ── */}
              {post.location_data?.name && (
                <div className="flex items-center gap-1 mt-2 mb-1">
                  <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 opacity-80 hover:opacity-100 transition-opacity">
                    <MapPin size={12} weight="bold" />
                    <span className="text-[11px] font-sans font-medium">{post.location_data.name}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Media Content ── */}
            {post.media_urls && post.media_urls.length > 0 && (
              <MediaGrid urls={post.media_urls} />
            )}

            {/* ── Quoted Post ── */}
            {post.quoted_post && post.quoted_post.id && (
              <div onClick={(e) => { e.stopPropagation(); router.push(`/post/${post.quoted_post.id}`); }}>
                <QuotedPost post={post.quoted_post} />
              </div>
            )}

            {/* ── Poll UI ── */}
            {post.poll_data && post.poll_data.options && post.poll_data.options.length > 0 && (
              <div className="mt-4 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 space-y-3 shadow-inner">
                {post.poll_data.question && (
                  <h4 className="text-[13px] font-sans font-bold text-neutral-800 dark:text-neutral-200 mb-2">{post.poll_data.question}</h4>
                )}
                <div className="space-y-2">
                  {post.poll_data.options.map((opt, i) => {
                    const votes = post.poll_data!.votes?.[i] || 0;
                    const totalVotes = post.poll_data!.votes?.reduce((a, b) => a + b, 0) || 1;
                    const percentage = Math.round((votes / totalVotes) * 100);
                    
                    return (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); withAuth(() => {}); }}
                        className="w-full relative group"
                      >
                        <div className="w-full h-9 bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 flex items-center justify-between relative overflow-hidden transition-all hover:border-cyan-500/50">
                          {/* Progress bar */}
                          <div 
                            className="absolute inset-y-0 left-0 bg-cyan-500/10 dark:bg-cyan-500/15 transition-all duration-700 ease-out" 
                            style={{ width: `${percentage}%` }}
                          />
                          <span className="relative z-10 text-[12px] font-sans font-medium text-neutral-700 dark:text-neutral-300">{opt}</span>
                          <span className="relative z-10 text-[11px] font-mono text-neutral-500 font-bold">{percentage}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100/50 dark:border-neutral-800/50">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    {post.poll_data.votes?.reduce((a, b) => a + b, 0) || 0} Votes · Final
                  </span>
                  <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                    <span className="text-[9px] font-mono font-bold uppercase">Verified Outcomes</span>
                    <CheckCircle size={14} weight="fill" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Topic Tags ── */}
            {post.topic_tags && post.topic_tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
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
            {!isReply && (
              <div className="mb-3">
                <ProvenanceTag post={post} />
              </div>
            )}

            {/* ── Action Footer ── */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[80px] sm:max-w-[160px]">
                {post.origin_label || 'agora.io'}
              </span>
 
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); withAuth(() => {}); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-[var(--text-tertiary)] hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                  aria-label={`${post.reply_count || 0} replies`}
                >
                  <ChatCircle size={15} />
                  <span>{post.reply_count || 0}</span>
                </button>
 
                <button
                  onClick={(e) => { e.stopPropagation(); withAuth(toggleLike); }}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] transition-all",
                    userHasLiked
                      ? "text-magenta-400 bg-magenta-500/10"
                      : "text-[var(--text-tertiary)] hover:text-magenta-400 hover:bg-magenta-500/10"
                  )}
                  aria-label={`${likeCount} boosts`}
                >
                  <ArrowUpRight size={15} weight={userHasLiked ? "bold" : "regular"} />
                  <span>{likeCount}</span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); withAuth(() => { router.push(`/post/${post.id}?quote=true`); }); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] text-[var(--text-tertiary)] hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                  aria-label="Quote post"
                >
                  <Quotes size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
