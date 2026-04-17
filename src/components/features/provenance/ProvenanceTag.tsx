"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Warning, Eye, Link as LinkIcon } from "phosphor-react";
import { cn } from "@/lib/utils";
import type { ProvenanceRecord, TransmissionNode, AffiliationSummary } from "@/types";

interface ProvenanceTagProps {
  provenance: ProvenanceRecord;
  postId: string;
  expanded?: boolean;
  onExpand?: () => void;
}

const sourceTypeConfig = {
  original: {
    label: "Original",
    pillClasses: "bg-teal-light text-teal-dark border-teal-light",
  },
  derived: {
    label: "Derived",
    pillClasses: "bg-teal-light text-teal-dark border-teal-light",
  },
  republished: {
    label: "Republished",
    pillClasses: "bg-teal-light text-teal-dark border-teal-light",
  },
  institutional: {
    label: "Institutional",
    pillClasses: "bg-violet/10 text-violet border-violet/20",
  },
} as const;

function getSourceConfig(provenance: ProvenanceRecord) {
  // Check if funded
  if (provenance.fundingDisclosure && provenance.fundingDisclosure.type !== "independent") {
    return {
      label: "Funded",
      pillClasses: "bg-orange/10 text-orange border-orange/20",
    };
  }
  // Check if coordinated
  if (provenance.coordinationFlag?.detected) {
    return {
      label: "Coordinated",
      pillClasses: "bg-orange text-paper border-orange shadow-sm",
    };
  }
  return sourceTypeConfig[provenance.sourceType];
}

// ─── STATE 1: Collapsed Pill ────────────────────────────────
function CollapsedPill({
  provenance,
  onClick,
}: {
  provenance: ProvenanceRecord;
  onClick: () => void;
}) {
  const config = getSourceConfig(provenance);
  const affiliationName = provenance.authorAffiliations[0]?.organizationName;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-xs transition-all duration-150 hover:opacity-80",
        config.pillClasses
      )}
      aria-label={`Source: ${config.label}${affiliationName ? `, ${affiliationName}` : ""}. Click to expand.`}
    >
      {provenance.coordinationFlag?.detected && (
        <Warning size={14} weight="fill" />
      )}
      <span className="font-medium">{config.label}</span>
      {affiliationName && (
        <>
          <span className="opacity-50">·</span>
          <span className="max-w-[120px] truncate">{affiliationName}</span>
        </>
      )}
    </button>
  );
}

