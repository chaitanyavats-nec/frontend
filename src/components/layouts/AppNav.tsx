"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Compass,
  PlusCircle,
  Shield,
  Bank,
  UserCircle,
  Bell,
  Fingerprint
} from "phosphor-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/features/theme/ThemeToggle";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const desktopNavItems: NavItem[] = [
  { label: "Home", href: "/home", icon: House },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Compose", href: "/compose", icon: PlusCircle },
  { label: "Moderation", href: "/moderation", icon: Shield, badge: 2 },
  { label: "Governance", href: "/governance", icon: Bank, badge: 1 },
  { label: "Profile", href: "/profile/me", icon: UserCircle },
];

const mobileNavItems: NavItem[] = [
  { label: "Home", href: "/home", icon: House },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Compose", href: "/compose", icon: PlusCircle },
  { label: "Civics", href: "/civics", icon: Fingerprint, badge: 3 },
  { label: "Profile", href: "/profile/me", icon: UserCircle },
];

export function AppNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/home") return pathname === "/home";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-ink z-40 border-b border-paper-dark/20 flex items-center justify-between px-4">
        <h1 className="font-display text-xl text-paper tracking-tight">AGORA</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative text-slate-light hover:text-paper cursor-pointer">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-terracotta text-paper text-[9px] rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
              3
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:left-0 bg-ink z-40">
        <div className="px-6 pt-8 pb-6">
          <h1 className="font-display text-2xl text-paper tracking-tight">
            AGORA
          </h1>
          <p className="font-mono text-xs text-sage-light mt-1">
            Decentralised discourse
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-1" role="navigation" aria-label="Main navigation">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-mono transition-colors duration-150",
                  active
                    ? "bg-sage/20 text-paper border-l-2 border-sage"
                    : "text-slate-light hover:text-paper hover:bg-paper/5 border-l-2 border-transparent"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} weight={active ? "fill" : "regular"} />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-terracotta text-paper text-xs font-mono rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toolbar (Bottom) */}
        <div className="px-6 pb-6 space-y-4">
          <ThemeToggle />

          <button
            className="flex items-center gap-2 text-slate-light hover:text-paper transition-colors duration-150 font-mono text-xs mt-2"
            aria-label="Notifications"
          >
            <div className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-terracotta text-paper rounded-full h-4 min-w-[16px] flex items-center justify-center px-1 text-[10px]">
                3
              </span>
            </div>
            <span>Notifications</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-ink z-40 border-t border-paper-dark/20"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href) || (item.href === "/civics" && (pathname.startsWith("/moderation") || pathname.startsWith("/governance")));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-colors duration-150 relative",
                  active ? "text-sage" : "text-slate-light hover:text-paper"
                )}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon size={22} weight={active ? "fill" : "regular"} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-terracotta text-paper text-[9px] font-mono rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[9px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
