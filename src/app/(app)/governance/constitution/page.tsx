"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen } from "phosphor-react";

export default function ConstitutionPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/governance"
        className="inline-flex items-center gap-1.5 font-medium text-xs text-slate hover:text-ink mb-6 transition-colors duration-150 bg-surface px-3 py-1.5 rounded-lg border border-paper-dark"
      >
        <ArrowLeft size={14} />
        Back to Governance Hub
      </Link>

      <div className="bg-surface border border-paper-dark rounded-lg p-8 sm:p-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 pb-8 border-b border-paper-dark">
          <div className="p-4 bg-gold/10 border border-gold/20 rounded-xl inline-flex self-start">
            <BookOpen size={40} className="text-gold" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-4xl tracking-tight text-ink mb-2">Agora Constitution</h1>
            <p className="font-mono text-xs text-slate uppercase tracking-wider font-semibold">
              Ratified Dec 12, 2024 · Current Version: 1.2
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2 className="font-sans font-semibold text-2xl tracking-tight text-ink">Article I: Data Sovereignty</h2>
          <p className="font-sans text-base text-ink leading-relaxed">
            All user data remains the cryptographic property of the generating entity. The protocol may process data for network functions (e.g., federation, indexing) but cannot license, sell, or transfer data rights. User deletion requests represent immediate cryptographic nullification on all conforming clients.
          </p>

          <h2 className="font-sans font-semibold text-2xl tracking-tight text-ink mt-10">Article II: Provenance & Epistemology</h2>
          <p className="font-sans text-base text-ink leading-relaxed">
            The protocol enforces structural differentiation between original primary observation and derived synthesis. Institutional claims mandate cryptographic signing linking to verified on-chain DAO or registered entity addresses. Financial disclosure is mandatory for commissioned analysis.
          </p>

          <h2 className="font-sans font-semibold text-2xl tracking-tight text-ink mt-10">Article III: Content Moderation & Censure</h2>
          <p className="font-sans text-base text-ink leading-relaxed">
            Agora rejects centralized content removal. Moderation operates via randomized civic juries selected by historical reputation weight. Juries rule exclusively on platform policy violations (inauthentic coordination, undisclosed conflict of interest, explicit fabrication). Outcomes result in reputation slashing and visibility penalization, not deletion, to maintain the historical record.
          </p>

          <h2 className="font-sans font-semibold text-2xl tracking-tight text-ink mt-10">Article IV: Right to Pseudonymous Participation</h2>
          <p className="font-sans text-base text-ink leading-relaxed">
            Every participant retains the right to pseudonymous participation. No governance action may compel identity disclosure beyond basic sybil resistance verification (e.g., BrightID or similar non-identifying humanity checks).
          </p>

          <div className="mt-12 p-5 bg-terracotta/5 border border-terracotta/20 rounded-lg">
            <h3 className="font-sans font-semibold text-sm text-terracotta mb-2">Notice of Active Amendment</h3>
            <p className="font-sans text-sm text-slate leading-relaxed">
              Article IV is currently under review by Proposal 2025-0039 regarding anonymity rights and jurisdictional compliance. Review the Governance Hub for voting details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
