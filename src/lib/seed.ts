/**
 * AGORA DATABASE SEED SCRIPT
 * 
 * HOW TO RUN:
 * 1. Execute runSeed() from this file to wipe and seed the database.
 * 2. This seeds users, profiles, topics, follows, top-level posts, quote posts, and threaded comments.
 */

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const SEED_USERS = [
  {
    email: "amara@agora.test",
    password: "SeedAgora123!",
    displayName: "Amara Osei",
    did: "did:agora:amara-osei",
    bio: "Secondary school teacher. Trying to read the news without losing my mind.",
    location: "Accra, Ghana",
    reputation: 42
  },
  {
    email: "mateus@agora.test",
    password: "SeedAgora123!",
    displayName: "Mateus Carvalho",
    did: "did:agora:mateus-carvalho",
    bio: "Investigative journalist. São Paulo. Covering land rights, corporate impunity, and the slow collapse of the Amazon.",
    location: "São Paulo, Brazil",
    reputation: 87
  },
  {
    email: "dilnoza@agora.test",
    password: "SeedAgora123!",
    displayName: "Dilnoza Yusupova",
    did: "did:agora:dilnoza-yusupova",
    bio: "Human rights organiser. Diaspora. Building networks that survive crackdowns.",
    location: "Berlin, Germany",
    reputation: 63
  },
  {
    email: "kenji@agora.test",
    password: "SeedAgora123!",
    displayName: "Kenji Watanabe",
    did: "did:agora:kenji-watanabe",
    bio: "Protocol developer. Interested in governance systems that actually work. Tokyo.",
    location: "Tokyo, Japan",
    reputation: 55
  },
  {
    email: "priya@agora.test",
    password: "SeedAgora123!",
    displayName: "Priya Nair",
    did: "did:agora:priya-nair",
    bio: "Climate policy researcher. Following the gap between what governments promise and what they do.",
    location: "Chennai, India",
    reputation: 71
  },
  {
    email: "homelander@agora.test",
    password: "SeedAgora123!",
    displayName: "homelander",
    did: "did:agora:homelander",
    bio: "The world's greatest hero. Leader of The Seven. Verified Patriot.",
    location: "New York City, USA",
    reputation: 95
  },
  {
    email: "butcher@agora.test",
    password: "SeedAgora123!",
    displayName: "Billy Butcher",
    did: "did:agora:billy-butcher",
    bio: "Oi. Keeping honest people honest and supes in check.",
    location: "London, UK",
    reputation: 50
  }
];

const SEED_TOPICS = [
  { name: "Politics & Governance", slug: "politics-governance" },
  { name: "Climate & Environment", slug: "climate-environment" },
  { name: "Technology & AI", slug: "technology-ai" },
  { name: "Economics & Labour", slug: "economics-labour" },
  { name: "Human Rights & Civil Society", slug: "human-rights" },
  { name: "Media & Information", slug: "media-information" },
  { name: "Science & Health", slug: "science-health" }
];

const FOLLOW_GRAPH: Record<string, string[]> = {
  "Amara Osei": ["Mateus Carvalho", "Dilnoza Yusupova", "Priya Nair"],
  "Mateus Carvalho": ["Amara Osei", "Kenji Watanabe", "Dilnoza Yusupova"],
  "Dilnoza Yusupova": ["Amara Osei", "Priya Nair", "Mateus Carvalho"],
  "Kenji Watanabe": ["Mateus Carvalho", "Priya Nair"],
  "Priya Nair": ["Dilnoza Yusupova", "Amara Osei", "Kenji Watanabe"],
  "homelander": ["Billy Butcher", "Amara Osei"],
  "Billy Butcher": ["homelander", "Mateus Carvalho", "Kenji Watanabe"]
};

