import { AppNav } from "@/components/layouts/AppNav";
import { ContributionModal } from "@/components/features/onboarding/ContributionModal";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <AppNav />
      {/* Main content area: offset by sidebar on desktop, top/bottom bar on mobile */}
      <main className="lg:pl-60 pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">
          {children}
        </div>
      </main>
      <ContributionModal />
    </div>
  );
}
