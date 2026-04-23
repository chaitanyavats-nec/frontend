"use client";

import { useState } from "react";
import { Note, Scales, Users, WarningCircle } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGovernance } from "@/hooks/useGovernance";
import type { GovernanceProposalWithAuthor, DbGovernanceVote } from "@/types";

interface GovernanceProposalProps {
  proposal: GovernanceProposalWithAuthor;
  isDetailedView?: boolean;
}

function TallyBreakdown({ votes }: { votes: DbGovernanceVote[] }) {
  if (!votes || votes.length === 0) return null;

  const tiers = ["steward", "trusted", "established", "new"];
  const totalWeight = votes.reduce((acc, v) => acc + v.weight, 0);

  const breakdown = tiers.map(tier => {
    const tierVotes = votes.filter(v => v.reputation_level === tier);
    const weight = tierVotes.reduce((acc, v) => acc + v.weight, 0);
    const count = tierVotes.length;
    const percent = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
    
    return { tier, weight, count, percent };
  });

  return (
    <div className="space-y-4 pt-6 border-t border-paper-dark mt-6">
      <div className="flex items-center justify-between">
        <h3 className="font-sans font-bold text-sm text-ink uppercase tracking-wider">Weightage Revelation</h3>
        <span className="text-[10px] font-mono text-slate bg-paper-dark/10 px-2 py-0.5 rounded uppercase font-bold">Verifiable Analysis</span>
      </div>
      <div className="space-y-3">
        {breakdown.map(({ tier, weight, count, percent }) => (
          <div key={tier} className="space-y-1.5">
            <div className="flex justify-between items-end text-[10px] font-mono uppercase tracking-widest px-0.5">
              <span className={cn(
                "font-bold",
                tier === 'steward' && "text-ink",
                tier === 'trusted' && "text-slate-dark",
                tier === 'established' && "text-slate",
                tier === 'new' && "text-slate-light"
              )}>
                {tier}s <span className="font-medium opacity-60">({count} votes)</span>
              </span>
              <span className="font-bold">{Math.round(percent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-paper-dark/30 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-1000 ease-out",
                  tier === 'steward' && "bg-ink",
                  tier === 'trusted' && "bg-slate-dark",
                  tier === 'established' && "bg-slate",
                  tier === 'new' && "bg-slate-light"
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-paper-dark/10 p-3 rounded-md border border-dashed border-paper-dark">
        <p className="text-[10px] font-mono text-slate uppercase leading-relaxed text-center tracking-wider">
          POW WEIGHTAGE REVEALS THE DISTRIBUTION OF REPUTATION STAKED IN THIS DECISION.
        </p>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  open: "bg-sage/10 text-sage border-sage/20",
  passed: "bg-sage text-white-0 border-sage",
  rejected: "bg-terracotta text-white-0 border-terracotta",
  invalid: "bg-paper-dark/50 text-slate border-paper-dark",
};

export function GovernanceProposalCard({
  proposal,
  isDetailedView = false,
}: GovernanceProposalProps) {
  const { useProposal, castVote, isVoting } = useGovernance();
  const { data: detailedData } = useProposal(isDetailedView ? proposal.id : "");
  
  const [localVoted, setLocalVoted] = useState(false);
  const [localVote, setLocalVote] = useState<"for" | "against" | "abstain" | null>(null);

  const totalVotes = (proposal.votes_for || 0) + (proposal.votes_against || 0) + (proposal.votes_abstain || 0);
  
  // Calculate percentages rounded to 1 decimal place
  const getPercent = (count: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 1000) / 10;
  };

  const handleVote = async (selectedVote: "for" | "against" | "abstain") => {
    try {
      await castVote({ proposalId: proposal.id, voteType: selectedVote });
      setLocalVote(selectedVote);
      setLocalVoted(true);
    } catch (err) {
      console.error("Failed to cast vote:", err);
    }
  };

  const isClosed = proposal.status !== "open" || new Date(proposal.deadline) < new Date();

  return (
    <div className="bg-surface border border-paper-dark rounded-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-paper-dark/30 p-4 border-b border-paper-dark flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {proposal.type === "constitutional" ? (
            <Scales size={20} className="text-gold" />
          ) : (
            <Note size={20} className="text-ink" />
          )}
          <span className="font-mono text-xs text-slate font-medium">
            Prop {proposal.id.split("-")[0].toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {proposal.constitutionalConflict && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gold/10 text-gold border border-gold/20">
              <WarningCircle size={14} />
              <span>Constitutional</span>
            </div>
          )}
          <span
            className={cn(
              "px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border",
              STATUS_COLORS[proposal.status]
            )}
          >
            {proposal.status}
          </span>
        </div>
      </div>

      <div className={cn("p-5 sm:p-6 flex flex-col flex-1", isDetailedView ? "space-y-6" : "space-y-4")}>
        {/* Title & Proposer */}
        <div>
          <h2 className={cn("text-ink mb-2 font-semibold tracking-tight", isDetailedView ? "text-2xl" : "text-lg")}>
            {proposal.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate">
            <span>Proposed by</span>
            <span className="font-mono truncate max-w-[200px]">
              {proposal.proposer?.did || "did:agora:unknown"}
            </span>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-xs text-slate">
          <span>Voting closes:</span>
          <time dateTime={proposal.deadline} className="text-ink font-medium">
            {new Date(proposal.deadline).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>

        {/* Body Preview vs Full */}
        <div className="relative flex-1">
          <div
            className={cn(
              "text-sm text-ink leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none prose-p:my-2 prose-headings:font-sans prose-headings:font-semibold prose-headings:text-ink prose-strong:font-semibold prose-ul:my-2 prose-li:my-0.5",
              !isDetailedView && "line-clamp-3"
            )}
            // Dangerously setting internal markup for rapid prototyping.
            // In a real app, use a markdown renderer.
            dangerouslySetInnerHTML={{
              __html: proposal.body
                .replace(/^## (.*)$/gm, "<h3>$1</h3>")
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/- (.*)/g, "<li>$1</li>")
                .replace(/(<li>[\s\S]*<\/li>)/, "<ul>$1</ul>"),
            }}
          />
          {!isDetailedView && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
          )}
        </div>

        {/* Current Tally */}
        <div className={cn("mt-auto", !isDetailedView && "pt-2")}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-medium text-slate flex items-center gap-1.5">
              <Users size={14} /> Total Votes: {totalVotes.toLocaleString()}
            </span>
            {proposal.status === "open" && (
              <span className="text-xs font-medium text-sage">Quorum reached</span>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-paper-dark/50 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-sage transition-all duration-500 ease-out"
              style={{ width: `${getPercent(proposal.votes_for || 0)}%` }}
              title={`For: ${getPercent(proposal.votes_for || 0)}%`}
            />
            <div
              className="h-full bg-terracotta transition-all duration-500 ease-out"
              style={{ width: `${getPercent(proposal.votes_against || 0)}%` }}
              title={`Against: ${getPercent(proposal.votes_against || 0)}%`}
            />
            <div
              className="h-full bg-slate-light transition-all duration-500 ease-out"
              style={{ width: `${getPercent(proposal.votes_abstain || 0)}%` }}
              title={`Abstain: ${getPercent(proposal.votes_abstain || 0)}%`}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-[10px] sm:text-xs font-medium">
            <span className="text-sage w-1/3 text-left">For ({getPercent(proposal.votes_for || 0)}%)</span>
            <span className="text-slate w-1/3 text-center">Abstain ({getPercent(proposal.votes_abstain || 0)}%)</span>
            <span className="text-terracotta w-1/3 text-right">Against ({getPercent(proposal.votes_against || 0)}%)</span>
          </div>
        </div>

        {/* Action Area */}
        {isDetailedView && proposal.status === "open" && !isClosed && (
          <div className="pt-6 border-t border-paper-dark mt-6">
            <h3 className="font-medium text-sm text-ink mb-4">Cast Your Vote</h3>
            {localVoted ? (
              <div className="bg-sage/10 border border-sage/20 p-4 rounded-lg text-center">
                <p className="font-semibold text-sm text-sage mb-1">Vote Recorded</p>
                <p className="text-sm text-slate">
                  You voted <strong className="capitalize text-ink">{localVote}</strong>. Your transaction has been confirmed on-chain.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleVote("for")}
                  disabled={isVoting}
                  variant="outline"
                  className="flex-1 border-sage text-sage hover:bg-sage hover:text-white-0"
                >
                  Vote For
                </Button>
                <Button
                  onClick={() => handleVote("against")}
                  disabled={isVoting}
                  variant="outline"
                  className="flex-1 border-terracotta text-terracotta hover:bg-terracotta hover:text-white-0"
                >
                  Vote Against
                </Button>
                <Button
                  onClick={() => handleVote("abstain")}
                  disabled={isVoting}
                  variant="outline"
                  className="flex-1 border-slate text-slate hover:bg-slate hover:text-white-0"
                >
                  Abstain
                </Button>
              </div>
            )}
            <p className="text-[11px] text-slate mt-4 text-center">
              Voting weight is determined by reputation score and active stake.
            </p>
          </div>
        )}

        {/* Reveal Weightage (Only if it's the detailed view AND the voting is closed) */}
        {isDetailedView && isClosed && detailedData?.votes && (
          <TallyBreakdown votes={detailedData.votes} />
        )}
      </div>
    </div>
  );
}
