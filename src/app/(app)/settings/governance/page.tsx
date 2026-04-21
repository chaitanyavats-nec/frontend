"use client";

import React, { useState } from "react";
import { 
  SettingsSection, 
  SettingToggle, 
  SettingAction 
} from "@/components/features/settings/SettingsComponents";
import { Bank, Coins, History, ArrowSquareOut } from "phosphor-react";

export default function GovernancePage() {
  const [prefs, setPrefs] = useState({
    newProposals: true,
    voteReminders: true,
    outcomes: true,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SettingsSection 
        title="Your Participation" 
        description="View your stake and historical involvement in Agora's governance."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 bg-teal/5 border border-teal/20 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-teal">
              <Coins size={20} weight="fill" />
              <span className="text-xs font-bold uppercase tracking-widest">VOICE Balance</span>
            </div>
            <p className="text-3xl font-display text-ink">847.20</p>
            <p className="text-xs text-slate">Governance Weight: <span className="font-bold text-teal">1.42x</span></p>
          </div>
          
          <div className="p-4 bg-paper-dark/10 rounded-xl flex flex-col justify-between">
            <div className="flex items-center gap-2 text-slate">
              <History size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Participation Rate</span>
            </div>
            <p className="text-2xl font-display text-ink">92%</p>
            <p className="text-[10px] text-slate font-mono uppercase">Top 5% of community</p>
          </div>
        </div>

        <SettingAction 
          label="Vote History" 
          description="Full history of proposals you've supported or opposed." 
          actionLabel="View All" 
          onClick={() => {}} 
        />
        
        <SettingAction 
          label="Active Proposals" 
          description="Go to the governance hub to see current live votes." 
          actionLabel="Open Hub" 
          onClick={() => {}} 
        />
      </SettingsSection>

      <SettingsSection 
        title="Governance Preferences" 
        description="Customise how you interact with the democratic process."
      >
        <SettingToggle 
          label="New Proposals" 
          description="Immediate detection alerts when a new governance proposal is published."
          checked={prefs.newProposals}
          onCheckedChange={(v) => setPrefs({ ...prefs, newProposals: v })}
        />
        <SettingToggle 
          label="Vote Reminders" 
          description="Get notified 24h before a proposal you haven't voted on closes."
          checked={prefs.voteReminders}
          onCheckedChange={(v) => setPrefs({ ...prefs, voteReminders: v })}
        />
        <SettingToggle 
          label="Outcome Announcements" 
          description="Get notified when a proposal reaches a final decision."
          checked={prefs.outcomes}
          onCheckedChange={(v) => setPrefs({ ...prefs, outcomes: v })}
        />

        <div className="mt-6 p-4 bg-violet/5 border border-violet/20 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-violet">
            <Bank size={18} />
            <h3 className="text-sm font-bold text-ink">Constitutional Amendment</h3>
          </div>
          <p className="text-xs text-slate leading-relaxed">
            As a community steward, you have the right to propose formal amendments to the 
            Moderation Manifesto or any section of the Agora Constitution.
          </p>
          <button className="flex items-center gap-1.5 text-xs font-bold text-violet hover:underline">
            PROPOSE AMENDMENT <ArrowSquareOut size={14} />
          </button>
        </div>
      </SettingsSection>
      
      <div className="pb-12" />
    </div>
  );
}
