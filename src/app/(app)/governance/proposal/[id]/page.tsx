"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { useMockData } from "@/hooks/useMockData";
import { GovernanceProposalCard } from "@/components/features/governance/GovernanceProposal";

export default function GovernanceProposalDetailPage() {
  const params = useParams();
  const { proposals } = useMockData();
  
  const proposal = proposals.find((p) => p.id === params.id);

  if (!proposal) {
    return (
      <div className="py-12 text-center">
        <p className="font-editorial text-base text-slate">Proposal not found.</p>
        <Link
          href="/governance"
          className="inline-flex items-center gap-1 font-mono text-xs text-sage hover:text-sage-dark mt-4"
        >
          <ArrowLeft size={14} />
          Back to Governance Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/governance"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate hover:text-ink mb-6 transition-colors duration-150"
      >
        <ArrowLeft size={14} />
        Back to Governance Hub
      </Link>

      <GovernanceProposalCard proposal={proposal} isDetailedView={true} />
    </div>
  );
}
