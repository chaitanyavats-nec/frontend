"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function usePosts(mode: "chronological" | "following" = "chronological") {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get posts for feed (joining profiles)
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts", mode],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from("posts")
        .select(`
          *,
          author:profiles(*)
        `)
        .order("created_at", { ascending: false });

      // Apply "Following" filter if authenticated
      if (mode === "following" && user) {
        // Get followed user IDs
        const { data: follows } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);
        
        const followedIds = follows?.map(f => f.following_id) || [];
        
        // Filter query
        if (followedIds.length > 0) {
          query = query.in("author_id", followedIds);
        } else {
          // If following no one, return empty or handle differently
          // For now, let's return an empty array for a clean "Following" feed
          return [];
        }
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map to frontend Post type (simplified for now)
      return data.map((p: any) => ({
        id: p.id,
        authorDid: p.author.did,
        authorDisplayName: p.author.display_name,
        content: p.body,
        timestamp: p.created_at,
        topicId: p.topic_id,
        provenance: { sourceType: p.provenance_type },
        replyCount: 0,
      }));
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async ({ body, topicId, provenanceType, citationUrl }: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authenticated user required");

      // Step 3 — Confirm profile exists
      const { data: profile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();
      
      if (!profile || profileCheckError) {
        throw new Error("Profile not found. Please complete account setup.");
      }

      const { data, error } = await supabase.from("posts").insert({
        author_id: user.id,
        body,
        topic_id: topicId,
        provenance_type: provenanceType,
        citation_url: citationUrl,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/home");
    },
  });

  return {
    posts,
    isPostsLoading,
    createPost: createPostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    createError: createPostMutation.error,
  };
}
