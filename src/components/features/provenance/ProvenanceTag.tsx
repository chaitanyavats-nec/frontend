"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Warning, Eye, Link as LinkIcon } from "phosphor-react";
import { cn } from "@/lib/utils";
import { useProvenance } from "@/hooks/useProvenance";
import type { PostWithProvenance } from "@/types";

interface ProvenanceTagProps {
  post: PostWithProvenance;
  expanded?: boolean;
  onExpand?: () => void;
}

const sourceTypeConfig = {
  original: {
    label: "Original",
    pillClasses: "bg-sage/10 text-sage-dark border-sage/30",
  },
  derived: {
    label: "Derived",
    pillClasses: "bg-sage/10 text-sage-dark border-sage/30",
  },
  republished: {
    label: "Republished",
    pillClasses: "bg-sage/10 text-sage-dark border-sage/30",
  },
  institutional: {
    label: "Institutional",
    pillClasses: "bg-gold/10 text-gold-dark border-gold/30",
  },
} as const;

export const updateTypeConfig = {
  added_context: { label: "Added Context", classes: "bg-teal/10 text-teal-dark border-teal/20" },
  incomplete_provenance: { label: "Incomplete Provenance", classes: "bg-orange/10 text-orange border-orange/20" },
  misleading_framing: { label: "Misleading Framing", classes: "bg-terracotta/10 text-terracotta border-terracotta/20" },
  undisclosed_funding: { label: "Undisclosed Funding", classes: "bg-terracotta/10 text-terracotta border-terracotta/20" },
} as const;

// ─── STATE 1: Collapsed Pill ────────────────────────────────
function CollapsedPill({
  post,
  onClick,
}: {
  post: PostWithProvenance;
  onClick: () => void;
}) {
  const summary = useProvenance(post);
  const config = summary.has_coordination_flag 
    ? { label: "Coordinated", pillClasses: "bg-terracotta text-white-0 border-terracotta shadow-sm" }
    : summary.has_funding_disclosure
    ? { label: "Funded", pillClasses: "bg-terracotta/10 text-terracotta border-terracotta/20" }
    : sourceTypeConfig[summary.source_type];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-mono text-[10px] sm:text-xs transition-all duration-150 hover:opacity-80",
        config.pillClasses
      )}
      aria-label={`Source: ${config.label}${summary.primary_affiliation ? `, ${summary.primary_affiliation}` : ""}. Click to expand.`}
    >
      {summary.has_coordination_flag ? (
        <Warning size={14} weight="fill" />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      )}
      <span className="font-medium">{config.label}</span>
      {summary.primary_affiliation && (
        <>
          <span className="opacity-50">·</span>
          <span className="max-w-[80px] sm:max-w-[120px] truncate">{summary.primary_affiliation}</span>
        </>
      )}
      {summary.is_on_chain && (
        <span className="ml-1 text-[10px]" title="On-chain Verified">✓</span>
      )}
    </button>
  );
}

