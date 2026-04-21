"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

export function useTopics() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      // Map to frontend Topic type
      return (data as unknown[]).map((t) => {
        const topic = t as { slug: string; name: string; domain?: string };
        return {
          slug: topic.slug,
          displayName: topic.name,
          domain: (topic.domain as "politics" | "science" | "local" | "culture" | "technology" | "economics") || "politics",
          subscriberCount: 0,
          postCount: 0,
        };
      });
    },
  });
}
