"use client";

import { useState } from "react";
import { MagnifyingGlass } from "phosphor-react";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { cn } from "@/lib/utils";

const EXPLORE_TABS = [
  "For you",
  "Posts",
  "Hashtags",
  "People",
  "News",
  "Sports",
  "Entertainment",
  "Technology"
];

import { useFeed } from "@/hooks/useFeed";

export default function ExplorePage() {
  const { posts, loading } = useFeed("curated");
  const [activeTab, setActiveTab] = useState("For you");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col -mt-4 lg:-mt-6">
      {/* Search Header - Sticky */}
      <div className="sticky top-0 z-30 bg-paper/90 backdrop-blur-md -mx-4 px-4 pt-4 pb-2 border-b border-paper-dark/10">
        <div className="relative group mb-4">
          <MagnifyingGlass 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate transition-colors group-focus-within:text-teal" 
          />
          <input 
            type="text" 
            placeholder="Search Agora topics, tags, or people" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border-2 border-paper-dark/30 rounded-full py-2.5 pl-12 pr-4 text-[15px] font-sans focus:border-teal/40 focus:bg-white outline-none transition-all shadow-sm placeholder:text-slate/50"
          />
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar -mx-2 px-2 mask-fade-right">
          {EXPLORE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold tracking-tight transition-all border",
                activeTab === tab
                  ? "bg-ink text-paper border-ink shadow-md"
                  : "bg-surface text-slate border-paper-dark/50 hover:border-slate/40 hover:bg-paper-dark/10"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Explore Content */}
      <div className="py-6 space-y-4">
        {/* Featured Section placeholder */}
        {activeTab === "For you" && (
           <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-teal/10 to-sage/10 border border-teal/20 relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal mb-2 block">Featured Topic</span>
                <h2 className="text-2xl font-editorial font-bold text-ink mb-2">The Future of Platform Cooperatives</h2>
                <p className="text-sm text-slate line-clamp-2 max-w-md">How the next generation of digital infrastructure is being built by the communities that use it, not just for-profit corporations.</p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
           </div>
        )}

        {/* Dynamic Feed based on tab */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-surface rounded-xl animate-pulse border border-paper-dark" />)}
          </div>
        ) : (
          posts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
