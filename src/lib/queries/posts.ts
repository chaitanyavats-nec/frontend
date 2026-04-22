/**
 * src/lib/queries/posts.ts
 * 
 * Typed Supabase query functions for retrieving and managing posts.
 */

import { createClient } from "@/utils/supabase/client";
import { PostWithProvenance, ProvenanceSummary, RawPostSelect } from "@/types";
import { normalisePost } from "../normalise";

const supabase = createClient();

/**
 * Common select string for post queries to ensure all relationships are joined.
 */
const POST_ENRICHED_SELECT = `
  *,
  author:profiles(
    *,
    affiliations(*)
  ),
  citations(*),
  provenance_updates(
    *,
    user:profiles(*)
  )
`;

export async function getFeedPosts(options: {
  limit?: number;
  offset?: number;
  topicTags?: string[];
  authorId?: string;
}): Promise<PostWithProvenance[]> {
  let query = supabase
    .from("posts")
    .select(POST_ENRICHED_SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (options.limit) query = query.limit(options.limit);
  if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  if (options.topicTags && options.topicTags.length > 0) {
    query = query.contains("topic_tags", options.topicTags);
  }
  if (options.authorId) {
    query = query.eq("author_id", options.authorId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rawData = data as unknown as RawPostSelect[];

  return (rawData || []).map((raw) => {
    // Filter to current affiliations only for author object
    if (raw.author?.affiliations) {
      raw.author.affiliations = raw.author.affiliations.filter((a) => a.is_current);
    }
    return normalisePost(raw);
  });
}

export async function getPostById(id: string): Promise<PostWithProvenance | null> {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      ${POST_ENRICHED_SELECT},
      moderation_flags(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }

  const raw = data as unknown as RawPostSelect;

  // Filter affiliations
  if (raw.author?.affiliations) {
    raw.author.affiliations = raw.author.affiliations.filter((a) => a.is_current);
  }

  // Check if post survived challenge (moderation_flags with status = 'upheld')
  // Note: survivability might be better as a derived field in normalise, 
  // but we'll stick to the query logic requested.
  return normalisePost(raw);
}

export async function getUserPosts(
  userId: string,
  options: { limit?: number; offset?: number }
): Promise<PostWithProvenance[]> {
  return getFeedPosts({ ...options, authorId: userId });
}

/**
 * Pure function to derive a ProvenanceSummary from a PostWithProvenance object.
 */
export function getProvenanceSummary(post: PostWithProvenance): ProvenanceSummary {
  return {
    source_type: post.source_type,
    origin_label: post.origin_label,
    has_funding_disclosure: post.funding_type !== "independent",
    has_coordination_flag: post.coordination_flagged === true,
    coordination_survived: post.coordination_survived === true,
    affiliation_count: post.author_affiliations?.length || 0,
    primary_affiliation: post.author_affiliations?.[0]?.organization_name || null,
    is_on_chain: post.provenance_tx_hash !== null,
    is_ipfs_stored: post.ipfs_cid !== null,
  };
}
