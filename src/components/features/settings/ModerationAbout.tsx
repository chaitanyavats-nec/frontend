"use client";

import React from "react";
import { SettingsSection, SettingItem } from "./SettingsComponents";
import { Book, Gavel, Envelope, Info, ChartBar } from "@phosphor-icons/react";

export function ModerationAbout() {
  return (
    <>
      <SettingsSection 
        title="About Moderation" 
        description="The principles and processes that govern discourse in Agora."
      >
        <SettingItem 
          label="Community Moderation Manifesto" 
          description="The foundational document defining harm, free speech, and collective safety."
          onClick={() => {}}
        >
          <Book size={20} className="text-teal" />
        </SettingItem>

        <SettingItem 
          label="How decisions are made" 
          description="Plain language explainer of the randomly selected third-party jury process."
          onClick={() => {}}
        >
          <Gavel size={20} className="text-teal" />
        </SettingItem>

        <SettingItem 
          label="How to appeal a decision" 
          description="Understanding your right to a second-stage review by a different jury cluster."
          onClick={() => {}}
        >
          <Info size={20} className="text-teal" />
        </SettingItem>

        <SettingItem 
          label="Transparency Report" 
          description="Public log of moderation outcomes, volumes, and institutional concentration statistics."
          onClick={() => {}}
        >
          <ChartBar size={20} className="text-teal" />
        </SettingItem>

        <SettingItem 
          label="Contact Moderation Team" 
          description="Escalate systemic issues or report moderator misconduct."
          onClick={() => {}}
        >
          <Envelope size={20} className="text-teal" />
        </SettingItem>
      </SettingsSection>
    </>
  );
}
