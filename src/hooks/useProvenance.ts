/**
 * src/hooks/useProvenance.ts
 * 
 * Hook for deriving provenance summary data from a post.
 */

import { PostWithProvenance, ProvenanceSummary } from "@/types";
import { getProvenanceSummary } from "@/lib/queries/posts";

export function useProvenance(post: PostWithProvenance): ProvenanceSummary {
  // Since getProvenanceSummary is a pure function, we can call it directly.
  return getProvenanceSummary(post);
}
