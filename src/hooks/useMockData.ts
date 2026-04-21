import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import {
  mockPosts,
  mockProfiles,
  mockProposals,
  mockModerationCases,
  mockTopics,
} from "@/lib/mockData";
import type {
  Post,
  UserProfile,
  GovernanceProposal,
  ModerationCase,
  Topic,
} from "@/types";

interface MockData {
  posts: Post[];
  profiles: UserProfile[];
  proposals: GovernanceProposal[];
  moderationCases: ModerationCase[];
  topics: Topic[];
  currentUser: UserProfile;
  isLoading: boolean;
  getPostById: (id: string) => Post | undefined;
  getProfileByDid: (did: string) => UserProfile | undefined;
  getProposalById: (id: string) => GovernanceProposal | undefined;
  getCaseById: (id: string) => ModerationCase | undefined;
}

export function useMockData(): MockData {
  const supabase = createClient();

  // Fetch Session/User
  const { data: userData } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Query posts
  const { data: posts = mockPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) throw error;
      return data as Post[];
    },
    // Fallback to mock data if no data yet or error
    retry: false,
  });

  // Query profiles
  const { data: profiles = mockProfiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data as UserProfile[];
    },
    retry: false,
  });

  // Query proposals
  const { data: proposals = mockProposals, isLoading: proposalsLoading } = useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("proposals").select("*");
      if (error) throw error;
      return data as GovernanceProposal[];
    },
    retry: false,
  });

  // Query moderation cases
  const { data: moderationCases = mockModerationCases, isLoading: casesLoading } = useQuery({
    queryKey: ["moderation_cases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("moderation_cases").select("*");
      if (error) throw error;
      return data as ModerationCase[];
    },
    retry: false,
  });

  // Query topics
  const { data: topics = mockTopics, isLoading: topicsLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("topics").select("*");
      if (error) throw error;
      return data as Topic[];
    },
    retry: false,
  });

  // Determine current user
  // If logged in, we try to find the profile. 
  // We assume the Supabase 'profiles' table has been fetched and includes the user.
  const currentUser = userData 
    ? (profiles.find(p => p.id === userData.id) || profiles.find(p => p.did === userData.id) || mockProfiles[0]) 
    : mockProfiles[0];

  const isLoading = postsLoading || profilesLoading || proposalsLoading || casesLoading || topicsLoading;

  return {
    posts,
    profiles,
    proposals,
    moderationCases,
    topics,
    currentUser,
    isLoading,
    getPostById: (id: string) => posts.find((p) => p.id === id),
    getProfileByDid: (did: string) => profiles.find((p) => p.did === did),
    getProposalById: (id: string) => proposals.find((p) => p.id === id),
    getCaseById: (id: string) => moderationCases.find((c) => c.id === id),
  };
}
