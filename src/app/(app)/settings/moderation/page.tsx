"use client";

import React, { useState } from "react";
import { 
  SettingsSection, 
  SettingToggle, 
  SettingItem, 
  SettingAction 
} from "@/components/features/settings/SettingsComponents";
import { ModerationAbout } from "@/components/features/settings/ModerationAbout";

export default function ModerationPage() {
  const [prefs, setPrefs] = useState({
    flagResolved: true,
    contentAppealed: true,
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SettingsSection 
        title="Your Moderation Activity" 
        description="Track the status of flags you've submitted and any actions taken on your own content."
      >
        <SettingAction 
          label="Flags Submitted" 
          description="History and current status of your community flags." 
          actionLabel="View History" 
          onClick={() => {}} 
        />
        <SettingAction 
          label="Appeals Submitted" 
          description="Status of your appeals against moderation decisions." 
          actionLabel="View Appeals" 
          onClick={() => {}} 
        />
        <SettingAction 
          label="Actioned Content" 
          description="Content of yours that has been actioned, with options to appeal." 
          actionLabel="Manage" 
          onClick={() => {}} 
        />
      </SettingsSection>

      <SettingsSection 
        title="Moderation Preferences" 
        description="Configure how you want to be notified about moderation events."
      >
        <SettingToggle 
          label="Flag Resolution" 
          description="Notify when a flag you've submitted has reaching a final jury outcome."
          checked={prefs.flagResolved}
          onCheckedChange={(v) => setPrefs({ ...prefs, flagResolved: v })}
        />
        <SettingToggle 
          label="Appeal Notifications" 
          description="Notify if content you flagged is being appealed by the author."
          checked={prefs.contentAppealed}
          onCheckedChange={(v) => setPrefs({ ...prefs, contentAppealed: v })}
        />
      </SettingsSection>

      <ModerationAbout />
      
      <div className="pb-12" />
    </div>
  );
}
