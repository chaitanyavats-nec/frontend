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
  ShieldCheck,
  Link as LinkIcon,
  Copy,
} from 'phosphor-react';
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
          ? 'border-l-2 border-cyan-400/20 pl-3 py-3 pr-4 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10'
          : 'bg-paper-raised rounded-md border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm'
      )}
    >
      {/* Top accent bar */}
      {!isReply && (
        <div className="h-[2px] flex w-full opacity-60 group-hover:opacity-100 transition-opacity">
          <div className="flex-1 bg-cyan-400" />
          <div className="flex-1 bg-magenta-400" />
          <div className="flex-1 bg-yellow-400" />
        </div>
      )}

      <div className={cn("p-3.5 sm:p-5", isReply && "p-0")}>
        <div className="flex items-start gap-3 sm:gap-4">
          {/* ── Author Avatar ── */}
          <div className="shrink-0 pt-0.5">
            <Link href={`/profile/${post.author.did}`} onClick={e => e.stopPropagation()}>
              <Avatar className={cn(
                "border-2 border-surface shadow-sm hover:opacity-90 transition-opacity",
                isReply ? "h-8 w-8" : "h-10 w-10"
              )}>
                {post.author.avatar_url && (
                  <AvatarImage src={post.author.avatar_url} alt={post.author.display_name} />
                )}
                <AvatarFallback className={cn("font-bold bg-paper-dark/10", isReply ? "text-[11px]" : "text-[13px]")}>
                  {getInitials(post.author.display_name)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            {/* ── Header Row ── */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0 w-full overflow-hidden text-[10px] sm:text-[14px]">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/profile/${post.author.did}`}
                    onClick={e => e.stopPropagation()}
                    className="font-sans font-bold text-[14px] text-neutral-900 dark:text-neutral-50 hover:text-cyan-600 transition-colors truncate max-w-[160px] sm:max-w-none"
                  >
                    {post.author.display_name}
                  </Link>
                  {post.coordination_survived && (
                    <ShieldCheck size={14} className="text-teal shrink-0" weight="fill" />
                  )}
                </div>
                <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700 shrink-0">·</span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-[10px] text-neutral-400 truncate shrink min-w-0">
                    {post.author.did || 'did:agora:unknown'}
                  </span>
                  <span className="text-neutral-300 dark:text-neutral-700 shrink-0">·</span>
                  <time className="text-[10px] font-mono text-neutral-400 shrink-0">
                    {getRelativeTime(post.created_at)}
                  </time>
                </div>
              </div>

              {/* ── Options Menu ── */}
              {!isReply && (
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
              )}
            </div>

            {/* ── Content Body ── */}
            <div className="mb-3">
              <div
                className={cn(
                  'text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed break-words overflow-hidden font-sans',
                  isReply ? 'text-[13px] line-clamp-4' : 'text-[15px] line-clamp-6'
                )}
              >
                {post.body}
              </div>
            </div>

            {/* ── Visual Media ── */}
            {post.media_urls && post.media_urls.length > 0 && (
              <div
                className={cn(
                  'relative rounded-md overflow-hidden mb-3 border border-neutral-200 dark:border-neutral-700 bg-paper-dark/20',
                  post.media_urls.length > 1 ? 'grid grid-cols-2 gap-0.5' : 'block'
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
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                ))}
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
            <div className="flex items-center justify-between pt-2.5 border-t border-dotted border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[100px] sm:max-w-[160px]">
                {post.origin_label || 'agora.io'}
              </span>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); withAuth(() => {}); }}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-md font-mono text-[10px] text-neutral-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all"
                  aria-label={`${post.reply_count || 0} replies`}
                >
                  <ChatCircle size={15} />
                  <span>{post.reply_count || 0}</span>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); withAuth(toggleLike); }}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1.5 rounded-md font-mono text-[10px] transition-all",
                    userHasLiked
                      ? "text-magenta-600 dark:text-magenta-400 bg-magenta-50 dark:bg-magenta-900/20"
                      : "text-neutral-400 hover:text-magenta-600 hover:bg-magenta-50 dark:hover:bg-magenta-900/20"
                  )}
                  aria-label={`${likeCount} boosts`}
                >
                  <ArrowUpRight size={15} weight={userHasLiked ? "bold" : "regular"} />
                  <span>{likeCount}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
