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

export default function HomePage() {
  const { user } = useAuth();
  const { data: topics } = useTopics();
  const { mode, setMode, selectedTopic, setSelectedTopic } = useFeedModeStore();
  
  const { posts, loading: isPostsLoading } = useFeed(mode, mode === "topics" ? [selectedTopic] : []);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

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

  // Sorting
  filteredPosts.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

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

      {/* Feed Cards */}
      <div className="space-y-4">
        {isPostsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-surface rounded-xl animate-pulse border border-paper-dark" />
            ))}
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="py-12 text-center bg-surface rounded-lg border border-paper-dark">
            <p className="font-sans text-sm text-slate">
              No posts found{selectedTopic ? ` for topic "${selectedTopic}"` : ""}.
            </p>
          </div>
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
