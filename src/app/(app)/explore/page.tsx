"use client";

import { useState } from "react";
import { MagnifyingGlass, TrendUp, Users, Hash, ArrowRight, UserPlus } from "phosphor-react";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFeed } from "@/hooks/useFeed";
import { FeedControls, HealthFilter, SortOption } from "@/components/features/feed/FeedControls";

const EXPLORE_TABS = [
  "For you",
  "Posts",
  "Hashtags",
  "People",
];

const RECOMMENDED_HASHTAGS = [
  { tag: "#CentralBanking", postsCount: "12.4K posts", category: "Governance", description: "Discussion on monetary policy and central bank actions." },
  { tag: "#AgoraLaunch", postsCount: "8.2K posts", category: "Community", description: "Celebrating the launch of the new Agora web feed." },
  { tag: "#ClimateJustice", postsCount: "14.9K posts", category: "Global", description: "Activism and news regarding sustainable climate agreements." },
  { tag: "#DigitalPrivacy", postsCount: "5.1K posts", category: "Technology", description: "Encryption, decentralized identity, and online rights." },
  { tag: "#SustainableCities", postsCount: "3.9K posts", category: "Civics", description: "Urban planning, cycle paths, and public infrastructure design." },
  { tag: "#FreeSpeech", postsCount: "22.5K posts", category: "Human Rights", description: "Discourse around free speech manifestos and platform moderation." },
];

const RECOMMENDED_PROFILES = [
  { 
    name: "Digital Justice", 
    handle: "@justice_tech", 
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80", 
    bio: "Advocating for digital rights, encryption, and open consensus.",
    followers: "12.4K followers"
  },
  { 
    name: "Urban planning", 
    handle: "@city_builder", 
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80", 
    bio: "Reimagining public spaces, walkability, and green cities.",
    followers: "8.9K followers"
  },
  { 
    name: "Billy Butcher", 
    handle: "@billy_b", 
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", 
    bio: "Reputation level Novice. Dev fighting for clean drinking water.",
    followers: "1.2K followers"
  },
  { 
    name: "Satoshi Nakamoto", 
    handle: "@satoshi", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", 
    bio: "Decentralized identity research and zero-knowledge proofs.",
    followers: "42.1K followers"
  }
];

