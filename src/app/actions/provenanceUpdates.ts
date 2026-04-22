"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { DbPost } from "@/types";

interface SubmitProvenanceUpdateParams {
  postId: string;
  updateType: "added_context" | "incomplete_provenance" | "misleading_framing" | "undisclosed_funding";
  body: string;
  evidenceUrl?: string;
  evidenceText?: string;
}

export async function submitProvenanceUpdate(params: SubmitProvenanceUpdateParams) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Authentication required" };
  }

  const { postId, updateType, body, evidenceUrl, evidenceText } = params;

  // Determine initial status based on type
  let status = "pending";
  if (updateType === "added_context" || updateType === "incomplete_provenance") {
    status = "accepted"; // These take effect instantly according to spec
  }

  // 1. Insert the update
  const { error: insertError } = await supabase
    .from("provenance_updates")
    .insert({
      post_id: postId,
      user_id: user.id,
      update_type: updateType,
      body,
      evidence_url: evidenceUrl,
      evidence_text: evidenceText,
      status
    });

  if (insertError) {
    console.error("Provenance update insert error:", insertError);
    return { error: "Failed to submit update" };
  }

  // 2. Perform server-side trust score / post effects if the update is instantly accepted
  if (status === "accepted") {
    // We fetch the current post to adjust it
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("trust_score, context_completeness")
      .eq("id", postId)
      .single();

    if (!fetchError && post) {
      const updates: Partial<DbPost> = {};
      
      if (updateType === "added_context") {
        updates.context_completeness = Math.min((post.context_completeness || 100) + 5, 100);
      } else if (updateType === "incomplete_provenance") {
        updates.trust_score = Math.max((post.trust_score || 100) - 5, 0); // Small downward adjustment
      }

      await supabase.from("posts").update(updates).eq("id", postId);
    }

    // Adjusting author score or contributor score would go here
    // e.g. bumping contributor reputation_total via a DB function. We'll skip complex queries for now 
    // unless defined, keeping it simple as a proof of concept.
  }

  revalidatePath(`/post/${postId}`);
  revalidatePath(`/post/${postId}/provenance`);

  return { success: true, status };
}
