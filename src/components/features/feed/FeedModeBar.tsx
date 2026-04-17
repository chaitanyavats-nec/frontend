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
  politics: "border-orange/20 text-orange bg-orange/5",
  science: "border-teal/20 text-teal-dark bg-teal/5",
  local: "border-violet/20 text-violet bg-violet/5",
  culture: "border-slate/40 text-slate",
  technology: "border-teal/20 text-teal bg-teal/5",
  economics: "border-violet/20 text-violet bg-violet/5",
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
              "px-3 py-1.5 rounded-lg font-bold text-xs transition-all duration-150 uppercase tracking-wider",
              mode === option.value
                ? "bg-teal text-paper shadow-sm"
                : "bg-transparent text-slate border border-paper-dark hover:border-teal/30 hover:text-ink"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Topic Chips (when Topics mode is selected) */}
      {mode === "topics" && (
        <div className="mt-3 -mx-4 px-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
          <button
            onClick={() => onTopicSelect?.("")}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 border shrink-0 uppercase tracking-tighter",
              !selectedTopic
                ? "bg-teal text-paper border-teal"
                : "bg-transparent text-slate border-paper-dark hover:border-teal/30"
            )}
          >
            All
          </button>
          {topics.map((topic) => (
            <button
              key={topic.slug}
              onClick={() => onTopicSelect?.(topic.slug)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 border shrink-0 uppercase tracking-tighter",
                selectedTopic === topic.slug
                  ? "bg-teal text-paper border-teal shadow-sm"
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
