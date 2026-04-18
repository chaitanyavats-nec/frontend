import { AppNav } from "@/components/layouts/AppNav";
import { RightSidebar } from "@/components/layouts/RightSidebar";
import { ContributionModal } from "@/components/features/onboarding/ContributionModal";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper flex justify-center">
      <AppNav />
      <div className="flex w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Left column gutter for fixed sidebar */}
        <div className="hidden lg:block w-20 shrink-0" />

        {/* Center column: Feed */}
        <main className="flex-1 max-w-[700px] pt-14 pb-20 lg:pt-0 lg:pb-0 border-x border-paper-dark/20 min-h-screen relative overflow-x-hidden">
          <div className="px-4 py-6 lg:py-8">
            {children}
          </div>
        </main>

        {/* Right column: Info & Recommendations */}
        <aside className="hidden lg:block w-[350px] shrink-0 pl-10 sticky top-0 h-fit">
          <RightSidebar />
        </aside>
      </div>
      <ContributionModal />
    </div>
  );
}
