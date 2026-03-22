"use client";

import Link from 'next/link';
import { Post } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChatCircle,
  Link as LinkIcon,
  GitCommit,
  BookOpen,
  ArrowUpRight,
} from 'phosphor-react';
import { ProvenanceTag } from '../provenance/ProvenanceTag';
import { cn } from '@/lib/utils';

interface FeedCardProps {
  post: Post;
  showProvenance?: boolean;
  isReply?: boolean;
}

export function FeedCard({ post, showProvenance = false, isReply = false }: FeedCardProps) {
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
        'group transition-colors duration-150',
        isReply
          ? 'border-l-2 border-sage/30 pl-3 py-3 pr-4 hover:bg-paper-dark/30'
          : 'bg-surface rounded-lg border border-paper-dark p-4 sm:p-5 hover:border-sage/30'
      )}
    >
      <div className="flex items-start gap-3">
        {/* ── Avatar ───────────────────────────────────── */}
        <Link href={`/profile/${post.authorDid}`} className="shrink-0 pt-0.5">
          <Avatar
            className={cn(
              isReply ? 'h-8 w-8' : 'h-10 w-10'
            )}
          >
            <AvatarImage src={post.authorAvatarUrl} alt={post.authorDisplayName || ''} />
            <AvatarFallback>
              {getInitials(post.authorDisplayName)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          {/* ── Header Row ────────────────────────────── */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Link
                href={`/profile/${post.authorDid}`}
                className="font-semibold text-[15px] text-ink hover:text-sage transition-colors duration-150 truncate"
              >
                {post.authorDisplayName}
              </Link>
              <span className="text-xs font-mono text-slate truncate hidden sm:inline">
                {post.authorDid.substring(0, 24)}…
              </span>
              <span className="text-slate/40 hidden sm:inline">·</span>
              <time className="text-xs text-slate shrink-0">
                {getRelativeTime(post.timestamp)}
              </time>
            </div>
          </div>

          {/* ── Content Body ──────────────────────────── */}
          <div
            className={cn(
              'text-ink whitespace-pre-wrap leading-relaxed',
              isReply ? 'text-sm mb-2' : 'text-sm md:text-base mb-3'
            )}
          >
            {post.content}
          </div>

          {/* ── Citations ─────────────────────────────── */}
          {post.citations && post.citations.length > 0 && (
            <div className="mb-3 space-y-1.5">
              {post.citations.map((citation, idx) => (
                <a
                  key={idx}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-paper-dark/30 border border-paper-dark hover:border-sage/30 transition-colors duration-150 group/cite"
                >
                  <BookOpen size={14} className="text-sage shrink-0" />
                  <span className="text-xs text-ink truncate">
                    {citation.title}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-slate capitalize shrink-0">
                    {citation.sourceType}
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="text-slate/60 group-hover/cite:text-sage transition-colors shrink-0"
                  />
                </a>
              ))}
            </div>
          )}

          {/* ── Topic Tags ────────────────────────────── */}
          {post.topicTags && post.topicTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.topicTags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono px-2 py-0.5 rounded-full bg-sage/10 text-sage border border-sage/20 transition-colors duration-150 hover:bg-sage/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Provenance + Actions Footer ───────────── */}
          <div
            className={cn(
              'flex items-center justify-between pt-2.5',
              !isReply && 'border-t border-paper-dark/60 mt-1'
            )}
          >
            {/* Provenance Tag */}
            <div>
              {post.provenance && (showProvenance || true) && (
                <ProvenanceTag
                  provenance={post.provenance}
                  postId={post.id}
                  expanded={false}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-0.5">
              {/* Reply */}
              <button
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-slate hover:text-sage hover:bg-sage/10 transition-all duration-150 text-sm group/btn"
                aria-label={`${post.replyCount || 0} replies`}
              >
                <ChatCircle
                  size={16}
                  className="transition-transform duration-150 group-hover/btn:scale-110"
                />
                <span className="text-xs">{post.replyCount || 0}</span>
              </button>

              {/* Derive */}
              <button
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-slate hover:text-gold hover:bg-gold/10 transition-all duration-150 text-sm group/btn"
                aria-label="Derive post"
              >
                <GitCommit
                  size={16}
                  className="transition-transform duration-150 group-hover/btn:scale-110"
                />
              </button>

              {/* Share */}
              <button
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-slate hover:text-terracotta hover:bg-terracotta/10 transition-all duration-150 text-sm group/btn"
                aria-label="Share link"
              >
                <LinkIcon
                  size={16}
                  className="transition-transform duration-150 group-hover/btn:scale-110"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
