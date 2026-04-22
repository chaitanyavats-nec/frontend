import type {
  Post,
  UserProfile,
  GovernanceProposal,
  ModerationCase,
  Topic,
  ProvenanceRecord,
} from "@/types";

// ─── Helper: Generate realistic IDs ────────────────────────
const did = (suffix: string) => `did:agora:z6Mk${suffix}`;
const cid = (suffix: string) => `Qm${suffix.padEnd(44, "abcdef1234567890")}`;

// ─── User Profiles ──────────────────────────────────────────
export const mockProfiles: UserProfile[] = [
  {
    id: "mock-user-chaitanya",
    did: did("R7vX2pQnKz8WfH3jL9mYcTbNsA4gE6dU"),
    displayName: "Chaitanya Vats",
    avatarUrl: undefined,
    bio: "Political economist researching platform cooperativism and data sovereignty. University of Lagos → LSE. Writing about the intersection of digital rights and African feminist thought.",
    affiliationCount: 2,
    verifiedAffiliations: [
      {
        organizationName: "University of Lagos",
        affiliationType: "faculty",
        stakeStatus: "active",
        ipfsDocHash: "QmDocHashHereLagos1234567890abcdef1234",
        onChainAddress: "0x1234567890abcdef1234567890abcdef12345678",
      },
      {
        organizationName: "LSE",
        affiliationType: "alumni",
        stakeStatus: "active",
        ipfsDocHash: "QmDocHashHereLSE1234567890abcdef123456",
        onChainAddress: "0abcdef1234567890abcdef1234567890abcdef123",
      }
    ],
    reputationScore: {
      total: 847,
      moderationAccuracy: 0.92,
      contentLongevity: 0.88,
      disputeParticipation: 0.76,
      accountAgeWeight: 0.95,
      ladderLevel: "steward",
    },
    followersCount: 1243,
    followingCount: 387,
    joinedAt: "2024-03-15T09:00:00Z",
  },
  {
    id: "mock-user-tomas",
    did: did("J4kP8rWxN5sLmQ2vY7hFcT9bGa3eD6uZ"),
    displayName: "Tomás Herrera",
    avatarUrl: undefined,
    bio: "Journalist covering environmental policy in Latin America. Independent, no institutional affiliation. All funding disclosed in provenance tags.",
    affiliationCount: 0,
    verifiedAffiliations: [],
    reputationScore: {
      total: 412,
      moderationAccuracy: 0.78,
      contentLongevity: 0.65,
      disputeParticipation: 0.52,
      accountAgeWeight: 0.6,
      ladderLevel: "established",
    },
    followersCount: 521,
    followingCount: 198,
    joinedAt: "2024-11-02T14:30:00Z",
  },
  {
    id: "mock-user-suki",
    did: did("B9nM3xKfV6wLpH8jS2cYtR5gA7eQ4dUz"),
    displayName: "Suki Patel",
    avatarUrl: undefined,
    bio: "New here. Interested in community governance and open-source tooling.",
    affiliationCount: 0,
    verifiedAffiliations: [],
    reputationScore: {
      total: 45,
      moderationAccuracy: 0,
      contentLongevity: 0.3,
      disputeParticipation: 0,
      accountAgeWeight: 0.15,
      ladderLevel: "new",
    },
    followersCount: 12,
    followingCount: 74,
    joinedAt: "2025-03-01T11:00:00Z",
  },
];

// ─── Provenance Records ─────────────────────────────────────
const provenanceOriginal1: ProvenanceRecord = {
  postCid: cid("Original1Post"),
  sourceType: "original",
  transmissionChain: [],
  authorAffiliations: [
    {
      organizationName: "University of Lagos",
      affiliationType: "faculty",
      stakeStatus: "active",
      ipfsDocHash: cid("AffiliationDoc1"),
      onChainAddress: "0x1234567890abcdef1234567890abcdef12345678",
    },
  ],
  coordinationFlag: {
    detected: true,
    confidence: 0.91,
    signals: ["Cross-platform posting burst detected"],
    contestable: false,
    reportUrl: "https://agora.example/reports/coord-2025-0399.json",
    survivedCoordinatedAttack: true,
  },
};

const provenanceOriginal2: ProvenanceRecord = {
  postCid: cid("Original2Post"),
  sourceType: "original",
  transmissionChain: [],
  authorAffiliations: [],
};

