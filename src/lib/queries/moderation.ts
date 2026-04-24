import { createClient } from "@/utils/supabase/client";
import { DbJuryCase, DbModerationFlag } from "@/types";

const supabase = createClient();

export async function getJuryCases() {
  const { data, error } = await supabase
    .from("jury_cases")
    .select(`
      *,
      moderation_flag:moderation_flags(
        *,
        post:posts(*)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getJuryCaseById(id: string) {
  const { data, error } = await supabase
    .from("jury_cases")
    .select(`
      *,
      moderation_flag:moderation_flags(
        *,
        post:posts(*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
