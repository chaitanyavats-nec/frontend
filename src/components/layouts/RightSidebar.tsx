"use client";

import { MagnifyingGlass, TrendUp, Newspaper, UserPlus, Sun, Moon } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

const trendingTopics = [
  { topic: "Central Banking", volume: "12.4k posts", category: "Governance" },
  { topic: "#AgoraLaunch", volume: "8.2k posts", category: "Community" },
  { topic: "Digital Privacy", volume: "5.1k posts", category: "Technology" },
  { topic: "Sustainable Cities", volume: "3.9k posts", category: "Civics" },
];

const newsItems = [
  {
    title: "Modi Launches ₹9,400 Crore Projects in Hyderabad, Urges National Austerity",
    time: "1 day ago",
    category: "News",
    postsCount: "193.3K posts",
    avatars: [
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=40&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=40&q=80"
    ]
  },
  {
    title: "Trump Warns Iran After Peace Proposal Rejection",
    time: "2 days ago",
    category: "News",
    postsCount: "184.5K posts",
    avatars: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=40&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=40&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&q=80"
    ]
  },
  {
    title: "Modi Visits Naidu and Kalyan Homes in Hyderabad",
    time: "16 hours ago",
    category: "News",
    postsCount: "104.3K posts",
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=40&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&q=80"
    ]
  }
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
    <div className="flex flex-col gap-5 py-8 h-fit">
      {/* Search Bar & Theme Toggle */}
      <div className="flex items-center gap-2.5">
        <div className="relative group flex-1">
          <MagnifyingGlass
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 transition-colors group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400"
          />
          <input
            type="text"
            placeholder="Search Agora..."
            className="w-full bg-white dark:bg-[#141312] border border-neutral-200/80 dark:border-white/[0.08] rounded-full py-2.5 pl-11 pr-4 text-sm font-sans transition-all focus:ring-2 focus:ring-[#2ec4bb]/10 focus:border-[#2ec4bb]/50 outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none"
          />
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-full bg-white dark:bg-[#141312] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 border border-neutral-200/80 dark:border-white/[0.08] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none transition-all"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} weight="regular" /> : <Moon size={20} weight="regular" />}
          </button>
        )}
      </div>

      {/* Today's News */}
      <section className="bg-white dark:bg-[#141312] border border-neutral-200/80 dark:border-white/[0.08] rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden">
        <div className="px-4 py-3.5 border-b border-neutral-100 dark:border-white/[0.05] flex items-center gap-2.5">
          <Newspaper weight="regular" className="text-cyan-600 dark:text-[#2ec4bb]" size={20} />
          <h2 className="font-editorial text-[17px] font-bold text-neutral-900 dark:text-[#EAE9E7] tracking-tight">Today&apos;s News</h2>
        </div>
        <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
          {newsItems.map((news, i) => (
            <button
              key={i}
              className="group text-left flex flex-col transition-all gap-1.5"
            >
              <h3 className="text-[13px] sm:text-[13.5px] leading-snug font-bold text-neutral-900 dark:text-[#EAE9E7] group-hover:text-[#2ec4bb] transition-colors">
                {news.title}
              </h3>
              
              <div className="flex items-center gap-2 mt-0.5">
                {/* Overlapping Avatars */}
                <div className="flex -space-x-1.5 overflow-hidden shrink-0">
                  {news.avatars.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="avatar"
                      className="inline-block h-[18px] w-[18px] rounded-full ring-2 ring-white dark:ring-[#141312] object-cover"
                    />
                  ))}
                </div>

                {/* Metadata */}
                <div className="text-[11px] font-sans text-neutral-500 dark:text-neutral-500 font-medium truncate">
                  <span>{news.time}</span>
                  <span className="mx-1 opacity-40">•</span>
                  <span>{news.category}</span>
                  <span className="mx-1 opacity-40">•</span>
                  <span>{news.postsCount}</span>
                </div>
              </div>
            </button>
          ))}
          <Link href="/explore" className="w-full mt-2 py-2.5 text-center block text-[12px] font-bold text-cyan-600 dark:text-[#2ec4bb] bg-neutral-50/80 dark:bg-white/[0.05] hover:bg-neutral-100 dark:hover:bg-white/[0.08] rounded-xl transition-colors">
            Show more
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="bg-white dark:bg-[#141312] border border-neutral-200/80 dark:border-white/[0.08] rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden">
        <div className="px-4 py-3.5 border-b border-neutral-100 dark:border-white/[0.05] flex items-center gap-2.5">
          <TrendUp weight="regular" className="text-cyan-600 dark:text-[#2ec4bb]" size={20} />
          <h2 className="font-editorial text-[17px] font-bold text-neutral-900 dark:text-[#EAE9E7] tracking-tight">Trending</h2>
        </div>
        <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
          {trendingTopics.map((trend, i) => (
            <button
              key={i}
              className="group text-left flex flex-col transition-all"
            >
              <div className="text-[10px] font-sans text-neutral-500 dark:text-neutral-500 uppercase tracking-widest mb-1">
                {trend.category.toUpperCase()}
              </div>
              <h3 className="text-[13px] leading-snug font-bold text-neutral-900 dark:text-[#EAE9E7] group-hover:text-[#2ec4bb] transition-colors mb-0.5">
                {trend.topic}
              </h3>
              <div className="text-[11px] text-neutral-500 dark:text-[#555] font-medium">
                {trend.volume}
              </div>
            </button>
          ))}
          <Link href="/explore" className="w-full mt-2 py-2.5 text-center block text-[12px] font-bold text-cyan-600 dark:text-[#2ec4bb] bg-neutral-50/80 dark:bg-white/[0.05] hover:bg-neutral-100 dark:hover:bg-white/[0.08] rounded-xl transition-colors">
            Show more
          </Link>
        </div>
      </section>

      {/* Who to follow */}
      <section className="bg-white dark:bg-[#141312] border border-neutral-200/80 dark:border-white/[0.08] rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden">
        <div className="px-4 py-3.5 border-b border-neutral-100 dark:border-white/[0.05] flex items-center gap-2.5">
          <UserPlus weight="regular" className="text-cyan-600 dark:text-[#2ec4bb]" size={20} />
          <h2 className="font-editorial text-[17px] font-bold text-neutral-900 dark:text-[#EAE9E7] tracking-tight">Connect</h2>
        </div>
        <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
          {recommendFollows.map((user, i) => (
            <div
              key={i}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-[#1A1918] flex items-center justify-center text-neutral-700 dark:text-[#EAE9E7] text-xs font-bold shrink-0 border border-neutral-200/80 dark:border-white/[0.08]">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] leading-snug font-bold text-neutral-900 dark:text-[#EAE9E7] truncate group-hover:text-[#2ec4bb] transition-colors">
                  {user.name}
                </h3>
                <p className="text-[10px] text-neutral-500 dark:text-[#555] truncate">{user.handle}</p>
              </div>
              <Button size="sm" variant="outline" className="h-[26px] rounded-full px-3 text-[9px] uppercase tracking-widest font-bold border-neutral-200/80 dark:border-white/[0.08] text-cyan-600 dark:text-[#2ec4bb] bg-transparent hover:bg-neutral-50 dark:hover:bg-white/[0.05] transition-colors">
                Follow
              </Button>
            </div>
          ))}
          <Link href="/explore" className="w-full mt-2 py-2.5 text-center block text-[12px] font-bold text-cyan-600 dark:text-[#2ec4bb] bg-neutral-50/80 dark:bg-white/[0.05] hover:bg-neutral-100 dark:hover:bg-white/[0.08] rounded-xl transition-colors">
            Show more
          </Link>
        </div>
      </section>

      {/* Footer Links */}
      <footer className="px-4 pb-8">
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-neutral-400 dark:text-[#555] font-medium">
          <a href="#" className="hover:underline hover:text-[#EAE9E7] transition-colors">Terms of Service</a>
          <a href="#" className="hover:underline hover:text-[#EAE9E7] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:underline hover:text-[#EAE9E7] transition-colors">Cookie Policy</a>
          <a href="#" className="hover:underline hover:text-[#EAE9E7] transition-colors">Transparency</a>
          <span>© 2026 AGORA</span>
        </div>
      </footer>
    </div>
  );
}
