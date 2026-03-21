"use client";

import { useState } from "react";
import { Note, Scales, Users, WarningCircle } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GovernanceProposal } from "@/types";

interface GovernanceProposalProps {
  proposal: GovernanceProposal;
  isDetailedView?: boolean;
}

const STATUS_COLORS = {
  open: "bg-sage-light text-sage-dark border-sage-light",
  passed: "bg-sage text-paper border-sage",
  rejected: "bg-terracotta text-paper border-terracotta",
  invalid: "bg-paper-dark text-slate border-paper-dark",
};

export function GovernanceProposalCard({
  proposal,
  isDetailedView = false,
}: GovernanceProposalProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const [vote, setVote] = useState<"for" | "against" | "abstain" | null>(null);

  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  
  // Calculate percentages rounded to 1 decimal place
  const getPercent = (count: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((count / totalVotes) * 1000) / 10;
  };

  const handleVote = (selectedVote: "for" | "against" | "abstain") => {
    setVote(selectedVote);
    setHasVoted(true);
    // In a real app, this would trigger an on-chain transaction
  };

  return (
    <div className="bg-paper border border-paper-dark rounded-md overflow-hidden">
      {/* Header */}
      <div className="bg-paper-dark/30 p-4 border-b border-paper-dark flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          {proposal.type === "constitutional" ? (
            <Scales size={20} className="text-gold" />
          ) : (
            <Note size={20} className="text-ink" />
          )}
          <span className="font-mono text-xs text-slate-light">
            Prop {proposal.id.split("-")[2]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {proposal.constitutionalConflict && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-gold-light text-gold border border-gold-light">
              <WarningCircle size={14} />
              <span>Constitutional</span>
            </div>
          )}
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs font-mono uppercase border",
              STATUS_COLORS[proposal.status]
            )}
          >
            {proposal.status}
          </span>
        </div>
      </div>

      <div className={cn("p-4 sm:p-6", isDetailedView ? "space-y-6" : "space-y-4")}>
        {/* Title & Proposer */}
        <div>
          <h2 className={cn("text-ink mb-1.5", isDetailedView ? "font-display text-2xl" : "font-display text-xl")}>
            {proposal.title}
          </h2>
          <div className="flex items-center gap-2 font-mono text-xs text-slate">
            <span>Proposed by</span>
            <span className="truncate max-w-[150px]">
              {proposal.proposerDid.slice(0, 16)}…
            </span>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate">
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
        <div className="relative">
          <div
            className={cn(
              "font-editorial text-sm text-ink leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none prose-p:my-2 prose-headings:font-display prose-headings:font-normal prose-headings:text-ink prose-strong:font-medium prose-strong:font-mono prose-ul:my-2 prose-li:my-0.5",
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
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-paper to-transparent pointer-events-none" />
          )}
        </div>

        {/* Current Tally */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-slate flex items-center gap-1.5">
              <Users size={14} /> Total Votes: {totalVotes.toLocaleString()}
            </span>
            {proposal.status === "open" && (
              <span className="font-mono text-xs text-sage">Quorum reached</span>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-paper-dark rounded-full overflow-hidden flex">
            <div
              className="h-full bg-sage transition-all duration-500 ease-out"
              style={{ width: `${getPercent(proposal.votesFor)}%` }}
              title={`For: ${getPercent(proposal.votesFor)}%`}
            />
            <div
              className="h-full bg-terracotta transition-all duration-500 ease-out"
              style={{ width: `${getPercent(proposal.votesAgainst)}%` }}
              title={`Against: ${getPercent(proposal.votesAgainst)}%`}
            />
            <div
              className="h-full bg-slate transition-all duration-500 ease-out"
              style={{ width: `${getPercent(proposal.votesAbstain)}%` }}
              title={`Abstain: ${getPercent(proposal.votesAbstain)}%`}
            />
          </div>
          
          <div className="flex justify-between mt-1.5 font-mono text-[10px] sm:text-xs">
            <span className="text-sage w-1/3 text-left">For ({getPercent(proposal.votesFor)}%)</span>
            <span className="text-slate w-1/3 text-center">Abstain ({getPercent(proposal.votesAbstain)}%)</span>
            <span className="text-terracotta w-1/3 text-right">Against ({getPercent(proposal.votesAgainst)}%)</span>
          </div>
        </div>

        {/* Action Area */}
        {isDetailedView && proposal.status === "open" && (
          <div className="pt-6 border-t border-paper-dark">
            <h3 className="font-mono text-sm text-ink mb-3">Cast Your Vote</h3>
            {hasVoted ? (
              <div className="bg-sage-light/20 border border-sage/30 p-4 rounded-md text-center">
                <p className="font-mono text-sm text-sage-dark mb-1">Vote Recorded</p>
                <p className="font-editorial text-sm text-slate">
                  You voted <strong className="capitalize text-ink">{vote}</strong>. Your transaction has been confirmed on-chain.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleVote("for")}
                  variant="outline"
                  className="flex-1 border-sage text-sage hover:bg-sage hover:text-paper font-mono"
                >
                  Vote For
                </Button>
                <Button
                  onClick={() => handleVote("against")}
                  variant="outline"
                  className="flex-1 border-terracotta text-terracotta hover:bg-terracotta hover:text-paper font-mono"
                >
                  Vote Against
                </Button>
                <Button
                  onClick={() => handleVote("abstain")}
                  variant="outline"
                  className="flex-1 border-slate text-slate hover:bg-slate hover:text-paper font-mono"
                >
                  Abstain
                </Button>
              </div>
            )}
            <p className="font-mono text-[10px] text-slate-light mt-3 text-center">
              Voting weight is determined by reputation score and active stake.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
