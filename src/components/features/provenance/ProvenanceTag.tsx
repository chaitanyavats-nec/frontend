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
    pillClasses: "bg-sage-light text-sage-dark border-sage-light",
  },
  derived: {
    label: "Derived",
    pillClasses: "bg-sage-light text-sage-dark border-sage-light",
  },
  republished: {
    label: "Republished",
    pillClasses: "bg-sage-light text-sage-dark border-sage-light",
  },
  institutional: {
    label: "Institutional",
    pillClasses: "bg-gold-light text-gold border-gold-light",
  },
} as const;

function getSourceConfig(provenance: ProvenanceRecord) {
  // Check if funded
  if (provenance.fundingDisclosure && provenance.fundingDisclosure.type !== "independent") {
    return {
      label: "Funded",
      pillClasses: "bg-terracotta-light text-terracotta border-terracotta-light",
    };
  }
  // Check if coordinated
  if (provenance.coordinationFlag?.detected) {
    return {
      label: "Coordinated",
      pillClasses: "bg-terracotta text-paper border-terracotta",
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
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-mono text-xs transition-all duration-150 hover:opacity-80",
        config.pillClasses
      )}
      aria-label={`Source: ${config.label}${affiliationName ? `, ${affiliationName}` : ""}. Click to expand.`}
    >
      {provenance.coordinationFlag?.detected && (
        <Warning size={12} weight="fill" />
      )}
      <span>{config.label}</span>
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
      <div className="border-l-2 border-sage bg-paper-dark/60 p-3 mt-2 rounded-r-md">
        <div className="space-y-2">
          {/* Origin Type */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate">Origin</span>
            <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono border", config.pillClasses)}>
              {config.label}
            </span>
          </div>

          {/* Primary Source */}
          {provenance.originLabel && (
            <div>
              <span className="font-mono text-xs text-slate">Source</span>
              <p className="font-editorial text-sm text-ink mt-0.5">
                {provenance.originLabel}
                {provenance.originUrl && (
                  <a
                    href={provenance.originUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center text-sage hover:text-sage-dark"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon size={12} />
                  </a>
                )}
              </p>
            </div>
          )}

          {/* Affiliations */}
          {provenance.authorAffiliations.length > 0 && (
            <div>
              <span className="font-mono text-xs text-slate">Affiliations</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {provenance.authorAffiliations.map((aff) => (
                  <span
                    key={aff.onChainAddress}
                    className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-xs border",
                      aff.stakeStatus === "active"
                        ? "bg-sage-light/50 text-sage-dark border-sage-light"
                        : aff.stakeStatus === "challenged"
                        ? "bg-gold-light/50 text-gold border-gold-light"
                        : "bg-terracotta-light/50 text-terracotta border-terracotta-light"
                    )}
                  >
                    {aff.organizationName}
                    <span className="opacity-50">({aff.affiliationType})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Funding Flag */}
          {provenance.fundingDisclosure && provenance.fundingDisclosure.type !== "independent" && (
            <div className="flex items-start gap-2">
              <span className="font-mono text-xs text-terracotta shrink-0">Funded</span>
              <span className="font-editorial text-sm text-ink">
                {provenance.fundingDisclosure.funderName || "Undisclosed"}
                {provenance.fundingDisclosure.amount && (
                  <span className="text-slate ml-1">({provenance.fundingDisclosure.amount})</span>
                )}
                {provenance.fundingDisclosure.staked && (
                  <span className="ml-1 font-mono text-xs text-sage">✓ staked</span>
                )}
              </span>
            </div>
          )}

          {/* Coordination Flag */}
          {provenance.coordinationFlag?.detected && (
            <div className="bg-terracotta/10 border border-terracotta/30 rounded-md p-2">
              <div className="flex items-center gap-1.5">
                <Warning size={14} weight="fill" className="text-terracotta" />
                <span className="font-mono text-xs text-terracotta font-medium">
                  Coordination detected ({Math.round(provenance.coordinationFlag.confidence * 100)}% confidence)
                </span>
              </div>
              <p className="font-editorial text-xs text-slate mt-1">
                {provenance.coordinationFlag.signals[0]}
              </p>
            </div>
          )}

          {/* View Full Chain Link */}
          <Link
            href={`/post/${postId}/provenance`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-mono text-xs text-sage hover:text-sage-dark transition-colors duration-150 mt-1"
          >
            View full chain
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── STATE 3: Full Chain View ───────────────────────────────
function TransmissionNodeCard({ node }: { node: TransmissionNode }) {
  const typeColors: Record<string, string> = {
    primary: "bg-sage text-paper",
    secondary: "bg-sage-light text-sage-dark",
    tertiary: "bg-paper-dark text-slate",
    institutional: "bg-gold-light text-gold",
    unverified: "bg-terracotta-light text-terracotta",
  };

  const relationshipColors: Record<string, string> = {
    supports: "text-sage",
    contradicts: "text-terracotta",
    contextualises: "text-gold",
    quotes: "text-ink",
  };

  return (
    <div className="relative pl-8">
      {/* Timeline dot and line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-paper-dark" />
      <div className="absolute left-[9px] top-3 w-2.5 h-2.5 rounded-full bg-sage border-2 border-paper" />

      <div className="pb-6">
        <div className="bg-paper border border-paper-dark rounded-md p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("px-1.5 py-0.5 rounded text-xs font-mono", typeColors[node.sourceType])}>
              {node.sourceType}
            </span>
            <span className={cn("font-mono text-xs", relationshipColors[node.relationship])}>
              {node.relationship}
            </span>
          </div>
          <p className="font-editorial text-sm text-ink mt-1.5">{node.sourceLabel}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <a
              href={node.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-sage hover:text-sage-dark underline truncate max-w-[300px]"
            >
              {node.sourceUrl}
            </a>
          </div>
          <time className="font-mono text-xs text-slate-light mt-1 block">
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
    active: "bg-sage-light text-sage-dark",
    challenged: "bg-gold-light text-gold",
    slashed: "bg-terracotta-light text-terracotta",
  };

  return (
    <div className="bg-paper border border-paper-dark rounded-md p-3">
      <div className="flex items-center justify-between">
        <h4 className="font-mono text-sm text-ink">{affiliation.organizationName}</h4>
        <span className={cn("px-1.5 py-0.5 rounded text-xs font-mono", statusColors[affiliation.stakeStatus])}>
          {affiliation.stakeStatus}
        </span>
      </div>
      <p className="font-mono text-xs text-slate mt-1">
        {affiliation.affiliationType}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <span className="font-mono text-xs text-slate-light truncate">
          IPFS: {affiliation.ipfsDocHash.slice(0, 16)}…
        </span>
        <span className="font-mono text-xs text-slate-light truncate">
          Chain: {affiliation.onChainAddress.slice(0, 10)}…
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
          <Eye size={20} className="text-sage" />
          <h2 className="font-display text-xl text-ink">Source Chain</h2>
        </div>
        <p className="font-editorial text-sm text-slate">
          Complete provenance data for this content. All declarations are on-chain and verifiable.
        </p>
      </div>

      {/* Origin Badge */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-slate">Origin type:</span>
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-mono border",
          getSourceConfig(provenance).pillClasses
        )}>
          {getSourceConfig(provenance).label}
        </span>
      </div>

      {/* Transmission Chain */}
      {provenance.transmissionChain.length > 0 && (
        <div>
          <h3 className="font-mono text-sm text-ink mb-4">Transmission Chain</h3>
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
          <h3 className="font-mono text-sm text-ink mb-3">Author Affiliations</h3>
          <div className="space-y-2">
            {provenance.authorAffiliations.map((aff) => (
              <AffiliationCard key={aff.onChainAddress} affiliation={aff} />
            ))}
          </div>
        </div>
      )}

      {/* Funding Disclosure */}
      {provenance.fundingDisclosure && provenance.fundingDisclosure.type !== "independent" && (
        <div>
          <h3 className="font-mono text-sm text-ink mb-3">Funding Disclosure</h3>
          <div className="bg-paper border border-paper-dark rounded-md p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-mono text-xs text-slate block">Type</span>
                <span className="font-editorial text-sm text-ink">{provenance.fundingDisclosure.type}</span>
              </div>
              {provenance.fundingDisclosure.funderName && (
                <div>
                  <span className="font-mono text-xs text-slate block">Funder</span>
                  <span className="font-editorial text-sm text-ink">{provenance.fundingDisclosure.funderName}</span>
                </div>
              )}
              {provenance.fundingDisclosure.amount && (
                <div>
                  <span className="font-mono text-xs text-slate block">Amount</span>
                  <span className="font-editorial text-sm text-ink">{provenance.fundingDisclosure.amount}</span>
                </div>
              )}
              <div>
                <span className="font-mono text-xs text-slate block">Status</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-xs font-mono",
                    provenance.fundingDisclosure.declared ? "bg-sage-light text-sage-dark" : "bg-terracotta-light text-terracotta"
                  )}>
                    {provenance.fundingDisclosure.declared ? "Declared" : "Undeclared"}
                  </span>
                  {provenance.fundingDisclosure.staked && (
                    <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-sage-light text-sage-dark">
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
          <h3 className="font-mono text-sm text-ink mb-3">Coordination Flag</h3>
          <div className="bg-terracotta/5 border border-terracotta/30 rounded-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <Warning size={18} weight="fill" className="text-terracotta" />
              <span className="font-mono text-sm text-terracotta font-medium">
                Confidence: {Math.round(provenance.coordinationFlag.confidence * 100)}%
              </span>
              {provenance.coordinationFlag.contestable && (
                <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-gold-light text-gold">
                  Contestable
                </span>
              )}
            </div>
            <div className="space-y-1.5">
              <span className="font-mono text-xs text-slate">Evidence</span>
              <ul className="space-y-1">
                {provenance.coordinationFlag.signals.map((signal, i) => (
                  <li key={i} className="font-editorial text-sm text-ink flex items-start gap-2">
                    <span className="text-terracotta mt-1 shrink-0">•</span>
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={provenance.coordinationFlag.reportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-sage hover:text-sage-dark mt-3"
            >
              View public report (JSON)
              <ArrowRight size={12} />
            </a>
          </div>
        </div>
      )}

      {/* Proportionality Toggle */}
      {provenance.proportionalityScore && (
        <div>
          <button
            onClick={() => setShowProportionality(!showProportionality)}
            className="flex items-center gap-2 font-mono text-xs text-sage hover:text-sage-dark transition-colors"
          >
            <Eye size={14} />
            {showProportionality ? "Hide" : "Show"} proportionality overlay
          </button>
          <AnimatePresence>
            {showProportionality && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 bg-paper border border-paper-dark rounded-md p-3"
              >
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <span className="font-mono text-xs text-slate block">Coverage</span>
                    <span className="font-mono text-lg text-ink">
                      {provenance.proportionalityScore.coverageVolume}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate block">Base Rate</span>
                    <span className="font-mono text-lg text-ink">
                      {provenance.proportionalityScore.baseRate}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate block">Ratio</span>
                    <span className="font-mono text-lg text-ink">
                      {provenance.proportionalityScore.ratio.toFixed(2)}x
                    </span>
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
