"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen } from "phosphor-react";

export default function ConstitutionPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/governance"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate hover:text-ink mb-6 transition-colors duration-150"
      >
        <ArrowLeft size={14} />
        Back to Governance Hub
      </Link>

      <div className="bg-paper border border-paper-dark rounded-md p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-paper-dark">
          <BookOpen size={32} className="text-gold" />
          <div>
            <h1 className="font-display text-3xl text-ink">Agora Constitution</h1>
            <p className="font-mono text-xs text-slate mt-1 uppercase tracking-wider">
              Ratified Dec 12, 2024 · Current Version: 1.2
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="font-display font-normal text-2xl text-ink">Article I: Data Sovereignty</h2>
          <p className="font-editorial text-base text-ink leading-relaxed">
            All user data remains the cryptographic property of the generating entity. The protocol may process data for network functions (e.g., federation, indexing) but cannot license, sell, or transfer data rights. User deletion requests represent immediate cryptographic nullification on all conforming clients.
          </p>

          <h2 className="font-display font-normal text-2xl text-ink mt-8">Article II: Provenance & Epistemology</h2>
          <p className="font-editorial text-base text-ink leading-relaxed">
            The protocol enforces structural differentiation between original primary observation and derived synthesis. Institutional claims mandate cryptographic signing linking to verified on-chain DAO or registered entity addresses. Financial disclosure is mandatory for commissioned analysis.
          </p>

          <h2 className="font-display font-normal text-2xl text-ink mt-8">Article III: Content Moderation & Censure</h2>
          <p className="font-editorial text-base text-ink leading-relaxed">
            Agora rejects centralized content removal. Moderation operates via randomized civic juries selected by historical reputation weight. Juries rule exclusively on platform policy violations (inauthentic coordination, undisclosed conflict of interest, explicit fabrication). Outcomes result in reputation slashing and visibility penalization, not deletion, to maintain the historical record.
          </p>

          <h2 className="font-display font-normal text-2xl text-ink mt-8">Article IV: Right to Pseudonymous Participation</h2>
          <p className="font-editorial text-base text-ink leading-relaxed">
            Every participant retains the right to pseudonymous participation. No governance action may compel identity disclosure beyond basic sybil resistance verification (e.g., BrightID or similar non-identifying humanity checks).
          </p>

          <div className="mt-12 p-4 bg-terracotta/5 border-l-2 border-terracotta rounded-r-md">
            <h3 className="font-mono text-sm text-terracotta mb-2">Notice of Active Amendment</h3>
            <p className="font-editorial text-sm text-slate">
              Article IV is currently under review by Proposal 2025-0039 regarding anonymity rights and jurisdictional compliance. Review the Governance Hub for voting details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
