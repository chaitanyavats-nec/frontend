"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Label, Switch, Input, Textarea } from "@/components/ui/settings-ui";
import { CaretRight } from "phosphor-react";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ title, description, children, className }: SettingsSectionProps) {
  return (
    <section className={cn("space-y-4 py-6 border-b border-paper-dark/30 last:border-0", className)}>
      <div className="space-y-1">
        <h2 className="text-lg font-display text-ink">{title}</h2>
        {description && <p className="text-sm text-slate leading-relaxed">{description}</p>}
      </div>
      <div className="space-y-2 mt-4">
        {children}
      </div>
    </section>
  );
}

interface SettingItemProps {
  label: string;
  description?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SettingItem({ label, description, children, onClick, className }: SettingItemProps) {
  const isClickable = !!onClick;
  
  return (
    <div 
      className={cn(
        "flex items-start justify-between gap-4 p-2 -mx-2 rounded-lg transition-colors",
        isClickable && "hover:bg-paper-dark/10 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-1 flex-1">
        <Label className="text-ink font-medium leading-none">{label}</Label>
        {description && <p className="text-xs text-slate">{description}</p>}
      </div>
      <div className="flex items-center shrink-0 min-w-[40px] justify-end">
        {children}
        {isClickable && !children && <CaretRight size={16} className="text-slate" />}
      </div>
    </div>
  );
}

interface SettingToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SettingToggle({ label, description, checked, onCheckedChange }: SettingToggleProps) {
  return (
    <SettingItem label={label} description={description}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </SettingItem>
  );
}

interface SettingActionProps {
  label: string;
  description?: string;
  actionLabel: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

export function SettingAction({ label, description, actionLabel, onClick, variant = "default" }: SettingActionProps) {
  return (
    <SettingItem label={label} description={description}>
      <button 
        onClick={onClick}
        className={cn(
          "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all",
          variant === "default" 
            ? "bg-teal/10 text-teal hover:bg-teal hover:text-paper" 
            : "bg-orange/10 text-orange hover:bg-orange hover:text-paper"
        )}
      >
        {actionLabel}
      </button>
    </SettingItem>
  );
}

export { Input, Textarea, Label };
