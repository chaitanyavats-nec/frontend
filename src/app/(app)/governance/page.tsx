"use client";

import Link from "next/link";
import { Scales, BookOpen } from "phosphor-react";
import { useGovernance } from "@/hooks/useGovernance";
import { GovernanceProposalCard } from "@/components/features/governance/GovernanceProposal";
import { Button } from "@/components/ui/button";

export default function GovernanceHubPage() {
  const { proposals, isProposalsLoading } = useGovernance();

  if (isProposalsLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-10 py-12 text-center">
        <p className="font-sans text-sm text-slate animate-pulse italic">Synchronizing with registry...</p>
      </div>
    );
  }

  const openProposals = (proposals || []).filter((p) => p.status === "open");
  const pastProposals = (proposals || []).filter((p) => p.status !== "open");

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-surface border border-paper-dark rounded-lg shadow-sm">
            <Scales size={28} className="text-ink" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-3xl text-ink tracking-tight">Governance</h1>
            <p className="font-sans text-sm text-slate mt-1">
              Shape the infrastructure and policies of Agora.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/governance/constitution" passHref>
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen size={16} /> Constitution
            </Button>
          </Link>
          <Link href="/governance/new" passHref>
            <Button className="bg-ink hover:bg-ink-light">
              New Proposal
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Proposals */}
      <div>
        <h2 className="font-sans font-semibold text-lg text-ink mb-4 tracking-tight">
          Active Proposals
        </h2>
        {openProposals.length === 0 ? (
          <div className="bg-surface rounded-lg border border-paper-dark p-12 text-center">
            <p className="font-sans text-sm text-slate">
              No active proposals at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {openProposals.map((proposal) => (
              <div key={proposal.id} className="group relative h-full">
                <Link
                  href={`/governance/proposal/${proposal.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View proposal ${proposal.title}`}
                />
                <div className="transition-transform duration-150 group-hover:-translate-y-1 h-full">
                  <GovernanceProposalCard proposal={proposal} isDetailedView={false} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Proposals */}
      {pastProposals.length > 0 && (
        <div className="pt-4 border-t border-paper-dark">
          <h2 className="font-sans font-semibold text-lg text-ink mb-4 tracking-tight mt-6">
            Recent Decisions
          </h2>
          <div className="space-y-6 opacity-80 hover:opacity-100 transition-opacity duration-300">
            {pastProposals.map((proposal) => (
              <div key={proposal.id} className="group relative h-full">
                <Link
                  href={`/governance/proposal/${proposal.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View past proposal ${proposal.title}`}
                />
                <div className="transition-transform duration-150 group-hover:-translate-y-1 h-full">
                  <GovernanceProposalCard proposal={proposal} isDetailedView={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
