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
import { ShieldCheck } from '@phosphor-icons/react';

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
        'group transition-all duration-200',
        isReply
          ? 'border-l-2 border-teal/20 pl-3 py-3 pr-4 hover:bg-teal/5'
          : 'bg-surface rounded-xl border border-paper-dark p-3.5 sm:p-5 hover:border-teal/30 hover:shadow-sm'
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
                className="font-editorial text-[17px] text-ink hover:text-teal transition-colors duration-150 truncate leading-tight"
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
              'text-ink whitespace-pre-wrap leading-relaxed break-words overflow-hidden',
              isReply ? 'text-sm mb-2' : 'text-sm md:text-base mb-3'
            )}
          >
            {post.content}
          </div>

          {/* ── Multimedia ──────────────────────────────── */}
          {post.media && post.media.length > 0 && (
            <div
              className={cn(
                "grid gap-2 mb-3 mt-2 overflow-hidden rounded-xl border border-paper-dark",
                post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
              )}
            >
              {post.media.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "relative bg-paper-dark/10 flex items-center justify-center overflow-hidden",
                    post.media && post.media.length === 3 && idx === 0 ? "row-span-2" : "",
                    post.media && post.media.length === 1 ? "aspect-auto max-h-[400px]" : "aspect-square"
                  )}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.altText || "Post image"}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : item.type === "video" ? (
                    <video
                      src={item.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          )}

          {/* ── Citations ─────────────────────────────── */}
          {post.citations && post.citations.length > 0 && (
            <div className="mb-3 space-y-1.5">
              {post.citations.map((citation, idx) => (
                <a
                  key={idx}
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-paper-dark/20 border border-paper-dark hover:border-teal/30 transition-colors duration-150 group/cite"
                >
                  <BookOpen size={14} className="text-teal shrink-0" />
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
                  className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-teal/5 text-teal border border-teal/20 transition-all duration-150 hover:bg-teal/10"
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
              {post.provenance?.coordinationFlag?.detected && post.provenance?.coordinationFlag?.survivedCoordinatedAttack && (
                <div title="This post survived a coordinated complaint campaign" className="flex items-center justify-center px-2 py-1">
                  <ShieldCheck size={18} className="text-teal" />
                </div>
              )}
              {/* Reply */}
              <button
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-slate hover:text-teal hover:bg-teal/5 transition-all duration-150 text-sm group/btn"
                aria-label={`${post.replyCount || 0} replies`}
              >
                <ChatCircle
                  size={18}
                  className="transition-transform duration-150 group-hover/btn:scale-110"
                />
                <span className="text-xs font-bold">{post.replyCount || 0}</span>
              </button>

              {/* Derive */}
              <button
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-slate hover:text-violet hover:bg-violet/5 transition-all duration-150 text-sm group/btn"
                aria-label="Derive post"
              >
                <GitCommit
                  size={18}
                  className="transition-transform duration-150 group-hover/btn:scale-110"
                />
              </button>

              {/* Share */}
              <button
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-slate hover:text-orange hover:bg-orange/5 transition-all duration-150 text-sm group/btn"
                aria-label="Share link"
              >
                <LinkIcon
                  size={18}
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
