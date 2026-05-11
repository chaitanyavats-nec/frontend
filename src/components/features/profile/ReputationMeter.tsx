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
    <div className="py-6 px-4 sm:px-6">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-sans text-[10px] font-bold tracking-[0.12em] text-neutral-400 dark:text-neutral-500 uppercase mb-1">Reputation</h3>
          <p className="font-sans text-[11px] text-neutral-500 dark:text-neutral-400">
            Based on historical accuracy and constructive participation.
          </p>
        </div>
        <div className="text-right flex items-center gap-6 justify-end">
          <div className="flex flex-col items-end">
            <span className="font-sans font-bold text-3xl text-neutral-900 dark:text-white leading-none block mb-1">
              {total}
            </span>
            <span className="text-[8px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
              Reputation
            </span>
          </div>
          {score.voiceWeight !== undefined && (
            <div className="flex flex-col items-end border-l border-neutral-200/60 dark:border-[#222120] pl-6">
              <span className="font-sans font-bold text-3xl text-cyan-600 dark:text-cyan-400 leading-none block mb-1">
                {Math.round(score.voiceWeight)}
              </span>
              <span className="text-[8px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                Voice Power
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Live Reputation Oscilloscope Threads Visualizer ── */}
      <div className="mb-6">
        <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl p-3 sm:p-4 relative h-16 sm:h-20 overflow-hidden shadow-inner flex items-center justify-center">
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 600 80" fill="none" preserveAspectRatio="none">
            <defs>
              <pattern id="reputationDotGrid" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" className="fill-white/5" />
              </pattern>
              {/* Glowing neon reputation gradients */}
              <linearGradient id="glowRepGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="glowRepCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#reputationDotGrid)" />
            
            {/* Layered animated sine waves representing reputation score components */}
            <path 
              d="M 0,40 C 150,15 300,65 450,20 T 600,40" 
              stroke="url(#glowRepGreen)" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              className="wave-thread-1" 
            />
            <path 
              d="M 0,40 C 100,60 250,25 400,55 T 600,40" 
              stroke="url(#glowRepCyan)" 
              strokeWidth="1.5" 
              className="wave-thread-2" 
            />
            <path 
              d="M 0,40 C 200,30 350,50 500,35 T 600,40" 
              stroke="rgba(16, 185, 129, 0.15)" 
              strokeWidth="1.2" 
              className="wave-thread-3" 
            />
          </svg>
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
          <div className="absolute top-2 right-3 flex items-center gap-1.5 z-10">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[7.5px] font-mono tracking-widest text-emerald-400 font-bold uppercase">LIVE FEED</span>
          </div>
        </div>
      </div>

      {/* Breakdown Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-6">
        <div>
          <div className="flex justify-between font-sans text-[10px] font-bold tracking-[0.06em] text-neutral-400 dark:text-neutral-500 uppercase mb-2">
            <span>Moderation Accuracy</span>
            <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[10.5px]">{moderationAccuracy} / {MAX_POINTS.moderationAccuracy}</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800/80 rounded-full overflow-hidden border border-neutral-200/10">
            <div
              className="h-full bg-neutral-800 dark:bg-neutral-200 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(moderationAccuracy / MAX_POINTS.moderationAccuracy) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-sans text-[10px] font-bold tracking-[0.06em] text-neutral-400 dark:text-neutral-500 uppercase mb-2">
            <span>Content Longevity</span>
            <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[10.5px]">{contentLongevity} / {MAX_POINTS.contentLongevity}</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800/80 rounded-full overflow-hidden border border-neutral-200/10">
            <div
              className="h-full bg-neutral-800 dark:bg-neutral-200 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(contentLongevity / MAX_POINTS.contentLongevity) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-sans text-[10px] font-bold tracking-[0.06em] text-neutral-400 dark:text-neutral-500 uppercase mb-2">
            <span>Dispute Participation</span>
            <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[10.5px]">{disputeParticipation} / {MAX_POINTS.disputeParticipation}</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800/80 rounded-full overflow-hidden border border-neutral-200/10">
            <div
              className="h-full bg-neutral-800 dark:bg-neutral-200 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(disputeParticipation / MAX_POINTS.disputeParticipation) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-sans text-[10px] font-bold tracking-[0.06em] text-neutral-400 dark:text-neutral-500 uppercase mb-2">
            <span>Account Age Weight</span>
            <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[10.5px]">{accountAgeWeight} / {MAX_POINTS.accountAgeWeight}</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800/80 rounded-full overflow-hidden border border-neutral-200/10">
            <div
              className="h-full bg-neutral-800 dark:bg-neutral-200 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(accountAgeWeight / MAX_POINTS.accountAgeWeight) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="pt-2 border-t border-neutral-100 dark:border-[#1e1e1e]">
        <span className="font-bold text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">What&apos;s next</span>
        <p className="font-sans text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {LADDER_REQUIREMENTS[ladderLevel]}
        </p>
      </div>
    </div>
  );
}
