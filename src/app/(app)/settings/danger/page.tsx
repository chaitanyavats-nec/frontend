"use client";

import React, { useState } from "react";
import { 
  SettingsSection, 
  SettingAction,
  Input
} from "@/components/features/settings/SettingsComponents";
import { useFeedStore, useProvenanceStore, useAccessibilityStore } from "@/stores/useSettingsStore";
import { Warning } from "@phosphor-icons/react";

export default function DangerZonePage() {
  const feed = useFeedStore();
  const provenance = useProvenanceStore();
  const accessibility = useAccessibilityStore();
  
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteSection, setShowDeleteSection] = useState(false);

  const handleResetPreferences = () => {
    feed.reset();
    provenance.reset();
    accessibility.reset();
    alert("Local preferences have been reset to defaults.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SettingsSection 
        title="Danger Zone" 
        description="High-impact actions that affect your account lifecycle and local environment. Use with caution."
      >
        <SettingAction 
          label="Deactivate Account" 
          description="Temporarily pause your activity. Your data is preserved and you can return at any time." 
          actionLabel="Deactivate" 
          onClick={() => {}} 
        />

        <SettingAction 
          label="Revoke All Sessions" 
          description="Immediately log out every device currently signed into your account." 
          actionLabel="Revoke All" 
          onClick={() => {}} 
          variant="destructive"
        />

        <SettingAction 
          label="Reset Preferences" 
          description="Clear all locally stored feed, provenance, and accessibility configurations." 
          actionLabel="Reset to Defaults" 
          onClick={handleResetPreferences} 
        />

        <div className="mt-8 p-6 border-2 border-orange/30 bg-orange/5 rounded-2xl space-y-6">
          <div className="flex items-start gap-3">
            <Warning size={32} weight="fill" className="text-orange shrink-0" />
            <div className="space-y-2">
              <h3 className="text-lg font-display text-ink uppercase tracking-tight">Permanent Account Deletion</h3>
              <p className="text-sm text-slate leading-relaxed">
                Deleting your account is permanent and cannot be undone. This will remove your profile, 
                your private posts, and your social graph from this node.
              </p>
              <div className="p-3 bg-white/50 rounded-lg border border-orange/10">
                <p className="text-xs font-bold text-orange uppercase tracking-wide flex items-center gap-1.5">
                  <Warning size={14} /> Immutable Records Warning
                </p>
                <p className="text-[11px] text-slate mt-1 leading-relaxed">
                  Due to the decentralised nature of the Agora ledger, on-chain records such as 
                  <strong> affiliation declarations</strong> and <strong>governance votes</strong> cannot 
                  be deleted. These will remain associated with your DID even after your account metadata is removed.
                </p>
              </div>
            </div>
          </div>

          {!showDeleteSection ? (
            <button 
              onClick={() => setShowDeleteSection(true)}
              className="w-full py-3 bg-orange text-paper font-bold rounded-xl shadow-lg hover:bg-orange-dark transition-all"
            >
              I UNDERSTAND, PROCEED TO DELETION
            </button>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink uppercase tracking-wider">
                  Type <span className="text-orange">DELETE</span> to confirm permanent removal
                </label>
                <Input 
                  value={deleteConfirm} 
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="DELETE"
                  className="border-orange/50 focus:ring-orange"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteSection(false)}
                  className="flex-1 py-2 bg-paper-dark text-ink font-bold rounded-lg text-sm"
                >
                  CANCEL
                </button>
                <button 
                  disabled={deleteConfirm !== "DELETE"}
                  className="flex-[2] py-2 bg-orange text-paper font-bold rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange/20"
                >
                  DELETE MY ACCOUNT FOREVER
                </button>
              </div>
            </div>
          )}
        </div>
      </SettingsSection>
      
      <div className="pb-12" />
    </div>
  );
}
