/**
 * src/lib/provenance-config.ts
 * 
 * Centralised configuration for the Five Post Types by Information Sourcing.
 */

import { Megaphone, FileText, Bank, CurrencyDollar, ShareNetwork } from "phosphor-react";

export const PROVENANCE_TYPES = {
  ORIGINAL: "original",
  DERIVED: "derived",
  INSTITUTIONAL: "institutional",
  FUNDED: "funded",
  AMPLIFIED: "amplified",
} as const;

export type ProvenanceType = typeof PROVENANCE_TYPES[keyof typeof PROVENANCE_TYPES];

export interface ProvenanceConfig {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: any; // React component
  description: string;
  shortDescription: string;
}

export const PROVENANCE_CONFIG: Record<string, ProvenanceConfig> = {
  original: {
    label: "Original",
    textColor: "text-[#4B634E]", // Sage green
    bgColor: "bg-[#F0F4F1]",
    borderColor: "border-[#4B634E]/20",
    icon: FileText,
    shortDescription: "Primary source reporting or analysis.",
    description: "The author is the primary source. The information originates with them — their own reporting, observation, analysis, or commentary.",
  },
  derived: {
    label: "Derived",
    textColor: "text-[#4A5568]", // Slate blue
    bgColor: "bg-[#EDF2F7]",
    borderColor: "border-[#4A5568]/20",
    icon: FileText,
    shortDescription: "Builds on or responds to an existing source.",
    description: "The post builds on, responds to, or summarises an existing source — a news article, a study, a government document, another post.",
  },
  institutional: {
    label: "Institutional",
    textColor: "text-[#B7791F]", // Gold
    bgColor: "bg-[#FEF9E7]",
    borderColor: "border-[#B7791F]/20",
    icon: Bank,
    shortDescription: "Content from or tied to an institution.",
    description: "The content originates from or is directly tied to an institution — a media organisation, a think tank, a government body, an NGO, a university.",
  },
  funded: {
    label: "Funded",
    textColor: "text-[#C53030]", // Terracotta
    bgColor: "bg-[#FFF5F5]",
    borderColor: "border-[#C53030]/20",
    icon: CurrencyDollar,
    shortDescription: "Produced with financial support.",
    description: "The content was produced with financial support from a named funder — a grant, a commission, a sponsorship, or an employment relationship.",
  },
  amplified: {
    label: "Amplified",
    textColor: "text-[#718096]", // Slate
    bgColor: "bg-[#F7FAFC]",
    borderColor: "border-[#718096]/20",
    icon: ShareNetwork,
    shortDescription: "Primary purpose is increasing reach.",
    description: "The post is primarily an act of amplification — a repost, a quote-post, or a post whose primary purpose is to increase reach.",
  },
};

export function getHealthColor(score: number): string {
  if (score >= 80) return "#2D9E64"; // Green
  if (score >= 40) return "#D69E2E"; // Amber
  return "#E53E3E"; // Red
}
