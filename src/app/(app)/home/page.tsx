"use client";

import { useState, useEffect } from "react";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { FeedModeBar } from "@/components/features/feed/FeedModeBar";
import { Button } from "@/components/ui/button";
import { useMockData } from "@/hooks/useMockData";
import type { FeedMode } from "@/types";

const POSTS_PER_PAGE = 5;
const FEED_MODE_KEY = "agora-feed-mode";
const FEED_TOPIC_KEY = "agora-feed-topic";

export default function HomePage() {
  const { posts, topics } = useMockData();
  const [mode, setMode] = useState<FeedMode>("chronological");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Load feed config from localStorage (never sent to server)
  useEffect(() => {
    const savedMode = localStorage.getItem(FEED_MODE_KEY) as FeedMode | null;
    const savedTopic = localStorage.getItem(FEED_TOPIC_KEY);
    if (savedMode) setMode(savedMode);
    if (savedTopic) setSelectedTopic(savedTopic);
  }, []);

  const handleModeChange = (newMode: FeedMode) => {
    setMode(newMode);
    localStorage.setItem(FEED_MODE_KEY, newMode);
    setVisibleCount(POSTS_PER_PAGE);
  };

  const handleTopicSelect = (slug: string) => {
    setSelectedTopic(slug);
    localStorage.setItem(FEED_TOPIC_KEY, slug);
    setVisibleCount(POSTS_PER_PAGE);
  };

  // Filter and sort posts
  let filteredPosts = [...posts];

  if (mode === "topics" && selectedTopic) {
    filteredPosts = filteredPosts.filter((p) =>
      p.topicTags.some((tag) => tag === selectedTopic || tag.includes(selectedTopic.replace(/-/g, " ")))
    );
  }

  // Chronological sort (latest first)
  filteredPosts.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div>
      {/* Page heading */}
      <div className="mb-6 lg:mb-8">
        <h1 className="font-editorial font-bold text-4xl tracking-tight text-ink hidden lg:block">Feed</h1>
      </div>

      {/* Feed Mode Bar */}
      <FeedModeBar
        mode={mode}
        onModeChange={handleModeChange}
        topics={topics}
        selectedTopic={selectedTopic}
        onTopicSelect={handleTopicSelect}
      />

      {/* Feed Cards */}
      <div className="space-y-4">
        {visiblePosts.length === 0 ? (
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
      {!hasMore && visiblePosts.length > 0 && (
        <div className="py-10 mt-6 text-center border-t border-paper-dark">
          <p className="font-sans text-sm text-slate">
            You&apos;ve reached the end. Take a break.
          </p>
        </div>
      )}
    </div>
  );
}
