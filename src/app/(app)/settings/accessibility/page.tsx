"use client";

import React from "react";
import { 
  SettingsSection, 
  SettingToggle, 
  SettingItem
} from "@/components/features/settings/SettingsComponents";
import { useAccessibilityStore } from "@/stores/useSettingsStore";
import { ThemeToggle } from "@/components/features/theme/ThemeToggle";

export default function AccessibilityPage() {
  const acc = useAccessibilityStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SettingsSection 
        title="Appearance" 
        description="Manage how Agora looks on your device."
      >
        <SettingItem label="Interface Theme" description="Switch between light and dark modes.">
          <ThemeToggle />
        </SettingItem>
      </SettingsSection>

      <SettingsSection 
        title="Accessibility" 
        description="Customise the Agora interface to better suit your visual and interactive needs. These settings are stored locally."
      >
        <SettingItem label="Interface Language" description="Select the primary language for the app interface.">
          <select 
            value={acc.interfaceLanguage}
            onChange={(e) => acc.update({ interfaceLanguage: e.target.value })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="en">English (default)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="hi">हिन्दी</option>
          </select>
        </SettingItem>

        <SettingItem label="Text Size" description="Adjust the baseline font size across the platform.">
          <select 
            value={acc.textSize}
            onChange={(e) => acc.update({ textSize: e.target.value as any })}
            className="bg-surface border border-paper-dark rounded px-2 py-1 text-xs font-medium text-ink outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="small">Small</option>
            <option value="medium">Medium (default)</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </SettingItem>

        <SettingToggle 
          label="High Contrast Mode" 
          description="Increases visibility of borders and text differentiation."
          checked={acc.highContrast}
          onCheckedChange={(v) => acc.update({ highContrast: v })}
        />

        <SettingToggle 
          label="Reduce Motion" 
          description="Minimises animations and parallax effects."
          checked={acc.reduceMotion}
          onCheckedChange={(v) => acc.update({ reduceMotion: v })}
        />

        <SettingToggle 
          label="Alt Text Reminder" 
          description="Remind you to add descriptive alt-text when uploading images."
          checked={acc.altTextReminder}
          onCheckedChange={(v) => acc.update({ altTextReminder: v })}
        />

        <SettingToggle 
          label="Screen Reader Optimised" 
          description="Switches to a simplified, high-priority accessibility layout."
          checked={acc.screenReaderOptimised}
          onCheckedChange={(v) => acc.update({ screenReaderOptimised: v })}
        />

        <SettingToggle 
          label="Keyboard Navigation Hints" 
          description="Show visual shortcuts and focus rings for keyboard-only usage."
          checked={acc.keyboardHints}
          onCheckedChange={(v) => acc.update({ keyboardHints: v })}
        />
      </SettingsSection>
      
      <div className="pb-12" />
    </div>
  );
}
