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
  getPostById: (id: string) => Post | undefined;
  getProfileByDid: (did: string) => UserProfile | undefined;
  getProposalById: (id: string) => GovernanceProposal | undefined;
  getCaseById: (id: string) => ModerationCase | undefined;
}

export function useMockData(): MockData {
  return {
    posts: mockPosts,
    profiles: mockProfiles,
    proposals: mockProposals,
    moderationCases: mockModerationCases,
    topics: mockTopics,
    currentUser: mockProfiles[0],
    getPostById: (id: string) => mockPosts.find((p) => p.id === id),
    getProfileByDid: (did: string) => mockProfiles.find((p) => p.did === did),
    getProposalById: (id: string) => mockProposals.find((p) => p.id === id),
    getCaseById: (id: string) => mockModerationCases.find((c) => c.id === id),
  };
}
