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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Sign up failed");

      // Generate DID (Derived from UUID)
      const did = `did:agora:z6Mk${authData.user.id.replace(/-/g, "").slice(0, 32)}`;

      // Insert Profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        display_name: displayName,
        did: did,
        reputation_score: 0,
      });

      if (profileError) throw profileError;

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
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
