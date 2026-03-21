"use client";

import Link from "next/link";
import { Scales, BookOpen } from "phosphor-react";
import { useMockData } from "@/hooks/useMockData";
import { GovernanceProposalCard } from "@/components/features/governance/GovernanceProposal";
import { Button } from "@/components/ui/button";

export default function GovernanceHubPage() {
  const { proposals } = useMockData();

  const openProposals = proposals.filter((p) => p.status === "open");
  const pastProposals = proposals.filter((p) => p.status !== "open");

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Scales size={32} className="text-ink" />
          <div>
            <h1 className="font-display text-2xl text-ink">Governance Hub</h1>
            <p className="font-editorial text-sm text-slate mt-1">
              Shape the infrastructure and policies of Agora.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/governance/constitution" passHref>
            <Button variant="outline" className="font-mono text-xs flex items-center gap-2">
              <BookOpen size={16} /> View Constitution
            </Button>
          </Link>
          <Button className="font-mono text-xs bg-sage hover:bg-sage-dark text-paper">
            New Proposal
          </Button>
        </div>
      </div>

      {/* Active Proposals */}
      <div>
        <h2 className="font-mono text-sm text-ink mb-4 pb-2 border-b border-paper-dark">
          Active Proposals
        </h2>
        {openProposals.length === 0 ? (
          <p className="font-editorial text-sm text-slate py-8 text-center bg-paper-dark/20 rounded-md border border-paper-dark border-dashed">
            No active proposals at this time.
          </p>
        ) : (
          <div className="space-y-6">
            {openProposals.map((proposal) => (
              <div key={proposal.id} className="group relative">
                <Link
                  href={`/governance/proposal/${proposal.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View proposal ${proposal.title}`}
                />
                <div className="transition-transform duration-150 group-hover:-translate-y-1">
                  <GovernanceProposalCard proposal={proposal} isDetailedView={false} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Proposals */}
      {pastProposals.length > 0 && (
        <div className="pt-8">
          <h2 className="font-mono text-sm text-ink mb-4 pb-2 border-b border-paper-dark">
            Recent Decisions
          </h2>
          <div className="space-y-6 opacity-80 hover:opacity-100 transition-opacity duration-300">
            {pastProposals.map((proposal) => (
              <div key={proposal.id} className="group relative">
                <Link
                  href={`/governance/proposal/${proposal.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View past proposal ${proposal.title}`}
                />
                <div className="transition-transform duration-150 group-hover:-translate-y-1 shadow-sm group-hover:shadow-md">
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
