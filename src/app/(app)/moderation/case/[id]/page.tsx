"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { useMockData } from "@/hooks/useMockData";
import { JuryCase } from "@/components/features/moderation/JuryCase";

export default function ModerationCaseDetailPage() {
  const params = useParams();
  const { moderationCases } = useMockData();
  
  const modCase = moderationCases.find((c) => c.id === params.id);

  if (!modCase) {
    return (
      <div className="py-12 text-center">
        <p className="font-editorial text-base text-slate">Case not found.</p>
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
