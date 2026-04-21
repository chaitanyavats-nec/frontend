/**
 * src/lib/normalise.ts
 * 
 * Normalization utilities to transform raw Supabase join results into
 * enriched application types with blockchain-readiness metadata.
 */

import { PostWithProvenance, UserWithReputation } from "@/types";

/**
 * Normalises a raw post object from Supabase.
 * Uses 'any' because Supabase deep join types are complex and unreliable
 * for inferred results from query strings.
 */
export function normalisePost(raw: any): PostWithProvenance {
  // Handle legacy mock data format (flat author fields)
  let author = raw.author;
  if (!author && raw.authorDid) {
    author = {
      id: raw.authorId || raw.authorDid,
      display_name: raw.authorDisplayName,
      did: raw.authorDid,
      avatar_url: raw.authorAvatarUrl || null,
      ladder_level: raw.reputationScore?.ladderLevel || "new",
      reputation_total: raw.reputationScore?.total || 0,
      affiliations: raw.verifiedAffiliations || [],
    };
  }

  // Handle topic tags alignment
  const topic_tags = raw.topic_tags || (raw.topicId ? [raw.topicId] : []);

  return {
    ...raw,
    author,
    topic_tags,
    // Surfacing affiliations as requested
    author_affiliations: author?.affiliations || [],
    // Derived blockchain readiness metadata
    _provenance_verified: raw.provenance_tx_hash ? true : (raw.provenance ? true : false),
    _content_permanent: raw.ipfs_cid ? true : false,
    _funding_verified: raw.funding_tx_hash ? true : false,
  };
}

/**
 * Normalises a raw profile object from Supabase.
 */
export function normaliseProfile(raw: any): UserWithReputation {
  // Handle legacy mock data format (camelCase)
  const display_name = raw.display_name || raw.displayName;
  const avatar_url = raw.avatar_url || raw.avatarUrl || null;
  const created_at = raw.created_at || raw.joinedAt || new Date().toISOString();
  
  // Mapping nested reputation score to flat fields if needed
  const ladder_level = raw.ladder_level || raw.reputationScore?.ladderLevel || "new";
  const reputation_total = raw.reputation_total ?? (raw.reputationScore?.total || 0);

  return {
    ...raw,
    display_name,
    avatar_url,
    created_at,
    ladder_level,
    reputation_total,
    // Derived blockchain readiness metadata
    _identity_anchored: raw.did !== null,
    _reputation_on_chain: raw.reputation_contract_address !== null,
  };
}
