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
    mutationFn: async ({ email, password, displayName }: Record<string, string>) => {
      // 1. Authenticate
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Sign up failed");

      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/home");
    },
  });

  // Login
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: Record<string, string>) => {
      // 1. Sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (!data.user) throw new Error("Login failed");

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