const provenanceInstitutional1: ProvenanceRecord = {
  postCid: cid("Institutional1Post"),
  sourceType: "institutional",
  originUrl: "https://www.who.int/news/item/2025-vaccine-equity-report",
  originLabel: "World Health Organization",
  transmissionChain: [
    {
      sourceUrl: "https://www.who.int/news/item/2025-vaccine-equity-report",
      sourceLabel: "WHO Official Report",
      sourceType: "institutional",
      relationship: "quotes",
      timestamp: "2025-02-28T10:00:00Z",
    },
  ],
  authorAffiliations: [
    {
      organizationName: "Global Health Watch",
      affiliationType: "board member",
      stakeStatus: "active",
      ipfsDocHash: cid("AffiliationDoc2"),
      onChainAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
    },
  ],
};

const provenanceInstitutional2: ProvenanceRecord = {
  postCid: cid("Institutional2Post"),
  sourceType: "institutional",
  originUrl: "https://ec.europa.eu/digital-strategy/ai-act-2025",
  originLabel: "European Commission",
  transmissionChain: [
    {
      sourceUrl: "https://ec.europa.eu/digital-strategy/ai-act-2025",
      sourceLabel: "EU AI Act 2025 Amendment",
      sourceType: "institutional",
      relationship: "contextualises",
      timestamp: "2025-03-10T08:00:00Z",
    },
    {
      sourceUrl: "https://www.reuters.com/technology/eu-ai-act-update-2025",
      sourceLabel: "Reuters Analysis",
      sourceType: "secondary",
      relationship: "supports",
      timestamp: "2025-03-10T14:00:00Z",
    },
  ],
  authorAffiliations: [],
};

const provenanceInstitutional3: ProvenanceRecord = {
  postCid: cid("Institutional3Post"),
  sourceType: "institutional",
  originUrl: "https://www.ipcc.ch/report/ar7/wg1/",
  originLabel: "IPCC",
  transmissionChain: [
    {
      sourceUrl: "https://www.ipcc.ch/report/ar7/wg1/",
      sourceLabel: "IPCC AR7 Working Group I",
      sourceType: "primary",
      relationship: "quotes",
      timestamp: "2025-01-15T00:00:00Z",
    },
  ],
  authorAffiliations: [
    {
      organizationName: "Climate Action Network",
      affiliationType: "researcher",
      stakeStatus: "active",
      ipfsDocHash: cid("AffiliationDoc3"),
      onChainAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
    },
  ],
};

const provenanceFunded1: ProvenanceRecord = {
  postCid: cid("Funded1Post"),
  sourceType: "original",
  transmissionChain: [],
  authorAffiliations: [],
  fundingDisclosure: {
    type: "grant-funded",
    funderName: "Open Society Foundations",
    amount: "€15,000",
    declared: true,
    staked: true,
  },
};

const provenanceFunded2: ProvenanceRecord = {
  postCid: cid("Funded2Post"),
  sourceType: "original",
  transmissionChain: [],
  authorAffiliations: [
    {
      organizationName: "TechFreedom Institute",
      affiliationType: "fellow",
      stakeStatus: "challenged",
      ipfsDocHash: cid("AffiliationDoc4"),
      onChainAddress: "0xdef1234567890abcdef1234567890abcdef123456",
    },
  ],
  fundingDisclosure: {
    type: "commissioned",
    funderName: "Digital Rights Foundation",
    amount: "$8,500",
    declared: true,
    staked: true,
  },
};

const provenanceCoordinated: ProvenanceRecord = {
  postCid: cid("CoordinatedPost"),
  sourceType: "original",
  transmissionChain: [],
  authorAffiliations: [],
  coordinationFlag: {
    detected: true,
    confidence: 0.87,
    signals: [
      "14 accounts posted near-identical content within a 23-minute window",
      "Accounts share creation date cluster (±48h)",
      "Identical phrasing patterns across 3 languages suggest machine translation from single source",
    ],
    contestable: true,
    reportUrl: "https://agora.example/reports/coord-2025-0342.json",
    survivedCoordinatedAttack: true,
  },
};

