"use client";

import { useState } from "react";
import { useTopics } from "@/hooks/useTopics";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ProvenanceTag } from "@/components/features/provenance/ProvenanceTag";
import { ArrowLeft, Link as LinkIcon, Image as ImageIcon, ChartBar, MapPin, Plus, Trash, X } from "phosphor-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { PostWithProvenance } from "@/types";

export default function ComposePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: topics } = useTopics();
  const { createPost, isCreating, createError } = usePosts();
  const [body, setBody] = useState("");
  const [topicId, setTopicId] = useState("");
  const [citationUrl, setCitationUrl] = useState("");
  const [provenanceType, setProvenanceType] = useState<"original" | "derived" | "republished" | "institutional">("original");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [locationName, setLocationName] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [activeTab, setActiveTab] = useState<"media" | "poll" | "location" | null>(null);
  const [tempMediaUrl, setTempMediaUrl] = useState("");

  // Construct a preview post object for the provenance tag
  const previewPost: PostWithProvenance = {
    id: "preview",
    body: body,
    source_type: provenanceType,
    author: {
      id: user?.id || "preview",
      display_name: (user as { user_metadata?: { display_name?: string } } | null)?.user_metadata?.display_name || user?.email?.split("@")[0] || "You",
      did: (user as { user_metadata?: { did?: string } } | null)?.user_metadata?.did || (user?.id ? `did:agora:${user.id}` : "did:agora:preview"),
      avatar_url: (user as { user_metadata?: { avatar_url?: string } } | null)?.user_metadata?.avatar_url ?? null,
      ladder_level: "new",
      reputation_total: 0,
      reputation_moderation_accuracy: 0,
      reputation_content_longevity: 0,
      reputation_dispute_participation: 0,
      reputation_account_age_weight: 0,
      affiliations: [],
      bio: null,
    },
    author_affiliations: [],
    media_urls: mediaUrls,
    topic_tags: topicId ? [topicId] : [],
    created_at: new Date().toISOString(),
    poll_data: pollQuestion ? { question: pollQuestion, options: pollOptions.filter(o => o.trim() !== ""), votes: pollOptions.map(() => 0) } : null,
    location_data: locationName ? { name: locationName } : null,
    citations: [],
    provenance_updates: [],
    _provenance_verified: false,
    _content_permanent: false,
    _funding_verified: false,
    // Add missing DbPost fields
    author_id: user?.id || "preview",
    ipfs_cid: null,
    content_signature: null,
    origin_url: null,
    origin_label: null,
    provenance_tx_hash: null,
    funding_type: "independent",
    funder_name: null,
    funding_staked: false,
    funding_tx_hash: null,
    coordination_flagged: false,
    coordination_confidence: null,
    coordination_survived: false,
    reply_count: 0,
    is_published: false,
    trust_score: 0,
    context_completeness: 0,
    has_disputed_framing: false,
    parent_id: null,
    root_id: null,
    type: 'post' as const,
    quoted_post_id: null,
  };

  const addMediaUrl = () => {
    if (tempMediaUrl && tempMediaUrl.trim() !== "") {
      setMediaUrls([...mediaUrls, tempMediaUrl.trim()]);
      setTempMediaUrl("");
    }
  };

  const removeMediaUrl = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({
        body,
        topicId,
        provenanceType,
        citationUrl: citationUrl || null,
        mediaUrls: mediaUrls.length > 0 ? mediaUrls : null,
        pollData: pollQuestion ? { question: pollQuestion, options: pollOptions.filter(o => o.trim() !== ""), votes: pollOptions.filter(o => o.trim() !== "").map(() => 0) } : null,
        locationData: locationName ? { name: locationName } : null,
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

          <div className="flex flex-col gap-4 border-y border-[var(--border-subtle)] py-4">
            {/* Rich Media Action Bar */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 hide-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "media" ? null : "media")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-sm transition-all text-xs font-bold uppercase tracking-wider font-mono shrink-0",
                    activeTab === "media" 
                      ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30" 
                      : "text-[var(--text-tertiary)] hover:text-cyan-400 hover:bg-cyan-500/10"
                  )}
                >
                  <ImageIcon size={18} />
                  <span>Media</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "poll" ? null : "poll")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-sm transition-all text-xs font-bold uppercase tracking-wider font-mono shrink-0",
                    activeTab === "poll" 
                      ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30" 
                      : "text-[var(--text-tertiary)] hover:text-cyan-400 hover:bg-cyan-500/10"
                  )}
                >
                  <ChartBar size={18} />
                  <span>Poll</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === "location" ? null : "location")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-sm transition-all text-xs font-bold uppercase tracking-wider font-mono shrink-0",
                    activeTab === "location" 
                      ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30" 
                      : "text-[var(--text-tertiary)] hover:text-cyan-400 hover:bg-cyan-500/10"
                  )}
                >
                  <MapPin size={18} />
                  <span>Location</span>
                </button>
              </div>

              {/* Media Tab Content */}
              {activeTab === "media" && (
                <div className="bg-paper-raised p-4 rounded-sm border border-[var(--border-subtle)] space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={tempMediaUrl}
                      onChange={(e) => setTempMediaUrl(e.target.value)}
                      placeholder="Enter Image URL..."
                      className="flex-1 bg-transparent border-b border-[var(--border-subtle)] focus:border-cyan-500 py-1 text-sm focus:outline-none"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMediaUrl())}
                    />
                    <button
                      type="button"
                      onClick={addMediaUrl}
                      className="p-1 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {mediaUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mediaUrls.map((url, i) => (
                        <div key={i} className="relative group w-20 h-20 border border-[var(--border-subtle)] rounded overflow-hidden">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeMediaUrl(i)}
                            className="absolute top-0 right-0 p-1 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Poll Tab Content */}
              {activeTab === "poll" && (
                <div className="bg-paper-raised p-4 rounded-sm border border-[var(--border-subtle)] space-y-4">
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Poll Question (Implicit if empty)"
                    className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-cyan-500 py-1 text-sm focus:outline-none font-bold"
                  />
                  <div className="space-y-2">
                    {pollOptions.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updatePollOption(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 bg-transparent border border-[var(--border-subtle)] rounded-sm px-3 py-1.5 text-sm focus:border-cyan-500 focus:outline-none"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removePollOption(i)}
                            className="p-1.5 text-neutral-400 hover:text-magenta-600"
                          >
                            <Trash size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={addPollOption}
                      className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-600 hover:underline"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
              )}

              {/* Location Tab Content */}
              {activeTab === "location" && (
                <div className="bg-paper-raised p-4 rounded-sm border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-cyan-600" />
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="Enter location name..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1"
                      autoFocus
                    />
                  </div>
                </div>
              )}
            </div>

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
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="w-full bg-paper-raised border border-[var(--border-subtle)] rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all appearance-none cursor-pointer text-neutral-900 dark:text-neutral-50"
            >
              <option value="">No Specific Topic (Optional)</option>
              {topics?.map((t) => (
                <option key={t.id || t.slug} value={t.id || t.slug}>
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
              className="w-full bg-paper-raised border border-[var(--border-subtle)] rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all appearance-none cursor-pointer text-neutral-900 dark:text-neutral-50"
            >
              <option value="original">Original Contribution</option>
              <option value="institutional">Institutional / Official</option>
              <option value="derived">Derived / Analysis</option>
              <option value="republished">Republished Content</option>
            </select>
          </div>
        </div>

        {/* Live Preview section */}
        <div className="bg-paper-raised border border-[var(--border-subtle)] p-8 rounded-md space-y-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-dotted border-[var(--border-subtle)] pb-2">
            <span className="sublabel">Live Provenance Preview</span>
            <div className="relative w-4 h-4">
              <div className="absolute top-0 left-0.5 w-2.5 h-2.5 bg-cyan-300/60 rounded-full" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-magenta-300/60 rounded-full" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-300/60 rounded-full" />
            </div>
          </div>
          <div className="pt-2">
            <ProvenanceTag
              post={previewPost}
              expanded={true}
            />
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-sm p-3 border border-dashed border-[var(--border-subtle)]">
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
            disabled={isCreating || !body}
            className="w-full bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 h-16 rounded-sm font-mono font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl"
          >
            {isCreating ? "Witnessing Content..." : "Commit Transfer"}
          </Button>
        </div>
      </form>
    </div>

  );
}
