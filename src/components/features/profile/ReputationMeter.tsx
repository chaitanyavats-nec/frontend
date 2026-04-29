"use client";

import { cn } from "@/lib/utils";
import type { ReputationScore } from "@/types";

interface ReputationMeterProps {
  score: ReputationScore;
}

const LADDER_REQUIREMENTS = {
  new: "Earn 10 points to become a Contributor. Continue participating to establish identity.",
  contributor: "30 points to reach Trusted. Your voice weight begins to scale with activity.",
  trusted: "50 points to reach Established. Eligible for advanced moderation features.",
  established: "75 points to reach Authority. High-trust community member.",
  authority: "90 points to reach Elder. Proven long-term commitment to Agora.",
  elder: "Maximum reputation tier. Recognized community elder with peak voice weight.",
};

const LADDER_COLORS = {
  new: "bg-slate-light/20 text-slate",
  contributor: "bg-sage-light/20 text-sage",
  trusted: "bg-sage text-white-0",
  established: "bg-gold text-white-0",
  authority: "bg-gold-dark text-white-0",
  elder: "bg-terracotta text-white-0",
};

const MAX_POINTS = {
  moderationAccuracy: 25,
  contentLongevity: 40,
  disputeParticipation: 10,
  accountAgeWeight: 25,
};

export function ReputationMeter({ score }: ReputationMeterProps) {
  // Use fallbacks for all score components to prevent crashing
  const moderationAccuracy = score?.moderationAccuracy || 0;
  const contentLongevity = score?.contentLongevity || 0;
  const disputeParticipation = score?.disputeParticipation || 0;
  const accountAgeWeight = score?.accountAgeWeight || 0;
  const total = score?.total || 0;
  const ladderLevel = score?.ladderLevel || "new";

  const totalWeight =
    moderationAccuracy +
    contentLongevity +
    disputeParticipation +
    accountAgeWeight;

  const getWidth = (val: number) => {
    if (totalWeight === 0) return "0%";
    return `${Math.max(2, Math.round((val / totalWeight) * 100))}%`;
  };

  return (
    <div className="py-4 px-4 sm:px-6">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="font-sans font-bold text-lg text-ink mb-1">Reputation</h3>
          <p className="font-sans text-[11px] text-slate">
            Based on historical accuracy and constructive participation.
          </p>
        </div>
        <div className="text-right flex items-center gap-6 justify-end">
          <div className="flex flex-col items-end">
            <span className="font-sans font-bold text-4xl text-ink leading-none block mb-1">
              {total}
            </span>
            <span className="text-[9px] font-bold text-slate uppercase tracking-widest">
              Reputation
            </span>
          </div>
          {score.voiceWeight !== undefined && (
            <div className="flex flex-col items-end border-l border-paper-dark/30 pl-6">
              <span className="font-sans font-bold text-4xl text-teal leading-none block mb-1">
                {Math.round(score.voiceWeight)}
              </span>
              <span className="text-[9px] font-bold text-teal uppercase tracking-widest">
                Voice Power
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-5 mb-8">
        <div>
          <div className="flex justify-between font-medium text-[11px] text-ink mb-2">
            <span>Moderation Accuracy</span>
            <span className="text-slate opacity-60">{moderationAccuracy} / {MAX_POINTS.moderationAccuracy}</span>
          </div>
          <div className="h-1 w-full bg-paper-dark/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-ink transition-all duration-500 ease-out"
              style={{ width: `${(moderationAccuracy / MAX_POINTS.moderationAccuracy) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-medium text-[11px] text-ink mb-2">
            <span>Content Longevity</span>
            <span className="text-slate opacity-60">{contentLongevity} / {MAX_POINTS.contentLongevity}</span>
          </div>
          <div className="h-1 w-full bg-paper-dark/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-ink transition-all duration-500 ease-out"
              style={{ width: `${(contentLongevity / MAX_POINTS.contentLongevity) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-medium text-[11px] text-ink mb-2">
            <span>Dispute Participation</span>
            <span className="text-slate opacity-60">{disputeParticipation} / {MAX_POINTS.disputeParticipation}</span>
          </div>
          <div className="h-1 w-full bg-paper-dark/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-ink transition-all duration-500 ease-out"
              style={{ width: `${(disputeParticipation / MAX_POINTS.disputeParticipation) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-medium text-[11px] text-ink mb-2">
            <span>Account Age Weight</span>
            <span className="text-slate opacity-60">{accountAgeWeight} / {MAX_POINTS.accountAgeWeight}</span>
          </div>
          <div className="h-1 w-full bg-paper-dark/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-ink transition-all duration-500 ease-out"
              style={{ width: `${(accountAgeWeight / MAX_POINTS.accountAgeWeight) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="pt-0">
        <span className="font-bold text-[9px] text-slate uppercase tracking-widest block mb-1">What&apos;s next</span>
        <p className="font-sans text-[11px] text-slate leading-relaxed">
          {LADDER_REQUIREMENTS[ladderLevel]}
        </p>
      </div>
    </div>
  );
}
