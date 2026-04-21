"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function useAuth() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get current user session
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Sign Up
  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, displayName }: any) => {
      // 1. Authenticate
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Sign up failed");

      // 2. Generate DID (As requested: did:agora: + UUID)
      const did = `did:agora:${authData.user.id}`;

      // 3. Immediately insert into profiles
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        display_name: displayName,
        did: did,
        reputation_score: 0,
        // created_at defaults to now() in schema, but we can be explicit if needed
      });

      if (profileError) {
        // If profile creation fails, we show this error to the user
        throw new Error(`Account created, but profile initialization failed: ${profileError.message}`);
      }

      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/home");
    },
  });

  // Login
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: any) => {
      // 1. Sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user) throw new Error("Login failed");

      // 2. Confirm profile exists (Step 2)
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();
      
      if (!profile) {
        // Create profile for returning user if missing
        const did = `did:agora:${data.user.id}`;
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          display_name: data.user.email?.split("@")[0] || "Returning User",
          did: did,
          reputation_score: 0,
        });
        if (profileError) throw new Error(`Profile sync failed: ${profileError.message}`);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/home");
    },
  });

  // Logout
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await supabase.auth.signOut();
      document.cookie = "agora_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/welcome");
    },
  });

  return {
    user,
    isLoading,
    signUp: signUpMutation.mutateAsync,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    signOut: signOutMutation.mutateAsync,
  };
}
