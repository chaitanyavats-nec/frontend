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
        <h1 className="font-editorial text-2xl font-bold text-ink tracking-tight">AGORA</h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative text-slate hover:text-ink cursor-pointer transition-colors">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 bg-orange text-paper text-[9px] font-medium rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
              3
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-20 lg:fixed lg:inset-y-0 lg:left-0 bg-surface border-r border-paper-dark z-40 transition-all duration-300">
        <div className="flex flex-col items-center pt-8 pb-6">
          <h1 className="font-editorial text-3xl font-bold text-ink tracking-tight leading-none">
            A
          </h1>
          <p className="font-mono text-[8px] uppercase tracking-tighter text-slate mt-1 opacity-70">
            AGORA
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
                  "flex items-center justify-center p-3 rounded-xl transition-all duration-150 relative group",
                  active
                    ? "bg-teal/10 text-teal shadow-inner"
                    : "text-slate hover:text-ink hover:bg-paper-dark/40"
                )}
                aria-current={active ? "page" : undefined}
                title={item.label}
              >
                <Icon size={24} weight={active ? "fill" : "regular"} className="group-hover:scale-110 transition-transform" />
                <span className="sr-only">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-orange text-paper text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5 shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toolbar (Bottom) */}
        <div className="flex flex-col items-center pb-8 space-y-6">
          <ThemeToggle />

          <button
            className="flex flex-col items-center gap-1 text-slate hover:text-ink transition-colors duration-150 group"
            aria-label="Notifications"
            title="Notifications"
          >
            <div className="relative">
              <Bell size={24} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 bg-orange text-paper rounded-full h-4 min-w-[16px] flex items-center justify-center px-1 text-[9px] font-bold shadow-sm">
                3
              </span>
            </div>
            <span className="sr-only">Notifications</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md z-40 border-t border-paper-dark pb-safe"
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
                  "flex flex-col items-center justify-center gap-1 py-1 px-3 transition-all duration-150 relative",
                  active ? "text-teal scale-110" : "text-slate hover:text-ink"
                )}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon size={24} weight={active ? "fill" : "regular"} />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-orange text-paper text-[9px] font-bold rounded-full h-4 min-w-[16px] flex items-center justify-center px-1 shadow-sm border border-surface">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