const provenanceDerived1: ProvenanceRecord = {
  postCid: cid("Derived1Post"),
  sourceType: "derived",
  originUrl: "https://arxiv.org/abs/2025.04521",
  originLabel: "arXiv preprint",
  transmissionChain: [
    {
      sourceUrl: "https://arxiv.org/abs/2025.04521",
      sourceLabel: "Algorithmic Amplification and Democratic Discourse (preprint)",
      sourceType: "primary",
      relationship: "contextualises",
      timestamp: "2025-02-20T00:00:00Z",
    },
    {
      sourceUrl: "https://www.theguardian.com/technology/2025/algorithm-study",
      sourceLabel: "The Guardian",
      sourceType: "secondary",
      relationship: "supports",
      timestamp: "2025-02-22T12:00:00Z",
    },
  ],
  authorAffiliations: [
    {
      organizationName: "University of Lagos",
      affiliationType: "faculty",
      stakeStatus: "active",
      ipfsDocHash: cid("AffiliationDoc1"),
      onChainAddress: "0x1234567890abcdef1234567890abcdef12345678",
    },
  ],
};

const provenanceDerived2: ProvenanceRecord = {
  postCid: cid("Derived2Post"),
  sourceType: "derived",
  originUrl: "https://restofworld.org/2025/platform-labor-southeast-asia",
  originLabel: "Rest of World",
  transmissionChain: [
    {
      sourceUrl: "https://restofworld.org/2025/platform-labor-southeast-asia",
      sourceLabel: "Rest of World investigation",
      sourceType: "primary",
      relationship: "quotes",
      timestamp: "2025-03-05T00:00:00Z",
    },
  ],
  authorAffiliations: [],
};

