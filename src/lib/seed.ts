/**
 * AGORA DATABASE SEED SCRIPT
 * 
 * HOW TO RUN:
 * 1. Import 'runSeed' from this file in a development-only route or component.
 * 2. Execute 'runSeed()' in the browser console or via a button click.
 * 
 * HOW TO WIPE AND RE-SEED:
 * 1. Go to your Supabase SQL Editor.
 * 2. Run: TRUNCATE public.posts, public.post_interactions, public.follows, public.profiles CASCADE;
 * 3. Then run this seed script again.
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

const SEED_POSTS = [
  {
    authorName: "Mateus Carvalho",
    topicSlug: "human-rights",
    provenance: "original",
    body: "Three soy farms in Pará have received environmental compliance certificates despite active deforestation alerts on their land. The certificates were issued four days after the alerts were filed. I have the documents. Thread below.",
    hoursAgo: 144 // 6 days
  },
  {
    authorName: "Amara Osei",
    topicSlug: "media-information",
    provenance: "original",
    body: "I showed my students the same story covered by four different outlets. Same event. Four completely different emotional registers. One was rage-inducing. One was boring. One made it seem resolved. One didn't mention the affected community at all. Media literacy should be compulsory before social media, not after.",
    hoursAgo: 140
  },
  {
    authorName: "Dilnoza Yusupova",
    topicSlug: "human-rights",
    provenance: "original",
    body: "Reminder that \"digital safety\" is not a metaphor for people in authoritarian contexts. Three members of our network had their devices searched at the border last month. Two had Signal. One had nothing. Guess which two were detained longer.",
    hoursAgo: 120 // 5 days
  },
  {
    authorName: "Priya Nair",
    topicSlug: "climate-environment",
    provenance: "institutional",
    body: "The new IPCC working group figures on carbon capture are worth reading carefully. The headline number assumes deployment of technologies that do not yet exist at scale. The footnotes are doing a lot of work that the press release is not.",
    hoursAgo: 115
  },
  {
    authorName: "Kenji Watanabe",
    topicSlug: "technology-ai",
    provenance: "original",
    body: "The governance problem with large language models is not that they hallucinate. It is that the organisations deploying them have no meaningful accountability to the people most affected by their outputs. Hallucination is a technical problem. Accountability is a structural one.",
    hoursAgo: 96 // 4 days
  },
  {
    authorName: "Mateus Carvalho",
    topicSlug: "economics-labour",
    provenance: "original",
    body: "Platform workers in Brazil are legally classified as independent contractors while being subject to algorithmic management that controls their hours, routes, and pay rates in real time. The law has not caught up. The platforms know this and have lobbied to keep it that way.",
    hoursAgo: 90
  },
  {
    authorName: "Amara Osei",
    topicSlug: "politics-governance",
    provenance: "original",
    body: "Every election cycle the same pattern: turnout anxiety, then higher than expected turnout, then surprise at who showed up. The surprise is a polling failure, not a civic one. People are participating. We are just not counting the right people in advance.",
    hoursAgo: 72 // 3 days
  },
  {
    authorName: "Priya Nair",
    topicSlug: "climate-environment",
    provenance: "funded",
    body: "New report from the Global Climate Finance Initiative on adaptation funding gaps in South Asia. Disclosure: this research was commissioned by the Green Climate Fund. Methodology and raw data are published in full. Read the numbers, not just the summary.",
    hoursAgo: 68
  },
  {
    authorName: "Dilnoza Yusupova",
    topicSlug: "human-rights",
    provenance: "original",
    body: "Legal observers documented 34 arrests at last week's demonstration. Official figure is 12. The gap between those numbers is not a rounding error. It is a policy.",
    hoursAgo: 48 // 2 days
  },
  {
    authorName: "Kenji Watanabe",
    topicSlug: "technology-ai",
    provenance: "original",
    body: "Decentralised identity is not a privacy solution by itself. A DID still tells everyone you interacted with a system, when, and how often. The privacy guarantee comes from what is NOT recorded, not from who holds the record. Architecture matters more than ownership.",
    hoursAgo: 44
  },
  {
    authorName: "Mateus Carvalho",
    topicSlug: "media-information",
    provenance: "original",
    body: "A think tank released a report yesterday that was cited by seven major outlets within 24 hours. Six of the seven did not mention who funds the think tank. I looked it up. You will not be surprised.",
    hoursAgo: 24 // 1 day
  },
  {
    authorName: "Amara Osei",
    topicSlug: "science-health",
    provenance: "original",
    body: "The WHO malaria figures for sub-Saharan Africa were updated quietly last week. Progress on mortality rates is real and significant. It received a fraction of the coverage of the setbacks. Good news travels slowly because it does not make people click.",
    hoursAgo: 20
  },
  {
    authorName: "Priya Nair",
    topicSlug: "politics-governance",
    provenance: "institutional",
    body: "The draft text of the global plastics treaty has been revised again. The binding production cap that 80 countries agreed to in principle in March is no longer in the current working draft. These negotiations happen mostly out of sight.",
    hoursAgo: 12
  },
  {
    authorName: "Kenji Watanabe",
    topicSlug: "technology-ai",
    provenance: "original",
    body: "Open source does not equal open governance. You can publish your code and still make every meaningful product decision in a room of five people. Transparency of artifact is not the same as transparency of process.",
    hoursAgo: 8
  },
  {
    authorName: "Dilnoza Yusupova",
    topicSlug: "human-rights",
    provenance: "original",
    body: "If your platform's safety features work well for users in Western Europe and fail for users in Central Asia or East Africa, that is not a localisation problem. That is a prioritisation problem. Safety by geography is not safety.",
    hoursAgo: 3
  }
];

const FOLLOW_GRAPH: Record<string, string[]> = {
  "Amara Osei": ["Mateus Carvalho", "Dilnoza Yusupova", "Priya Nair"],
  "Mateus Carvalho": ["Amara Osei", "Kenji Watanabe", "Dilnoza Yusupova"],
  "Dilnoza Yusupova": ["Amara Osei", "Priya Nair", "Mateus Carvalho"],
  "Kenji Watanabe": ["Mateus Carvalho", "Priya Nair"],
  "Priya Nair": ["Dilnoza Yusupova", "Amara Osei", "Kenji Watanabe"]
};

export async function runSeed() {
  console.log("🚀 Starting Agora Seeding...");
  
  const results = {
    usersCreated: 0,
    profilesUpserted: 0,
    topicsUpserted: 0,
    postsInserted: 0,
    followsCreated: 0,
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
          if (authError.message.includes("User already registered")) {
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
            location: u.location,
            reputation_score: u.reputation
          });

          if (profileError) throw profileError;
          results.profilesUpserted++;
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

    const now = new Date();
    for (const p of SEED_POSTS) {
      try {
        const authorId = profileMap[p.authorName];
        const topicId = topicMap[p.topicSlug];
        if (!authorId || !topicId) throw new Error("Missing author or topic mapping");

        const createdAt = new Date(now.getTime() - p.hoursAgo * 60 * 60 * 1000).toISOString();

        const { error } = await supabase.from("posts").insert({
          author_id: authorId,
          topic_id: topicId,
          provenance_type: p.provenance,
          body: p.body,
          created_at: createdAt
        });

        if (error) throw error;
        results.postsInserted++;
      } catch (err) {
        results.errors.push(`Post by ${p.authorName} failed: ${(err as Error).message}`);
      }
    }

    console.log("✅ Seeding Complete!");
    console.table({
      "Users Created": results.usersCreated,
      "Profiles Upserted": results.profilesUpserted,
      "Topics Upserted": results.topicsUpserted,
      "Posts Inserted": results.postsInserted,
      "Follows Created": results.followsCreated,
      "Errors": results.errors.length
    });

    if (results.errors.length > 0) {
      console.error("⚠️ Errors encountered during seeding:");
      results.errors.forEach(e => console.error(` - ${e}`));
    }

  } catch (globalErr) {
    console.error("❌ Critical Seeding Failure:", globalErr);
  }
}
