"use client";

import { cn } from "@/lib/utils";
import type { FeedMode, Topic } from "@/types";

interface FeedModeBarProps {
  mode: FeedMode;
  onModeChange: (mode: FeedMode) => void;
  topics: Topic[];
  selectedTopic?: string;
  onTopicSelect?: (slug: string) => void;
  showFollowing?: boolean;
}

const modeOptions: { value: FeedMode; label: string }[] = [
  { value: "following", label: "Following" },
  { value: "chronological", label: "Global" },
  { value: "topics", label: "Topics" },
  { value: "curated", label: "Curated" },
];


export function FeedModeBar({
  mode,
  onModeChange,
  topics,
  selectedTopic,
  onTopicSelect,
  showFollowing,
}: FeedModeBarProps) {
  const visibleOptions = modeOptions.filter(opt =>
    opt.value !== "following" || showFollowing
  );

  return (
    <div className="mb-6">
      {/* Mode Tabs - Presswork Style */}
      <div className="flex border-b border-[var(--border-subtle)] mb-6" role="tablist" aria-label="Feed mode">
        {visibleOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onModeChange(option.value)}
            role="tab"
            aria-selected={mode === option.value}
            className={cn(
              "px-5 py-2.5 text-[10px] font-medium uppercase tracking-widest transition-all duration-140 -mb-[1px] border-b-2 whitespace-nowrap",
              mode === option.value
                ? "text-[var(--text-primary)] border-cyan-500"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] border-transparent hover:border-[var(--border-default)]"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Topic Chips - Presswork Style */}
      {mode === "topics" && (
        <div className="mt-4 -mx-4 px-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0">
          <button
            onClick={() => onTopicSelect?.("")}
            className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all duration-140 border shrink-0 uppercase tracking-tighter",
              !selectedTopic
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                : "bg-transparent text-[var(--text-tertiary)] border-[var(--border-default)] hover:border-cyan-500/30 hover:text-cyan-400"
            )}
          >
            All Topics
          </button>
          {topics.map((topic) => (
            <button
              key={topic.slug}
              onClick={() => onTopicSelect?.(topic.slug)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-all duration-140 border shrink-0 uppercase tracking-tighter",
                selectedTopic === topic.slug
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  : "bg-transparent text-[var(--text-tertiary)] border-[var(--border-default)] hover:border-cyan-500/30 hover:text-cyan-400"
              )}
            >
              #{topic.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

