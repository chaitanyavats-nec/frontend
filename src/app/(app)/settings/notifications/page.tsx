"use client";

import React, { useState } from "react";
import { 
  SettingsSection, 
  SettingToggle
} from "@/components/features/settings/SettingsComponents";

export default function NotificationsSettingsPage() {
  // In a real app, these would be managed by a Supabase hook
  const [notifs, setNotifs] = useState({
    replies: true,
    mentions: true,
    followers: true,
    governance: true,
    moderation: false,
    legal: true,
    email: {
      activity: true,
      news: false,
    },
    push: {
      activity: true,
      mentions: true,
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SettingsSection 
        title="Activity Notifications" 
        description="Stay updated with interactions on your content and network growth."
      >
        <SettingToggle 
          label="Replies to your posts" 
          description="Get notified when someone responds to your thread."
          checked={notifs.replies}
          onCheckedChange={(v) => setNotifs({ ...notifs, replies: v })}
        />
        <SettingToggle 
          label="Mentions" 
          description="Get notified when someone tags you in a post."
          checked={notifs.mentions}
          onCheckedChange={(v) => setNotifs({ ...notifs, mentions: v })}
        />
        <SettingToggle 
          label="New followers" 
          description="Get notified when someone starts following you."
          checked={notifs.followers}
          onCheckedChange={(v) => setNotifs({ ...notifs, followers: v })}
        />
      </SettingsSection>

      <SettingsSection 
        title="Platform & Civic Updates" 
        description="Notifications related to governance, moderation, and legal status."
      >
        <SettingToggle 
          label="Governance proposals" 
          description="Updates on proposals you've voted on and new major amendments."
          checked={notifs.governance}
          onCheckedChange={(v) => setNotifs({ ...notifs, governance: v })}
        />
        <SettingToggle 
          label="Moderation outcomes" 
          description="Status updates on content you've flagged for review."
          checked={notifs.moderation}
          onCheckedChange={(v) => setNotifs({ ...notifs, moderation: v })}
        />
        <SettingToggle 
          label="Legal threat registry" 
          description="Immediate alerts if your content is targeted by legal removal requests."
          checked={notifs.legal}
          onCheckedChange={(v) => setNotifs({ ...notifs, legal: v })}
        />
      </SettingsSection>

      <SettingsSection 
        title="Email Notifications" 
        description="Manage what gets sent to your inbox."
      >
        <SettingToggle 
          label="Activity Digest" 
          description="Weekly summary of your mentions and thread performance."
          checked={notifs.email.activity}
          onCheckedChange={(v) => setNotifs({ ...notifs, email: { ...notifs.email, activity: v } })}
        />
        <SettingToggle 
          label="Agora News & Updates" 
          description="Announcements about major platform changes and constitutional conventions."
          checked={notifs.email.news}
          onCheckedChange={(v) => setNotifs({ ...notifs, email: { ...notifs.email, news: v } })}
        />
      </SettingsSection>

      <SettingsSection 
        title="Push Notifications" 
        description="Direct alerts on your device."
      >
        <SettingToggle 
          label="Real-time interactions" 
          description="Push alerts for mentions and direct replies."
          checked={notifs.push.activity}
          onCheckedChange={(v) => setNotifs({ ...notifs, push: { ...notifs.push, activity: v } })}
        />
      </SettingsSection>

      <div className="flex justify-end pt-4 pb-12">
        <button className="px-6 py-2 bg-teal text-paper font-bold rounded-lg shadow-lg hover:shadow-teal/20 transition-all active:scale-95">
          Update Preferences
        </button>
      </div>
    </div>
  );
}
