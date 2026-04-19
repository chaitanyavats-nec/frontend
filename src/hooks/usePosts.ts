"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function usePosts() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async ({ body, topicId, provenanceType, citationUrl }: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authenticated user required");

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
    createPost: createPostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    createError: createPostMutation.error,
  };
}
