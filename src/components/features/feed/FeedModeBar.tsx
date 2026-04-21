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
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-6" role="tablist" aria-label="Feed mode">
        {visibleOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onModeChange(option.value)}
            role="tab"
            aria-selected={mode === option.value}
            className={cn(
              "px-5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-widest transition-all duration-140 -mb-[1px] border-b-2 whitespace-nowrap",
              mode === option.value
                ? "text-neutral-900 dark:text-neutral-50 border-neutral-800 dark:border-neutral-200"
                : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
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
              "px-3 py-1.5 rounded-full font-mono text-[10px] font-medium whitespace-nowrap transition-all duration-140 border shrink-0 uppercase tracking-tighter",
              !selectedTopic
                ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-200 border-cyan-400"
                : "bg-transparent text-neutral-500 border-neutral-300 dark:border-neutral-700 hover:border-cyan-400 hover:text-cyan-600"
            )}
          >
            All Topics
          </button>
          {topics.map((topic) => (
            <button
              key={topic.slug}
              onClick={() => onTopicSelect?.(topic.slug)}
              className={cn(
                "px-3 py-1.5 rounded-full font-mono text-[10px] font-medium whitespace-nowrap transition-all duration-140 border shrink-0 uppercase tracking-tighter",
                selectedTopic === topic.slug
                  ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-200 border-cyan-400"
                  : "bg-transparent text-neutral-500 border-neutral-300 dark:border-neutral-700 hover:border-cyan-400 hover:text-cyan-600"
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

