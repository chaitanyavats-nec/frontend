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
  Fingerprint,
  Gear
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
  { label: "Settings", href: "/settings/privacy", icon: Gear },
];

const mobileNavItems: NavItem[] = [
  { label: "Home", href: "/home", icon: House },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Compose", href: "/compose", icon: PlusCircle },
  { label: "Civics", href: "/civics", icon: Fingerprint, badge: 3 },
  { label: "Settings", href: "/settings/privacy", icon: Gear },
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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-surface z-40 border-b border-paper-dark flex items-center justify-between px-4">
        <h1 className="font-sans text-xl font-bold text-ink tracking-tight">AGORA</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative text-slate hover:text-ink cursor-pointer transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-terracotta text-white-0 text-[9px] font-medium rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
              3
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 lg:left-0 bg-surface border-r border-paper-dark z-40">
        <div className="px-6 pt-8 pb-6">
          <h1 className="font-sans text-2xl font-bold text-ink tracking-tight">
            AGORA
          </h1>
          <p className="font-sans text-xs text-slate mt-1">
            Decentralised discourse
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5" role="navigation" aria-label="Main navigation">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                  active
                    ? "bg-sage/10 text-sage"
                    : "text-slate hover:text-ink hover:bg-paper-dark/50"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} weight={active ? "fill" : "regular"} />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-terracotta text-white-0 text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
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
            className="flex items-center gap-2 text-slate hover:text-ink transition-colors duration-150 text-xs font-medium mt-2"
            aria-label="Notifications"
          >
            <div className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-terracotta text-white-0 rounded-full h-4 min-w-[16px] flex items-center justify-center px-1 text-[10px] font-medium">
                3
              </span>
            </div>
            <span>Notifications</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface z-40 border-t border-paper-dark"
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
                  active ? "text-sage" : "text-slate hover:text-ink"
                )}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon size={22} weight={active ? "fill" : "regular"} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-terracotta text-white-0 text-[9px] font-medium rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
