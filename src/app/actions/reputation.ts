"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function refreshReputationAction(userId: string) {
  const supabase = createClient();
  
  // Verify user is the one requesting, or admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    throw new Error("Unauthorized to refresh reputation");
  }

  const { data, error } = await supabase.rpc("recalculate_reputation", { user_uuid: userId });
  if (error) throw error;
  
  revalidatePath(`/profile/${userId}`);
  return data;
}
