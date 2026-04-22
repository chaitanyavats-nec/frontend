/**
 * src/lib/normalise.ts
 * 
 * Normalization utilities to transform raw Supabase join results into
 * enriched application types with blockchain-readiness metadata.
 */

import { PostWithProvenance, UserWithReputation, RawPostSelect, RawProfileSelect } from "@/types";

type LegacyPost = {
  authorDid?: string;
  authorId?: string;
  authorDisplayName?: string;
  authorAvatarUrl?: string | null;
  reputationScore?: {
    ladderLevel: string;
    total: number;
  };
  verifiedAffiliations?: string[];
  topicId?: string;
  provenance?: boolean;
};

type LegacyProfile = {
  displayName?: string;
  avatarUrl?: string | null;
  joinedAt?: string;
  reputationScore?: {
    ladderLevel: string;
    total: number;
  };
};

/**
 * Normalises a raw post object from Supabase.
 */
export function normalisePost(raw: RawPostSelect): PostWithProvenance {
  let author = raw.author;
  if (!author && (raw as LegacyPost).authorDid) {
    const flat = raw as LegacyPost;
    author = {
      id: flat.authorId || flat.authorDid,
      display_name: flat.authorDisplayName,
      did: flat.authorDid,
      avatar_url: flat.authorAvatarUrl || null,
      ladder_level: (flat.reputationScore?.ladderLevel as "new" | "established" | "trusted" | "steward") || "new",
      reputation_total: flat.reputationScore?.total || 0,
      affiliations: [], // Fixed types for mock data legacy compatibility
      bio: null,
    };
  }

  // Handle topic tags alignment
  const topic_tags = raw.topic_tags || ((raw as LegacyPost).topicId ? [(raw as LegacyPost).topicId as string] : []);

  return {
    ...raw,
    author,
    topic_tags,
    // Surfacing affiliations as requested
    author_affiliations: author?.affiliations || [],
    provenance_updates: raw.provenance_updates || [],
    // Derived blockchain readiness metadata
    _provenance_verified: raw.provenance_tx_hash ? true : ((raw as LegacyPost).provenance ? true : false),
    _content_permanent: raw.ipfs_cid ? true : false,
    _funding_verified: raw.funding_tx_hash ? true : false,
  };
}

/**
 * Normalises a raw profile object from Supabase.
 */
export function normaliseProfile(raw: RawProfileSelect): UserWithReputation {
  // Handle legacy mock data format (camelCase)
  const display_name = raw.display_name || (raw as LegacyProfile).displayName;
  const avatar_url = raw.avatar_url || (raw as LegacyProfile).avatarUrl || null;
  const created_at = raw.created_at || (raw as LegacyProfile).joinedAt || new Date().toISOString();
  
  // Mapping nested reputation score to flat fields if needed
  const ladder_level = (raw.ladder_level as "new" | "established" | "trusted" | "steward") || (raw as LegacyProfile).reputationScore?.ladderLevel || "new";
  const reputation_total = raw.reputation_total ?? ((raw as LegacyProfile).reputationScore?.total || 0);

  return {
    ...raw,
    display_name,
    avatar_url,
    created_at,
    ladder_level,
    reputation_total,
    post_count: raw.post_count?.[0]?.count || 0,
    follower_count: raw.follower_count?.[0]?.count || 0,
    following_count: raw.following_count?.[0]?.count || 0,
    // Derived blockchain readiness metadata
    _identity_anchored: raw.did !== null,
    _reputation_on_chain: raw.reputation_contract_address !== null,
  };
}
