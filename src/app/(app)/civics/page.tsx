"use client";

import GovernanceHubPage from "@/app/(app)/governance/page";

export default function CivicsMobilePage() {
  return (
    <div className="space-y-6 lg:hidden">
      <div className="mb-4">
        <h1 className="font-sans font-bold text-3xl tracking-tight text-ink">Governance</h1>
        <p className="font-sans text-sm text-slate mt-1">
          Participate in network governance and vote on proposals.
        </p>
      </div>

      <div className="mt-0">
        <GovernanceHubPage />
      </div>
    </div>
  );
}
