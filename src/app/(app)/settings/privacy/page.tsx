"use client";

import React, { useState } from "react";
import { 
  SettingsSection, 
  SettingToggle, 
  SettingItem, 
  SettingAction 
} from "@/components/features/settings/SettingsComponents";
import { Lock, Fingerprint } from "@phosphor-icons/react";

export default function PrivacyReachSecurityPage() {
  const [settings, setSettings] = useState({
    followingListPublic: false,
    discoverable: "did-only",
    dmFrom: "following",
    sensitiveContent: "blur",
    federated: true,
    searchIndexing: false,
    allowQuotes: true,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Privacy Section */}
      <SettingsSection 
        title="Privacy" 
        description="Control who can see your activity and how you interact with others."
      >
        <SettingToggle 
          label="Public Following List" 
          description="Allow others to see the accounts you follow. Default is private."
          checked={settings.followingListPublic}
          onCheckedChange={(v) => setSettings({ ...settings, followingListPublic: v })}
        />
        
        <SettingItem label="Profile Discoverability" description="How others find your account.">
          <select 
            value={settings.discoverable}
            onChange={(e) => setSettings({ ...settings, discoverable: e.target.value })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="searchable">Searchable (Display name)</option>
            <option value="did-only">DID Only</option>
            <option value="none">Not Discoverable</option>
          </select>
        </SettingItem>

        <SettingItem label="Direct Messages" description="Who can send you private messages.">
          <select 
            value={settings.dmFrom}
            onChange={(e) => setSettings({ ...settings, dmFrom: e.target.value })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="everyone">Everyone</option>
            <option value="following">People you follow</option>
            <option value="none">No one</option>
          </select>
        </SettingItem>

        <SettingItem label="Sensitive Content" description="How sensitive media is displayed in your feed.">
          <select 
            value={settings.sensitiveContent}
            onChange={(e) => setSettings({ ...settings, sensitiveContent: e.target.value })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="show">Show always</option>
            <option value="blur">Blur (default)</option>
            <option value="hide">Hide completely</option>
          </select>
        </SettingItem>

        <div className="p-4 bg-paper-dark/10 rounded-xl mt-4">
          <div className="flex items-start gap-3">
            <Lock size={20} className="text-teal shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-ink">Data Collection Opt-out</p>
              <p className="text-xs text-slate leading-relaxed">
                Agora is architected for structural privacy. We cannot collect your private keys, 
                your physical location history, or your un-hashed IP addresses by design. 
                All analytical data processed is client-side or aggregated in a way that respects your 
                sovereign identity.
              </p>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Reach Section */}
      <SettingsSection 
        title="Reach" 
        description="Publicity and federation settings for your shared content."
      >
        <SettingToggle 
          label="ActivityPub Federation" 
          description="Allow your posts to be federated to Mastodon and other decentralised instances."
          checked={settings.federated}
          onCheckedChange={(v) => setSettings({ ...settings, federated: v })}
        />
        <SettingToggle 
          label="Search Indexing" 
          description="Allow your public posts to be indexed by global search engines."
          checked={settings.searchIndexing}
          onCheckedChange={(v) => setSettings({ ...settings, searchIndexing: v })}
        />
        <SettingToggle 
          label="Allow Quoting" 
          description="Allow others to quote-post your content."
          checked={settings.allowQuotes}
          onCheckedChange={(v) => setSettings({ ...settings, allowQuotes: v })}
        />
      </SettingsSection>

      {/* Security Section */}
      <SettingsSection 
        title="Security" 
        description="Manage your account access, authentication, and cryptographic keys."
      >
        <SettingAction label="Email Address" description="Current: chaitanya.v...@example.com" actionLabel="Change" onClick={() => {}} />
        <SettingAction label="Password" description="Last changed 3 months ago." actionLabel="Update" onClick={() => {}} />
        
        <SettingItem label="Two-Factor Authentication" description="Add an extra layer of security to your account.">
          <span className="text-xs font-bold text-orange bg-orange/10 px-2 py-0.5 rounded uppercase tracking-wider">Not Enabled</span>
        </SettingItem>

        <SettingAction label="Active Sessions" description="3 devices currently logged in." actionLabel="Manage" onClick={() => {}} />
        <SettingAction label="Authorised Applications" description="2 third-party apps have limited access." actionLabel="View" onClick={() => {}} />
        
        <div className="p-4 border border-paper-dark/30 rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Fingerprint size={18} className="text-teal" />
            <h3 className="text-sm font-bold text-ink">Cryptographic Key Management</h3>
          </div>
          <p className="text-xs text-slate">
            Your identity is tied to your cryptographic keypair. Rotating your keys is a major action 
            that will require re-signing existing affiliations.
          </p>
          <div className="flex gap-2">
            <button className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-paper-dark/20 hover:bg-paper-dark/40 rounded transition-colors">
              BACKUP KEYS
            </button>
            <button className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-orange/10 text-orange hover:bg-orange hover:text-paper rounded transition-colors border border-orange/20">
              ROTATE KEYPAIR
            </button>
          </div>
        </div>

        <SettingAction label="Login History" description="View last 10 login attempts and locations." actionLabel="View" onClick={() => {}} />
        <SettingAction label="Account Recovery" description="Set up backup recovery methods." actionLabel="Setup" onClick={() => {}} />
      </SettingsSection>

      <div className="pb-12" />
    </div>
  );
}
