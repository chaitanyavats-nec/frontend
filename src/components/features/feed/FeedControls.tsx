"use client";

import { Funnel, ArrowsDownUp } from "phosphor-react";

export type HealthFilter = "all" | "high" | "standard" | "unverified";
export type SortOption = "newest" | "oldest" | "highest-health" | "lowest-health";

interface FeedControlsProps {
  healthFilter: HealthFilter;
  setHealthFilter: (filter: HealthFilter) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  postCount?: number; // Kept to prevent any TypeScript breaks in page imports, unused in UI
}

export function FeedControls({
  healthFilter,
  setHealthFilter,
  sortOption,
  setSortOption,
}: FeedControlsProps) {
  return (
    <div className="flex items-center gap-5 py-1 mb-2 transition-all select-none">
      
      {/* Dynamic Sort Selection */}
      <div className="relative flex items-center gap-1 hover:opacity-80 transition-opacity">
        <ArrowsDownUp size={14} className="text-neutral-400 dark:text-neutral-500 shrink-0" />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="appearance-none bg-transparent border-none outline-none font-sans text-[13px] font-bold text-neutral-600 hover:text-neutral-900 dark:text-[#A8A7A5] dark:hover:text-[#EAE9E7] cursor-pointer pr-3.5 transition-colors"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "9px",
          }}
        >
          <option value="highest-health" className="bg-white dark:bg-[#141312]">Best</option>
          <option value="newest" className="bg-white dark:bg-[#141312]">Newest</option>
          <option value="oldest" className="bg-white dark:bg-[#141312]">Oldest</option>
          <option value="lowest-health" className="bg-white dark:bg-[#141312]">Disputed</option>
        </select>
      </div>

      {/* Dynamic Health Filter Selection */}
      <div className="relative flex items-center gap-1 hover:opacity-80 transition-opacity">
        <Funnel size={14} className="text-neutral-400 dark:text-neutral-500 shrink-0" />
        <select
          value={healthFilter}
          onChange={(e) => setHealthFilter(e.target.value as HealthFilter)}
          className="appearance-none bg-transparent border-none outline-none font-sans text-[13px] font-bold text-neutral-600 hover:text-neutral-900 dark:text-[#A8A7A5] dark:hover:text-[#EAE9E7] cursor-pointer pr-3.5 transition-colors"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "9px",
          }}
        >
          <option value="all" className="bg-white dark:bg-[#141312]">All Feed</option>
          <option value="high" className="bg-white dark:bg-[#141312]">Verified (80%+)</option>
          <option value="standard" className="bg-white dark:bg-[#141312]">Standard (50%+)</option>
          <option value="unverified" className="bg-white dark:bg-[#141312]">Low Score</option>
        </select>
      </div>

    </div>
  );
}