export default function ExplorePage() {
  const { posts, loading } = useFeed("curated");
  const [activeTab, setActiveTab] = useState("For you");
  const [searchQuery, setSearchQuery] = useState("");
  const [followedState, setFollowedState] = useState<Record<string, boolean>>({});
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  const toggleFollow = (handle: string) => {
    setFollowedState(prev => ({
      ...prev,
      [handle]: !prev[handle]
    }));
  };

  // Filter hashtags and profiles based on search query
  const filteredHashtags = RECOMMENDED_HASHTAGS.filter(item => 
    item.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProfiles = RECOMMENDED_PROFILES.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter and sort curated feed posts
  let filteredPosts = posts ? [...posts] : [];

  // Apply Health Filtering
  if (healthFilter === "high") {
    filteredPosts = filteredPosts.filter((p) => (p.trust_score ?? 0) >= 80);
  } else if (healthFilter === "standard") {
    filteredPosts = filteredPosts.filter((p) => (p.trust_score ?? 0) >= 50);
  } else if (healthFilter === "unverified") {
    filteredPosts = filteredPosts.filter((p) => (p.trust_score ?? 0) < 50);
  }

  // Apply Sorting
  filteredPosts.sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortOption === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortOption === "highest-health") {
      return (b.trust_score ?? 0) - (a.trust_score ?? 0);
    } else if (sortOption === "lowest-health") {
      return (a.trust_score ?? 0) - (b.trust_score ?? 0);
    }
    return 0;
  });

  return (
    <div className="flex flex-col -mt-4 lg:-mt-6">
      {/* Search Header - Sticky */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#0c0c0b]/90 backdrop-blur-md -mx-4 px-4 pt-4 pb-2 border-b border-neutral-200 dark:border-white/[0.08]">
        <div className="relative group mb-4">
          <MagnifyingGlass
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 transition-colors group-focus-within:text-[#2ec4bb]"
          />
          <input
            type="text"
            placeholder="Search Agora topics, tags, or people"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-[#141312] border border-neutral-200/80 dark:border-white/[0.08] rounded-full py-2.5 pl-12 pr-4 text-sm font-sans focus:border-[#2ec4bb]/50 focus:bg-white outline-none transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar -mx-2 px-2">
          {EXPLORE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-bold tracking-tight transition-all border",
                activeTab === tab
                  ? "bg-neutral-900 dark:bg-[#EAE9E7] text-white dark:text-neutral-900 border-neutral-900 dark:border-[#EAE9E7]"
                  : "bg-neutral-50 dark:bg-[#141312] text-neutral-500 dark:text-neutral-400 border-neutral-200/80 dark:border-white/[0.08] hover:border-neutral-300 dark:hover:border-white/[0.15]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Explore Content */}
      <div className="py-6 space-y-8">
        
        {/* TAB 1: FOR YOU */}
        {activeTab === "For you" && (
          <>
            {/* Hero Curated Spotlight */}
            <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-neutral-50 to-neutral-100/50 dark:from-[#141312] dark:to-[#1a1918] border border-neutral-200/80 dark:border-white/[0.08] p-6">
              <div className="relative z-10 max-w-xl">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2ec4bb] mb-2.5 block">SPOTLIGHT</span>
                <h2 className="font-editorial text-[22px] sm:text-[24px] font-bold text-neutral-900 dark:text-[#EAE9E7] leading-tight mb-3">
                  Decentralized Moderation Juries: How Collective Security Replaces Algorithmic Bans
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-[13px] leading-relaxed mb-4">
                  Learn about Agora's new randomly selected jury process. Ensuring harm is minimized while preserving absolute freedom of voice across decentralized networks.
                </p>
                <div className="flex items-center gap-3">
                  <Button size="sm" className="h-[30px] rounded-full px-4 text-[10px] uppercase tracking-widest font-bold bg-neutral-900 dark:bg-[#EAE9E7] hover:bg-neutral-800 dark:hover:bg-[#dcdbd9] text-white dark:text-neutral-900 transition-colors">
                    Read Manifesto
                  </Button>
                </div>
              </div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 dark:bg-[#2ec4bb]/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Trending Tags Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendUp size={18} className="text-[#2ec4bb]" />
                  <h2 className="font-editorial text-lg font-bold text-neutral-900 dark:text-[#EAE9E7]">Trending Topics</h2>
                </div>
                <button onClick={() => setActiveTab("Hashtags")} className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2ec4bb] hover:underline flex items-center gap-1">
                  See all <ArrowRight size={10} weight="bold" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {RECOMMENDED_HASHTAGS.slice(0, 4).map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => {
                      setSearchQuery(item.tag);
                      setActiveTab("Posts");
                    }}
                    className="group text-left p-4 rounded-xl bg-neutral-50 dark:bg-[#141312] hover:bg-neutral-100/50 dark:hover:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.08] transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2ec4bb]">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-medium">
                        {item.postsCount}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-[#EAE9E7] group-hover:text-[#2ec4bb] transition-colors mb-1.5">
                      {item.tag}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-500 line-clamp-1">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* Recommend Profiles Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#2ec4bb]" />
                  <h2 className="font-editorial text-lg font-bold text-neutral-900 dark:text-[#EAE9E7]">Recommended Creators</h2>
                </div>
                <button onClick={() => setActiveTab("People")} className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2ec4bb] hover:underline flex items-center gap-1">
                  See all <ArrowRight size={10} weight="bold" />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x">
                {RECOMMENDED_PROFILES.map((profile) => (
                  <div
                    key={profile.handle}
                    className="w-[240px] shrink-0 snap-start p-4 rounded-[14px] bg-neutral-50 dark:bg-[#141312] border border-neutral-200/80 dark:border-white/[0.08] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-white/[0.08]"
                        />
                        <Button 
                          onClick={() => toggleFollow(profile.handle)}
                          size="sm" 
                          variant={followedState[profile.handle] ? "secondary" : "outline"}
                          className="h-[26px] rounded-full px-3 text-[9px] uppercase tracking-widest font-bold"
                        >
                          {followedState[profile.handle] ? "Following" : "Follow"}
                        </Button>
                      </div>
                      <h3 className="text-[13px] font-bold text-neutral-900 dark:text-[#EAE9E7] leading-none mb-1 truncate">
                        {profile.name}
                      </h3>
                      <p className="text-[10px] text-[#2ec4bb] font-mono mb-2">{profile.handle}</p>
                      <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-500 line-clamp-2">
                        {profile.bio}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-200/50 dark:border-white/[0.04]">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{profile.followers}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Curated Feed Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-[#2ec4bb]" />
                <h2 className="font-editorial text-lg font-bold text-neutral-900 dark:text-[#EAE9E7]">Curated for You</h2>
              </div>
              
              <FeedControls
                healthFilter={healthFilter}
                setHealthFilter={setHealthFilter}
                sortOption={sortOption}
                setSortOption={setSortOption}
                postCount={filteredPosts.length}
              />

              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-neutral-50 dark:bg-[#141312] rounded-xl animate-pulse border border-neutral-200/80 dark:border-white/[0.08]" />)}
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <FeedCard key={post.id} post={post} />
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {/* TAB 2: POSTS (FILTERED SEARCH / FEED) */}
        {activeTab === "Posts" && (
          <div className="space-y-4">
            <FeedControls
              healthFilter={healthFilter}
              setHealthFilter={setHealthFilter}
              sortOption={sortOption}
              setSortOption={setSortOption}
              postCount={filteredPosts.length}
            />

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-neutral-50 dark:bg-[#141312] rounded-xl animate-pulse border border-neutral-200/80 dark:border-white/[0.08]" />)}
              </div>
            ) : (
              filteredPosts.map((post) => (
                <FeedCard key={post.id} post={post} />
              ))
            )}
          </div>
        )}

        {/* TAB 3: HASHTAGS */}
        {activeTab === "Hashtags" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHashtags.map((item) => (
              <div
                key={item.tag}
                className="p-5 rounded-[14px] bg-neutral-50 dark:bg-[#141312] border border-neutral-200/80 dark:border-white/[0.08] hover:border-[#2ec4bb]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2ec4bb]">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-bold">
                      {item.postsCount}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold text-neutral-900 dark:text-[#EAE9E7] mb-2">
                    {item.tag}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-neutral-200/50 dark:border-white/[0.04] flex justify-end">
                  <Button 
                    onClick={() => {
                      setSearchQuery(item.tag);
                      setActiveTab("Posts");
                    }}
                    size="sm" 
                    variant="outline"
                    className="h-7 rounded-full text-[10px] uppercase tracking-widest font-bold"
                  >
                    View Posts
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: PEOPLE */}
        {activeTab === "People" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProfiles.map((profile) => (
              <div
                key={profile.handle}
                className="p-5 rounded-[14px] bg-neutral-50 dark:bg-[#141312] border border-neutral-200/80 dark:border-white/[0.08] flex items-start gap-4"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-white/[0.08] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-[#EAE9E7] leading-tight truncate">
                        {profile.name}
                      </h3>
                      <p className="text-[11px] text-[#2ec4bb] font-mono leading-none">{profile.handle}</p>
                    </div>
                    <Button 
                      onClick={() => toggleFollow(profile.handle)}
                      size="sm" 
                      variant={followedState[profile.handle] ? "secondary" : "outline"}
                      className="h-[26px] rounded-full px-3 text-[9px] uppercase tracking-widest font-bold shrink-0"
                    >
                      {followedState[profile.handle] ? "Following" : "Follow"}
                    </Button>
                  </div>
                  <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-500 mb-3 line-clamp-2">
                    {profile.bio}
                  </p>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{profile.followers}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