export async function runSeed() {
  console.log("🚀 Starting Agora Seeding...");
  
  const results = {
    usersCreated: 0,
    profilesUpserted: 0,
    topicsUpserted: 0,
    postsInserted: 0,
    followsCreated: 0,
    commentsInserted: 0,
    errors: [] as string[]
  };

  try {
    const userMap: Record<string, string> = {}; // Name -> UUID

    // 1. SEED USERS & PROFILES
    for (const u of SEED_USERS) {
      try {
        // Sign up User
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: u.email,
          password: u.password,
          options: { data: { display_name: u.displayName } }
        });

        let userId = authData.user?.id;

        if (authError) {
          if (authError.message.includes("already registered") || authError.message.includes("use a different email")) {
            // Fetch existing user if already there
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: u.email,
              password: u.password
            });
            if (signInError) throw signInError;
            userId = signInData.user?.id;
          } else {
            throw authError;
          }
        } else {
          results.usersCreated++;
        }

        if (userId) {
          userMap[u.displayName] = userId;
          
          // Upsert Profile
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: userId,
            display_name: u.displayName,
            did: u.did,
            bio: u.bio,
            reputation_score: u.reputation
          });

          if (profileError) throw profileError;
          results.profilesUpserted++;

          // Upsert sample affiliations for homelander and Billy Butcher to match the screenshots perfectly
          if (u.displayName === "homelander") {
            try {
              await supabase.from("affiliations").upsert([
                { user_id: userId, organization_name: "Vought Intl", role: "Patriot", affiliation_type: "Corporate", is_current: true },
                { user_id: userId, organization_name: "The Seven", role: "Leader", affiliation_type: "Team", is_current: true },
                { user_id: userId, organization_name: "Vought Tower", role: "Resident", affiliation_type: "Institutional", is_current: true }
              ]);
            } catch (err) {
              console.warn("Could not seed affiliations: ", err);
            }
          } else if (u.displayName === "Billy Butcher") {
            try {
              await supabase.from("affiliations").upsert([
                { user_id: userId, organization_name: "The Boys", role: "Leader", affiliation_type: "Vigilante", is_current: true }
              ]);
            } catch (err) {
              console.warn("Could not seed affiliations: ", err);
            }
          }
        }
      } catch (err) {
        results.errors.push(`User ${u.displayName} failed: ${(err as Error).message}`);
      }
    }

    // 2. SEED TOPICS
    for (const t of SEED_TOPICS) {
      try {
        const { error } = await supabase.from("topics").upsert(t, { onConflict: 'slug' });
        if (error) throw error;
        results.topicsUpserted++;
      } catch (err) {
        results.errors.push(`Topic ${t.name} failed: ${(err as Error).message}`);
      }
    }

    // 3. SEED FOLLOWS
    const { data: allProfiles } = await supabase.from("profiles").select("id, display_name");
    const profileMap: Record<string, string> = {};
    allProfiles?.forEach(p => profileMap[p.display_name] = p.id);

    for (const [followerName, followedNames] of Object.entries(FOLLOW_GRAPH)) {
      const followerId = profileMap[followerName];
      if (!followerId) continue;

      for (const followedName of followedNames) {
        const followingId = profileMap[followedName];
        if (!followingId) continue;

        try {
          const { error } = await supabase.from("follows").upsert({
            follower_id: followerId,
            following_id: followingId
          });
          if (error) throw error;
          results.followsCreated++;
        } catch (err) {
          results.errors.push(`Follow ${followerName} -> ${followedName} failed: ${(err as Error).message}`);
        }
      }
    }

    // 4. SEED POSTS
    const { data: allTopics } = await supabase.from("topics").select("id, slug");
    const topicMap: Record<string, string> = {};
    allTopics?.forEach(t => topicMap[t.slug] = t.id);

    // Wipe previous posts to ensure fresh start
    try {
      await supabase.from("posts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } catch (e) {
      console.warn("Truncate failed, proceeding anyway...");
    }

    const now = new Date();
    const postIds: Record<string, string> = {}; // Key identifier -> UUID

    // Seed Top-level posts
    const TOP_POSTS = [
      {
        key: "butcher_1",
        authorName: "Billy Butcher",
        topicSlug: "politics-governance",
        provenance: "derived",
        origin_url: "https://theboys.info/reports/corporate-takedowns-2026",
        origin_label: "The Boys Corporate Takedowns Report (2026)",
        media: ["https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800"],
        body: "Oi. We just analyzed the last 30,000 corporate content takedowns under the guise of 'harm reduction'. 84% of them targeted union organizers and environmental reporters. It's not safety, it's corporate protection. Data published below.",
        hoursAgo: 12
      },
      {
        key: "homelander_1",
        authorName: "homelander",
        topicSlug: "politics-governance",
        provenance: "institutional",
        body: "Vought International has always put people first. Our safety systems are audited by certified, neutral panels. Whistleblowers with unverified datasets are just seeking clout. Trust the heroes who keep you safe every single day. 🇺🇸",
        hoursAgo: 10
      },
      {
        key: "mateus_1",
        authorName: "Mateus Carvalho",
        topicSlug: "human-rights",
        provenance: "original",
        media: ["https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=800"],
        body: "Three soy farms in Pará have received environmental compliance certificates despite active deforestation alerts on their land. The certificates were issued four days after the alerts were filed. I have the documents. Thread below.",
        hoursAgo: 24
      },
      {
        key: "priya_1",
        authorName: "Priya Nair",
        topicSlug: "climate-environment",
        provenance: "funded",
        media: ["https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800"],
        body: "New report from the Global Climate Finance Initiative on adaptation funding gaps in South Asia. Disclosure: this research was commissioned by the Green Climate Fund. Methodology and raw data are published in full. Read the numbers, not just the summary.",
        hoursAgo: 36
      },
      {
        key: "dilnoza_1",
        authorName: "Dilnoza Yusupova",
        topicSlug: "human-rights",
        provenance: "republished",
        body: "Republishing the statement of the independent legal observers in Berlin: 'Legal observers documented 34 arrests at last week's demonstration. Official figure is 12. The gap between those numbers is not a rounding error.'",
        hoursAgo: 48
      },
      {
        key: "kenji_1",
        authorName: "Kenji Watanabe",
        topicSlug: "technology-ai",
        provenance: "amplified",
        media: ["https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"],
        body: "Amplifying the decentralized identity protocol specification: A DID still tells everyone you interacted with a system. The privacy guarantee comes from zero-knowledge credentials. Architecture matters more than ownership.",
        hoursAgo: 72
      }
    ];

    for (const p of TOP_POSTS) {
      try {
        const authorId = profileMap[p.authorName];
        const topicId = topicMap[p.topicSlug];
        if (!authorId || !topicId) throw new Error("Missing author or topic mapping");

        const createdAt = new Date(now.getTime() - p.hoursAgo * 60 * 60 * 1000).toISOString();

        const { data: inserted, error } = await supabase.from("posts").insert({
          author_id: authorId,
          topic_id: topicId,
          provenance_type: p.provenance,
          body: p.body,
          origin_url: (p as any).origin_url || null,
          origin_label: (p as any).origin_label || null,
          media_urls: (p as any).media || null,
          created_at: createdAt,
          type: "post",
          is_published: true
        }).select("id").single();

        if (error) throw error;
        if (inserted) {
          postIds[p.key] = inserted.id;
        }
        results.postsInserted++;
      } catch (err) {
        results.errors.push(`Post ${p.key} failed: ${(err as Error).message}`);
      }
    }

    // 5. SEED QUOTE POSTS (NESTED PROVENANCE REPOST CHAINS)
    const QUOTE_POSTS = [
      {
        key: "homelander_quote",
        authorName: "homelander",
        topicSlug: "politics-governance",
        provenance: "derived",
        origin_url: "https://vought.com/news/security-operations-verification",
        origin_label: "Vought Security Verification Ledger (2026)",
        body: "Billy is spreading lies again. Vought's security operations are 100% legal, transparent, and anchored on-chain. This is a coordinated attack on our heroes!",
        quotedKey: "butcher_1",
        hoursAgo: 8
      },
      {
        key: "butcher_quote",
        authorName: "Billy Butcher",
        topicSlug: "politics-governance",
        provenance: "derived",
        origin_url: "https://theboys.info/rants/vought-scam-2026",
        origin_label: "The Boys Counter-Audit Ledger (2026)",
        body: "Coordination flagged? Safe on-chain? Talk is cheap, mate. Where's the transaction hash of your so-called audit report? Clear the ledger.",
        quotedKey: "homelander_quote",
        hoursAgo: 6
      }
    ];

    for (const p of QUOTE_POSTS) {
      try {
        const authorId = profileMap[p.authorName];
        const topicId = topicMap[p.topicSlug];
        const quotedId = postIds[p.quotedKey];
        if (!authorId || !topicId || !quotedId) throw new Error("Missing author, topic, or quoted post mapping");

        const createdAt = new Date(now.getTime() - p.hoursAgo * 60 * 60 * 1000).toISOString();

        const { data: inserted, error } = await supabase.from("posts").insert({
          author_id: authorId,
          topic_id: topicId,
          provenance_type: p.provenance,
          body: p.body,
          origin_url: (p as any).origin_url || null,
          origin_label: (p as any).origin_label || null,
          created_at: createdAt,
          quoted_post_id: quotedId,
          type: "post",
          is_published: true
        }).select("id").single();

        if (error) throw error;
        if (inserted) {
          postIds[p.key] = inserted.id;
        }
        results.postsInserted++;
      } catch (err) {
        results.errors.push(`Quote Post ${p.key} failed: ${(err as Error).message}`);
      }
    }

    // 6. SEED COMMENTS (THREADED CONVERSATIONS)
    const COMMENTS = [
      // 1. Replies to Billy Butcher's First Post (butcher_1)
      {
        authorName: "homelander",
        body: "This is completely unverified gossip. Our legal team is already reviewing these false claims.",
        parentKey: "butcher_1",
        rootKey: "butcher_1",
        hoursAgo: 11
      },
      {
        authorName: "Billy Butcher",
        body: "Review this, mate.",
        parentKey: "butcher_1",
        rootKey: "butcher_1",
        hoursAgo: 10.5,
        parentIsPreviousComment: true
      },
      {
        authorName: "Kenji Watanabe",
        body: "Outstanding analysis, Billy. The IPFS content hash checks out. Is the raw parquet file available?",
        parentKey: "butcher_1",
        rootKey: "butcher_1",
        hoursAgo: 10
      },
      {
        authorName: "Billy Butcher",
        body: "Yes, the CID is uploaded to the permanent web. Check my bio.",
        parentKey: "butcher_1",
        rootKey: "butcher_1",
        hoursAgo: 9.5,
        parentIsPreviousComment: true
      },

      // 2. Replies to Homelander's First Post (homelander_1)
      {
        authorName: "Billy Butcher",
        body: "Oi. Keeping honest people honest.",
        parentKey: "homelander_1",
        rootKey: "homelander_1",
        hoursAgo: 9
      },
      {
        authorName: "Amara Osei",
        body: "The tone here is highly defensive. Why are the raw safety reports not downloadable directly from the Vought portal?",
        parentKey: "homelander_1",
        rootKey: "homelander_1",
        hoursAgo: 8.5
      },

      // 3. Replies to Mateus Carvalho's Post (mateus_1)
      {
        authorName: "Kenji Watanabe",
        body: "This is extremely concerning. The timestamps on those deforested certificates match exactly with the corporate contribution cycles. Have you submitted these PDFs to the public IPFS index?",
        parentKey: "mateus_1",
        rootKey: "mateus_1",
        hoursAgo: 22
      },
      {
        authorName: "Mateus Carvalho",
        body: "Yes, I have. The IPFS root CID is QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco. All hashes are cryptographically signed.",
        parentKey: "mateus_1",
        rootKey: "mateus_1",
        hoursAgo: 21,
        parentIsPreviousComment: true
      },
      {
        authorName: "Amara Osei",
        body: "Thank you for this brave work, Mateus. The local farming associations in Pará have been trying to flag this coordination for months. We will amplify.",
        parentKey: "mateus_1",
        rootKey: "mateus_1",
        hoursAgo: 18
      },

      // 4. Replies to Priya Nair's Post (priya_1)
      {
        authorName: "Dilnoza Yusupova",
        body: "The methodology is outstandingly transparent. Having the GCF fund the research but keeping the raw dataset fully public on-chain is how all climate research should be published.",
        parentKey: "priya_1",
        rootKey: "priya_1",
        hoursAgo: 32
      },
      {
        authorName: "Amara Osei",
        body: "Looking at the South Asian adaptation numbers, the adaptation funding gap is actually wider than we estimated. Outstanding contribution.",
        parentKey: "priya_1",
        rootKey: "priya_1",
        hoursAgo: 30
      },

      // 5. Replies to Dilnoza Yusupova's Post (dilnoza_1)
      {
        authorName: "Priya Nair",
        body: "This discrepancy of 22 missing arrests is massive. It represents a systematic effort to downplay the scale of the civil demonstration. Thank you for republishing with the observer hashes.",
        parentKey: "dilnoza_1",
        rootKey: "dilnoza_1",
        hoursAgo: 44
      },
      {
        authorName: "Billy Butcher",
        body: "Same old tricks. Keep pushing them, Dilnoza. Light always sanitizes the shadows.",
        parentKey: "dilnoza_1",
        rootKey: "dilnoza_1",
        hoursAgo: 42
      },

      // 6. Replies to Kenji Watanabe's Post (kenji_1)
      {
        authorName: "Amara Osei",
        body: "Very well said, Kenji. Standard DIDs only anchor identity; Zero-Knowledge credentials provide actual, verifiable privacy. This is a crucial distinction.",
        parentKey: "kenji_1",
        rootKey: "kenji_1",
        hoursAgo: 68
      },
      {
        authorName: "Priya Nair",
        body: "Is there an active implementation of this protocol that we can test on our community platforms?",
        parentKey: "kenji_1",
        rootKey: "kenji_1",
        hoursAgo: 64
      },

      // 7. Replies to Homelander's Quote Post (homelander_quote)
      {
        authorName: "Amara Osei",
        body: "Saying Vought is transparent doesn't make it so. Show us the public contract address for the neutral audit panel.",
        parentKey: "homelander_quote",
        rootKey: "homelander_quote",
        hoursAgo: 7
      },

      // 8. Replies to Billy Butcher's Quote Post (butcher_quote)
      {
        authorName: "Kenji Watanabe",
        body: "I am auditing the Vought contract transaction hash. It turns out the 'neutral panel' keys are controlled by a 2-of-3 multisig held entirely by Vought subsidiaries.",
        parentKey: "butcher_quote",
        rootKey: "butcher_quote",
        hoursAgo: 5
      },
      {
        authorName: "Billy Butcher",
        body: "Told you so, mate. Total sham.",
        parentKey: "butcher_quote",
        rootKey: "butcher_quote",
        hoursAgo: 4,
        parentIsPreviousComment: true
      }
    ];

    let lastCommentId: string | null = null;
    for (const c of COMMENTS) {
      try {
        const authorId = profileMap[c.authorName];
        const rootId = postIds[c.rootKey];
        let parentId = postIds[c.parentKey];

        if (c.parentIsPreviousComment && lastCommentId) {
          parentId = lastCommentId;
        }

        if (!authorId || !rootId || !parentId) throw new Error("Missing author, root, or parent post mapping");

        const createdAt = new Date(now.getTime() - c.hoursAgo * 60 * 60 * 1000).toISOString();

        const { data: inserted, error } = await supabase.from("posts").insert({
          author_id: authorId,
          parent_id: parentId,
          root_id: rootId,
          body: c.body,
          created_at: createdAt,
          provenance_type: "derived",
          type: "comment",
          is_published: true
        }).select("id").single();

        if (error) throw error;
        if (inserted) {
          lastCommentId = inserted.id;
        }
        results.commentsInserted++;
      } catch (err) {
        results.errors.push(`Comment by ${c.authorName} failed: ${(err as Error).message}`);
      }
    }

    console.log("✅ Seeding Complete!");
    console.table({
      "Users Created": results.usersCreated,
      "Profiles Upserted": results.profilesUpserted,
      "Topics Upserted": results.topicsUpserted,
      "Posts Inserted": results.postsInserted,
      "Comments Inserted": results.commentsInserted,
      "Follows Created": results.followsCreated,
      "Errors": results.errors.length
    });

    if (results.errors.length > 0) {
      throw new Error(
        `Seeding completed with ${results.errors.length} errors:\n\n` +
        results.errors.slice(0, 10).map((e, idx) => `${idx + 1}. ${e}`).join("\n") +
        (results.errors.length > 10 ? `\n... and ${results.errors.length - 10} more` : "") +
        `\n\nThis might be because your Supabase tables have Row Level Security (RLS) enabled, which prevents client-side insertions of other users' posts.\n\n` +
        `To allow this client seed to run successfully, run this SQL in your Supabase SQL Editor:\n` +
        `ALTER TABLE posts DISABLE ROW LEVEL SECURITY;\n` +
        `ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;\n` +
        `ALTER TABLE follows DISABLE ROW LEVEL SECURITY;\n` +
        `ALTER TABLE affiliations DISABLE ROW LEVEL SECURITY;\n` +
        `ALTER TABLE topics DISABLE ROW LEVEL SECURITY;\n\n` +
        `After seeding, you can re-enable RLS by running:\n` +
        `ALTER TABLE posts ENABLE ROW LEVEL SECURITY;\n` +
        `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\n` +
        `ALTER TABLE follows ENABLE ROW LEVEL SECURITY;\n` +
        `ALTER TABLE affiliations ENABLE ROW LEVEL SECURITY;\n` +
        `ALTER TABLE topics ENABLE ROW LEVEL SECURITY;`
      );
    }

  } catch (globalErr) {
    console.error("❌ Critical Seeding Failure:", globalErr);
    throw globalErr;
  }
}
