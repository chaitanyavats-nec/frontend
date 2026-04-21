"use client";

import { MagnifyingGlass, TrendUp, Newspaper, UserPlus, Sun, Moon } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const trendingTopics = [
  { topic: "Central Banking", volume: "12.4k posts", category: "Governance" },
  { topic: "#AgoraLaunch", volume: "8.2k posts", category: "Community" },
  { topic: "Digital Privacy", volume: "5.1k posts", category: "Technology" },
  { topic: "Sustainable Cities", volume: "3.9k posts", category: "Civics" },
];

const newsItems = [
  { title: "New Governance Proposal: Tiered Voting Weights", time: "2h ago", source: "Agora Gazette" },
  { title: "Understanding the Lino-Print Aesthetic in Modern Web", time: "5h ago", source: "Design Weekly" },
  { title: "Civic Engagement reached record highs this quarter", time: "8h ago", source: "Metrics Daily" },
];

const recommendFollows = [
  { name: "Digital Justice", handle: "@justice_tech", bio: "Advocating for digital rights and privacy." },
  { name: "Urban planning", handle: "@city_builder", bio: "Reimagining public spaces for everyone." },
];

export function RightSidebar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-8 h-fit">
      {/* Search Bar & Theme Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative group flex-1">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 transition-colors group-focus-within:text-cyan-500"
          />
          <input
            type="text"
            placeholder="Search Agora..."
            className="w-full bg-neutral-100 dark:bg-neutral-800/10 hover:bg-neutral-200 dark:hover:bg-neutral-800 focus:bg-neutral-50 dark:focus:bg-neutral-900 border-none rounded-md py-2.5 pl-10 pr-4 text-sm font-sans transition-all focus:ring-2 focus:ring-cyan-500/20 outline-none text-neutral-900 dark:text-neutral-100"
          />
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-md bg-neutral-100 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
          </button>
        )}
      </div>


      {/* Today's News */}
      <section className="bg-surface/50 rounded-2xl border border-paper-dark/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-paper-dark/50 flex items-center gap-2">
          <Newspaper weight="bold" className="text-teal" size={18} />
          <h2 className="font-editorial text-lg font-bold text-ink">Today&apos;s News</h2>
        </div>
        <div className="flex flex-col">
          {newsItems.map((news, i) => (
            <button
              key={i}
              className="px-4 py-3 text-left hover:bg-paper-dark/30 transition-colors border-b last:border-0 border-paper-dark/30 group"
            >
              <p className="text-[11px] font-mono uppercase tracking-wider text-slate mb-1">{news.source} • {news.time}</p>
              <h3 className="text-sm font-bold text-ink leading-tight group-hover:text-teal transition-colors">{news.title}</h3>
            </button>
          ))}
        </div>
        <button className="w-full py-3 text-xs font-bold text-teal hover:bg-teal/5 transition-colors">
          Show more
        </button>
      </section>

      {/* Trending */}
      <section className="bg-surface/50 rounded-2xl border border-paper-dark/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-paper-dark/50 flex items-center gap-2">
          <TrendUp weight="bold" className="text-orange" size={18} />
          <h2 className="font-editorial text-lg font-bold text-ink">Trending</h2>
        </div>
        <div className="flex flex-col">
          {trendingTopics.map((trend, i) => (
            <button
              key={i}
              className="px-4 py-3 text-left hover:bg-paper-dark/30 transition-colors border-b last:border-0 border-paper-dark/30"
            >
              <p className="text-[10px] font-bold text-slate/60 uppercase tracking-tighter">{trend.category}</p>
              <h3 className="text-sm font-bold text-ink mb-0.5">{trend.topic}</h3>
              <p className="text-[11px] text-slate">{trend.volume}</p>
            </button>
          ))}
        </div>
        <button className="w-full py-3 text-xs font-bold text-teal hover:bg-teal/5 transition-colors">
          Show more
        </button>
      </section>

      {/* Who to follow */}
      <section className="bg-surface/50 rounded-2xl border border-paper-dark/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-paper-dark/50 flex items-center gap-2">
          <UserPlus weight="bold" className="text-ink" size={18} />
          <h2 className="font-editorial text-lg font-bold text-ink">Connect</h2>
        </div>
        <div className="flex flex-col">
          {recommendFollows.map((user, i) => (
            <div
              key={i}
              className="px-4 py-3 flex items-start gap-3 hover:bg-paper-dark/30 transition-colors border-b last:border-0 border-paper-dark/30"
            >
              <div className="w-10 h-10 rounded-full bg-paper-dark flex items-center justify-center text-slate font-bold shrink-0 shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-ink truncate">{user.name}</h3>
                <p className="text-xs text-slate truncate">{user.handle}</p>
              </div>
              <Button size="sm" variant="outline" className="h-8 rounded-full px-4 text-xs font-bold border-teal text-teal hover:bg-teal/5">
                Follow
              </Button>
            </div>
          ))}
        </div>
        <button className="w-full py-3 text-xs font-bold text-teal hover:bg-teal/5 transition-colors">
          Show more
        </button>
      </section>

      {/* Footer Links */}
      <footer className="px-4 pb-8">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate/60 font-medium">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">Transparency</a>
          <span>© 2026 AGORA</span>
        </div>
      </footer>
    </div>
  );
}