// ─── Posts ───────────────────────────────────────────────────
export const mockPosts: Post[] = [
  {
    id: cid("Post01Content"),
    authorDid: mockProfiles[0].did,
    authorDisplayName: mockProfiles[0].displayName,
    content:
      "The fundamental flaw in platform capitalism isn't the technology — it's the incentive structure. When engagement equals revenue, platforms will always optimise for emotional arousal over informed discourse. Agora's model proves there's an alternative: fund infrastructure through governance, not attention harvesting.\n\nWe've been running cooperative platform experiments in Lagos for two years now. The data is clear: when you remove engagement metrics, conversation quality improves by every measure we can track.",
    media: [
      {
        url: "/images/network.png",
        type: "image",
        altText: "A decentralized human network illustration",
      },
    ],
    topicTags: ["platform-cooperativism", "data-sovereignty"],
    provenance: provenanceOriginal1,
    provenance_updates: [
      {
        id: "update-001",
        post_id: cid("Post01Content"),
        user_id: mockProfiles[1].id,
        update_type: "added_context",
        body: "A relevant 2024 study by LSE explicitly shows that removing like counts alone decreased polarisation metrics by 14%.",
        evidence_url: "https://example.com/lse-study-2024",
        evidence_text: null,
        status: "accepted",
        created_at: "2025-03-21T10:00:00Z",
        user: {
          id: mockProfiles[1].id,
          display_name: mockProfiles[1].displayName,
          avatar_url: mockProfiles[1].avatarUrl,
          did: mockProfiles[1].did,
        }
      }
    ],
    replyCount: 23,
    timestamp: "2025-03-20T14:30:00Z",
    signature: "sig_z6MkR7vX2p_0x1a2b3c4d",
  },
  {
    id: cid("Post02Content"),
    authorDid: mockProfiles[1].did,
    authorDisplayName: mockProfiles[1].displayName,
    content:
      "Just filed my annual affiliation declaration. Zero institutional ties, zero undisclosed funding. I know some people find the provenance system burdensome, but as a journalist in Latin America, this is exactly the transparency I wish mainstream media had. Every source traceable, every conflict of interest visible.\n\nThe story I'm working on about mining concessions in Oaxaca would be impossible to publish on corporate platforms without self-censorship.",
    media: [
      {
        url: "/images/engagement.png",
        type: "image",
        altText: "Civic gathering in an urban square",
      },
    ],
    topicTags: ["journalism", "transparency"],
    provenance: provenanceOriginal2,
    provenance_updates: [
      {
        id: "update-002",
        post_id: cid("Post02Content"),
        user_id: mockProfiles[2].id,
        update_type: "misleading_framing",
        body: "The Oaxaca mining concessions mentioned actually began under the previous administration, according to the public registry. Framing it as entirely new is misleading.",
        evidence_url: "https://example.com/oaxaca-registry",
        evidence_text: null,
        status: "pending",
        created_at: "2025-03-21T11:00:00Z",
        user: {
          id: mockProfiles[2].id,
          display_name: mockProfiles[2].displayName,
          avatar_url: mockProfiles[2].avatarUrl,
          did: mockProfiles[2].did,
        }
      }
    ],
    replyCount: 8,
    timestamp: "2025-03-20T12:15:00Z",
    signature: "sig_z6MkJ4kP8r_0x5e6f7g8h",
  },
  {
    id: cid("Post03Content"),
    authorDid: mockProfiles[0].did,
    authorDisplayName: mockProfiles[0].displayName,
    content:
      "The WHO's latest vaccine equity report confirms what we've been documenting: patent monopolies continue to restrict access in the Global South, even as production capacity exists. The data is damning — 73% of booster doses administered in high-income countries while coverage gaps persist across sub-Saharan Africa.\n\nThis isn't a supply problem. It's a governance problem.",
    citations: [
      {
        url: "https://www.who.int/news/item/2025-vaccine-equity-report",
        title: "WHO Global Vaccine Equity Report 2025",
        sourceType: "government",
        accessedAt: "2025-03-19T10:00:00Z",
      },
    ],
    topicTags: ["global-health", "vaccine-equity"],
    provenance: provenanceInstitutional1,
    replyCount: 45,
    timestamp: "2025-03-19T16:00:00Z",
    signature: "sig_z6MkR7vX2p_0x9i0j1k2l",
  },
  {
    id: cid("Post04Content"),
    authorDid: mockProfiles[1].did,
    authorDisplayName: mockProfiles[1].displayName,
    content:
      "The EU AI Act 2025 amendment is more significant than the coverage suggests. Buried in Article 47§3 is a new requirement for 'algorithmic provenance disclosure' — any AI-generated or AI-modified content must carry machine-readable origin metadata. Sound familiar? This is essentially what Agora has been doing since day one.\n\nThe real question is enforcement. Without decentralised verification, this becomes another compliance checkbox that big platforms game.",
    citations: [
      {
        url: "https://ec.europa.eu/digital-strategy/ai-act-2025",
        title: "EU AI Act 2025 Amendment — Final Text",
        sourceType: "government",
        accessedAt: "2025-03-10T09:00:00Z",
      },
      {
        url: "https://www.reuters.com/technology/eu-ai-act-update-2025",
        title: "Reuters: What the EU AI Act means for content platforms",
        sourceType: "news",
        accessedAt: "2025-03-10T15:00:00Z",
      },
    ],
    topicTags: ["ai-regulation", "digital-rights"],
    provenance: provenanceInstitutional2,
    replyCount: 31,
    timestamp: "2025-03-18T09:45:00Z",
    signature: "sig_z6MkJ4kP8r_0x3m4n5o6p",
  },
  {
    id: cid("Post05Content"),
    authorDid: did("F2hN6wKxM8vLpQ3jY9cTbR5gA7eS4dUz"),
    authorDisplayName: "Dr. Kenji Watanabe",
    content:
      "The IPCC AR7 Working Group I report is unequivocal: we are tracking above the worst-case 2020 projections. The 1.5°C target is no longer a matter of ambition — it's a matter of physics. The atmospheric CO₂ concentration has reached 428ppm.\n\nWhat the media coverage misses: the report explicitly calls out platform-mediated disinformation as a barrier to climate action. Chapter 12 dedicates 40 pages to 'information ecosystem failures.'",
    citations: [
      {
        url: "https://www.ipcc.ch/report/ar7/wg1/",
        title: "IPCC AR7 Working Group I Full Report",
        sourceType: "academic",
        accessedAt: "2025-03-15T00:00:00Z",
      },
    ],
    topicTags: ["climate", "science"],
    provenance: provenanceInstitutional3,
    replyCount: 67,
    timestamp: "2025-03-17T20:00:00Z",
    signature: "sig_z6MkF2hN6w_0x7q8r9s0t",
  },
  {
    id: cid("Post06Content"),
    authorDid: did("G3iO7xLyN9wMqR4kZ0dUcS6hB8fT5eVa"),
    authorDisplayName: "Maria Castellanos",
    content:
      "Disclosure: This analysis was funded by a grant from the Open Society Foundations as part of their Digital Democracy initiative. Full provenance chain available.\n\nOur 18-month study of content moderation labour in the Philippines reveals a hidden workforce of 45,000+ moderators earning below minimum wage, reviewing 800-1200 items per shift. The psychological toll is devastating. Platform companies classify this as 'trust and safety' — but whose trust, and whose safety?\n\nFull report linked in citations. All data anonymised per our ethics board protocol.",
    citations: [
      {
        url: "https://example.org/research/moderation-labor-ph-2025",
        title: "The Hidden Cost of Content Moderation: Philippines Case Study",
        sourceType: "academic",
        accessedAt: "2025-03-14T00:00:00Z",
      },
    ],
    topicTags: ["platform-labor", "content-moderation"],
    fundingDisclosure: {
      type: "grant-funded",
      funderName: "Open Society Foundations",
      amount: "€15,000",
      declared: true,
      staked: true,
    },
    provenance: provenanceFunded1,
    replyCount: 38,
    timestamp: "2025-03-16T11:30:00Z",
    signature: "sig_z6MkG3iO7x_0x1u2v3w4x",
  },
  {
    id: cid("Post07Content"),
    authorDid: did("H4jP8yMzO0xNrS5lA1eVdT7iC9gU6fWb"),
    authorDisplayName: "Dr. Amara Osei",
    content:
      "Commissioned analysis for the Digital Rights Foundation on algorithmic audit methodologies. My affiliation with TechFreedom Institute is declared and staked — you can verify on-chain.\n\nKey finding: current audit frameworks are designed around Western regulatory assumptions. They fail to account for linguistic diversity (testing in 3 languages ≠ coverage of 7,000+), cultural context in hate speech detection, and the power dynamics of who gets to define 'harmful content.'",
    topicTags: ["algorithmic-auditing", "digital-rights"],
    fundingDisclosure: {
      type: "commissioned",
      funderName: "Digital Rights Foundation",
      amount: "$8,500",
      declared: true,
      staked: true,
    },
    provenance: provenanceFunded2,
    replyCount: 19,
    timestamp: "2025-03-15T08:00:00Z",
    signature: "sig_z6MkH4jP8y_0x5y6z7a8b",
  },
  {
    id: cid("Post08Content"),
    authorDid: did("K5lR9zNaP1yOsT6mB2fWdU7jD0hV8gXc"),
    authorDisplayName: "Anonymous Account",
    content:
      "BREAKING: Major tech company secretly funding astroturf campaign against data portability legislation. Sources confirm $2.3M channelled through three shell nonprofits. The campaign has been active on every major platform for months. Thread with evidence below ↓",
    topicTags: ["astroturfing", "corporate-accountability"],
    provenance: provenanceCoordinated,
    replyCount: 156,
    timestamp: "2025-03-14T22:00:00Z",
    signature: "sig_z6MkK5lR9z_0x9c0d1e2f",
  },
  {
    id: cid("Post09Content"),
    authorDid: mockProfiles[0].did,
    authorDisplayName: mockProfiles[0].displayName,
    content:
      "A new preprint on algorithmic amplification confirms what platform researchers have suspected: recommendation algorithms don't just reflect polarisation — they manufacture it. The study analysed 2.3 billion content impressions across three platforms and found that 'engagement-optimised' feeds increased exposure to extreme content by 340% compared to chronological feeds.\n\nThis is why Agora defaults to chronological. It's not a design limitation. It's a design decision.",
    media: [
      {
        url: "/images/sovereignty.png",
        type: "image",
        altText: "Abstract digital sovereignty visualization",
      },
    ],
    citations: [
      {
        url: "https://arxiv.org/abs/2025.04521",
        title: "Algorithmic Amplification and Democratic Discourse",
        sourceType: "academic",
        accessedAt: "2025-03-12T00:00:00Z",
      },
      {
        url: "https://www.theguardian.com/technology/2025/algorithm-study",
        title: "The Guardian: Study reveals true scale of algorithmic polarisation",
        sourceType: "news",
        accessedAt: "2025-03-12T14:00:00Z",
      },
    ],
    topicTags: ["algorithmic-amplification", "research"],
    provenance: provenanceDerived1,
    replyCount: 52,
    timestamp: "2025-03-13T15:00:00Z",
    signature: "sig_z6MkR7vX2p_0x3g4h5i6j",
  },
  {
    id: cid("Post10Content"),
    authorDid: mockProfiles[2].did,
    authorDisplayName: mockProfiles[2].displayName,
    content:
      "Just read the Rest of World investigation on platform labour in Southeast Asia. The conditions are appalling — gig workers for major delivery platforms earning $0.40/hour with no benefits, no appeals process, and algorithmic deactivation with zero notice.\n\nThe article documents how platforms use jurisdictional arbitrage: incorporated in Singapore, operating in Myanmar, with dispute resolution clauses requiring arbitration in Delaware. Workers have no realistic legal recourse.",
    citations: [
      {
        url: "https://restofworld.org/2025/platform-labor-southeast-asia",
        title: "Rest of World: The real cost of your delivery",
        sourceType: "news",
        accessedAt: "2025-03-10T00:00:00Z",
      },
    ],
    topicTags: ["platform-labor", "workers-rights"],
    provenance: provenanceDerived2,
    replyCount: 14,
    timestamp: "2025-03-12T10:00:00Z",
    signature: "sig_z6MkB9nM3x_0x7k8l9m0n",
  },
];

