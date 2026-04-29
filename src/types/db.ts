/**
 * src/types/db.ts
 * 
 * TypeScript interfaces mirroring the Supabase schema and enriched types
 * for the application's query layer.
 */

// ─── Raw Table Interfaces (Supabase Schema) ───────────────────

export interface DbProfile {
  id: string; // UUID (FK → auth.users)
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  did: string | null;
  public_key: string | null;
  humanity_verified: boolean;
  reputation_contract_address: string | null;
  reputation_total: number;
  reputation_moderation_accuracy: number;
  reputation_content_longevity: number;
  reputation_dispute_participation: number;
  reputation_account_age_weight: number;
  ladder_level: "new" | "contributor" | "trusted" | "established" | "authority" | "elder";
  created_at: string;
}

export interface DbPost {
  id: string;
  author_id: string; // (FK → profiles.id)
  parent_id: string | null;
  root_id: string | null;
  body: string;
  media_urls: string[] | null;
  ipfs_cid: string | null;
  content_signature: string | null;
  source_type: "original" | "derived" | "institutional" | "funded" | "amplified" | "republished";
  origin_url: string | null;
  origin_label: string | null;
  provenance_tx_hash: string | null;
  funding_type: "independent" | "grant-funded" | "commissioned" | "institutional";
  funder_name: string | null;
  funding_staked: boolean;
  funding_tx_hash: string | null;
  coordination_flagged: boolean;
  coordination_confidence: number | null;
  coordination_survived: boolean;
  reply_count: number;
  topic_tags: string[] | null;
  poll_data: { 
    question: string;
    options: string[];
    votes: number[];
  } | null;
  location_data: {
    name: string;
    lat?: number;
    lng?: number;
  } | null;
  type: "post" | "comment";
  quoted_post_id: string | null;
  is_published: boolean;
  trust_score: number;
  context_completeness: number;
  has_disputed_framing: boolean;
  created_at: string;
}

export interface DbAffiliation {
  id: string;
  user_id: string; // (FK → profiles.id)
  organization_name: string;
  affiliation_type: string;
  role: string | null;
  public_statement: string | null;
  period_start: string | null;
  period_end: string | null;
  is_current: boolean;
  ipfs_doc_hash: string | null;
  stake_amount: number | null;
  tx_hash: string | null;
  is_staked: boolean;
  is_challenged: boolean;
  is_slashed: boolean;
  created_at: string;
}

export interface DbCitation {
  id: string;
  post_id: string; // (FK → posts.id)
  url: string;
  title: string;
  source_type: "academic" | "news" | "government" | "ngo" | "social" | "other";
  accessed_at: string;
}

export interface DbModerationFlag {
  id: string;
  post_id: string; // (FK → posts.id)
  flagger_id: string; // (FK → profiles.id)
  flag_type: string;
  note: string | null;
  flagger_weight: number;
  status: string;
  onchain_case_id: string | null;
  created_at: string;
}

export interface DbJuryCase {
  id: string;
  flag_id: string; // (FK → moderation_flags.id)
  phase: "commit" | "reveal" | "outcome";
  outcome: "upheld" | "dismissed" | null;
  commit_deadline: string;
  reveal_deadline: string;
  onchain_tx_hash: string | null;
  votes_upheld: number;
  votes_dismissed: number;
  jury_participants: { user_id: string; vote: "upheld" | "dismissed" }[];
  created_at: string;
}

export interface DbGovernanceProposal {
  id: string;
  proposer_id: string; // (FK → profiles.id)
  title: string;
  body: string;
  proposal_type: "standard" | "constitutional";
  status: string;
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  deadline: string;
  constitutional_conflict: boolean;
  onchain_proposal_id: string | null;
  onchain_tx_hash: string | null;
  created_at: string;
}

export interface DbGovernanceVote {
  id: string;
  proposal_id: string;
  user_id: string;
  vote_type: "for" | "against" | "abstain";
  reputation_level: "new" | "contributor" | "trusted" | "established" | "authority" | "elder";
  weight: number;
  created_at: string;
}

// ─── Enriched Application Types ──────────────────────────────

export type PostWithAuthor = DbPost & {
  author: Pick<
    DbProfile,
    | "id"
    | "display_name"
    | "avatar_url"
    | "did"
    | "bio"
    | "ladder_level"
    | "reputation_total"
    | "reputation_moderation_accuracy"
    | "reputation_content_longevity"
    | "reputation_dispute_participation"
    | "reputation_account_age_weight"
  > & {
    affiliations: DbAffiliation[];
  };
  // Blockchain readiness hints (derived)
  _provenance_verified: boolean;
  _content_permanent: boolean;
  _funding_verified: boolean;
};

export type PostWithProvenance = PostWithAuthor & {
  citations: DbCitation[];
  author_affiliations: DbAffiliation[]; // Same as author.affiliations, surfaced as requested
  provenance_updates: (DbProvenanceUpdate & {
    user: Pick<DbProfile, "id" | "display_name" | "avatar_url" | "did" | "ladder_level" | "reputation_total">
  })[];
  quoted_post?: PostWithAuthor;
};

export interface DbProvenanceUpdate {
  id: string;
  post_id: string;
  user_id: string;
  update_type: "added_context" | "incomplete_provenance" | "misleading_framing" | "undisclosed_funding";
  body: string;
  evidence_url: string | null;
  evidence_text: string | null;
  status: "pending" | "accepted" | "disputed" | "dismissed";
  created_at: string;
}

export type UserWithReputation = DbProfile & {
  affiliations: DbAffiliation[];
  post_count: number;
  follower_count: number;
  following_count: number;
  // Blockchain readiness hints (derived)
  _identity_anchored: boolean;
  _reputation_on_chain: boolean;
  voice_weight?: number;
};

export interface ProvenanceSummary {
  source_type: DbPost["source_type"];
  origin_label: string | null;
  has_funding_disclosure: boolean;
  has_coordination_flag: boolean;
  coordination_survived: boolean;
  affiliation_count: number;
  primary_affiliation: string | null;
  is_on_chain: boolean;
  is_ipfs_stored: boolean;
  health_score: number;
}

// ─── Supabase Raw Join types (for normalization layer) ────────

export type RawPostSelect = DbPost & {
  author: (DbProfile & { affiliations: DbAffiliation[] }) | null;
  citations: DbCitation[];
  provenance_updates: (DbProvenanceUpdate & { user: DbProfile })[];
  moderation_flags?: DbModerationFlag[];
  quoted_post?: (DbPost & { author: DbProfile & { affiliations: DbAffiliation[] } }) | null;
};

export type RawProfileSelect = DbProfile & {
  affiliations: DbAffiliation[];
  post_count?: [{ count: number }];
  follower_count?: [{ count: number }];
  following_count?: [{ count: number }];
  voice_weight?: number;
};

export type GovernanceProposalWithAuthor = DbGovernanceProposal & {
  proposer: Pick<DbProfile, "id" | "display_name" | "avatar_url" | "did">;
};
