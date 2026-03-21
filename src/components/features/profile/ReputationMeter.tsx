"use client";

import { cn } from "@/lib/utils";
import type { ReputationScore } from "@/types";

interface ReputationMeterProps {
  score: ReputationScore;
}

const LADDER_REQUIREMENTS = {
  new: "100 points to reach Established. Participate in disputes to level up.",
  established: "500 points to reach Trusted. Maintain >80% moderation accuracy.",
  trusted: "1000 points and active stewardship role required for Steward.",
  steward: "Highest reputation level. Eligible for full Constitution committee.",
};

const LADDER_COLORS = {
  new: "bg-slate-light text-slate",
  established: "bg-sage-light text-sage-dark",
  trusted: "bg-sage text-paper",
  steward: "bg-gold text-paper",
};

export function ReputationMeter({ score }: ReputationMeterProps) {
  // Mock calculate percentage weights for the breakdown bars
  const totalWeight =
    score.moderationAccuracy +
    score.contentLongevity +
    score.disputeParticipation +
    score.accountAgeWeight;

  const getWidth = (val: number) => {
    if (totalWeight === 0) return "0%";
    return `${Math.max(2, Math.round((val / totalWeight) * 100))}%`;
  };

  return (
    <div className="bg-paper p-5 rounded-md border border-paper-dark">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display text-xl text-ink mb-1">Reputation</h3>
          <p className="font-editorial text-sm text-slate">
            Based on historical accuracy and constructive participation.
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-3xl text-ink leading-none block mb-1">
            {score.total}
          </span>
          <span
            className={cn(
               "inline-block px-2 py-0.5 rounded text-xs font-mono capitalize",
              LADDER_COLORS[score.ladderLevel]
            )}
          >
            {score.ladderLevel}
          </span>
        </div>
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-4 mb-5">
        <div>
          <div className="flex justify-between font-mono text-xs text-slate mb-1.5">
            <span>Moderation Accuracy</span>
            <span>{(score.moderationAccuracy * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-paper-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-sage transition-all duration-500 ease-out"
              style={{ width: getWidth(score.moderationAccuracy) }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-mono text-xs text-slate mb-1.5">
            <span>Content Longevity</span>
            <span>{(score.contentLongevity * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-paper-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-sage transition-all duration-500 ease-out"
              style={{ width: getWidth(score.contentLongevity) }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-mono text-xs text-slate mb-1.5">
            <span>Dispute Participation</span>
            <span>{(score.disputeParticipation * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-paper-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-sage transition-all duration-500 ease-out"
              style={{ width: getWidth(score.disputeParticipation) }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-mono text-xs text-slate mb-1.5">
            <span>Account Age Weight</span>
            <span>{(score.accountAgeWeight * 100).toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-paper-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-sage transition-all duration-500 ease-out"
              style={{ width: getWidth(score.accountAgeWeight) }}
            />
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="pt-4 border-t border-paper-dark">
        <span className="font-mono text-xs text-slate block mb-1">What&apos;s next</span>
        <p className="font-editorial text-sm text-ink">
          {LADDER_REQUIREMENTS[score.ladderLevel]}
        </p>
      </div>
    </div>
  );
}
