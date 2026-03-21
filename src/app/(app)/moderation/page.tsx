"use client";

import Link from "next/link";
import { ShieldCheck } from "phosphor-react";
import { useMockData } from "@/hooks/useMockData";
import { JuryCase } from "@/components/features/moderation/JuryCase";

export default function ModerationHubPage() {
  const { moderationCases } = useMockData();

  // Split cases for demonstration
  const activeCases = moderationCases.filter((c) => c.phase !== "outcome");
  const pastCases = moderationCases.filter((c) => c.phase === "outcome");

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ShieldCheck size={32} className="text-ink" />
        <div>
          <h1 className="font-display text-2xl text-ink">Moderation Hub</h1>
          <p className="font-editorial text-sm text-slate mt-1">
            Your assigned jury duties and historical case log.
          </p>
        </div>
      </div>

      {/* Active Cases */}
      <div>
        <h2 className="font-mono text-sm text-ink mb-4 pb-2 border-b border-paper-dark">
          Active Cases Requiring Your Attention
        </h2>
        {activeCases.length === 0 ? (
          <p className="font-editorial text-sm text-slate py-8 text-center bg-paper-dark/20 rounded-md border border-paper-dark border-dashed">
            No active cases assigned to you at this time.
          </p>
        ) : (
          <div className="space-y-4">
            {activeCases.map((modCase) => (
              <div key={modCase.id} className="group relative">
                <Link
                  href={`/moderation/case/${modCase.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View moderation case ${modCase.id}`}
                />
                <div className="transition-transform duration-150 group-hover:-translate-y-1">
                  <JuryCase modCase={modCase} isDetailedView={false} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Cases */}
      {pastCases.length > 0 && (
        <div className="pt-4">
          <h2 className="font-mono text-sm text-ink mb-4 pb-2 border-b border-paper-dark">
            Past Cases
          </h2>
          <div className="space-y-4 opacity-75 hover:opacity-100 transition-opacity duration-300">
            {pastCases.map((modCase) => (
              <div key={modCase.id} className="group relative">
                <Link
                  href={`/moderation/case/${modCase.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View moderation case ${modCase.id}`}
                />
                <div className="transition-transform duration-150 group-hover:-translate-y-1">
                  <JuryCase modCase={modCase} isDetailedView={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
