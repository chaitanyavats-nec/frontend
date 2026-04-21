"use client";

import { useState } from "react";
import { useTopics } from "@/hooks/useTopics";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ProvenanceTag } from "@/components/features/provenance/ProvenanceTag";
import { ArrowLeft, Link as LinkIcon } from "phosphor-react";
import { useRouter } from "next/navigation";
import type { ProvenanceRecord } from "@/types";

export default function ComposePage() {
  const router = useRouter();
  const { data: topics } = useTopics();
  useAuth();
  const { createPost, isCreating, createError } = usePosts();

  const [body, setBody] = useState("");
  const [topicId, setTopicId] = useState("");
  const [citationUrl, setCitationUrl] = useState("");
  const [provenanceType, setProvenanceType] = useState<ProvenanceRecord["sourceType"]>("original");

  // Construct a preview provenance record
  const previewProvenance: ProvenanceRecord = {
    postCid: "preview-cid",
    sourceType: provenanceType,
    transmissionChain: [],
    authorAffiliations: [], // Placeholder until real affiliations are connected
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
    <div className="max-w-2xl mx-auto py-12 px-6 font-sans min-h-screen bg-paper-page">
      <header className="flex items-center justify-between mb-12">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-400"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <div className="sublabel mb-1">New Witness</div>
          <h1 className="font-serif font-bold text-2xl tracking-tight text-neutral-900 dark:text-neutral-50">Publish Contribution</h1>
        </div>
        <div className="w-9" /> {/* Spacer */}
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Editor Area */}
        <div className="space-y-6">
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What needs witnessing today? Provide context, evidence, and perspective..."
            className="w-full bg-transparent border-none focus:ring-0 text-lg font-sans leading-relaxed text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 min-h-[250px] resize-none"
          />

          <div className="flex items-center gap-4 border-y border-neutral-200 dark:border-neutral-800 py-4">
            <div className="flex-1 flex items-center gap-3 group">
              <LinkIcon size={18} className="text-neutral-400 group-focus-within:text-cyan-600 transition-colors" />
              <input
                type="url"
                value={citationUrl}
                onChange={(e) => setCitationUrl(e.target.value)}
                placeholder="PRIMARY SOURCE URL (OPTIONAL)"
                className="bg-transparent border-none focus:ring-0 text-[10px] font-mono text-cyan-700 dark:text-cyan-300 w-full placeholder:text-neutral-300 dark:placeholder:text-neutral-700 uppercase tracking-widest"
              />
            </div>
          </div>
        </div>

        {/* Metadata section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="sublabel flex items-center gap-1.5">
              Topic Category
            </label>
            <select
              required
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full bg-paper-raised border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all appearance-none cursor-pointer text-neutral-900 dark:text-neutral-50"
            >
              <option value="" disabled>Select a topic...</option>
              {topics?.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="sublabel flex items-center gap-1.5">
              Provenance Type
            </label>
            <select
              required
              value={provenanceType}
              onChange={(e) => setProvenanceType(e.target.value as "original" | "derived" | "republished" | "institutional")}
              className="w-full bg-paper-raised border border-neutral-300 dark:border-neutral-700 rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all appearance-none cursor-pointer text-neutral-900 dark:text-neutral-50"
            >
              <option value="original">Original Contribution</option>
              <option value="institutional">Institutional / Official</option>
              <option value="derived">Derived / Analysis</option>
              <option value="republished">Republished Content</option>
            </select>
          </div>
        </div>

        {/* Live Preview section */}
        <div className="bg-paper-raised border border-neutral-200 dark:border-neutral-800 p-8 rounded-md space-y-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-dotted border-neutral-200 dark:border-neutral-800 pb-2">
            <span className="sublabel">Live Provenance Preview</span>
            <div className="relative w-4 h-4">
              <div className="absolute top-0 left-0.5 w-2.5 h-2.5 bg-cyan-300/60 rounded-full" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-magenta-300/60 rounded-full" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-300/60 rounded-full" />
            </div>
          </div>
          <div className="pt-2">
            <ProvenanceTag
              provenance={previewProvenance}
              postId="preview"
              expanded={true}
            />
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-sm p-3 border border-dashed border-neutral-200 dark:border-neutral-800">
            <p className="text-[10px] font-mono text-neutral-400 leading-relaxed">
              SIGNATURE PROCESS: YOUR VERIFIED LOCAL EXPERTISE AND PROFESSIONAL AFFILIATIONS WILL BE AUTOMATICALLY ATTACHED TO THIS POST&apos;S PROVENANCE CHAIN UPON PUBLICATION.
            </p>
          </div>
        </div>

        {createError && (
          <p className="text-magenta-600 dark:text-magenta-400 text-[10px] font-mono font-bold uppercase tracking-widest text-center bg-magenta-50 dark:bg-magenta-900/10 py-4 rounded-sm border border-magenta-200 dark:border-magenta-800">
            {(createError as Error).message || "Failed to publish post."}
          </p>
        )}

        <div className="pt-8">
          <Button
            type="submit"
            disabled={isCreating || !body || !topicId}
            className="w-full bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 h-16 rounded-sm font-mono font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl"
          >
            {isCreating ? "Witnessing Content..." : "Commit Transfer"}
          </Button>
        </div>
      </form>
    </div>

  );
}
