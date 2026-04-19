"use client";

import { useState } from "react";
import { useMockData } from "@/hooks/useMockData";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ProvenanceTag } from "@/components/features/provenance/ProvenanceTag";
import { ArrowLeft, TextAa, Link as LinkIcon, Info } from "phosphor-react";
import { useRouter } from "next/navigation";
import type { ProvenanceRecord, Post } from "@/types";

export default function ComposePage() {
  const router = useRouter();
  const { topics, currentUser } = useMockData();
  const { createPost, isCreating, createError } = usePosts();
  
  const [body, setBody] = useState("");
  const [topicId, setTopicId] = useState("");
  const [citationUrl, setCitationUrl] = useState("");
  const [provenanceType, setProvenanceType] = useState<any>("original");

  // Construct a preview provenance record
  const previewProvenance: ProvenanceRecord = {
    postCid: "preview-cid",
    sourceType: provenanceType,
    transmissionChain: [],
    authorAffiliations: currentUser.verifiedAffiliations || [],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({
        body,
        topicId,
        provenanceType,
        citationUrl: citationUrl || null,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 font-sans min-h-screen">
      <header className="flex items-center justify-between mb-12">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-paper-dark/30 transition-colors text-slate"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-editorial font-bold text-2xl tracking-tight text-ink">New Contribution</h1>
        <div className="w-9" /> {/* Spacer */}
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Editor Area */}
        <div className="space-y-6">
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What is the evidence? What is the context?"
            className="w-full bg-transparent border-none focus:ring-0 text-xl font-sans leading-relaxed text-ink placeholder:text-slate/40 min-h-[200px] resize-none"
          />

          <div className="flex items-center gap-4 border-y border-paper-dark py-4">
            <div className="flex-1 flex items-center gap-2 group">
              <LinkIcon size={18} className="text-slate group-focus-within:text-teal transition-colors" />
              <input
                type="url"
                value={citationUrl}
                onChange={(e) => setCitationUrl(e.target.value)}
                placeholder="Primary source URL (optional)"
                className="bg-transparent border-none focus:ring-0 text-sm font-mono text-teal w-full placeholder:text-slate/30"
              />
            </div>
          </div>
        </div>

        {/* Metadata section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate flex items-center gap-1.5">
              Topic Category
            </label>
            <select
              required
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full bg-paper border border-paper-dark rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a topic...</option>
              {topics.map((t) => (
                <option key={t.slug} value={(t as any).id || t.slug}>
                  {t.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate flex items-center gap-1.5">
              Provenance Type
            </label>
            <select
              required
              value={provenanceType}
              onChange={(e) => setProvenanceType(e.target.value)}
              className="w-full bg-paper border border-paper-dark rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all appearance-none cursor-pointer"
            >
              <option value="original">Original Contribution</option>
              <option value="institutional">Institutional / Official</option>
              <option value="derived">Derived / Analysis</option>
              <option value="republished">Republished Content</option>
            </select>
          </div>
        </div>

        {/* Preview section */}
        <div className="bg-surface border border-paper-dark p-6 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate">Live Provenance Preview</span>
            <Info size={14} className="text-slate/50" />
          </div>
          <div className="pt-2">
            <ProvenanceTag 
              provenance={previewProvenance} 
              postId="preview" 
              expanded={true}
            />
          </div>
          <p className="text-[10px] text-slate italic pt-2">
            Your verified affiliations ({currentUser.verifiedAffiliations.length}) will be automatically attached to this post's provenance chain.
          </p>
        </div>

        {createError && (
          <p className="text-terracotta text-xs font-medium text-center bg-terracotta/5 py-3 rounded-lg border border-terracotta/20">
            {(createError as any).message || "Failed to publish post."}
          </p>
        )}

        <div className="pt-8">
          <Button
            type="submit"
            disabled={isCreating || !body || !topicId}
            className="w-full bg-ink text-paper h-14 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-teal transition-all duration-300 shadow-xl shadow-ink/10 disabled:opacity-50 disabled:hover:bg-ink"
          >
            {isCreating ? "Publishing to Agora..." : "Publish Contribution"}
          </Button>
        </div>
      </form>
    </div>
  );
}
