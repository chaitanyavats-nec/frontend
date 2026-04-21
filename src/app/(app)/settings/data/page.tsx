"use client";

import React from "react";
import { 
  SettingsSection, 
  SettingAction 
} from "@/components/features/settings/SettingsComponents";
import { Download, FileCode, Archive, Warning } from "@phosphor-icons/react";

export default function DataExportImportPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SettingsSection 
        title="Export Your Data" 
        description="Download a copy of your information from the Agora network for portability or backup."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-paper-dark/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-ink">
              <FileCode size={18} className="text-teal" />
              <span className="text-xs font-bold uppercase tracking-wider">Posts & Content</span>
            </div>
            <p className="text-xs text-slate">Full history of your posts, replies, and citations.</p>
            <div className="flex gap-2">
              <button className="text-[10px] font-bold px-2 py-1 bg-surface border border-paper-dark rounded hover:border-teal transition-colors">JSON</button>
              <button className="text-[10px] font-bold px-2 py-1 bg-surface border border-paper-dark rounded hover:border-teal transition-colors">CSV</button>
            </div>
          </div>

          <div className="p-4 bg-paper-dark/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-ink">
              <FileCode size={18} className="text-teal" />
              <span className="text-xs font-bold uppercase tracking-wider">Social Graph</span>
            </div>
            <p className="text-xs text-slate">Your following list and follower counts in JSON format.</p>
            <button className="text-[10px] font-bold px-2 py-1 bg-surface border border-paper-dark rounded hover:border-teal transition-colors w-fit">DOWNLOAD JSON</button>
          </div>

          <div className="p-4 bg-paper-dark/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-ink">
              <Archive size={18} className="text-teal" />
              <span className="text-xs font-bold uppercase tracking-wider">Direct Messages</span>
            </div>
            <p className="text-xs text-slate">End-to-end encrypted archive of your private conversations.</p>
            <button className="text-[10px] font-bold px-2 py-1 bg-surface border border-paper-dark rounded hover:border-teal transition-colors w-fit">DOWNLOAD ARCHIVE</button>
          </div>

          <div className="p-4 bg-paper-dark/10 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-ink">
              <Download size={18} className="text-teal" />
              <span className="text-xs font-bold uppercase tracking-wider">Reputation & Activity</span>
            </div>
            <p className="text-xs text-slate">On-chain affiliation declarations and reputation history.</p>
            <button className="text-[10px] font-bold px-2 py-1 bg-surface border border-paper-dark rounded hover:border-teal transition-colors w-fit">DOWNLOAD JSON</button>
          </div>
        </div>

        <div className="mt-4 p-4 border border-paper-dark/30 rounded-xl bg-teal/5 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-ink">Full Account Archive</h3>
            <p className="text-xs text-slate">Request a full export of every data point associated with your DID.</p>
          </div>
          <button className="px-4 py-2 bg-teal text-paper text-xs font-bold rounded shadow hover:bg-teal-dark transition-colors">
            REQUEST ALL DATA
          </button>
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Import Data" 
        description="Migrate your social graph from other platforms to Agora."
      >
        <SettingAction 
          label="Following List" 
          description="Import people you follow from Mastodon or Bluesky (CSV/JSON)." 
          actionLabel="Upload File" 
          onClick={() => {}} 
        />
        
        <SettingAction 
          label="Blocked Accounts" 
          description="Import your existing block lists from other ActivityPub instances." 
          actionLabel="Upload CSV" 
          onClick={() => {}} 
        />

        <div className="mt-4 p-4 bg-orange/5 border border-orange/20 rounded-xl flex items-start gap-3">
          <Warning size={20} className="text-orange shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-ink">A Note on Immutability</p>
            <p className="text-[11px] text-slate leading-relaxed">
              While Agora allows full data export, some on-chain records (like affiliation stakes 
              and governance votes) are structurally permanent. Importing/Exporting content 
              metadata does not alter your existing cryptographic footprint on the ledger.
            </p>
          </div>
        </div>
      </SettingsSection>
      
      <div className="pb-12" />
    </div>
  );
}