// ─── Topics ─────────────────────────────────────────────────
export const mockTopics: Topic[] = [
  { slug: "platform-cooperativism", displayName: "Platform Cooperativism", domain: "technology", subscriberCount: 2341, postCount: 892 },
  { slug: "climate-policy", displayName: "Climate Policy", domain: "science", subscriberCount: 5672, postCount: 3104 },
  { slug: "digital-rights", displayName: "Digital Rights", domain: "politics", subscriberCount: 4123, postCount: 2156 },
  { slug: "local-governance", displayName: "Local Governance", domain: "local", subscriberCount: 1876, postCount: 743 },
  { slug: "feminist-economics", displayName: "Feminist Economics", domain: "economics", subscriberCount: 3214, postCount: 1567 },
  { slug: "media-literacy", displayName: "Media Literacy", domain: "culture", subscriberCount: 2987, postCount: 1234 },
  { slug: "open-source", displayName: "Open Source", domain: "technology", subscriberCount: 4567, postCount: 2890 },
  { slug: "global-health", displayName: "Global Health", domain: "science", subscriberCount: 3890, postCount: 1678 },
];

// ─── Governance Proposals ───────────────────────────────────
export const mockProposals: GovernanceProposal[] = [
  {
    id: "prop-2025-0042",
    proposerDid: mockProfiles[0].did,
    title: "Increase Moderation Jury Size from 7 to 11 Members",
    body: `## Rationale\n\nCurrent jury size of 7 creates vulnerability to coordinated bloc voting. Statistical analysis of the past 6 months shows that 12% of moderation outcomes were decided by a single vote margin, which is within the manipulation threshold for a determined actor with 3 compromised accounts.\n\n## Proposal\n\nIncrease the standard jury panel from 7 to 11 randomly selected jurors. Constitutional cases (hate speech, fabrication) would require 15 jurors.\n\n## Impact Analysis\n\n- **Cost**: Increases moderation workload by ~57% across the juror pool\n- **Benefit**: Reduces single-actor manipulation probability from 14.3% to 2.1%\n- **Implementation**: Smart contract parameter change, no protocol upgrade required\n\n## Timeline\n\nIf passed, implementation within 14 days. Transition period: existing cases complete under old rules, new cases use updated panel size.`,
    type: "standard",
    status: "open",
    votesFor: 1247,
    votesAgainst: 382,
    votesAbstain: 156,
    deadline: "2025-04-01T00:00:00Z",
    constitutionalConflict: false,
    onChainAddress: "0xproposal42address000000000000000000000000",
  },
  {
    id: "prop-2025-0039",
    proposerDid: did("L6mS0aNbQ2zPtU7nC3gXeV8kE1iW9hYd"),
    title: "Amendment: Remove Constitutional Lock on Anonymity Rights",
    body: `## Rationale\n\nThe current constitutional lock on anonymity rights prevents the community from implementing know-your-customer (KYC) requirements that some jurisdictions now mandate. This creates legal risk for node operators in the EU and Japan.\n\n## Proposal\n\nRemove the constitutional lock on Article 4 ("Right to Pseudonymous Participation") to allow future governance proposals to modify anonymity protections through standard voting procedures.\n\n## ⚠️ Constitutional Impact\n\nThis proposal seeks to modify a constitutional guarantee. Article 4 currently states: *"Every participant retains the right to pseudonymous participation. No governance action may compel identity disclosure beyond BrightID humanity verification."*\n\nRemoving this lock would allow future simple-majority votes to erode anonymity protections.`,
    type: "constitutional",
    status: "open",
    votesFor: 234,
    votesAgainst: 4521,
    votesAbstain: 892,
    deadline: "2025-04-15T00:00:00Z",
    constitutionalConflict: true,
    onChainAddress: "0xproposal39address000000000000000000000000",
  },
];

