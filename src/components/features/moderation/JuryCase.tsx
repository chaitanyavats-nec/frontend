"use client";

import { useState } from "react";
import { ShieldCheck, LockKey, LockOpen, WarningCircle } from "phosphor-react";
import { FeedCard } from "@/components/features/feed/FeedCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ModerationCase } from "@/types";

interface JuryCaseProps {
  modCase: ModerationCase;
  isDetailedView?: boolean;
}

const FLAG_COLORS = {
  coordination: "bg-terracotta text-paper",
  "citation-misrepresentation": "bg-terracotta text-paper",
  "undisclosed-funding": "bg-terracotta text-paper",
  "hate-speech": "bg-terracotta text-paper",
  fabricated: "bg-terracotta text-paper",
};

export function JuryCase({ modCase, isDetailedView = false }: JuryCaseProps) {
  const [hasCommitted, setHasCommitted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [vote, setVote] = useState<"uphold" | "dismiss" | null>(null);

  const handleCommit = () => {
    if (vote) {
      setHasCommitted(true);
      // In a real app, this would submit a hash of the vote + salt to the chain
    }
  };

  const handleReveal = () => {
    setHasRevealed(true);
    // In a real app, this would submit the plaintext vote + salt to verify the hash
  };

  return (
    <div className="bg-paper border border-paper-dark rounded-md overflow-hidden">
      {/* Header */}
      <div className="bg-paper-dark/30 p-3 border-b border-paper-dark flex flex-col sm:flex-row gap-2.5 items-start sm:items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={18} className="text-ink" />
          <span className="font-mono text-[10px] sm:text-xs text-slate-light">
            Case {modCase.id.slice(0, 16)}…
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-mono capitalize",
              FLAG_COLORS[modCase.flagType] || "bg-slate text-paper"
            )}
          >
             {modCase.flagType.replace("-", " ")}
          </span>
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-mono uppercase border",
              modCase.phase === "commit"
                ? "bg-sage-light text-sage-dark border-sage-light"
                : modCase.phase === "reveal"
                ? "bg-gold-light text-gold border-gold-light"
                : "bg-paper-dark text-slate border-paper-dark"
            )}
          >
            {modCase.phase}
          </span>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 space-y-4">
        {/* Timeline context */}
        <div className="flex flex-col sm:flex-row gap-3 font-mono text-[10px] sm:text-[11px] text-slate bg-paper-dark/10 p-2.5 rounded-md">
          <div className="flex-1">
            <strong className="text-ink block mb-0.5">Commit Deadline</strong>
            {new Date(modCase.commitDeadline).toLocaleString("en-GB")}
          </div>
          <div className="flex-1">
            <strong className="text-ink block mb-0.5">Reveal Deadline</strong>
            {new Date(modCase.revealDeadline).toLocaleString("en-GB")}
          </div>
        </div>

        {/* Flag Note / Evidence */}
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-ink mb-1.5">Flagger Note</h3>
          <p className="font-editorial text-[14px] text-slate bg-terracotta/5 p-2.5 rounded border border-terracotta/10 flex gap-2">
            <WarningCircle className="text-terracotta shrink-0 mt-0.5" size={15} />
            {modCase.flaggerNote || "No note provided."}
          </p>

          {isDetailedView && modCase.evidence.length > 0 && (
            <div className="mt-4">
              <h4 className="font-mono text-xs text-slate mb-2">Evidence Provided</h4>
              <ul className="space-y-1.5 list-disc list-inside">
                {modCase.evidence.map((ev, i) => (
                  <li key={i} className="font-editorial text-sm text-ink">
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Content Under Review */}
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-ink mb-1.5">Content Under Review</h3>
          <div className="border border-terracotta/30 rounded-md overflow-hidden">
            {/* Reuse FeedCard but force provenance display to see context */}
            <FeedCard post={modCase.flaggedPost} showProvenance={true} />
          </div>
        </div>

        {/* Action Area based on Phase */}
        {isDetailedView && (
          <div className="pt-3 border-t border-paper-dark">
            {modCase.phase === "commit" && !hasCommitted && (
              <div className="space-y-3">
                <p className="font-editorial text-[13px] text-slate leading-relaxed">
                  Review the evidence and cast your vote. During the commit phase, your vote is cryptographically hashed and hidden from other jurors to prevent bias.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVote("uphold")}
                    className={cn(
                      "flex-1 py-1.5 rounded-md font-mono text-[11px] font-bold uppercase tracking-wider transition-all border",
                      vote === "uphold"
                        ? "bg-terracotta text-paper border-terracotta"
                        : "bg-paper text-slate border-paper-dark hover:border-terracotta/50"
                    )}
                  >
                    Uphold
                  </button>
                  <button
                    onClick={() => setVote("dismiss")}
                    className={cn(
                      "flex-1 py-1.5 rounded-md font-mono text-[11px] font-bold uppercase tracking-wider transition-all border",
                      vote === "dismiss"
                        ? "bg-sage text-paper border-sage"
                        : "bg-paper text-slate border-paper-dark hover:border-sage/50"
                    )}
                  >
                    Dismiss
                  </button>
                </div>
                <Button
                  onClick={handleCommit}
                  disabled={!vote}
                  className="w-full font-mono flex items-center gap-2"
                >
                  <LockKey size={16} /> Commit Vote Hash
                </Button>
              </div>
            )}

            {modCase.phase === "commit" && hasCommitted && (
              <div className="bg-sage-light/20 border border-sage/30 p-4 rounded-md text-center">
                <LockKey size={24} className="text-sage mx-auto mb-2" />
                <h4 className="font-display text-lg text-ink">Vote Committed</h4>
                <p className="font-editorial text-sm text-slate mt-1">
                  Your cryptographic hash has been recorded on-chain. Please return during the reveal phase to decrypt your vote.
                </p>
              </div>
            )}

            {modCase.phase === "reveal" && !hasRevealed && (
              <div className="space-y-4">
                <p className="font-editorial text-sm text-slate">
                  The commit phase has ended. You must now reveal your vote to be counted and to maintain your reputation score.
                </p>
                <Button
                  onClick={handleReveal}
                  className="w-full font-mono flex items-center gap-2 bg-gold hover:bg-gold-light text-paper hover:text-ink border border-gold"
                >
                  <LockOpen size={16} /> Reveal Plaintext Vote
                </Button>
              </div>
            )}

            {modCase.phase === "reveal" && hasRevealed && (
              <div className="bg-sage-light/20 border border-sage/30 p-4 rounded-md text-center">
                <LockOpen size={24} className="text-sage mx-auto mb-2" />
                <h4 className="font-display text-lg text-ink">Vote Revealed</h4>
                <p className="font-editorial text-sm text-slate mt-1">
                  Your vote has been verified and counted. The final outcome will be published once all jurors have revealed or the deadline passes.
                </p>
              </div>
            )}

            {modCase.phase === "outcome" && (
              <div className="bg-paper-dark/30 p-4 rounded-md border border-paper-dark">
                <h4 className="font-mono text-sm text-ink mb-1">Case Resolved</h4>
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded text-xs font-mono uppercase mt-2",
                    modCase.outcome === "upheld" ? "bg-terracotta text-paper" : "bg-sage text-paper"
                  )}
                >
                  Outcome: {modCase.outcome}
                </span>
                <p className="font-editorial text-sm text-slate mt-2">
                  The jury reached a consensus to {modCase.outcome === "upheld" ? "remove the post and slash the author's reputation." : "dismiss the flag. The post remains active."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
