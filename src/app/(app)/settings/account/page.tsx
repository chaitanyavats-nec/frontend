"use client";

import React from "react";
import { 
  SettingsSection, 
  SettingItem, 
  Input, 
  Textarea, 
  SettingAction 
} from "@/components/features/settings/SettingsComponents";
import { Copy, UserCircle, Image as ImageIcon } from "phosphor-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { updateProfile } from "@/lib/queries/users";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ReputationHistory } from "@/components/features/profile/ReputationHistory";

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const { profile, loading } = useProfile(user?.id || "");

  const handleCopyDid = () => {
    if (profile?.did) {
      navigator.clipboard.writeText(profile.did);
      alert("DID copied to clipboard");
    }
  };

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const supabase = createClient();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      await updateProfile(user.id, { avatar_url: data.publicUrl });
      
      alert("Avatar updated successfully! Please refresh to see changes globally.");
      // Ideally we would invalidate the react-query cache here, but a reload works for now
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error uploading avatar:", error);
      alert(error instanceof Error ? error.message : "Error uploading avatar");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || !profile) {
    return <div className="p-8 text-center text-slate animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SettingsSection 
        title="Profile" 
        description="Public information about you that appears on your profile and next to your posts."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate">Display Name</label>
            <Input defaultValue={profile.display_name} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate">Pronouns</label>
            <Input placeholder="e.g. they/them" />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate">Bio / About</label>
          <Textarea 
            defaultValue={profile.bio || ""} 
            placeholder="Tell the community about yourself..." 
            className="h-24"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate">Website URL</label>
            <Input placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate">Location (Optional)</label>
            <Input placeholder="City, Country" />
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate">Languages you write in</label>
          <Input placeholder="e.g. English, Spanish (comma separated)" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="file" 
            ref={avatarInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleAvatarUpload} 
            disabled={isUploading}
          />
          <div 
            onClick={() => avatarInputRef.current?.click()}
            className={cn(
              "p-4 border border-dashed border-paper-dark rounded-xl flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group",
              isUploading ? "bg-surface/30 opacity-50 cursor-not-allowed" : "bg-surface/50 hover:bg-surface"
            )}
          >
            {profile.avatar_url ? (
              <Avatar className="w-16 h-16 border-2 border-surface shadow-sm">
                <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
                <AvatarFallback>{profile.display_name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-16 h-16 rounded-full bg-paper-dark/20 flex items-center justify-center text-slate group-hover:text-teal transition-colors">
                <UserCircle size={32} />
              </div>
            )}
            <p className="text-xs font-medium text-slate">
              {isUploading ? "Uploading..." : "Change Avatar"}
            </p>
          </div>
          <div className="p-4 border border-dashed border-paper-dark rounded-xl flex flex-col items-center justify-center gap-3 bg-surface/50 hover:bg-surface transition-colors cursor-pointer group">
            <div className="w-full h-16 rounded-lg bg-paper-dark/20 flex items-center justify-center text-slate group-hover:text-teal transition-colors">
              <ImageIcon size={32} />
            </div>
            <p className="text-xs font-medium text-slate">Change Header image</p>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Identity" 
        description="The cryptographic and verified metadata that establishes your unique presence in the Agora network."
      >
        <div className="space-y-4">
          <div className="p-4 bg-paper-dark/10 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate">Your DID (Decentralised Identifier)</label>
              <button 
                onClick={handleCopyDid}
                className="text-teal hover:text-teal-dark transition-colors flex items-center gap-1.5 text-xs font-bold"
              >
                <Copy size={14} />
                COPY
              </button>
            </div>
            <code className="block text-xs text-ink font-mono break-all bg-surface/50 p-2 rounded">
              {profile.did || "Identity pending"}
            </code>
          </div>

          <div className="p-4 bg-paper-dark/10 rounded-xl space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate">Linked Public Key</label>
            <code className="block text-xs text-ink font-mono break-all bg-surface/50 p-2 rounded">
              {profile.public_key || "No key attached"}
            </code>
          </div>

          <SettingItem label="BrightID Verification" description="Your proof-of-personhood status across the network.">
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider",
              profile.humanity_verified ? "text-teal bg-teal/10" : "text-slate bg-paper-dark/20"
            )}>
              {profile.humanity_verified ? "Verified" : "Unverified"}
            </span>
          </SettingItem>

          <SettingAction 
            label="Affiliation Declarations" 
            description="Manage your verified institutional and community ties on the dedicated declaration page." 
            actionLabel="Manage Declarations" 
            onClick={() => window.location.href = '/settings/affiliations'} 
          />

          <SettingAction 
            label="Funding Disclosures" 
            description="Manage your default and per-post funding declarations." 
            actionLabel="Manage" 
            onClick={() => {}} 
          />
        </div>
      </SettingsSection>

      <SettingsSection 
        title="Reputation History" 
        description="A timeline of events that have affected your reputation score. This log is only visible to you."
      >
        <ReputationHistory userId={user?.id || ""} />
      </SettingsSection>

      <div className="flex justify-end pt-4">
        <button className="px-6 py-2 bg-teal text-paper font-bold rounded-lg shadow-lg hover:shadow-teal/20 transition-all active:scale-95">
          Save Changes
        </button>
      </div>
    </div>
  );
}
