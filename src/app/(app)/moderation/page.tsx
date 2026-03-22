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
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-surface border border-paper-dark rounded-lg shadow-sm">
          <ShieldCheck size={28} className="text-ink" />
        </div>
        <div>
          <h1 className="font-sans font-bold text-3xl tracking-tight text-ink">Moderation Hub</h1>
          <p className="font-sans text-sm text-slate mt-1">
            Your assigned jury duties and historical case log.
          </p>
        </div>
      </div>

      {/* Active Cases */}
      <div>
        <h2 className="font-sans font-semibold text-lg text-ink mb-4 tracking-tight">
          Active Cases Requiring Your Attention
        </h2>
        {activeCases.length === 0 ? (
          <div className="bg-surface rounded-lg border border-paper-dark p-12 text-center">
            <p className="font-sans text-sm text-slate">
              No active cases assigned to you at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeCases.map((modCase) => (
              <div key={modCase.id} className="group relative h-full">
                <Link
                  href={`/moderation/case/${modCase.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View moderation case ${modCase.id}`}
                />
                <div className="transition-transform duration-150 group-hover:-translate-y-1 h-full">
                  <JuryCase modCase={modCase} isDetailedView={false} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Cases */}
      {pastCases.length > 0 && (
        <div className="pt-4 border-t border-paper-dark">
          <h2 className="font-sans font-semibold text-lg text-ink mb-4 tracking-tight mt-6">
            Past Cases
          </h2>
          <div className="space-y-6 opacity-80 hover:opacity-100 transition-opacity duration-300">
            {pastCases.map((modCase) => (
              <div key={modCase.id} className="group relative h-full">
                <Link
                  href={`/moderation/case/${modCase.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View moderation case ${modCase.id}`}
                />
                <div className="transition-transform duration-150 group-hover:-translate-y-1 h-full">
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