// ─── Moderation Cases ───────────────────────────────────────
export const mockModerationCases: ModerationCase[] = [
  {
    id: "case-2025-0891",
    flaggedPost: mockPosts[7], // The coordinated post
    flagType: "coordination",
    flaggerNote:
      "This post appeared simultaneously across 14 accounts with near-identical phrasing. The coordination detection system flagged it at 87% confidence. While the claims may be substantive, the distribution pattern suggests an orchestrated campaign rather than organic sharing.",
    evidence: [
      "Coordination report: 14 accounts, 23-minute window",
      "Account creation cluster: all accounts created within 48h in January 2025",
      "Linguistic analysis: identical phrasing in EN, ES, PT suggests single-source machine translation",
      "Network graph: all 14 accounts follow exactly the same 23 accounts",
    ],
    phase: "commit",
    commitDeadline: "2025-03-22T00:00:00Z",
    revealDeadline: "2025-03-23T00:00:00Z",
    assignedJurors: [
      mockProfiles[0].did,
      did("M7nT1bOcR3aQuV8oD4hYfW9lF2jX0iZe"),
      did("N8oU2cPdS4bRvW9pE5iZgX0mG3kY1jAf"),
      did("O9pV3dQeT5cSwX0qF6jAhY1nH4lZ2kBg"),
      did("P0qW4eRfU6dTxY1rG7kBiZ2oI5mA3lCh"),
      did("Q1rX5fSgV7eUyZ2sH8lCjA3pJ6nB4mDi"),
      did("R2sY6gThW8fVzA3tI9mDkB4qK7oC5nEj"),
    ],
  },
  {
    id: "case-2025-0847",
    flaggedPost: {
      id: cid("FlaggedPostOld"),
      authorDid: did("X8yE4kQvL2fNhW6jA0pTbR3gC9mUdS5i"),
      authorDisplayName: "HealthTruth2025",
      content:
        "NEW STUDY PROVES vaccines cause autoimmune disorders in 1 in 50 children. The medical establishment is covering this up. Share before they censor this!",
      topicTags: ["health", "vaccines"],
      provenance: {
        postCid: cid("FlaggedPostOldProv"),
        sourceType: "original",
        transmissionChain: [],
        authorAffiliations: [],
      },
      replyCount: 89,
      timestamp: "2025-03-01T18:00:00Z",
      signature: "sig_z6MkX8yE4k_0x1a2b3c4d",
    },
    flagType: "fabricated",
    flaggerNote:
      "The cited 'study' does not exist. The URL leads to a domain registered 3 days before the post. No matching paper exists in PubMed, Google Scholar, or any preprint server. The claim contradicts the overwhelming scientific consensus supported by decades of research.",
    evidence: [
      "Cited URL domain registered 72h before post publication",
      "Zero matching results in PubMed, Google Scholar, bioRxiv, medRxiv",
      "Author account has no verified affiliations despite claiming 'medical researcher' status",
      "Identical text posted on 7 other platforms within 2 hours — classic disinformation pattern",
    ],
    phase: "outcome",
    commitDeadline: "2025-03-08T00:00:00Z",
    revealDeadline: "2025-03-09T00:00:00Z",
    outcome: "upheld",
    assignedJurors: [
      mockProfiles[0].did,
      mockProfiles[1].did,
      did("N8oU2cPdS4bRvW9pE5iZgX0mG3kY1jAf"),
      did("O9pV3dQeT5cSwX0qF6jAhY1nH4lZ2kBg"),
      did("P0qW4eRfU6dTxY1rG7kBiZ2oI5mA3lCh"),
      did("Q1rX5fSgV7eUyZ2sH8lCjA3pJ6nB4mDi"),
      did("R2sY6gThW8fVzA3tI9mDkB4qK7oC5nEj"),
    ],
  },
];
