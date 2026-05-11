import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { normalisePost } from "@/lib/normalise";

const POST_ENRICHED_SELECT = `
  *,
  author:profiles(
    *,
    affiliations(*)
  ),
  citations(*),
  provenance_updates(
    *,
    user:profiles(*)
  ),
  quoted_post:quoted_post_id(
    *,
    author:profiles(
      *,
      affiliations(*)
    )
  )
`;

export function usePosts() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get posts for feed (joining profiles)
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {

      const { data, error } = await supabase
        .from("posts")
        .select(POST_ENRICHED_SELECT)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data || []).map(normalisePost);
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async ({ body, topicId, provenanceType, citationUrl, mediaUrls, pollData, locationData, parentId, rootId, type, quotedPostId }: Record<string, any>) => {

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
        media_urls: mediaUrls || [],
        poll_data: pollData || null,
        location_data: locationData || null,
        parent_id: parentId || null,
        root_id: rootId || null,
        type: type || (parentId ? "comment" : "post"),
        quoted_post_id: quotedPostId || null,
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      
      // Only redirect if NOT a reply
      if (!variables.parentId) {
        router.push("/home");
      }
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);
      if (error) throw error;
      return postId;
    },
    onSuccess: (postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  return {
    posts,
    isPostsLoading,
    createPost: createPostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    createError: createPostMutation.error,
    deletePost: deletePostMutation.mutateAsync,
    isDeleting: deletePostMutation.isPending,
  };
}
