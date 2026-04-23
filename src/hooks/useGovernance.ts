import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { GovernanceProposalWithAuthor, DbGovernanceVote } from "@/types";

export function useGovernance() {
  const supabase = createClient();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get all proposals
  const { data: proposals, isLoading: isProposalsLoading } = useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("governance_proposals")
        .select(`
          *,
          proposer:profiles(id, display_name, avatar_url, did)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as GovernanceProposalWithAuthor[];
    },
  });

  // Get a specific proposal and its votes
  const useProposal = (id: string) => 
    useQuery({
      queryKey: ["proposal", id],
      queryFn: async () => {
        const { data: proposal, error: pError } = await supabase
          .from("governance_proposals")
          .select(`
            *,
            proposer:profiles(id, display_name, avatar_url, did)
          `)
          .eq("id", id)
          .single();
        
        if (pError) throw pError;

        const { data: votes, error: vError } = await supabase
          .from("governance_votes")
          .select("*")
          .eq("proposal_id", id);
        
        if (vError) throw vError;

        return { 
          ...(proposal as GovernanceProposalWithAuthor), 
          votes: votes as DbGovernanceVote[] 
        };
      },
      enabled: !!id,
    });

  // Create a new proposal
  const createProposalMutation = useMutation({
    mutationFn: async ({ title, body, type, deadline }: { title: string; body: string; type: "standard" | "constitutional"; deadline: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authenticated user required");

      const { data, error } = await supabase
        .from("governance_proposals")
        .insert({
          proposer_id: user.id,
          title,
          body,
          proposal_type: type,
          deadline,
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      router.push("/governance");
    },
  });

  // Cast a vote
  const castVoteMutation = useMutation({
    mutationFn: async ({ proposalId, voteType }: { proposalId: string; voteType: "for" | "against" | "abstain" }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authenticated user required");

      // Get user reputation and level
      const { data: profile, error: pError } = await supabase
        .from("profiles")
        .select("reputation_total, ladder_level")
        .eq("id", user.id)
        .single();
      
      if (pError) throw pError;

      const { data, error } = await supabase
        .from("governance_votes")
        .insert({
          proposal_id: proposalId,
          user_id: user.id,
          vote_type: voteType,
          reputation_level: profile.ladder_level,
          weight: profile.reputation_total,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["proposal", variables.proposalId] });
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });

  return {
    proposals,
    isProposalsLoading,
    useProposal,
    createProposal: createProposalMutation.mutateAsync,
    isCreating: createProposalMutation.isPending,
    castVote: castVoteMutation.mutateAsync,
    isVoting: castVoteMutation.isPending,
  };
}
