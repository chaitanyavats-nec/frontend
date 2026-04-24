"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Compass,
  UserCircle,
  Bell,
  Fingerprint,
  Gear,
  NotePencil,
  ChartBar,
  SignIn,
  MagnifyingGlass,
  CaretDown,
  List
} from "phosphor-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useFeedModeStore } from "@/stores/useFeedModeStore";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useTopics } from "@/hooks/useTopics";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const desktopNavItems: NavItem[] = [
  { label: "Home", href: "/home", icon: House },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Compose", href: "/compose", icon: NotePencil },
  { label: "Governance", href: "/governance", icon: ChartBar, badge: 1 },
  { label: "Settings", href: "/settings/account", icon: Gear },
];

const mobileNavItems: NavItem[] = [
  { label: "Home", href: "/home", icon: House },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Compose", href: "/compose", icon: NotePencil },
  { label: "Governance", href: "/civics", icon: ChartBar, badge: 1 },
  { label: "Settings", href: "/settings/account", icon: Gear },
];

export function AppNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { mode, setMode, selectedTopic, setSelectedTopic } = useFeedModeStore();
  const { data: topics } = useTopics();
  const { open: openAuthModal } = useAuthModalStore();

  const isActive = (href: string) => {
    if (href === "/home") return pathname === "/home";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-neutral-50/95 dark:bg-neutral-900/95 backdrop-blur-md z-40 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4">
        {/* Left: Profile Icon */}
        <Link href={user ? "/profile/me" : "/welcome"} className="shrink-0">
          <UserCircle size={26} className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50" weight={pathname === "/profile/me" ? "fill" : "regular"} />
        </Link>

        {/* Feed Mode Dropdown (only on home) */}
        <div className="flex-1 flex justify-start ml-4">
          {pathname === "/home" ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 py-1.5 transition-all outline-none border-none">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                  {mode === "chronological" ? "Global" : mode === "topics" ? (selectedTopic || "Topics") : mode}
                </span>
                <CaretDown size={10} weight="bold" className="text-cyan-500/70 dark:text-cyan-400/50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 max-h-[70vh] overflow-y-auto">
                <DropdownMenuLabel className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">Feed View</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setMode("chronological")} className="font-mono text-[11px] uppercase tracking-wider">Global</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMode("curated")} className="font-mono text-[11px] uppercase tracking-wider">Curated</DropdownMenuItem>
                {user && (
                  <DropdownMenuItem onClick={() => setMode("following")} className="font-mono text-[11px] uppercase tracking-wider">Following</DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">Topics</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setMode("topics"); setSelectedTopic(""); }} className="font-mono text-[11px] uppercase tracking-wider">All Topics</DropdownMenuItem>
                {topics?.map(topic => (
                  <DropdownMenuItem 
                    key={topic.id} 
                    onClick={() => { setMode("topics"); setSelectedTopic(topic.slug); }}
                    className={cn(
                      "font-mono text-[11px] uppercase tracking-wider",
                      selectedTopic === topic.slug && mode === "topics" ? "text-cyan-500" : ""
                    )}
                  >
                    #{topic.displayName}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400 ml-4">
               {pathname.split('/').pop()?.replace('-', ' ') || 'Agora'}
             </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors">
            <MagnifyingGlass size={20} />
          </button>
          
          <div className="relative text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 cursor-pointer transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-neutral-900 text-[8px] font-bold rounded-full h-3.5 min-w-[14px] flex items-center justify-center border border-neutral-900">
              3
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Presswork Style (Expanding on Hover) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-20 hover:lg:w-64 lg:fixed lg:top-0 lg:bottom-0 lg:left-0 z-[100] bg-neutral-50 dark:bg-neutral-900 items-start py-8 transition-all duration-300 group/sidebar overflow-hidden">
        {/* Top: Logo Mark (Presswork Signature) */}
        <div className="mb-8 px-4 w-full h-12 flex items-center">
          <Link href="/home" className="relative flex items-center justify-center w-12 h-12 shrink-0">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-2 w-7 h-7 bg-cyan-300/80 rounded-full mix-blend-multiply dark:mix-blend-screen" />
              <div className="absolute bottom-1 left-0 w-7 h-7 bg-magenta-300/80 rounded-full mix-blend-multiply dark:mix-blend-screen" />
              <div className="absolute bottom-1 right-0 w-7 h-7 bg-yellow-300/80 rounded-full mix-blend-multiply dark:mix-blend-screen" />
            </div>
            <span className="relative font-serif text-2xl font-black text-neutral-900 dark:text-neutral-50 leading-none">A</span>
          </Link>
          <span className="ml-4 font-serif text-xl font-bold text-neutral-900 dark:text-neutral-50 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            AGORA
          </span>
        </div>

        {/* Middle: Primary Navigation */}
        <nav className="flex-1 space-y-2 w-full px-3" role="navigation" aria-label="Main navigation">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const handleNavClick = (e: React.MouseEvent) => {
              if (!user && item.label === "Compose") {
                e.preventDefault();
                openAuthModal();
              }
            };

            return (
              <Link
                key={item.href}
                href={(!user && item.label === "Compose") ? "#" : item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex items-center w-full h-12 rounded-sm transition-all duration-200 relative group px-2",
                  active
                    ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
                    : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
                )}
                aria-current={active ? "page" : undefined}
              >
                {/* Active Indicator (Cyan bar) */}
                {active && (
                  <div className="absolute left-0 w-1 h-2/3 bg-cyan-400 rounded-r-md transition-all duration-300" />
                )}

                <div className="relative flex items-center justify-center w-10 shrink-0">
                  <Icon size={22} weight={active ? "fill" : "regular"} className="transition-transform group-hover:scale-110" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-neutral-900 text-[10px] font-bold rounded-xs h-4 min-w-[16px] flex items-center justify-center px-1 border border-neutral-900">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="ml-4 font-mono text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.label}
                </span>

                {/* Tooltip (Presswork Style) - Only visible when NOT expanded */}
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-800 text-neutral-100 text-[10px] font-mono font-bold uppercase tracking-widest rounded-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover/sidebar:hidden transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-2xl border border-neutral-700">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: User Actions */}
        <div className="mt-auto space-y-2 w-full px-3">
          {/* Profile / Login */}
          <Link
            href={user ? "/profile/me" : "/welcome"}
            className={cn(
              "flex items-center w-full h-12 rounded-sm transition-all group px-2 relative",
              (user && pathname === "/profile/me") ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/50"
            )}
            aria-label={user ? "Profile" : "Sign In"}
          >
            {(user && pathname === "/profile/me") && (
              <div className="absolute left-0 w-1 h-2/3 bg-cyan-400 rounded-r-md" />
            )}
            <div className="relative flex items-center justify-center w-10 shrink-0">
              {user ? (
                <UserCircle size={22} weight={pathname === "/profile/me" ? "fill" : "regular"} className="transition-transform group-hover:scale-110" />
              ) : (
                <SignIn size={22} className="transition-transform group-hover:scale-110" />
              )}
            </div>

            <span className="ml-4 font-mono text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {user ? "Profile" : "Sign In"}
            </span>

            <div className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-800 text-neutral-100 text-[10px] font-mono font-bold uppercase tracking-widest rounded-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover/sidebar:hidden transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-2xl border border-neutral-700">
              {user ? "Profile" : "Sign In"}
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Bar - Presswork Style */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-neutral-50/95 dark:bg-neutral-900/95 backdrop-blur-md z-40 border-t border-neutral-200 dark:border-neutral-800 pb-safe"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href) || (item.href === "/civics" && (pathname.startsWith("/moderation") || pathname.startsWith("/governance")));
            const handleNavClick = (e: React.MouseEvent) => {
              if (!user && item.label === "Compose") {
                e.preventDefault();
                openAuthModal();
              }
            };

            return (
              <Link
                key={item.href}
                href={(!user && item.label === "Compose") ? "#" : item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1 px-3 transition-all duration-150 relative",
                  active ? "text-neutral-900 dark:text-neutral-50" : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50"
                )}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon size={24} weight={active ? "fill" : "regular"} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-yellow-400 text-neutral-900 text-[9px] font-bold rounded-xs h-4 min-w-[16px] flex items-center justify-center px-1 border border-neutral-900">
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

    </>
  );
}
