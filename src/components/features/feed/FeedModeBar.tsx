"use client";

import { cn } from "@/lib/utils";
import type { FeedMode, Topic } from "@/types";

interface FeedModeBarProps {
  mode: FeedMode;
  onModeChange: (mode: FeedMode) => void;
  topics: Topic[];
  selectedTopic?: string;
  onTopicSelect?: (slug: string) => void;
}

const modeOptions: { value: FeedMode; label: string }[] = [
  { value: "chronological", label: "Chronological" },
  { value: "topics", label: "Topics" },
  { value: "curated", label: "Curated" },
];

const domainColors: Record<string, string> = {
  politics: "border-terracotta/40 text-terracotta",
  science: "border-sage/40 text-sage-dark",
  local: "border-gold/40 text-gold",
  culture: "border-slate/40 text-slate",
  technology: "border-sage/40 text-sage",
  economics: "border-gold/40 text-gold",
};

export function FeedModeBar({
  mode,
  onModeChange,
  topics,
  selectedTopic,
  onTopicSelect,
}: FeedModeBarProps) {
  return (
    <div className="mb-6">
      {/* Mode Pills */}
      <div className="flex items-center gap-2" role="tablist" aria-label="Feed mode">
        {modeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onModeChange(option.value)}
            role="tab"
            aria-selected={mode === option.value}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium text-xs transition-colors duration-150",
              mode === option.value
                ? "bg-sage text-white-0"
                : "bg-transparent text-slate border border-paper-dark hover:border-sage/30 hover:text-ink"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Topic Chips (when Topics mode is selected) */}
      {mode === "topics" && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onTopicSelect?.("")}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-150 border shrink-0",
              !selectedTopic
                ? "bg-sage text-white-0 border-sage"
                : "bg-transparent text-slate border-paper-dark hover:border-sage/30"
            )}
          >
            All
          </button>
          {topics.map((topic) => (
            <button
              key={topic.slug}
              onClick={() => onTopicSelect?.(topic.slug)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-150 border shrink-0",
                selectedTopic === topic.slug
                  ? "bg-sage text-white-0 border-sage"
                  : cn("bg-transparent border", domainColors[topic.domain] || "border-paper-dark text-slate")
              )}
            >
              {topic.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
