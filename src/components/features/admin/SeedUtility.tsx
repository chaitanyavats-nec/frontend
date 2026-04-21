"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Database, Users, Chat } from "phosphor-react";

export function SeedUtility() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState("");
  const supabase = createClient();

  const handleSeedTopics = async () => {
    setIsSeeding(true);
    setStatus("Seeding topics...");
    try {
      const topics = [
        { name: "Politics & Governance", slug: "politics-governance" },
        { name: "Climate & Environment", slug: "climate-environment" },
        { name: "Technology & AI", slug: "technology-ai" },
        { name: "Economics & Labour", slug: "economics-labour" },
        { name: "Human Rights & Civil Society", slug: "human-rights-civil-society" },
      ];
      const { error } = await supabase.from("topics").upsert(topics, { onConflict: "slug" });
      if (error) throw error;
      setStatus("Topics seeded!");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCreateTestAccounts = async () => {
    setIsSeeding(true);
    setStatus("Creating test accounts...");
    try {
      const testUsers = [
        { email: "user1@agora.test", password: "TestAgora123", displayName: "Amara Osei", did: "did:agora:amara" },
        { email: "user2@agora.test", password: "TestAgora123", displayName: "Mateus Carvalho", did: "did:agora:mateus" },
      ];

      for (const u of testUsers) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: u.email,
          password: u.password,
        });
        
        if (error && !error.message.includes("already registered")) throw error;
        
        if (data.user) {
          // Manual profile insert (Step 1 requirement)
          await supabase.from("profiles").upsert({
            id: data.user.id,
            display_name: u.displayName,
            did: u.did,
            reputation_score: 0,
          });
        }
      }
      setStatus("Test accounts ready! (You may need to sign in)");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSeedPosts = async () => {
    setIsSeeding(true);
    setStatus("Seeding posts...");
    try {
      const { data: profiles } = await supabase.from("profiles").select("id, did");
      const { data: topics } = await supabase.from("topics").select("id, slug");

      if (!profiles || !topics) throw new Error("Missing profiles or topics");

      const amara = profiles.find(p => p.did === "did:agora:amara") || profiles[0];
      const mateus = profiles.find(p => p.did === "did:agora:mateus") || profiles[1] || profiles[0];

      const now = new Date();
      const posts = [
        {
          author_id: amara.id,
          body: "Direct democracy at the municipal level has shown exceptional results in Porto Alegre. We should look at scaling these models for broader governance.",
          topic_slug: "politics-governance",
          provenance: "original",
          daysAgo: 1.8
        },
        {
          author_id: mateus.id,
          body: "The recent IPCC report highlights that urban planning is our most effective lever for carbon sequestration in high-density areas. Local policy must adapt.",
          topic_slug: "climate-environment",
          provenance: "institutional",
          daysAgo: 1.2
        },
        {
          author_id: amara.id,
          body: "As LLMs move from predictive text to symbolic reasoning, we need to ensure the datasets remain open-source to prevent corporate mono-cultures in AI.",
          topic_slug: "technology-ai",
          provenance: "original",
          daysAgo: 0.8
        },
        {
          author_id: mateus.id,
          body: "This research on the 'Gig Economy 2.0' was commissioned to evaluate universal basic services as a stabilizer for precarious labor markets.",
          topic_slug: "economics-labour",
          provenance: "institutional",
          daysAgo: 0.4
        },
        {
          author_id: amara.id,
          body: "The expansion of digital surveillance in humanitarian corridors is a direct threat to civil society. Independent audits of these systems are non-negotiable.",
          topic_slug: "human-rights-civil-society",
          provenance: "original",
          daysAgo: 0.1
        }
      ];

      for (const p of posts) {
        const topic = topics.find(t => t.slug === p.topic_slug);
        const createdAt = new Date(now.getTime() - p.daysAgo * 24 * 60 * 60 * 1000).toISOString();
        
        await supabase.from("posts").insert({
          author_id: p.author_id,
          body: p.body,
          topic_id: topic?.id,
          provenance_type: p.provenance,
          created_at: createdAt
        });
      }
      setStatus("Chronological feed seeded!");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end">
      {status && <div className="bg-ink text-paper text-[10px] px-3 py-1 rounded-full animate-in fade-in slide-in-from-bottom-2">{status}</div>}
      <div className="flex gap-2">
        <Button
          onClick={handleSeedTopics}
          disabled={isSeeding}
          title="Step 4: Seed Topics"
          className="bg-paper border border-paper-dark text-slate hover:text-teal shadow-xl rounded-full p-3 h-12 w-12"
        >
          <Database size={20} />
        </Button>
        <Button
          onClick={handleCreateTestAccounts}
          disabled={isSeeding}
          title="Step 4: Create Test Accounts"
          className="bg-paper border border-paper-dark text-slate hover:text-violet shadow-xl rounded-full p-3 h-12 w-12"
        >
          <Users size={20} />
        </Button>
        <Button
          onClick={handleSeedPosts}
          disabled={isSeeding}
          title="Step 4: Seed Sample Posts"
          className="bg-paper border border-paper-dark text-slate hover:text-terracotta shadow-xl rounded-full p-3 h-12 w-12"
        >
          <Chat size={20} />
        </Button>
      </div>
    </div>
  );
}
