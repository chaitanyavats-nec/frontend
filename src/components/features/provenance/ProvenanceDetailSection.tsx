"use client";

import { PROVENANCE_CONFIG, getHealthColor } from "@/lib/provenance-config";
import { useProvenance } from "@/hooks/useProvenance";
import type { PostWithProvenance } from "@/types";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  CurrencyDollar, 
  Bank, 
  ShareNetwork, 
  Warning, 
  Link as LinkIcon, 
  ArrowRight,
  ShieldCheck,
  Globe
} from "phosphor-react";
import Link from "next/link";

interface ProvenanceDetailSectionProps {
  post: PostWithProvenance;
}

export function ProvenanceDetailSection({ post }: ProvenanceDetailSectionProps) {
  const summary = useProvenance(post);
  const type = (post.source_type || "original") as string;
  const config = PROVENANCE_CONFIG[type] || PROVENANCE_CONFIG.original;
  const healthColor = getHealthColor(summary.health_score);

  return (
    <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
             <config.icon size={20} className={config.textColor} weight="duotone" />
          </div>
          <div>
            <h3 className="font-editorial text-xl font-bold text-ink">Provenance Report</h3>
            <p className="text-xs font-sans text-slate uppercase tracking-wider opacity-60">Source Integrity Verification</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-mono font-bold" style={{ color: healthColor }}>{summary.health_score}</div>
            <div className="text-[9px] font-mono uppercase tracking-widest text-slate">Health Score</div>
          </div>
          <Link 
            href={`/post/${post.id}/provenance`}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-ink text-white text-xs font-mono font-bold uppercase tracking-widest hover:opacity-90 transition-all"
          >
            Full Chain <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Type Specific Fields */}
        <div className="space-y-4">
          {type === "original" && <OriginalFields post={post} summary={summary} />}
          {type === "derived" && <DerivedFields post={post} summary={summary} />}
          {type === "institutional" && <InstitutionalFields post={post} summary={summary} />}
          {type === "funded" && <FundedFields post={post} summary={summary} />}
          {type === "amplified" && <AmplifiedFields post={post} summary={summary} />}
        </div>

        {/* Global/Common Fields */}
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-neutral-50 dark:bg-neutral-900/50 border border-[var(--border-subtle)]">
             <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold text-slate mb-3">Verification Matrix</h4>
             <div className="space-y-3">
                <VerificationRow label="On-chain Record" status={summary.is_on_chain ? "Verified" : "Pending"} />
                <VerificationRow label="IPFS Snapshot" status={summary.is_ipfs_stored ? "Permanent" : "Ephemeral"} />
                <VerificationRow label="Coordination" status={summary.has_coordination_flag ? "Detected" : "Organic"} warning={summary.has_coordination_flag} />
                <VerificationRow label="Dispute Status" status={post.has_disputed_framing ? "Active" : "Clear"} warning={post.has_disputed_framing} />
             </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-md border border-teal/20 bg-teal/5">
             <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-teal" weight="fill" />
                <span className="text-xs font-sans font-semibold text-ink">Author Reputation Level</span>
             </div>
             <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal">{post.author.ladder_level}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerificationRow({ label, status, warning }: { label: string, status: string, warning?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-sans text-slate">{label}</span>
      <span className={cn(
        "text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded",
        warning ? "bg-orange/10 text-orange border border-orange/20" : "bg-teal/10 text-teal border border-teal/20"
      )}>
        {status}
      </span>
    </div>
  );
}

function Field({ label, value, prominent = false }: { label: string, value: string | React.ReactNode, prominent?: boolean }) {
  return (
    <div>
      <label className="font-mono text-[9px] uppercase tracking-widest text-slate mb-1 block">{label}</label>
      <div className={cn("font-sans text-sm text-ink", prominent ? "text-lg font-bold" : "font-medium")}>
        {value}
      </div>
    </div>
  );
}

function OriginalFields({ post, summary }: { post: PostWithProvenance, summary: any }) {
  return (
    <div className="space-y-4">
      <Field label="Content Type" value="Original reporting and commentary" />
      <Field label="Funding" value={post.funding_type === 'independent' ? "Independent — no funding relationship declared" : `Funded by ${post.funder_name}`} />
      <Field label="Author Declaration" value={post.author_affiliations.length > 0 ? "Affiliations declared and current" : "No institutional affiliations declared"} />
      <Field label="Citations" value={`${post.citations?.length || 0} structured citations verified`} />
    </div>
  );
}

function DerivedFields({ post, summary }: { post: PostWithProvenance, summary: any }) {
  return (
    <div className="space-y-4">
      <Field label="Content Type" value="Derived from external source" />
      <Field label="Primary Source" value={
        <div className="mt-1 p-2 rounded bg-white dark:bg-black border border-[var(--border-subtle)]">
           <div className="font-bold text-xs">{post.origin_label || "Source"}</div>
           <div className="text-[10px] opacity-60 truncate">{post.origin_url}</div>
        </div>
      } />
      <Field label="Transmission Path" value="2 steps: [Source] → This Post" />
      <Field label="Source Integrity" value="Calculated from cross-reference matching" />
    </div>
  );
}

function InstitutionalFields({ post, summary }: { post: PostWithProvenance, summary: any }) {
  return (
    <div className="space-y-4">
      <Field label="Content Type" value="Institutional content" prominent />
      <Field label="Institution" value={summary.primary_affiliation || "Unknown Organization"} />
      <Field label="Author Role" value="Staff Writer / Contributor" />
      <Field label="Funding Summary" value="Top 3 funders: [Undisclosed]" />
    </div>
  );
}

function FundedFields({ post, summary }: { post: PostWithProvenance, summary: any }) {
  return (
    <div className="space-y-4">
      <Field label="Content Type" value="Funded content" />
      <Field label="Funder Name" value={post.funder_name || "Confidential"} prominent />
      <Field label="Relationship" value={post.funding_type || "Commissioned"} />
      <Field label="Status" value="Self-declared and staked" />
    </div>
  );
}

function AmplifiedFields({ post, summary }: { post: PostWithProvenance, summary: any }) {
  const getLineageChain = (p: any): any[] => {
    const chain = [];
    let current = p.quoted_post;
    while (current) {
      chain.push(current);
      current = current.quoted_post;
    }
    return chain;
  };

  const lineage = getLineageChain(post);

  return (
    <div className="space-y-5">
      <Field label="Content Type" value="Amplification of existing content" />
      <Field label="Relationship" value="Quote with commentary" />
      <Field label="Network Analysis" value={summary.has_coordination_flag ? "Coordinated pattern detected" : "Organic distribution"} />

      {lineage.length > 0 && (
        <div className="pt-2">
          <label className="font-mono text-[9px] uppercase tracking-widest text-slate mb-3 block">Provenance Lineage Chain</label>
          <div className="relative pl-4 space-y-4 border-l border-neutral-200 dark:border-neutral-800">
            {lineage.map((item, index) => (
              <div key={item.id} className="relative group transition-all duration-200">
                {/* Visual Dot on Timeline */}
                <div className="absolute left-[-21px] top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-500 border-2 border-white dark:border-black transition-transform group-hover:scale-125 shadow-sm" />
                
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-sans font-bold text-neutral-800 dark:text-neutral-200">{item.author?.display_name || "Unknown Author"}</span>
                    <span className="text-[10px] font-mono text-neutral-400">@{item.author?.display_name.toLowerCase().replace(/ /g, '')}</span>
                  </div>
                  <p className="text-xs font-sans text-neutral-500 line-clamp-2 italic leading-relaxed">
                    "{item.body}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
