"use client";

import { useState, useEffect } from "react";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { FeedModeBar } from "@/components/features/feed/FeedModeBar";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/usePosts";
import { useTopics } from "@/hooks/useTopics";
import { useAuth } from "@/hooks/useAuth";
import type { FeedMode } from "@/types";

const POSTS_PER_PAGE = 5;
const FEED_MODE_KEY = "agora-feed-mode";
const FEED_TOPIC_KEY = "agora-feed-topic";

export default function HomePage() {
  const { user } = useAuth();
  const { data: topics } = useTopics();
  const [mode, setMode] = useState<FeedMode>("chronological");
  const { posts, isPostsLoading } = usePosts(mode === "following" ? "following" : "chronological");
  
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Load feed config from localStorage (never sent to server)
  useEffect(() => {
    const savedMode = localStorage.getItem(FEED_MODE_KEY) as FeedMode | null;
    const savedTopic = localStorage.getItem(FEED_TOPIC_KEY);
    
    // Default to following if logged in and no saved mode
    if (user && !savedMode) {
      setMode("following");
    } else if (savedMode) {
      // Validate saved mode (guest can't see following)
      if (savedMode === "following" && !user) {
        setMode("chronological");
      } else {
        setMode(savedMode);
      }
    }
    
    if (savedTopic) setSelectedTopic(savedTopic);
  }, [user]);

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
  let filteredPosts = posts ? [...posts] : [];

  if (mode === "topics" && selectedTopic) {
    filteredPosts = filteredPosts.filter((p) =>
      p.topicId === selectedTopic || 
      p.topicTags?.some((tag: string) => tag === selectedTopic)
    );
  }

  // Chronological sort is handled by usePosts query order if you want, 
  // but keeping manual sort here for safety since we're using mock mapped types
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
        topics={topics || []}
        selectedTopic={selectedTopic}
        onTopicSelect={handleTopicSelect}
        showFollowing={!!user}
      />

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
