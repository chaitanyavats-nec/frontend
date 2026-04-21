// ─── Database & Enriched Types ──────────────────────────────
export * from "./db";
import { PostWithProvenance } from "./db";

// ─── UI & Local Types ───────────────────────────────────────

// ─── Media ──────────────────────────────────────────────────
export interface MediaItem {
  url: string;
  type: "image" | "video" | "audio";
  altText: string;
  width?: number;
  height?: number;
}

// ─── Citation ───────────────────────────────────────────────
export interface Citation {
  url: string;
  title: string;
  sourceType: "academic" | "news" | "government" | "ngo" | "social" | "other";
  accessedAt: string;
}

// ─── Provenance ─────────────────────────────────────────────
export interface TransmissionNode {
  sourceUrl: string;
  sourceLabel: string;
  sourceType: "primary" | "secondary" | "tertiary" | "institutional" | "unverified";
  relationship: "supports" | "contradicts" | "contextualises" | "quotes";
  timestamp: string;
}

export interface AffiliationSummary {
  organizationName: string;
  affiliationType: string;
  stakeStatus: "active" | "challenged" | "slashed";
  ipfsDocHash: string;
  onChainAddress: string;
}

export interface FundingDisclosure {
  type: "independent" | "grant-funded" | "commissioned" | "institutional";
  funderName?: string;
  amount?: string;
  declared: boolean;
  staked: boolean;
}

export interface CoordinationFlag {
  detected: boolean;
  confidence: number;
  signals: string[];
  contestable: boolean;
  reportUrl: string;
  survivedCoordinatedAttack?: boolean;
}

export interface ProportionalityData {
  coverageVolume: number;
  baseRate: number;
  ratio: number;
}

export interface ProvenanceRecord {
  postCid: string;
  sourceType: "original" | "derived" | "republished" | "institutional";
  originUrl?: string;
  originLabel?: string;
  transmissionChain: TransmissionNode[];
  authorAffiliations: AffiliationSummary[];
  fundingDisclosure?: FundingDisclosure;
  coordinationFlag?: CoordinationFlag;
  proportionalityScore?: ProportionalityData;
  socialContext?: {
    sourceNode?: string;
  };
}

// ─── Post ───────────────────────────────────────────────────
export interface Post {
  id: string;
  authorDid: string;
  authorDisplayName: string;
  authorAvatarUrl?: string;
  content: string;
  media?: MediaItem[];
  citations?: Citation[];
  topicTags: string[];
  fundingDisclosure?: FundingDisclosure;
  provenance: ProvenanceRecord;
  replyCount: number;
  timestamp: string;
  signature: string;
}

// ─── User ───────────────────────────────────────────────────
export interface ReputationScore {
  total: number;
  moderationAccuracy: number;
  contentLongevity: number;
  disputeParticipation: number;
  accountAgeWeight: number;
  ladderLevel: "new" | "established" | "trusted" | "steward";
}

export interface UserProfile {
  id: string;
  did: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  affiliationCount: number;
  verifiedAffiliations: AffiliationSummary[];
  reputationScore: ReputationScore;
  followersCount: number;
  followingCount: number;
  joinedAt: string;
}

// ─── Governance ─────────────────────────────────────────────
export interface GovernanceProposal {
  id: string;
  proposerDid: string;
  title: string;
  body: string;
  type: "standard" | "constitutional";
  status: "open" | "passed" | "rejected" | "invalid";
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  deadline: string;
  constitutionalConflict: boolean;
  onChainAddress: string;
}

// ─── Moderation ─────────────────────────────────────────────
export interface ModerationCase {
  id: string;
  flaggedPost: PostWithProvenance;
  flagType:
    | "coordination"
    | "citation-misrepresentation"
    | "undisclosed-funding"
    | "hate-speech"
    | "fabricated";
  flaggerNote?: string;
  evidence: string[];
  phase: "commit" | "reveal" | "outcome";
  commitDeadline: string;
  revealDeadline: string;
  outcome?: "upheld" | "dismissed";
  assignedJurors: string[];
}

// ─── Topics & Feed ──────────────────────────────────────────
export interface Topic {
  id?: string;
  slug: string;
  displayName: string;
  domain: "politics" | "science" | "local" | "culture" | "technology" | "economics";
  subscriberCount: number;
  postCount: number;
}

export type FeedMode = "chronological" | "topics" | "curated" | "following";
