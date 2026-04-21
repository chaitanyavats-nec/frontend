"use client";

import React from "react";
import { 
  SettingsSection, 
  SettingItem
} from "@/components/features/settings/SettingsComponents";
import { ModerationAbout } from "@/components/features/settings/ModerationAbout";
import { GithubLogo, BookOpen, ShieldCheck, Heart, ChatCircleText, UserCheck } from "@phosphor-icons/react";

export default function AboutLegalPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SettingsSection 
        title="About Agora" 
        description="Platform information and the social contracts that bind the community."
      >
        <div className="p-4 bg-paper-dark/10 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-slate">Platform Version</p>
            <p className="text-sm font-mono text-ink">v0.4.2-beta (Build 2026.04.19)</p>
          </div>
          <span className="px-2 py-1 bg-teal/10 text-teal text-[10px] font-bold rounded uppercase tracking-tighter">Stable Node</span>
        </div>

        <SettingItem label="Community Constitution" description="The core rules and rights governing the Agora network.">
          <BookOpen size={20} className="text-teal" />
        </SettingItem>

        <SettingItem label="Terms of Use" description="Formal agreement for node usage and network participation.">
          <ShieldCheck size={20} className="text-teal" />
        </SettingItem>

        <SettingItem label="Privacy Architecture" description="A plain-language breakdown of what Agora structurally cannot do with your data.">
          <ShieldCheck size={20} className="text-teal" />
        </SettingItem>

        <SettingItem label="Open Source Repository" description="View the source code, contribute, or audit the protocol.">
          <GithubLogo size={20} className="text-teal" />
        </SettingItem>

        <SettingItem label="Acknowledgements" description="The academic sources and open-source projects that made Agora possible.">
          <Heart size={20} className="text-teal" />
        </SettingItem>
      </SettingsSection>

      <ModerationAbout />

      <SettingsSection 
        title="Support & Escalation" 
        description="Get help or report issues that haven't been resolved through standard community channels."
      >
        <SettingItem label="Report Platform Issue" description="Technical bugs, infrastructure failures, or UI glitches.">
          <ChatCircleText size={20} className="text-slate" />
        </SettingItem>

        <div className="mt-4 p-4 border border-orange/30 bg-orange/5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-orange">
            <UserCheck size={18} />
            <h3 className="text-sm font-bold text-ink">Request Human Review</h3>
          </div>
          <p className="text-xs text-slate leading-relaxed">
            If you&apos;ve exhausted the community moderation appeal process and believe a systemic 
            injustice has occurred, you can request an escalation to the Human Review Board.
          </p>
          <button className="text-xs font-bold text-orange hover:underline uppercase tracking-wider">
            INITIATE ESCALATION
          </button>
        </div>
      </SettingsSection>
      
      <div className="pb-12" />
    </div>
  );
}
