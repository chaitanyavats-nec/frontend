"use client";

import { usePathname } from "next/navigation";
import { AppNav } from "@/components/layouts/AppNav";
import { RightSidebar } from "@/components/layouts/RightSidebar";
import { ContributionModal } from "@/components/features/onboarding/ContributionModal";
import { AuthModal } from "@/components/features/auth/AuthModal";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSettings = pathname?.startsWith("/settings");

  return (
    <div className="min-h-screen bg-paper flex justify-center overflow-x-hidden">
      <div className={cn(
        "flex w-full px-4 sm:px-6 transition-all duration-300 gap-4 lg:gap-8",
        isSettings ? "max-w-[1440px]" : "max-w-[1300px]"
      )}>
        {/* Left Column: Navigation Sidebar (Fixed, but we need a spacer in the flow) */}
        {!isSettings && (
          <>
            <AppNav />
            <div className="hidden lg:block w-20 shrink-0" />
          </>
        )}

        {/* Center column: Feed / Settings content */}
        <main className={cn(
          "flex-1 pt-14 pb-20 lg:pt-0 lg:pb-0 relative transition-all duration-300",
          !isSettings ? "max-w-[700px] border-x border-neutral-200 dark:border-neutral-800 min-h-screen overflow-x-hidden" : "w-full min-h-screen"
        )}>
          <div className={cn(
            "py-6 lg:py-8",
            !isSettings ? "px-6 lg:px-10" : "px-0"
          )}>
            {children}
          </div>
        </main>

        {/* Right column: Info & Recommendations - Hidden in Settings */}
        {!isSettings && (
          <aside className="hidden xl:block w-[350px] shrink-0 sticky top-8 h-fit">
            <RightSidebar />
          </aside>
        )}
      </div>
      <ContributionModal />
      <AuthModal />
    </div>
  );
}
