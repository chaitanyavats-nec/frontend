import { useQuery } from "@tanstack/react-query";
import { getJuryCases, getJuryCaseById } from "@/lib/queries/moderation";

export function useModeration() {
  const { data: moderationCases, isLoading: isCasesLoading } = useQuery({
    queryKey: ["moderation-cases"],
    queryFn: getJuryCases,
  });

  const useJuryCase = (id: string) =>
    useQuery({
      queryKey: ["moderation-case", id],
      queryFn: () => getJuryCaseById(id),
      enabled: !!id,
    });

  return {
    moderationCases: moderationCases || [],
    isCasesLoading,
    useJuryCase,
  };
}
