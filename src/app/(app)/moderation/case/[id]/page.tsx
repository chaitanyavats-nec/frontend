"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { useModeration } from "@/hooks/useModeration";
import { JuryCase } from "@/components/features/moderation/JuryCase";

export default function ModerationCaseDetailPage() {
  const params = useParams();
  const { useJuryCase } = useModeration();
  const { data: modCase, isLoading, error } = useJuryCase(params.id as string);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <p className="font-mono text-xs text-slate animate-pulse uppercase tracking-widest">Verifying evidence...</p>
      </div>
    );
  }

  if (error || !modCase) {
    return (
      <div className="py-12 text-center">
        <p className="font-editorial text-base text-slate">
          {error ? "Error loading case." : "Case not found."}
        </p>
        <Link
          href="/moderation"
          className="inline-flex items-center gap-1 font-mono text-xs text-sage hover:text-sage-dark mt-4"
        >
          <ArrowLeft size={14} />
          Back to Moderation Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/moderation"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate hover:text-ink mb-6 transition-colors duration-150"
      >
        <ArrowLeft size={14} />
        Back to Moderation Hub
      </Link>

      <JuryCase modCase={modCase} isDetailedView={true} />
    </div>
  );
}
