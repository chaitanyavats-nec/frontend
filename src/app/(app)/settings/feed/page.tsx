"use client";

import React, { useState } from "react";
import { 
  SettingsSection, 
  SettingToggle, 
  SettingItem, 
  SettingAction,
  Input
} from "@/components/features/settings/SettingsComponents";
import { useFeedStore, useProvenanceStore } from "@/stores/useSettingsStore";
import { X } from "@phosphor-icons/react";

export default function FeedSettingsPage() {
  const feed = useFeedStore();
  const provenance = useProvenanceStore();

  // Local state for Supabase-backed settings (Mocked)
  const [mutedKeywords, setMutedKeywords] = useState(["ads", "crypto", "spam"]);
  const [newKeyword, setNewKeyword] = useState("");

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newKeyword.trim()) {
      setMutedKeywords([...mutedKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw: string) => {
    setMutedKeywords(mutedKeywords.filter(k => k !== kw));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Feed Behaviour - Persisted to localStorage */}
      <SettingsSection 
        title="Feed Behaviour" 
        description="Customise how you discover and consume content. These settings are stored locally on your device."
      >
        <SettingItem label="Default Feed Type" description="Select your initial view when opening Agora.">
          <select 
            value={feed.defaultType}
            onChange={(e) => feed.update({ defaultType: e.target.value as "chronological" | "topic-filtered" | "curated" })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="chronological">Chronological (default)</option>
            <option value="topic-filtered">Topic-filtered</option>
            <option value="curated">Curated</option>
          </select>
        </SettingItem>

        <SettingItem label="Default Feed Scope" description="Control the source of your main feed.">
          <select 
            value={feed.defaultScope}
            onChange={(e) => feed.update({ defaultScope: e.target.value as "everyone" | "people-you-follow" | "topics-you-follow" })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="everyone">Everyone</option>
            <option value="people-you-follow">People you follow only</option>
            <option value="topics-you-follow">Topics you follow only</option>
          </select>
        </SettingItem>

        <SettingItem label="Pagination Size" description="Number of posts per page.">
          <select 
            value={feed.paginationSize}
            onChange={(e) => feed.update({ paginationSize: parseInt(e.target.value) as 10 | 25 | 50 })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </SettingItem>

        <SettingToggle 
          label="Show reply threads inline" 
          description="Display conversations directly in the main feed."
          checked={feed.showReplyThreadsInline}
          onCheckedChange={(v) => feed.update({ showReplyThreadsInline: v })}
        />

        <SettingToggle 
          label="Collapse long posts" 
          description="Hide content longer than 500 characters with a 'read more' button."
          checked={feed.collapseLongPosts}
          onCheckedChange={(v) => feed.update({ collapseLongPosts: v })}
        />
      </SettingsSection>

      {/* Provenance Display - Persisted to localStorage */}
      <SettingsSection 
        title="Provenance Display" 
        description="Manage the visibility and detail level of content origin metadata."
      >
        <SettingItem label="Default Tag State" description="How the source identifier appears initially.">
          <select 
            value={provenance.tagDefaultState}
            onChange={(e) => provenance.update({ tagDefaultState: e.target.value as "collapsed" | "expanded" | "full-chain" })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="collapsed">Collapsed Pill (default)</option>
            <option value="expanded">Expanded Summary</option>
            <option value="full-chain">Always Show Full Chain</option>
          </select>
        </SettingItem>

        <SettingToggle 
          label="Colour coding" 
          description="Visual indicators for different provenance and source types."
          checked={provenance.colorCoding}
          onCheckedChange={(v) => provenance.update({ colorCoding: v })}
        />

        <SettingItem label="Funding Warnings" description="How disclosed funding status is surfaced.">
          <select 
            value={provenance.showFundingWarnings}
            onChange={(e) => provenance.update({ showFundingWarnings: e.target.value as "always" | "funded-only" | "never" })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="always">Always show</option>
            <option value="funded-only">Only on funded content</option>
            <option value="never">Never show</option>
          </select>
        </SettingItem>

        <SettingToggle 
          label="Proportionality overlay" 
          description="Shows when a topic is disproportionately covered from one institutional source."
          checked={provenance.proportionalityOverlay}
          onCheckedChange={(v) => provenance.update({ proportionalityOverlay: v })}
        />

        <SettingToggle 
          label="Source concentration warnings" 
          description="Alert when too much current feed content originates from a single cluster."
          checked={provenance.sourceConcentrationWarnings}
          onCheckedChange={(v) => provenance.update({ sourceConcentrationWarnings: v })}
        />
      </SettingsSection>

      {/* Muted & Blocked - Synced to Supabase */}
      <SettingsSection 
        title="Muted & Blocked" 
        description="Accounts, topics, and keywords you prefer not to see."
      >
        <SettingAction label="Muted Accounts" description="List of accounts whose posts are hidden." actionLabel="Manage" onClick={() => {}} />
        <SettingAction label="Muted Topics" description="Hide specific categories of content." actionLabel="Manage" onClick={() => {}} />
        
        <div className="space-y-3 p-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate">Muted Keywords & Phrases</label>
          <div className="flex flex-wrap gap-2">
            {mutedKeywords.map(kw => (
              <span key={kw} className="flex items-center gap-1.5 px-2.5 py-1 bg-paper-dark/20 text-ink text-xs font-semibold rounded-full border border-paper-dark">
                {kw}
                <button onClick={() => removeKeyword(kw)} className="text-slate hover:text-orange"><X size={12} weight="bold" /></button>
              </span>
            ))}
            <div className="relative group">
              <Input 
                value={newKeyword} 
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={handleAddKeyword}
                placeholder="Add keyword..." 
                className="h-7 py-0 px-2 min-w-[120px] text-xs border-dashed"
              />
            </div>
          </div>
        </div>

        <SettingAction label="Blocked Accounts" description="Prevent accounts from interacting with you." actionLabel="Manage" onClick={() => {}} />
        <SettingAction label="Blocked Domains" description="Block entire federated instances (ActivityPub)." actionLabel="Manage" onClick={() => {}} />
      </SettingsSection>

      {/* Filtered Content - Persisted to localStorage */}
      <SettingsSection 
        title="Filtered Content" 
        description="Fine-grained content filtering based on moderation and dispute status."
      >
        <SettingItem label="Hide specific provenance types" description="Automatically hide posts flagged with certain metadata.">
          <div className="flex gap-2">
            {["Funded", "Institutional", "Coordination"].map(type => (
              <button key={type} className="text-[10px] font-bold px-2 py-1 rounded border border-paper-dark hover:border-teal transition-colors">
                {type}
              </button>
            ))}
          </div>
        </SettingItem>

        <SettingToggle 
          label="Hide posts under moderation" 
          description="Wait for active moderation jury reviews to complete before showing content."
          checked={false}
          onCheckedChange={() => {}}
        />

        <SettingItem label="Active Dispute Labels" description="How content with competing claims is displayed.">
          <select 
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="always">Show always</option>
            <option value="blurred">Blurred</option>
            <option value="hidden">Hidden</option>
          </select>
        </SettingItem>
      </SettingsSection>

      <div className="pb-12" />
    </div>
  );
}
