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
  CaretDown,
  CaretUp,
  MapPin,
  CheckCircle,
  Quotes,
} from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ProvenanceTag } from "@/components/features/provenance/ProvenanceTag";
import { ProvenanceUpdatePanel } from "@/components/features/provenance/ProvenanceUpdatePanel";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "next/navigation";
import { QuotedPost } from "./QuotedPost";
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
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const { createPost, isCreating, createError } = usePosts();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isQuoteMode = searchParams.get("quote") === "true";

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    try {
      await createPost({
        body: replyText,
        parentId: isQuoteMode ? null : post.id,
        rootId: isQuoteMode ? null : (post.root_id || post.id),
        type: isQuoteMode ? "post" : "comment",
        quotedPostId: isQuoteMode ? post.id : null,
        provenanceType: "original",
      });
      setReplyText("");
      setIsReplying(false);
    } catch (err) {
      console.error("Failed to post:", err);
    }
  };

  return (
    <article
      className="bg-paper-raised rounded-md border border-[var(--border-subtle)] overflow-hidden"
      role="article"
      aria-label={`Post by ${post.author.display_name}`}
    >
      {/* Accent bar */}
      <div className="h-px flex w-full">
        <div className="flex-1 bg-cyan-400" />
        <div className="flex-1 bg-magenta-400" />
        <div className="flex-1 bg-yellow-400" />
      </div>

      <div className="p-4 sm:p-6">
        {/* ── Author Row ── */}
        <div className="flex items-center justify-between mb-4">
          <Link href={`/profile/${post.author.did}`} className="flex items-center gap-3 hover:opacity-90 transition-opacity min-w-0 flex-1">
            <Avatar className="h-10 w-10 sm:h-11 sm:w-11 border-[1.5px] border-surface shadow-sm shrink-0">
              {post.author.avatar_url && (
                <AvatarImage src={post.author.avatar_url} alt={post.author.display_name} />
              )}
              <AvatarFallback className="text-[12px] font-bold bg-paper-dark/10">{getInitials(post.author.display_name)}</AvatarFallback>
            </Avatar>
 
            <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0 overflow-hidden">
              <span className="font-sans font-bold text-[15px] sm:text-[17px] text-neutral-900 dark:text-neutral-50 truncate shrink-0">
                {post.author.display_name}
              </span>
              <span className="hidden sm:inline text-neutral-300 dark:text-neutral-600 shrink-0">·</span>
              <div className="flex items-center gap-1.5 min-w-0">
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
            </div>
          </Link>

          {/* ── Location Badge ── */}
          {post.location_data?.name && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800 rounded-sm text-cyan-700 dark:text-cyan-300 mr-2">
              <MapPin size={14} weight="fill" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{post.location_data.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsProfileExpanded(!isProfileExpanded)}
              className={cn(
                "p-2 rounded-md transition-all duration-150",
                isProfileExpanded 
                  ? "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20" 
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
              aria-label={isProfileExpanded ? "Hide author profile" : "Show author profile"}
            >
              {isProfileExpanded ? <CaretUp size={18} weight="bold" /> : <CaretDown size={18} weight="bold" />}
            </button>

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
        </div>

        {/* ── Expanded Profile Panel ── */}
        <AnimatePresence>
          {isProfileExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mb-4 p-4 rounded-md bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-6">
                  {/* Left: Bio */}
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-slate mb-2 opacity-70">Author Biography</h4>
                    <p className="font-sans text-[13px] text-ink leading-relaxed">
                      {post.author.bio || "No biography provided for this author."}
                    </p>
                  </div>
                  
                  {/* Right: Reputation */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-slate mb-2 opacity-70">Reputation</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[9px] font-mono mb-1 text-slate uppercase">
                          <span>Accuracy</span>
                          <span className="text-teal font-bold">85%</span>
                        </div>
                        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "85%" }}
                            className="h-full bg-teal/70"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] font-mono mb-1 text-slate uppercase">
                          <span>Longevity</span>
                          <span className="text-teal font-bold">70%</span>
                        </div>
                        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "70%" }}
                            className="h-full bg-teal/70"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] font-mono mb-1 text-slate uppercase">
                          <span>Participation</span>
                          <span className="text-teal font-bold">45%</span>
                        </div>
                        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "45%" }}
                            className="h-full bg-teal/70"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Content Body ── */}
        <div className="mb-4">
          {post.location_data?.name && (
            <div className="flex sm:hidden items-center gap-1.5 mb-3 text-cyan-600 dark:text-cyan-400">
              <MapPin size={14} weight="fill" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider">{post.location_data.name}</span>
            </div>
          )}
          <p className="text-[15px] sm:text-[16px] font-sans text-neutral-800 dark:text-neutral-200 leading-[1.65] whitespace-pre-wrap break-words">
            {post.body}
          </p>
        </div>

        {/* ── Poll UI ── */}
        {post.poll_data && (
          <div className="mb-6 bg-paper-sunken border border-neutral-200 dark:border-neutral-800 rounded-md p-5 space-y-4">
            {post.poll_data.question && (
              <h4 className="text-[15px] font-sans font-bold text-ink mb-2">{post.poll_data.question}</h4>
            )}
            <div className="space-y-2.5">
              {post.poll_data.options.map((opt, i) => {
                const votes = post.poll_data!.votes?.[i] || 0;
                const totalVotes = post.poll_data!.votes?.reduce((a, b) => a + b, 0) || 1;
                const percentage = Math.round((votes / totalVotes) * 100);
                
                return (
                  <button
                    key={i}
                    className="w-full relative group"
                  >
                    <div className="w-full h-11 bg-paper border border-[var(--border-subtle)] rounded-md px-4 flex items-center justify-between relative overflow-hidden transition-all hover:border-cyan-500/50">
                      <div 
                        className="absolute inset-y-0 left-0 bg-cyan-100/30 dark:bg-cyan-900/15 transition-all duration-700 ease-out" 
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="relative z-10 text-[14px] font-sans text-ink">{opt}</span>
                      <span className="relative z-10 text-[12px] font-mono text-slate font-medium">{percentage}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[11px] font-mono text-slate uppercase tracking-widest font-medium">
                {post.poll_data.votes?.reduce((a, b) => a + b, 0) || 0} Votes · Final Results
              </span>
              <div className="flex items-center gap-1.5 text-teal">
                <span className="text-[10px] font-mono font-bold uppercase">Verified Outcomes</span>
                <CheckCircle size={16} weight="fill" />
              </div>
            </div>
          </div>
        )}

        {/* ── Media ── */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mb-4 rounded-md overflow-hidden border border-[var(--border-subtle)] bg-paper-dark/10">
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
            <div className="border border-[var(--border-subtle)] rounded-md overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-700">
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
        <div className="mb-4">
          <div className="space-y-2">
            <ProvenanceTag post={post} expanded={true} />
            {!showUpdatePanel && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowUpdatePanel(true)}
                  className="text-[11px] font-mono font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors underline underline-offset-2"
                >
                  Contribute context
                </button>
              </div>
            )}
          </div>
          {showUpdatePanel && (
            <ProvenanceUpdatePanel postId={post.id} onClose={() => setShowUpdatePanel(false)} />
          )}
        </div>

        {/* ── Action Bar ── */}
        <div className="flex items-center gap-1 sm:gap-1.5 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex-wrap">
          <button
            onClick={() => setIsReplying(!isReplying)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-all duration-150 text-[12px] font-mono font-medium ${isReplying ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            aria-label="Reply to this post"
          >
            <ChatCircle size={16} weight={isReplying ? "fill" : "regular"} />
            <span>Reply</span>
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-neutral-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all duration-150 text-[12px] font-mono font-medium"
            aria-label="Boost this post"
          >
            <ArrowsLeftRight size={16} />
            <span>Boost</span>
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-neutral-500 hover:text-magenta-600 hover:bg-magenta-50 dark:hover:bg-magenta-900/20 transition-all duration-150 text-[12px] font-mono font-medium"
            aria-label="Save this post"
          >
            <BookmarkSimple size={16} />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150 text-[12px] font-mono font-medium ml-auto"
            aria-label="Share this post"
          >
            <ShareNetwork size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        {/* ── Inline Compose ── */}
        {(isReplying || isQuoteMode) && (
          <div className="mt-4 p-3 sm:p-4 border border-cyan-200 dark:border-cyan-800 rounded-md bg-paper-raised relative ring-1 ring-cyan-100 dark:ring-cyan-900/30">
            {isQuoteMode && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2 text-[10px] font-mono font-bold uppercase text-cyan-600 tracking-wider">
                  <Quotes size={14} weight="fill" />
                  Quoting Post
                </div>
                <QuotedPost post={post} />
              </div>
            )}
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
              <Button 
                size="sm" 
                onClick={handleReplySubmit}
                disabled={!replyText.trim() || isCreating} 
                className="bg-cyan-600 text-white px-4 h-7 sm:h-8 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-cyan-700 disabled:opacity-40"
              >
                {isCreating ? "Witnessing..." : "Commit Reply"}
              </Button>
            </div>
            {createError && (
              <p className="mt-2 text-[10px] font-mono text-magenta-600 uppercase tracking-widest px-1">
                {(createError as Error).message}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
