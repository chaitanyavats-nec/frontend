import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { normalisePost } from "@/lib/normalise";
import { USE_MOCK_DATA } from "@/lib/config";
import { mockPosts } from "@/lib/mockData";

export function usePosts() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get posts for feed (joining profiles)
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return mockPosts.map(normalisePost);
      }

      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          author:profiles(*)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data || []).map(normalisePost);
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async ({ body, topicId, provenanceType, citationUrl }: Record<string, string | null>) => {
      if (USE_MOCK_DATA) {
        console.log("Mock post created:", { body, topicId, provenanceType, citationUrl });
        return { id: "mock-" + Date.now() };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authenticated user required");

      // Robust Profile Check with Retry (Handles trigger latency)
      let profile = null;
      for (let i = 0; i < 5; i++) {
        const { data } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();
        
        if (data) {
          profile = data;
          break;
        }
        // Wait 500ms before retrying
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (!profile) {
        throw new Error("Profile not found. Please ensure account setup is complete or try refreshing.");
      }

      // Validate UUID format for topicId
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validTopicId = (topicId && uuidRegex.test(topicId)) ? topicId : null;

      const { data, error } = await supabase.from("posts").insert({
        author_id: user.id,
        body,
        topic_id: validTopicId,
        provenance_type: provenanceType,
        citation_url: citationUrl,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
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
