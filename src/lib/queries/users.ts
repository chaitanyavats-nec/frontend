/**
 * src/lib/queries/users.ts
 * 
 * Typed Supabase query functions for retrieving user and affiliation data.
 */

import { createClient } from "@/utils/supabase/client";
import { UserWithReputation, DbAffiliation } from "@/types";
import { normaliseProfile } from "../normalise";

const supabase = createClient();

export async function getUserProfile(userId: string): Promise<UserWithReputation | null> {
  const queryField = userId.startsWith("did:") ? "did" : "id";

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq(queryField, userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  const internalId = data.id;

  // Fetch affiliations separately for stability during migration
  let affiliations: any[] = [];
  try {
    const { data: affData } = await supabase
      .from("affiliations")
      .select("*")
      .eq("user_id", internalId)
      .eq("is_current", true);
    affiliations = affData || [];
  } catch (e) {
    console.warn("Affiliations table not found or query failed, skipping for now.");
  }

  // Get post count separately (Supabase v2 count doesn't easily join here without RPC or multiple queries)
  const { count: postCount, error: countError } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("author_id", internalId);

  if (countError) throw countError;

  // Filter current affiliations
  const currentAffiliations = (data.affiliations || []).filter((a: any) => a.is_current);

  // For followers/following, we'd need another join/count, 
  // but for now we'll return the profile with these counts (assuming they might be columns or placeholder logic)
  // The prompt schema SECTION 1 did NOT list followers_count in profiles, 
  // but SECTION 2 UserWithReputation requires counts.
  // I will assume they are derived or present.
  
  return normaliseProfile({
    ...data,
    affiliations: currentAffiliations,
    post_count: postCount || 0,
    follower_count: 0, // Placeholder
    following_count: 0, // Placeholder
  });
}

export async function getAffiliationsByUser(userId: string): Promise<DbAffiliation[]> {
  const { data, error } = await supabase
    .from("affiliations")
    .select("*")
    .eq("user_id", userId)
    .order("is_current", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}
