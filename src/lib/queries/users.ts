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
  const decodedId = decodeURIComponent(userId);
  const queryField = decodedId.startsWith("did:") ? "did" : "id";

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq(queryField, decodedId)
    .single();

  if (error) {
    if (error.code === "PGRST116" || error.code === "22P02") return null; // Not found or invalid UUID format
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

  // Get followers count
  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", internalId);

  // Get following count
  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", internalId);

  return normaliseProfile({
    ...data,
    affiliations: currentAffiliations,
    post_count: postCount || 0,
    follower_count: followersCount || 0,
    following_count: followingCount || 0,
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

export async function getFollowers(userId: string): Promise<UserWithReputation[]> {
  const decodedId = decodeURIComponent(userId);
  const { data: profile, error: pError } = await supabase
    .from("profiles")
    .select("id")
    .eq(decodedId.startsWith("did:") ? "did" : "id", decodedId)
    .single();
  
  if (pError || !profile) return [];

  const { data, error } = await supabase
    .from("follows")
    .select(`
      profiles:follower_id (
        *,
        affiliations(*)
      )
    `)
    .eq("following_id", profile.id);

  if (error) throw error;
  return (data || []).map((row: any) => normaliseProfile(row.profiles));
}

export async function getFollowing(userId: string): Promise<UserWithReputation[]> {
  const decodedId = decodeURIComponent(userId);
  const { data: profile, error: pError } = await supabase
    .from("profiles")
    .select("id")
    .eq(decodedId.startsWith("did:") ? "did" : "id", decodedId)
    .single();
  
  if (pError || !profile) return [];

  const { data, error } = await supabase
    .from("follows")
    .select(`
      profiles:following_id (
        *,
        affiliations(*)
      )
    `)
    .eq("follower_id", profile.id);

  if (error) throw error;
  return (data || []).map((row: any) => normaliseProfile(row.profiles));
}
