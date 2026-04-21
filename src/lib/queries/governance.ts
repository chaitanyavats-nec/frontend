/**
 * src/lib/queries/governance.ts
 * 
 * Typed Supabase query functions for governance proposals.
 */

import { createClient } from "@/utils/supabase/client";
import { DbGovernanceProposal } from "@/types";

const supabase = createClient();

export async function getOpenProposals() {
  const { data, error } = await supabase
    .from("governance_proposals")
    .select(`
      *,
      proposer:profiles(display_name, did)
    `)
    .eq("status", "open")
    .gt("deadline", new Date().toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Mapping to ensure proposer data is accessible
  return (data || []).map(p => ({
    ...p,
    proposer_display_name: p.proposer?.display_name,
    proposer_did: p.proposer?.did,
  }));
}
