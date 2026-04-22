"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChatCircle,
  Flag,
  ArrowsLeftRight,
  BookmarkSimple,
  ShareNetwork,
  DotsThree,
  Copy,
  Image as ImageIcon,
  Link as LinkIcon,
  ArrowLeft,
} from "phosphor-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProvenanceTag } from "@/components/features/provenance/ProvenanceTag";
import { ProvenanceUpdatePanel } from "@/components/features/provenance/ProvenanceUpdatePanel";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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

function getFormattedDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PostDetail({ post }: PostDetailProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showUpdatePanel, setShowUpdatePanel] = useState(false);

  return (
    <article
      className="bg-paper-raised rounded-md border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      role="article"
      aria-label={`Post by ${post.author.display_name}`}
    >
      {/* Accent bar */}
      <div className="h-[2px] flex w-full">
        <div className="flex-1 bg-cyan-400" />
        <div className="flex-1 bg-magenta-400" />
        <div className="flex-1 bg-yellow-400" />
      </div>

      <div className="p-4 sm:p-6">
        {/* ── Author Row ── */}
        <div className="flex items-center justify-between mb-5">
          <Link href={`/profile/${post.author.did}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity min-w-0 max-w-[calc(100%-40px)]">
            <Avatar className="h-11 w-11 sm:h-12 sm:w-12 border-2 border-surface shadow-sm shrink-0">
              {post.author.avatar_url && (
                <AvatarImage src={post.author.avatar_url} alt={post.author.display_name} />
              )}
              <AvatarFallback className="text-[13px] font-bold bg-paper-dark/10">{getInitials(post.author.display_name)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 w-full overflow-hidden">
              <span className="font-sans font-bold text-[15px] sm:text-[16px] text-neutral-900 dark:text-neutral-50 truncate shrink-0">
                {post.author.display_name}
              </span>
              <span className="hidden sm:inline text-neutral-300 dark:text-neutral-600 shrink-0">·</span>
              <span className="font-mono text-[11px] text-neutral-400 truncate shrink min-w-0">
                {post.author.did || 'did:agora:unknown'}
              </span>
              <span className="hidden sm:inline text-neutral-300 dark:text-neutral-600 shrink-0">·</span>
              <time
                className="text-[11px] font-mono text-neutral-400 shrink-0"
                dateTime={post.created_at}
              >
                {getFormattedDate(post.created_at)}
              </time>
            </div>
          </Link>

          {/* ── Options Menu ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 -mr-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
                aria-label="Post options"
              >
                <DotsThree size={22} weight="bold" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem className="gap-2.5 cursor-pointer">
                <BookmarkSimple size={15} />
                <span>Save post</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)} className="gap-2.5 cursor-pointer">
                <Copy size={15} />
                <span>Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2.5 cursor-pointer">
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
              <DropdownMenuItem className="gap-2.5 cursor-pointer text-red-500 focus:text-red-500">
                <Flag size={15} />
                <span>Flag post</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── Full Content ── */}
        <div className="mb-5">
          <p className="text-[16px] sm:text-[17px] font-sans text-neutral-800 dark:text-neutral-200 leading-[1.75] whitespace-pre-wrap break-words">
            {post.body}
          </p>
        </div>

        {/* ── Media ── */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mb-5 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <div className={post.media_urls.length > 1 ? "grid grid-cols-2 gap-0.5" : ""}>
              {post.media_urls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt={`Post media ${i + 1}`}
                  className="w-full object-cover max-h-[480px]"
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Citations ── */}
        {post.citations && post.citations.length > 0 && (
          <div className="mb-5">
            <h3 className="eyebrow mb-2.5">Citations</h3>
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-md overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-700">
              {post.citations.map((citation, i) => (
                <div key={i} className="flex items-start gap-2.5 px-3 py-2.5">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 shrink-0 mt-0.5 uppercase">
                    {citation.source_type}
                  </span>
                  <div className="min-w-0">
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-sans text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 block truncate"
                    >
                      {citation.title}
                    </a>
                    <span className="text-[10px] font-mono text-neutral-400">
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

        {/* ── Provenance ── */}
        <div className="mb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <ProvenanceTag post={post} expanded={true} />
            </div>
            {!showUpdatePanel && (
              <button
                onClick={() => setShowUpdatePanel(true)}
                className="text-[11px] font-mono font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors shrink-0 mt-1 underline underline-offset-2"
              >
                Contribute context
              </button>
            )}
          </div>
          {showUpdatePanel && (
            <ProvenanceUpdatePanel postId={post.id} onClose={() => setShowUpdatePanel(false)} />
          )}
        </div>

        {/* ── Action Bar ── */}
        <div className="flex items-center gap-1 sm:gap-1.5 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex-wrap">
          <button
            onClick={() => setIsReplying(!isReplying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors duration-150 text-[12px] font-mono font-medium ${isReplying ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            aria-label="Reply to this post"
          >
            <ChatCircle size={16} weight={isReplying ? "fill" : "regular"} />
            <span>Reply</span>
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-neutral-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors duration-150 text-[12px] font-mono font-medium"
            aria-label="Boost this post"
          >
            <ArrowsLeftRight size={16} />
            <span>Boost</span>
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-neutral-400 hover:text-magenta-600 hover:bg-magenta-50 dark:hover:bg-magenta-900/20 transition-colors duration-150 text-[12px] font-mono font-medium"
            aria-label="Save this post"
          >
            <BookmarkSimple size={16} />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 text-[12px] font-mono font-medium ml-auto"
            aria-label="Share this post"
          >
            <ShareNetwork size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* ── Inline Compose ── */}
        {isReplying && (
          <div className="mt-4 p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700 rounded-md bg-paper-raised relative">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[14px] font-sans leading-relaxed text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 min-h-[80px] sm:min-h-[100px] resize-none pb-12"
              autoFocus
            />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <button className="text-neutral-400 hover:text-cyan-600 transition-colors p-1">
                  <ImageIcon size={16} />
                </button>
                <button className="text-neutral-400 hover:text-cyan-600 transition-colors p-1">
                  <LinkIcon size={16} />
                </button>
              </div>
              <Button size="sm" disabled={!replyText.trim()} className="bg-cyan-600 text-white px-4 h-7 sm:h-8 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-cyan-700 disabled:opacity-40">
                Commit Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