// ─── STATE 2: Expanded Summary ──────────────────────────────
function ExpandedSummary({
  provenance,
  postId,
}: {
  provenance: ProvenanceRecord;
  postId: string;
}) {
  const config = getSourceConfig(provenance);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="border-l-2 border-teal bg-surface p-4 mt-3 rounded-r-lg shadow-md border-y border-r border-paper-dark">
        <div className="space-y-3">
          {/* Origin Type */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate uppercase tracking-wider">Origin</span>
            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-medium border", config.pillClasses)}>
              {config.label}
            </span>
          </div>

          {/* Primary Source */}
          {provenance.originLabel && (
            <div>
              <span className="font-mono text-xs text-slate uppercase tracking-wider">Source</span>
              <p className="font-sans text-sm text-ink mt-1 font-medium">
                {provenance.originLabel}
                {provenance.originUrl && (
                  <a
                    href={provenance.originUrl}
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
          {provenance.authorAffiliations.length > 0 && (
            <div>
              <span className="font-mono text-xs text-slate uppercase tracking-wider">Affiliations</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {provenance.authorAffiliations.map((aff) => (
                  <span
                    key={aff.onChainAddress}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-mono text-[11px] font-medium border transition-colors",
                      aff.stakeStatus === "active"
                        ? "bg-teal/10 text-teal-dark border-teal/20"
                        : aff.stakeStatus === "challenged"
                          ? "bg-violet/10 text-violet border-violet/20"
                          : "bg-orange/10 text-orange border-orange/20"
                    )}
                  >
                    {aff.organizationName}
                    <span className="opacity-60 text-[10px] uppercase">({aff.affiliationType})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Funding Flag */}
          {provenance.fundingDisclosure && provenance.fundingDisclosure.type !== "independent" && (
            <div className="flex items-start gap-2 bg-paper-dark/20 p-2.5 rounded-md border border-paper-dark">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-orange shrink-0 mt-0.5">Funded</span>
              <span className="font-sans text-sm text-ink font-medium">
                {provenance.fundingDisclosure.funderName || "Undisclosed"}
                {provenance.fundingDisclosure.amount && (
                  <span className="text-slate ml-1.5 font-normal">({provenance.fundingDisclosure.amount})</span>
                )}
                {provenance.fundingDisclosure.staked && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-wider font-bold text-teal bg-teal/10 px-1.5 py-0.5 rounded border border-teal/20">✓ Staked</span>
                )}
              </span>
            </div>
          )}

          {/* Coordination Flag */}
          {provenance.coordinationFlag?.detected && (
            <div className="bg-orange/10 border border-orange/30 rounded-md p-3">
              <div className="flex items-center gap-1.5">
                <Warning size={16} weight="fill" className="text-orange" />
                <span className="font-sans text-sm text-orange font-semibold">
                  Coordination detected ({Math.round(provenance.coordinationFlag.confidence * 100)}% confidence)
                </span>
              </div>
              <p className="font-sans text-xs text-slate mt-1.5 leading-relaxed">
                {provenance.coordinationFlag.signals[0]}
              </p>
            </div>
          )}

          {/* View Full Chain Link */}
          <Link
            href={`/post/${postId}/provenance`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-teal hover:text-teal-dark transition-colors duration-150 pt-1"
          >
            View full chain
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── STATE 3: Full Chain View ───────────────────────────────
function TransmissionNodeCard({ node }: { node: TransmissionNode }) {
  const typeColors: Record<string, string> = {
    primary: "bg-teal text-paper",
    secondary: "bg-teal/10 text-teal-dark border-teal/20 border",
    tertiary: "bg-surface text-slate border-paper-dark border",
    institutional: "bg-violet/10 text-violet border-violet/20 border",
    unverified: "bg-orange/10 text-orange border-orange/20 border",
  };

  const relationshipColors: Record<string, string> = {
    supports: "text-teal",
    contradicts: "text-orange",
    contextualises: "text-violet",
    quotes: "text-ink",
  };

  return (
    <div className="relative pl-8">
      {/* Timeline dot and line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-paper-dark" />
      <div className="absolute left-[9px] top-4 w-2.5 h-2.5 rounded-full bg-teal border-2 border-paper" />

      <div className="pb-6">
        <div className="bg-surface border border-paper-dark rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={cn("px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider", typeColors[node.sourceType])}>
              {node.sourceType}
            </span>
            <span className={cn("font-medium text-xs font-sans", relationshipColors[node.relationship])}>
              {node.relationship}
            </span>
          </div>
          <p className="font-sans font-medium text-sm text-ink mt-2">{node.sourceLabel}</p>
          <div className="flex items-center gap-2 mt-2">
            <a
              href={node.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-teal hover:text-teal-dark underline truncate max-w-[300px]"
            >
              {node.sourceUrl}
            </a>
          </div>
          <time className="font-mono text-xs text-slate mt-2 block">
            {new Date(node.timestamp).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </div>
    </div>
  );
}

function AffiliationCard({ affiliation }: { affiliation: AffiliationSummary }) {
  const statusColors = {
    active: "bg-sage/10 text-sage-dark",
    challenged: "bg-gold/10 text-gold",
    slashed: "bg-terracotta/10 text-terracotta",
  };

  return (
    <div className="bg-surface border border-paper-dark rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-editorial font-semibold text-base text-ink">{affiliation.organizationName}</h4>
        <span className={cn("px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border transition-colors",
          affiliation.stakeStatus === "active" ? "border-teal/20" :
            affiliation.stakeStatus === "challenged" ? "border-violet/20" : "border-orange/20",
          statusColors[affiliation.stakeStatus]
        )}>
          {affiliation.stakeStatus}
        </span>
      </div>
      <p className="font-sans text-xs font-medium text-slate uppercase tracking-wider">
        {affiliation.affiliationType}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 pt-3 border-t border-paper-dark">
        <span className="font-mono text-[11px] text-slate truncate">
          <span className="text-slate/60 mr-1">IPFS:</span>
          {affiliation.ipfsDocHash.slice(0, 16)}…
        </span>
        <span className="font-mono text-[11px] text-slate truncate">
          <span className="text-slate/60 mr-1">Chain:</span>
          {affiliation.onChainAddress.slice(0, 10)}…
        </span>
      </div>
    </div>
  );
}

export function ProvenanceFullChain({ provenance }: { provenance: ProvenanceRecord }) {
  const [showProportionality, setShowProportionality] = useState(false);

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
          getSourceConfig(provenance).pillClasses
        )}>
          {getSourceConfig(provenance).label}
        </span>
      </div>

      {/* Transmission Chain */}
      {provenance.transmissionChain.length > 0 && (
        <div>
          <h3 className="font-sans font-semibold text-lg tracking-tight text-ink mb-5">Transmission Chain</h3>
          <div className="relative">
            {provenance.transmissionChain.map((node, i) => (
              <TransmissionNodeCard key={`${node.sourceUrl}-${i}`} node={node} />
            ))}
          </div>
        </div>
      )}

      {/* Author Affiliations */}
      {provenance.authorAffiliations.length > 0 && (
        <div>
          <h3 className="font-sans font-semibold text-lg tracking-tight text-ink mb-4">Author Affiliations</h3>
          <div className="space-y-3">
            {provenance.authorAffiliations.map((aff) => (
              <AffiliationCard key={aff.onChainAddress} affiliation={aff} />
            ))}
          </div>
        </div>
      )}

      {/* Funding Disclosure */}
      {provenance.fundingDisclosure && provenance.fundingDisclosure.type !== "independent" && (
        <div>
          <h3 className="font-sans font-semibold text-lg tracking-tight text-ink mb-4">Funding Disclosure</h3>
          <div className="bg-surface border border-paper-dark rounded-lg p-5 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate mb-1 block">Type</span>
                <span className="font-sans font-medium text-sm text-ink">{provenance.fundingDisclosure.type}</span>
              </div>
              {provenance.fundingDisclosure.funderName && (
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate mb-1 block">Funder</span>
                  <span className="font-sans font-medium text-sm text-ink">{provenance.fundingDisclosure.funderName}</span>
                </div>
              )}
              {provenance.fundingDisclosure.amount && (
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate mb-1 block">Amount</span>
                  <span className="font-sans font-medium text-sm text-ink">{provenance.fundingDisclosure.amount}</span>
                </div>
              )}
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate mb-1 block">Status</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border transition-colors",
                    provenance.fundingDisclosure.declared ? "bg-teal/10 text-teal border-teal/20" : "bg-orange/10 text-orange border-orange/20"
                  )}>
                    {provenance.fundingDisclosure.declared ? "Declared" : "Undeclared"}
                  </span>
                  {provenance.fundingDisclosure.staked && (
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
      {provenance.coordinationFlag?.detected && (
        <div>
          <h3 className="font-sans font-semibold text-lg tracking-tight text-ink mb-4">Coordination Flag</h3>
          <div className="bg-orange/5 border border-orange/20 rounded-lg p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <Warning size={20} weight="fill" className="text-orange" />
              <span className="font-sans text-sm text-orange font-bold">
                Confidence: {Math.round(provenance.coordinationFlag.confidence * 100)}%
              </span>
              {provenance.coordinationFlag.contestable && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-violet/10 text-violet border border-violet/20 ml-auto shadow-sm">
                  Contestable
                </span>
              )}
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate">Evidence</span>
              <ul className="space-y-1.5 bg-surface/50 rounded-md p-3 border border-paper-dark">
                {provenance.coordinationFlag.signals.map((signal, i) => (
                  <li key={i} className="font-sans text-sm font-medium text-ink flex items-start gap-2.5">
                    <span className="text-terracotta mt-[2px] shrink-0 font-bold">•</span>
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={provenance.coordinationFlag.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-sage hover:text-sage-dark mt-4"
            >
              View public report (JSON)
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      )}

      {/* Proportionality Toggle */}
      {provenance.proportionalityScore && (
        <div>
          <button
            onClick={() => setShowProportionality(!showProportionality)}
            className="flex items-center gap-2 font-sans font-medium text-xs text-sage hover:text-sage-dark transition-colors bg-sage/10 hover:bg-sage/20 px-3 py-1.5 rounded-lg"
          >
            <Eye size={16} />
            {showProportionality ? "Hide" : "Show"} proportionality overlay
          </button>
          <AnimatePresence>
            {showProportionality && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="bg-surface border border-paper-dark rounded-lg p-5 shadow-sm">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate block mb-1">Coverage</span>
                      <span className="font-sans font-bold text-xl tracking-tight text-ink">
                        {provenance.proportionalityScore.coverageVolume}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate block mb-1">Base Rate</span>
                      <span className="font-sans font-bold text-xl tracking-tight text-ink">
                        {provenance.proportionalityScore.baseRate}
                      </span>
                    </div>
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate block mb-1">Ratio</span>
                      <span className="font-sans font-bold text-xl tracking-tight text-ink">
                        {provenance.proportionalityScore.ratio.toFixed(2)}x
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── Main ProvenanceTag Component ───────────────────────────
export function ProvenanceTag({
  provenance,
  postId,
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
      <CollapsedPill provenance={provenance} onClick={handleToggle} />
      <AnimatePresence>
        {isExpanded && (
          <ExpandedSummary provenance={provenance} postId={postId} />
        )}
      </AnimatePresence>
    </div>
  );
}
