"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  Heart,
  LinkSimple as LinkIcon,
  Trash,
  Coins,
  Fingerprint,
  IdentificationCard,
  Info,
} from 'phosphor-react';
import { QuotedPost } from './QuotedPost';
import { MediaGrid } from './MediaGrid';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useInteractions } from '@/hooks/useInteractions';
import { usePosts } from '@/hooks/usePosts';
import { useAuthModalStore } from '@/stores/useAuthModalStore';
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

import { PROVENANCE_CONFIG, getHealthColor } from '@/lib/provenance-config';
import { useProvenance } from '@/hooks/useProvenance';

export function FeedCard({ post, isReply = false }: FeedCardProps) {
  const [isProvenanceExpanded, setIsProvenanceExpanded] = useState(false);
  const summary = useProvenance(post);
  const type = (post.source_type || "original") as string;
  const config = PROVENANCE_CONFIG[type] || PROVENANCE_CONFIG.original;
  const healthColor = getHealthColor(summary.health_score);

  const router = useRouter();
  const { user } = useAuth();
  const { open: openAuthModal } = useAuthModalStore();
  const { likeCount, userHasLiked, toggleLike } = useInteractions(post.id);
  const { deletePost } = usePosts();
  const isAuthor = user?.id === post.author_id;

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
        'group transition-colors duration-150 cursor-pointer relative',
        isReply
          ? 'border-l-2 border-cyan-500/20 pl-3 py-3 pr-4 hover:bg-cyan-500/5'
          : 'border-b border-neutral-100/50 dark:border-white/[0.02] last:border-0 hover:bg-neutral-50/80 dark:hover:bg-white/[0.02]'
      )}
    >
      <div className={cn("flex flex-col", isReply ? "gap-2" : "gap-3 sm:gap-4 pt-3 pb-6 px-3 sm:px-4")}>
        {/* ── Header Row ── */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* ── Author Avatar ── */}
            <div className="shrink-0">
              <Link href={`/profile/${post.author.did}`} onClick={e => e.stopPropagation()}>
                <Avatar className={cn(
                  "shadow-sm hover:opacity-90 transition-opacity",
                  isReply ? "h-8 w-8" : "h-11 w-11"
                )}>
                  {post.author?.avatar_url && (
                    <AvatarImage src={post.author.avatar_url} alt={post.author.display_name} />
                  )}
                  <AvatarFallback className={cn("font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-400", isReply ? "text-[11px]" : "text-[14px]")}>
                    {getInitials(post.author?.display_name || "??")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>

            <div className="flex flex-col min-w-0 flex-1 justify-center">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post.author.did}`}
                  onClick={e => e.stopPropagation()}
                  className="font-sans font-bold text-[15px] text-neutral-900 dark:text-neutral-100 hover:text-cyan-600 transition-colors truncate shrink-0"
                >
                  {post.author?.display_name || "Unknown Author"}
                </Link>
                <time className="text-[12px] font-sans text-neutral-400 dark:text-neutral-500 shrink-0">
                  {getRelativeTime(post.created_at)}
                </time>
              </div>
              {/* Visual Reputation Squares */}
              <div className="flex items-center gap-[3px] mt-0.5">
                <div className="w-2.5 h-2.5 rounded-[2px] bg-danger" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-danger" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-success" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-success" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-danger" />
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1.5 -mr-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                aria-label="Post options"
              >
                <DotsThree size={20} weight="bold" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => withAuth(() => { })} className="gap-2.5 cursor-pointer">
                <BookmarkSimple size={15} />
                <span>Save post</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)} className="gap-2.5 cursor-pointer">
                <Copy size={15} />
                <span>Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => withAuth(() => { })} className="gap-2.5 cursor-pointer">
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
              <DropdownMenuItem onClick={() => withAuth(() => { })} className="gap-2.5 cursor-pointer text-red-500 focus:text-red-500">
                <Flag size={15} />
                <span>Flag post</span>
              </DropdownMenuItem>
              {isAuthor && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault();
                      setTimeout(async () => {
                        if (confirm("Are you sure you want to delete this post?")) {
                          try {
                            await deletePost(post.id);
                          } catch (err) {
                            console.error("Failed to delete post:", err);
                          }
                        }
                      }, 100);
                    }} 
                    className="gap-2.5 cursor-pointer text-red-600 focus:text-red-600 font-semibold"
                  >
                    <Trash size={15} />
                    <span>Delete post</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── Content Body ── */}
        <div className="flex flex-col gap-3">
          <div
            className={cn(
              'text-neutral-900 dark:text-white whitespace-pre-wrap leading-snug break-words overflow-hidden font-sans',
              isReply ? 'text-[14px] line-clamp-4' : 'text-[15px] sm:text-[16px] line-clamp-6'
            )}
          >
            {post.body}
          </div>

          {/* ── Inline Location ── */}
          {post.location_data?.name && (
            <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 opacity-80 hover:opacity-100 transition-opacity">
              <MapPin size={12} weight="bold" />
              <span className="text-[11px] font-sans font-medium">{post.location_data.name}</span>
            </div>
          )}

          {/* ── Provenance Tag Capsule & Inline Audit Panel ── */}
          {!isReply && (
            <div className="w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProvenanceExpanded(!isProvenanceExpanded);
                }}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest shadow-xs transition-all duration-200 cursor-pointer border",
                  isProvenanceExpanded 
                    ? "bg-neutral-200 dark:bg-[#3a3a3a] border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
                    : "bg-neutral-900 dark:bg-[#282828] border-transparent text-neutral-300 dark:text-[#A8A7A5] hover:bg-neutral-800 dark:hover:bg-[#333]"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full transition-transform duration-300", 
                  isProvenanceExpanded ? "scale-125" : "",
                  {
                    'bg-cyan-400': type === 'original',
                    'bg-purple-400': type === 'derived',
                    'bg-blue-400': type === 'institutional',
                    'bg-emerald-400': type === 'funded',
                    'bg-amber-400': type === 'amplified',
                    'bg-pink-400': type === 'republished',
                  }
                )} />
                <span>{type}</span>
                <span className="text-[9px] lowercase opacity-60 font-mono font-normal">
                  {isProvenanceExpanded ? "[close report]" : "[view audit]"}
                </span>
              </button>

              <AnimatePresence>
                {isProvenanceExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Inline Animation Style for the Wavy Threads */}
                    <style>{`
                      @keyframes flow-dash {
                        0% {
                          stroke-dashoffset: 240;
                        }
                        100% {
                          stroke-dashoffset: 0;
                        }
                      }
                      .wave-thread-1 {
                        stroke-dasharray: 140 40;
                        animation: flow-dash 10s linear infinite;
                      }
                      .wave-thread-2 {
                        stroke-dasharray: 90 30;
                        animation: flow-dash 7s linear infinite reverse;
                      }
                      .wave-thread-3 {
                        stroke-dasharray: 50 15;
                        animation: flow-dash 4s linear infinite;
                      }
                    `}</style>

                    {/* Derived Parameter Health Scores */}
                    {(() => {
                      const infoHealth = post.context_completeness || 95;
                      
                      let fundingHealth = 100;
                      if (post.funding_type && post.funding_type !== "independent") {
                        if (post.funding_staked) {
                          fundingHealth = 95;
                        } else if (post.funding_tx_hash) {
                          fundingHealth = 80;
                        } else {
                          fundingHealth = 50;
                        }
                      }

                      let authorHealth = 45;
                      if (post.author?.ladder_level) {
                        const levels: Record<string, number> = {
                          elder: 100,
                          authority: 95,
                          established: 85,
                          trusted: 75,
                          contributor: 60,
                          new: 45
                        };
                        authorHealth = levels[post.author.ladder_level] || 45;
                      }

                      const getThreadColor = (score: number) => {
                        if (score >= 80) return {
                          primary: "#10b981",
                          secondary: "rgba(16, 185, 129, 0.32)",
                          ambient: "rgba(16, 185, 129, 0.11)",
                        };
                        if (score >= 60) return {
                          primary: "#06b6d4",
                          secondary: "rgba(6, 182, 212, 0.32)",
                          ambient: "rgba(6, 182, 212, 0.11)",
                        };
                        if (score >= 45) return {
                          primary: "#f59e0b",
                          secondary: "rgba(245, 158, 11, 0.32)",
                          ambient: "rgba(245, 158, 11, 0.11)",
                        };
                        return {
                          primary: "#ef4444",
                          secondary: "rgba(239, 68, 68, 0.32)",
                          ambient: "rgba(239, 68, 68, 0.11)",
                        };
                      };

                      const infoColors = getThreadColor(infoHealth);
                      const fundingColors = getThreadColor(fundingHealth);
                      const authorColors = getThreadColor(authorHealth);

                      return (
                        <div className="mt-3.5 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-[#1e1e1e] space-y-5 text-left shadow-md dark:shadow-2xl">
                          {/* Header Row */}
                          <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-[#222120] pb-3">
                            <span className="font-sans text-[10.5px] uppercase tracking-[0.12em] text-neutral-500 dark:text-[#a3a3a3] font-bold">Provenance Audit Report</span>
                            <ShieldCheck size={18} className="text-[#10b981] dark:text-[#2ec4bb]" />
                          </div>

                          {/* ── Live Interactive Wavy Oscilloscope Visualizer ── */}
                          <div className="grid grid-cols-3 gap-2 bg-[#f9f9f9] dark:bg-[#1a1a1a] border border-neutral-200/50 dark:border-[#262524] rounded-2xl p-2.5 sm:p-4 relative h-16 sm:h-20 overflow-hidden shadow-inner">
                            {/* Segment 1: Info Health Wave */}
                            <div className="relative flex items-center justify-center h-full w-full border-r border-neutral-200/50 dark:border-[#262524]/40 pr-1">
                              <svg className="w-full h-full" viewBox="0 0 240 80" fill="none" preserveAspectRatio="none">
                                <defs>
                                  <pattern id="dotGrid1" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="0.75" className="fill-neutral-900/5 dark:fill-white/5" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#dotGrid1)" />
                                <path d="M 10,40 C 60,15 180,15 230,40" stroke={infoColors.ambient} strokeWidth="1.5" className="wave-thread-3" />
                                <path d="M 10,40 C 70,60 170,60 230,40" stroke={infoColors.secondary} strokeWidth="2" className="wave-thread-2" />
                                <path d="M 10,40 C 50,30 190,50 230,40" stroke={infoColors.primary} strokeWidth="2.5" strokeLinecap="round" className="wave-thread-1" />
                              </svg>
                            </div>

                            {/* Segment 2: Funding Health Wave */}
                            <div className="relative flex items-center justify-center h-full w-full border-r border-neutral-200/50 dark:border-[#262524]/40 px-1">
                              <svg className="w-full h-full" viewBox="0 0 240 80" fill="none" preserveAspectRatio="none">
                                <defs>
                                  <pattern id="dotGrid2" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="0.75" className="fill-neutral-900/5 dark:fill-white/5" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#dotGrid2)" />
                                <path d="M 10,40 C 60,15 180,15 230,40" stroke={fundingColors.ambient} strokeWidth="1.5" className="wave-thread-3" />
                                <path d="M 10,40 C 70,60 170,60 230,40" stroke={fundingColors.secondary} strokeWidth="2" className="wave-thread-2" />
                                <path d="M 10,40 C 50,30 190,50 230,40" stroke={fundingColors.primary} strokeWidth="2.5" strokeLinecap="round" className="wave-thread-1" />
                              </svg>
                            </div>

                            {/* Segment 3: Author Health Wave */}
                            <div className="relative flex items-center justify-center h-full w-full pl-1">
                              <svg className="w-full h-full" viewBox="0 0 240 80" fill="none" preserveAspectRatio="none">
                                <defs>
                                  <pattern id="dotGrid3" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="0.75" className="fill-neutral-900/5 dark:fill-white/5" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#dotGrid3)" />
                                <path d="M 10,40 C 60,15 180,15 230,40" stroke={authorColors.ambient} strokeWidth="1.5" className="wave-thread-3" />
                                <path d="M 10,40 C 70,60 170,60 230,40" stroke={authorColors.secondary} strokeWidth="2" className="wave-thread-2" />
                                <path d="M 10,40 C 50,30 190,50 230,40" stroke={authorColors.primary} strokeWidth="2.5" strokeLinecap="round" className="wave-thread-1" />
                              </svg>
                            </div>
                          </div>

                          {/* ── Details Columns ── */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                            {/* Column 1: Information Status */}
                            <div className="flex flex-col gap-2">
                              <div className="p-2 rounded-lg bg-[#f0f9fa] dark:bg-[#121e20] text-cyan-600 dark:text-[#2ec4bb] w-fit">
                                <Info size={16} weight="bold" />
                              </div>
                              <div className="space-y-0.5">
                                <div className="font-sans text-[9px] font-bold tracking-[0.08em] text-neutral-400 dark:text-[#555] uppercase">Information Status</div>
                                <div className="font-sans font-bold text-neutral-900 dark:text-[#E5E3DF] capitalize text-[13px] mt-1">{type}</div>
                                <div className="font-sans text-[11px] text-neutral-600 dark:text-[#999] leading-relaxed mt-0.5">
                                  {type === "original" && "Genesis Content — Original statement/analysis."}
                                  {type === "derived" && "Derived Synthesis — Synthesized from prior sources."}
                                  {type === "institutional" && "Institutional Record — Certified release from official org."}
                                  {type === "funded" && "Funded Declaration — Disclosed sponsored research/advocacy."}
                                  {type === "amplified" && "Amplification — Quote post adding contextual commentary."}
                                  {type === "republished" && "Republished Source — Verified external syndication."}
                                </div>
                              </div>
                            </div>

                            {/* Column 2: Funding Status */}
                            <div className="flex flex-col gap-2">
                              <div className="p-2 rounded-lg bg-[#f0fdf4] dark:bg-[#112019] text-emerald-600 dark:text-[#2ec4bb] w-fit">
                                <Coins size={16} weight="bold" />
                              </div>
                              <div className="space-y-0.5">
                                <div className="font-sans text-[9px] font-bold tracking-[0.08em] text-neutral-400 dark:text-[#555] uppercase">Funding Status</div>
                                <div className="font-sans font-bold text-neutral-900 dark:text-[#E5E3DF] capitalize text-[13px] mt-1">
                                  {post.funding_type === "independent" ? "Independent / Unsponsored" : `${post.funding_type || "Independent"} Funded`}
                                </div>
                                <div className="font-sans text-[11px] text-neutral-600 dark:text-[#999] leading-relaxed mt-0.5">
                                  {post.funding_type === "independent" 
                                    ? "Produced independently without corporate or external grant funding." 
                                    : `Supported by ${post.funder_name || "external grant programs"}.`}
                                </div>
                              </div>
                            </div>

                            {/* Column 3: Author Status */}
                            <div className="flex flex-col gap-2">
                              <div className="p-2 rounded-lg bg-[#eff6ff] dark:bg-[#131924] text-blue-600 dark:text-[#4F81C4] w-fit">
                                <IdentificationCard size={16} weight="bold" />
                              </div>
                              <div className="space-y-0.5">
                                <div className="font-sans text-[9px] font-bold tracking-[0.08em] text-neutral-400 dark:text-[#555] uppercase">Author & Affiliation</div>
                                <div className="font-sans font-bold text-neutral-900 dark:text-[#E5E3DF] text-[13px] mt-1">
                                  {post.author_affiliations?.[0]?.organization_name || "Verified Independent Voice"}
                                </div>
                                <div className="font-sans text-[11px] text-neutral-600 dark:text-[#999] leading-relaxed mt-0.5">
                                  {post.author_affiliations?.[0] 
                                    ? `${post.author_affiliations[0].role || "Member"} at ${post.author_affiliations[0].organization_name}.` 
                                    : `No corporate conflicts reported.`}
                                  <div className="mt-2 flex items-center gap-1 font-sans text-[11px] text-neutral-500">
                                    <span>Reputation Rank:</span>
                                    <span className="font-bold text-sky-600 dark:text-[#38BDF8] capitalize">{post.author?.ladder_level || "Contributor"}</span>
                                    <span className="text-neutral-400 dark:text-neutral-500">({post.author?.reputation_total || 0})</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── Media Content ── */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="rounded-xl overflow-hidden mt-1">
            <MediaGrid urls={post.media_urls} />
          </div>
        )}

        {/* ── Quoted Post ── */}
        {post.quoted_post && post.quoted_post.id && (
          <div onClick={(e) => { e.stopPropagation(); if (post.quoted_post?.id) router.push(`/post/${post.quoted_post.id}`); }}>
            <QuotedPost post={post.quoted_post} />
          </div>
        )}

        {/* ── Poll UI ── */}
        {post.poll_data && post.poll_data.options && post.poll_data.options.length > 0 && (
          <div className="mt-2 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 space-y-3 shadow-inner">
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
                    onClick={(e) => { e.stopPropagation(); withAuth(() => { }); }}
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
          <div className="flex flex-wrap gap-1.5 mt-2">
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

        {/* ── Action Footer Pill ── */}
        <div className="flex items-center pt-2">
          <div className="inline-flex items-center bg-neutral-50 dark:bg-[#111] border border-neutral-200 dark:border-[#222] rounded-full px-4 py-2 gap-4 shadow-sm">
            <button
              onClick={(e) => { e.stopPropagation(); withAuth(() => { }); }}
              className="flex items-center gap-2 text-[13px] font-medium text-neutral-500 dark:text-[#777] hover:text-neutral-900 dark:hover:text-neutral-300 transition-all"
              aria-label={`${post.reply_count || 0} replies`}
            >
              <ChatCircle size={18} weight="regular" />
              <span>{post.reply_count || 0}</span>
            </button>

            <div className="w-[1px] h-3.5 bg-neutral-300 dark:bg-[#333]" />

            <button
              onClick={(e) => { e.stopPropagation(); withAuth(toggleLike); }}
              className={cn(
                "flex items-center gap-2 text-[13px] font-medium transition-all",
                userHasLiked ? "text-[#ff2b5e]" : "text-neutral-500 dark:text-[#777] hover:text-[#ff2b5e]"
              )}
              aria-label={`${likeCount} likes`}
            >
              <Heart size={18} weight={userHasLiked ? "fill" : "regular"} />
              <span>{likeCount}</span>
            </button>

            <div className="w-[1px] h-3.5 bg-neutral-300 dark:bg-[#333]" />

            <button
              onClick={(e) => { e.stopPropagation(); withAuth(() => { router.push(`/compose?quoteId=${post.id}`); }); }}
              className="flex items-center gap-2 text-[13px] font-medium text-neutral-500 dark:text-[#777] hover:text-neutral-900 dark:hover:text-neutral-300 transition-all"
              aria-label="Quote post"
            >
              <span className="tracking-wide">99</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
