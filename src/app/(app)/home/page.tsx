"use client";

import { useState, useEffect } from "react";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { FeedModeBar } from "@/components/features/feed/FeedModeBar";
import { Button } from "@/components/ui/button";
import { useFeed } from "@/hooks/useFeed";
import { useTopics } from "@/hooks/useTopics";
import { useAuth } from "@/hooks/useAuth";
import type { FeedMode } from "@/types";

const POSTS_PER_PAGE = 5;
const FEED_MODE_KEY = "agora-feed-mode";
const FEED_TOPIC_KEY = "agora-feed-topic";

import { useFeedModeStore } from "@/stores/useFeedModeStore";
import { FeedControls, HealthFilter, SortOption } from "@/components/features/feed/FeedControls";
import { UserPlus, Check } from "phosphor-react";

export default function HomePage() {
  const { user } = useAuth();
  const { data: topics } = useTopics();
  const { mode, setMode, selectedTopic, setSelectedTopic } = useFeedModeStore();
  
  const { posts, loading: isPostsLoading } = useFeed(mode, mode === "topics" ? [selectedTopic] : []);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [followedState, setFollowedState] = useState<Record<string, boolean>>({});

  const toggleFollow = (handle: string) => {
    setFollowedState((prev) => ({
      ...prev,
      [handle]: !prev[handle],
    }));
  };

  const handleModeChange = (newMode: FeedMode) => {
    setMode(newMode);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const handleTopicSelect = (slug: string) => {
    setSelectedTopic(slug);
    setVisibleCount(POSTS_PER_PAGE);
  };

  // Filter and sort posts
  let filteredPosts = posts ? [...posts] : [];

  if (mode === "topics" && selectedTopic) {
    filteredPosts = filteredPosts.filter((p) =>
      p.topic_tags?.includes(selectedTopic)
    );
  }

  // Apply Health Filtering
  if (healthFilter === "high") {
    filteredPosts = filteredPosts.filter((p) => (p.trust_score ?? 0) >= 80);
  } else if (healthFilter === "standard") {
    filteredPosts = filteredPosts.filter((p) => (p.trust_score ?? 0) >= 50);
  } else if (healthFilter === "unverified") {
    filteredPosts = filteredPosts.filter((p) => (p.trust_score ?? 0) < 50);
  }

  // Apply Sorting
  filteredPosts.sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortOption === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortOption === "highest-health") {
      return (b.trust_score ?? 0) - (a.trust_score ?? 0);
    } else if (sortOption === "lowest-health") {
      return (a.trust_score ?? 0) - (b.trust_score ?? 0);
    }
    return 0;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div>
      {/* Page heading */}
      <div className="mb-6 lg:mb-8">
        <h1 className="font-editorial font-bold text-4xl tracking-tight text-ink hidden lg:block">Feed</h1>
      </div>

      {/* Feed Mode Bar - Hidden on mobile, handled by Nav Dropdown */}
      <div className="hidden lg:block">
        <FeedModeBar
          mode={mode}
          onModeChange={handleModeChange}
          topics={topics || []}
          selectedTopic={selectedTopic}
          onTopicSelect={handleTopicSelect}
          showFollowing={!!user}
        />
      </div>

      {/* Feed Controls */}
      <div className="mt-4">
        <FeedControls
          healthFilter={healthFilter}
          setHealthFilter={setHealthFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          postCount={filteredPosts.length}
        />
      </div>

      {/* Feed Cards */}
      <div className="space-y-4">
        {isPostsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-surface rounded-xl animate-pulse border border-paper-dark" />
            ))}
          </div>
        ) : visiblePosts.length === 0 ? (
          mode === "following" ? (
            <div className="py-12 px-4 text-center max-w-xl mx-auto space-y-8 animate-fade-in">
              {/* Premium Vector Illustration */}
              <div className="relative h-44 w-44 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 to-transparent animate-pulse" />
                <svg className="w-32 h-32 text-neutral-300 dark:text-neutral-700" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="50" cy="50" r="40" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite] origin-center" />
                  <circle cx="50" cy="50" r="28" strokeDasharray="2 2" className="animate-[spin_20s_linear_infinite_reverse] origin-center" />
                  <circle cx="50" cy="50" r="12" className="text-[#2ec4bb]" />
                  
                  {/* Floating connection lines & nodes */}
                  <line x1="50" y1="50" x2="20" y2="30" strokeWidth="1" className="opacity-60" />
                  <line x1="50" y1="50" x2="80" y2="40" strokeWidth="1" className="opacity-60" />
                  <line x1="50" y1="50" x2="40" y2="82" strokeWidth="1" className="opacity-60" />
                  
                  <circle cx="20" cy="30" r="4" fill="currentColor" className="text-neutral-400" />
                  <circle cx="80" cy="40" r="5" fill="currentColor" className="text-neutral-400" />
                  <circle cx="40" cy="82" r="3" fill="#2ec4bb" />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3">
                <h3 className="font-editorial text-2xl font-bold text-neutral-900 dark:text-[#EAE9E7]">A Quiet Corner</h3>
                <p className="font-sans text-xs text-neutral-500 dark:text-[#A8A7A5] leading-relaxed max-w-md mx-auto">
                  The voices you follow will publish their thoughts, citations, and consensus records right here. Begin by connecting with some of our featured creators:
                </p>
              </div>

              {/* Follow Recommendations Grid */}
              <div className="text-left bg-white dark:bg-[#141312] border border-neutral-200/80 dark:border-white/[0.08] rounded-2xl divide-y divide-neutral-100 dark:divide-white/[0.04] overflow-hidden shadow-sm">
                {[
                  { 
                    name: "Digital Justice", 
                    handle: "@justice_tech", 
                    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80", 
                    bio: "Advocating for digital rights, encryption, and open consensus.",
                    followers: "12.4K followers"
                  },
                  { 
                    name: "Urban planning", 
                    handle: "@city_builder", 
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", 
                    bio: "Reimagining public spaces, walkability, and green cities.",
                    followers: "8.9K followers"
                  },
                  { 
                    name: "Billy Butcher", 
                    handle: "@billy_b", 
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", 
                    bio: "Reputation level Novice. Dev fighting for clean drinking water.",
                    followers: "1.2K followers"
                  }
                ].map((u) => {
                  const isFollowing = !!followedState[u.handle];
                  return (
                    <div key={u.handle} className="p-4 hover:bg-neutral-50/50 dark:hover:bg-white/[0.01] transition-all flex items-start gap-3.5">
                      <img src={u.avatar} alt={u.name} className="h-10 w-10 rounded-full object-cover grayscale dark:opacity-80" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-sans font-bold text-sm text-neutral-900 dark:text-[#EAE9E7] truncate leading-tight hover:text-[#2ec4bb] transition-colors cursor-pointer">{u.name}</h4>
                            <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 truncate">{u.handle}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => toggleFollow(u.handle)}
                            variant={isFollowing ? "outline" : "default"}
                            className={`h-8 rounded-full px-4 text-[10px] font-bold uppercase tracking-widest shrink-0 transition-all ${
                              isFollowing 
                                ? "border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/5" 
                                : "bg-neutral-900 text-white dark:bg-[#EAE9E7] dark:text-neutral-950 hover:opacity-90"
                            }`}
                          >
                            {isFollowing ? (
                              <span className="flex items-center gap-1"><Check size={11} strokeWidth={3} /> Following</span>
                            ) : (
                              <span className="flex items-center gap-1"><UserPlus size={11} /> Follow</span>
                            )}
                          </Button>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-[#A8A7A5] mt-1.5 leading-relaxed line-clamp-2">{u.bio}</p>
                        <p className="text-[10px] font-bold text-[#2ec4bb] mt-1 uppercase tracking-wider">{u.followers}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center bg-surface rounded-lg border border-paper-dark">
              <p className="font-sans text-sm text-slate">
                No posts found{selectedTopic ? ` for topic "${selectedTopic}"` : ""}.
              </p>
            </div>
          )
        ) : (
          visiblePosts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Pagination: Load More — NOT infinite scroll */}
      {hasMore && (
        <div className="py-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + POSTS_PER_PAGE)}
            className="font-medium text-xs rounded-full px-6"
          >
            Load more ({filteredPosts.length - visibleCount} remaining)
          </Button>
        </div>
      )}

      {/* Natural stopping point */}
      {!hasMore && visiblePosts.length > 0 && !isPostsLoading && (
        <div className="py-10 mt-6 text-center border-t border-paper-dark">
          <p className="font-sans text-sm text-slate">
            You&apos;ve reached the end. Take a break.
          </p>
        </div>
      )}
    </div>
  );
}