// ─── STATE 2: Expanded Summary ──────────────────────────────
function ExpandedSummary({
  post,
}: {
  post: PostWithProvenance;
}) {
  const summary = useProvenance(post);
  const config = summary.has_coordination_flag 
    ? { label: "Coordinated", pillClasses: "bg-terracotta text-white-0 border-terracotta shadow-sm" }
    : summary.has_funding_disclosure
    ? { label: "Funded", pillClasses: "bg-terracotta/10 text-terracotta border-terracotta/20" }
    : sourceTypeConfig[summary.source_type];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="border border-[var(--border-subtle)] bg-neutral-50/50 dark:bg-neutral-800/30 p-3 mt-2 rounded-md">
        <div className="space-y-2.5">
          {/* Origin Type */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate uppercase tracking-wider">Origin</span>
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-medium border", config.pillClasses)}>
              {config.label}
            </span>
            {summary.is_on_chain && (
              <span className="ml-auto font-mono text-[9px] sm:text-[10px] text-teal font-bold uppercase tracking-wider border border-teal/20 bg-teal/5 px-1.5 sm:px-2 py-0.5 rounded truncate max-w-[80px] sm:max-w-none">
                <span className="sm:hidden">On-Chain</span>
                <span className="hidden sm:inline">On-Chain Trusted</span>
              </span>
            )}
            {summary.is_ipfs_stored && (
              <span className="font-mono text-[9px] sm:text-[10px] text-slate font-bold uppercase tracking-wider border border-paper-dark bg-paper-dark/10 px-1.5 sm:px-2 py-0.5 rounded truncate max-w-[60px] sm:max-w-none">
                <span className="sm:hidden">IPFS</span>
                <span className="hidden sm:inline">IPFS Permalink</span>
              </span>
            )}
          </div>

          {/* Source Label */}
          {summary.origin_label && (
            <div>
              <span className="font-mono text-xs text-slate uppercase tracking-wider">Source</span>
              <p className="font-sans text-sm text-ink mt-1 font-medium">
                {summary.origin_label}
                {post.origin_url && (
                  <a
                    href={post.origin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center text-teal hover:text-teal-dark"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon size={14} />
                  </a>
                )}
              </p>
            </div>
          )}

          {/* Affiliations */}
          {post.author_affiliations.length > 0 && (
            <div>
              <span className="font-mono text-xs text-slate uppercase tracking-wider">Affiliations</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {post.author_affiliations.map((aff) => (
                  <span
                    key={aff.id}
                    className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-mono text-[10px] font-medium border transition-colors",
                      aff.is_staked
                        ? "bg-teal/5 text-teal/80 border-teal/20"
                        : aff.is_challenged
                          ? "bg-violet/5 text-violet/80 border-violet/20"
                          : "bg-orange/5 text-orange/80 border-orange/20"
                    )}
                  >
                    {aff.organization_name}
                    <span className="opacity-60 text-[10px] uppercase">({aff.affiliation_type})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Funding Flag */}
          {summary.has_funding_disclosure && (
            <div className="flex items-start gap-2 bg-paper-dark/10 p-2 rounded-md border border-paper-dark/50">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange shrink-0 mt-0.5">Funded</span>
              <span className="font-sans text-sm text-ink font-medium">
                {post.funder_name || "Undisclosed"}
                {post.funding_staked && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-wider font-bold text-teal bg-teal/10 px-1.5 py-0.5 rounded border border-teal/20">✓ Staked Disclosure</span>
                )}
              </span>
            </div>
          )}

          {/* Coordination Flag */}
          {summary.has_coordination_flag && (
            <div className="bg-orange/10 border border-orange/30 rounded-md p-3">
              <div className="flex items-center gap-1.5">
                <Warning size={16} weight="fill" className="text-orange" />
                <span className="font-sans text-sm text-orange font-semibold">
                  Coordination detected ({Math.round((post.coordination_confidence || 0) * 100)}% confidence)
                </span>
              </div>
            </div>
          )}

          {/* Community Additions */}
          {post.provenance_updates && post.provenance_updates.length > 0 && (
            <div className="pt-2 border-t border-paper-dark">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs text-slate uppercase tracking-wider">
                  Community additions <span className="opacity-60 ml-1">({post.provenance_updates.length})</span>
                </span>
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", updateTypeConfig[post.provenance_updates[0].update_type].classes)}>
                  {updateTypeConfig[post.provenance_updates[0].update_type].label}
                </span>
              </div>
              <div className="space-y-1.5 mb-2">
                {post.provenance_updates.slice(0, 2).map((update) => (
                  <div key={update.id} className="text-[11px] font-sans p-2 rounded bg-paper-dark/10 border border-paper-dark/30">
                    <span className="font-semibold text-ink mr-1">{update.user?.display_name || "Unknown"}</span>
                    <span className={cn("px-1 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-white/50 border shadow-sm mr-2", update.status === 'pending' ? 'text-gold border-gold/30' : 'text-slate border-paper-dark')}>
                      {update.status === 'pending' ? 'Review' : updateTypeConfig[update.update_type].label}
                    </span>
                    <p className="text-slate line-clamp-1 mt-0.5">{update.body}</p>
                  </div>
                ))}
              </div>
              <Link
                href={`/post/${post.id}/provenance`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-teal hover:text-teal-dark transition-colors"
              >
                View all additions <ArrowRight size={12} />
              </Link>
            </div>
          )}

          {/* View Full Chain Link */}
          <Link
            href={`/post/${post.id}/provenance`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-teal hover:text-teal-dark transition-colors duration-150 pt-1"
          >
            View full chain history
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


function AffiliationCard({ affiliation }: { affiliation: DbAffiliation }) {
  return (
    <div className="bg-surface border border-paper-dark rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-editorial font-semibold text-base text-ink">{affiliation.organization_name}</h4>
        <span className={cn("px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border transition-colors",
          affiliation.is_staked ? "bg-sage/10 text-sage-dark border-teal/20" :
            affiliation.is_challenged ? "bg-gold/10 text-gold border-violet/20" : "bg-orange/10 text-orange border-orange/20"
        )}>
          {affiliation.is_staked ? "Active" : affiliation.is_challenged ? "Challenged" : "Verified"}
        </span>
      </div>
      <p className="font-sans text-xs font-medium text-slate uppercase tracking-wider">
        {affiliation.affiliation_type}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 pt-3 border-t border-paper-dark">
        <span className="font-mono text-[11px] text-slate truncate">
          <span className="text-slate/60 mr-1">IPFS:</span>
          {affiliation.ipfs_doc_hash?.slice(0, 16) || 'None'}…
        </span>
        <span className="font-mono text-[11px] text-slate truncate">
          <span className="text-slate/60 mr-1">Tx:</span>
          {affiliation.tx_hash?.slice(0, 10) || 'None'}…
        </span>
      </div>
    </div>
  );
}

import { DbAffiliation } from "@/types";

export function ProvenanceFullChain({ post }: { post: PostWithProvenance }) {
  const summary = useProvenance(post);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Eye size={24} className="text-teal" />
          <h2 className="font-editorial font-bold text-3xl tracking-tight text-ink">Source Chain</h2>
        </div>
        <p className="font-sans text-sm text-slate">
          Complete provenance data for this content. All declarations are on-chain and verifiable.
        </p>
      </div>

      {/* Origin Badge */}
      <div className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-paper-dark">
        <span className="font-mono text-xs uppercase tracking-wider font-semibold text-slate">Origin type</span>
        <span className={cn(
          "px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border",
          (summary.has_coordination_flag 
            ? { label: "Coordinated", pillClasses: "bg-orange text-paper border-orange shadow-sm" }
            : summary.has_funding_disclosure
            ? { label: "Funded", pillClasses: "bg-orange/10 text-orange border-orange/20" }
            : sourceTypeConfig[summary.source_type]).pillClasses
        )}>
          {(summary.has_coordination_flag 
            ? { label: "Coordinated", pillClasses: "bg-orange text-paper border-orange shadow-sm" }
            : summary.has_funding_disclosure
            ? { label: "Funded", pillClasses: "bg-orange/10 text-orange border-orange/20" }
            : sourceTypeConfig[summary.source_type]).label}
        </span>
      </div>

      {/* Author Affiliations */}
      {post.author_affiliations.length > 0 && (
        <div>
          <h3 className="font-sans font-semibold text-lg tracking-tight text-ink mb-4">Author Affiliations</h3>
          <div className="space-y-3">
            {post.author_affiliations.map((aff) => (
              <AffiliationCard key={aff.id} affiliation={aff} />
            ))}
          </div>
        </div>
      )}

      {/* Funding Disclosure */}
      {summary.has_funding_disclosure && (
        <div>
          <h3 className="font-sans font-semibold text-lg tracking-tight text-ink mb-4">Funding Disclosure</h3>
          <div className="bg-surface border border-paper-dark rounded-lg p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate mb-1 block">Type</span>
                <span className="font-sans font-medium text-sm text-ink">{post.funding_type}</span>
              </div>
              {post.funder_name && (
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate mb-1 block">Funder</span>
                  <span className="font-sans font-medium text-sm text-ink">{post.funder_name}</span>
                </div>
              )}
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate mb-1 block">Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border transition-colors",
                    post.funding_tx_hash ? "bg-teal/10 text-teal border-teal/20" : "bg-orange/10 text-orange border-orange/20"
                  )}>
                    {post.funding_tx_hash ? "On-chain Verified" : "Self-declared"}
                  </span>
                  {post.funding_staked && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border bg-teal/10 text-teal border-teal/20">
                      Staked
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coordination Flag */}
      {summary.has_coordination_flag && (
        <div>
          <h3 className="font-sans font-semibold text-lg tracking-tight text-ink mb-4">Coordination Flag</h3>
          <div className="bg-orange/5 border border-orange/20 rounded-lg p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Warning size={20} weight="fill" className="text-orange" />
              <span className="font-sans text-sm text-orange font-bold">
                Confidence: {Math.round((post.coordination_confidence || 0) * 100)}%
              </span>
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate">Status</span>
              <div className="font-sans text-sm font-medium text-ink p-3 bg-surface/50 rounded-md border border-paper-dark">
                {post.coordination_survived ? "Post survived challenge." : "Under active challenge."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ProvenanceTag Component ───────────────────────────
export function ProvenanceTag({
  post,
  expanded: controlledExpanded,
  onExpand,
}: ProvenanceTagProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = () => {
    if (onExpand) {
      onExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  return (
    <div>
      <CollapsedPill post={post} onClick={handleToggle} />
      <AnimatePresence>
        {isExpanded && (
          <ExpandedSummary post={post} />
        )}
      </AnimatePresence>
    </div>
  );
}
