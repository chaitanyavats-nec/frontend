import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET() {
  const supabase = createClient();
  const diagnostics: any = {};

  try {
    // 1. Test basic connection and get tables
    const { data: tables, error: tablesError } = await supabase
      .from("profiles")
      .select("count", { count: "exact", head: true });
    
    diagnostics.profiles_connection = tablesError ? { success: false, error: tablesError } : { success: true, count: tables };

    // 2. Try to run a raw query or test gen_random_bytes if possible
    // Since we don't have direct SQL, let's try to insert a profile directly to see if RLS or other things fail
    const testId = "00000000-0000-0000-0000-000000000001";
    const { data: testProfile, error: profileInsertError } = await supabase
      .from("profiles")
      .insert({
        id: testId,
        display_name: "Test Diagnostic User",
        did: "did:agora:diagnostic-" + Date.now(),
      });

    diagnostics.profile_direct_insert = profileInsertError 
      ? { success: false, code: profileInsertError.code, message: profileInsertError.message, details: profileInsertError.details } 
      : { success: true, data: testProfile };

    // 3. Clean up test profile if it succeeded
    if (!profileInsertError) {
      await supabase.from("profiles").delete().eq("id", testId);
    }

    // 4. Test signUp with a random email to see what the exact auth trigger error is
    const testEmail = `test-${Date.now()}@agora.test`;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: "TestPassword123!",
      options: { data: { display_name: "Diagnostic Auth User" } }
    });

    diagnostics.auth_signup = signUpError 
      ? { success: false, status: signUpError.status, message: signUpError.message } 
      : { success: true, userId: signUpData.user?.id };

    // Clean up auth user if it succeeded
    if (!signUpError && signUpData.user?.id) {
      // Note: we can't easily delete auth users from client SDK, but it's a test email
    }

  } catch (err: any) {
    diagnostics.global_error = { message: err.message, stack: err.stack };
  }

  return NextResponse.json(diagnostics);
}
