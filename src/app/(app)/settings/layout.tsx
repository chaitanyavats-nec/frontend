"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Bell, 
  Lock, 
  Browsers, 
  Shield, 
  Bank, 
  Database, 
  Wheelchair, 
  Wallet, 
  Info, 
  WarningCircle, 
  SignOut,
  CaretRight,
  CaretLeft
} from "phosphor-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  variant?: "default" | "danger";
}

const navItems: NavItem[] = [
  { label: "Account", href: "/settings/account", icon: User },
  { label: "Notifications", href: "/settings/notifications", icon: Bell },
  { label: "Privacy & Security", href: "/settings/privacy", icon: Lock },
  { label: "Feed & Content", href: "/settings/feed", icon: Browsers },
  { label: "Moderation", href: "/settings/moderation", icon: Shield },
  { label: "Governance", href: "/settings/governance", icon: Bank },
  { label: "Data & Export", href: "/settings/data", icon: Database },
  { label: "Accessibility", href: "/settings/accessibility", icon: Wheelchair },
  { label: "Payments", href: "/settings/payments", icon: Wallet },
  { label: "About & Legal", href: "/settings/about", icon: Info },
  { label: "Danger Zone", href: "/settings/danger", icon: WarningCircle, variant: "danger" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Settings Navigation Sidebar */}
      <aside className="w-full lg:w-72 shrink-0 lg:border-r border-paper-dark/20 lg:pr-8 min-h-screen">
        <div className="sticky top-8 space-y-1">
          {/* Back button */}
          <div className="mb-8">
            <Link 
              href="/home" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate hover:text-teal transition-colors group px-4"
            >
              <CaretLeft size={16} weight="bold" className="group-hover:-translate-x-1 transition-transform" />
              Back to Agora
            </Link>
          </div>

          <div className="px-4 mb-6">
            <h1 className="text-3xl font-editorial text-ink tracking-tight">Settings</h1>
            <p className="text-sm text-slate mt-1">Personalise your platform experience.</p>
          </div>
          
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                    active 
                      ? "bg-teal text-paper shadow-lg shadow-teal/20" 
                      : item.variant === "danger"
                        ? "text-slate hover:text-orange hover:bg-orange/5"
                        : "text-slate hover:text-ink hover:bg-paper-dark/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} weight={active ? "fill" : "regular"} className={cn("transition-transform group-hover:scale-110")} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {active && (
                    <motion.div 
                      layoutId="active-settings-indicator"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <CaretRight size={14} weight="bold" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-paper-dark/30">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-slate hover:text-orange hover:bg-orange/5 rounded-xl transition-all duration-200 group"
                onClick={() => signOut()}
              >
                <SignOut size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Settings Content Area */}
      <main className="flex-1 min-w-0 pb-20">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
