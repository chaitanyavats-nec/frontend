"use client";

import React, { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Warning, X, FileArrowUp, CheckCircle, Question } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import type { DbAffiliation } from "@/types";

const AFFILIATION_TYPES = [
  { id: "employment", label: "Employment" },
  { id: "advisory", label: "Advisory" },
  { id: "funding", label: "Funding Received" },
  { id: "ownership", label: "Ownership Stake" }
];

export default function AffiliationsDeclarationPage() {
  const { user } = useAuth();
  const { profile, loading } = useProfile(user?.id || "");
  const [isAdding, setIsAdding] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  
  // Form State
  const [formData, setFormData] = useState({
    type: "employment",
    organization: "",
    role: "",
    periodStart: "",
    periodEnd: "",
    ongoing: true,
    statement: ""
  });

  if (loading || !profile) {
    return <div className="p-8 text-center text-slate animate-pulse">Loading declarations...</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    
    const { error } = await supabase.from('affiliations').insert({
      user_id: user.id,
      organization_name: formData.organization,
      role: formData.role,
      affiliation_type: formData.type,
      period_start: formData.periodStart ? `${formData.periodStart}-01` : `${new Date().toISOString().slice(0, 7)}-01`,
      period_end: formData.ongoing || !formData.periodEnd ? null : `${formData.periodEnd}-01`,
      is_current: formData.ongoing,
      public_statement: formData.statement,
      // Default blockchain flags for demonstration
      is_staked: false,
      is_challenged: false,
      is_slashed: false
    });

    setIsSubmitting(false);
    
    if (error) {
      console.error("Error inserting affiliation", error);
      alert(`Failed to declare affiliation: ${error.message}`);
      return;
    }

    setShowConfirmModal(false);
    setIsAdding(false);
    window.location.reload();
  };

  const handleEndDeclaration = async (id: string) => {
    const { error } = await supabase
      .from('affiliations')
      .update({
        is_current: false,
        period_end: new Date().toISOString().slice(0, 7)
      })
      .eq('id', id);

    if (error) {
      console.error("Error ending affiliation", error);
      alert("Failed to end affiliation");
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto py-8">
      <div>
        <h1 className="font-editorial font-bold text-3xl text-ink">Affiliation Declarations</h1>
        <p className="font-sans text-sm text-slate mt-2">
          Transparency is the foundation of Agora. Declare your institutional, financial, and community ties to build trust. Declarations are permanently recorded on-chain.
        </p>
      </div>

      {/* Existing Declarations */}
      {!isAdding && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-wider font-semibold text-slate">Active Declarations</h2>
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-dark text-white-0 text-xs font-bold rounded-md transition-colors"
            >
              <Plus size={14} /> Add Declaration
            </button>
          </div>
          
          {profile.affiliations && profile.affiliations.length > 0 ? (
            <div className="grid gap-4">
              {profile.affiliations.map((aff: DbAffiliation) => (
                <div key={aff.id} className="bg-surface border border-paper-dark rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-sans font-semibold text-lg text-ink">{aff.organization_name}</h3>
                      <p className="font-sans text-sm text-slate">{aff.role || aff.affiliation_type}</p>
                    </div>
                    <span className={cn(
                      "px-2.5 py-1 rounded border text-[10px] font-mono font-bold uppercase tracking-wider",
                      aff.is_current ? "bg-teal/10 text-teal-dark border-teal/20" : "bg-paper-dark/20 text-slate border-paper-dark"
                    )}>
                      {aff.is_current ? aff.affiliation_type : `Former ${aff.affiliation_type}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-paper-dark/50">
                    <span className="font-mono text-xs text-slate">
                      {aff.period_start || "Unknown"} — {aff.is_current ? "Present" : aff.period_end || "Unknown"}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-teal font-bold uppercase">
                      <CheckCircle size={14} /> On-chain
                    </span>
                    {aff.is_current && (
                      <button 
                        onClick={() => handleEndDeclaration(aff.id)}
                        className="ml-auto text-xs font-medium text-slate hover:text-orange transition-colors"
                      >
                        End Declaration
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border border-dashed border-paper-dark rounded-xl bg-surface/50">
              <p className="font-sans text-sm text-slate mb-4">You have no active affiliation declarations.</p>
              <button 
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal hover:bg-teal-dark text-white-0 text-xs font-bold rounded-md transition-colors"
              >
                <Plus size={14} /> Add Your First Declaration
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add New Form */}
      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-paper-dark rounded-xl overflow-hidden shadow-sm"
        >
          <div className="p-5 border-b border-paper-dark flex justify-between items-center bg-paper-dark/10">
            <h2 className="font-sans font-semibold text-ink">New Declaration</h2>
            <button onClick={() => setIsAdding(false)} className="text-slate hover:text-ink">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Segmented Control */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate">Declaration Type</label>
                <div className="flex p-1 bg-paper-dark/30 rounded-lg">
                  {AFFILIATION_TYPES.map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({...formData, type: type.id})}
                      className={cn(
                        "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                        formData.type === type.id ? "bg-surface shadow-sm text-ink" : "text-slate hover:text-ink"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Org & Role */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate">Organization Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full bg-transparent border border-paper-dark rounded-md px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal/20 transition-all text-ink"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate">Role / Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-transparent border border-paper-dark rounded-md px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal/20 transition-all text-ink"
                  placeholder="e.g. Senior Researcher"
                />
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate">Time Period</label>
                <div className="flex items-center gap-3">
                  <input type="month" className="flex-1 bg-transparent border border-paper-dark rounded-md px-3 py-1.5 text-sm uppercase font-mono text-slate focus:border-teal" />
                  <span className="text-slate">to</span>
                  {!formData.ongoing ? (
                    <input type="month" className="flex-1 bg-transparent border border-paper-dark rounded-md px-3 py-1.5 text-sm uppercase font-mono text-slate focus:border-teal" />
                  ) : (
                    <div className="flex-1 px-3 py-1.5 text-sm uppercase font-mono text-slate bg-paper-dark/20 rounded-md text-center">Present</div>
                  )}
                </div>
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.ongoing} 
                    onChange={(e) => setFormData({...formData, ongoing: e.target.checked})}
                    className="rounded text-teal focus:ring-teal border-paper-dark bg-transparent"
                  />
                  <span className="text-xs text-slate">This is an ongoing affiliation</span>
                </label>
              </div>

              {/* Statement */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate">Public Statement (Optional)</label>
                  <span className={cn("text-[10px] font-mono", formData.statement.length > 200 ? "text-orange" : "text-slate")}>
                    {formData.statement.length}/280
                  </span>
                </div>
                <textarea 
                  value={formData.statement}
                  onChange={(e) => setFormData({...formData, statement: e.target.value.substring(0, 280)})}
                  placeholder="Provide any additional context about this relationship..."
                  className="w-full h-24 bg-transparent border border-paper-dark rounded-md px-3 py-2 text-sm focus:border-teal focus:ring-1 focus:ring-teal/20 transition-all text-ink resize-none"
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate">
                  Supporting Document (Optional) <Question size={14} className="text-slate/50" />
                </label>
                <div className="border border-dashed border-paper-dark rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-paper-dark/5 hover:bg-paper-dark/10 transition-colors cursor-pointer text-slate">
                  <FileArrowUp size={24} />
                  <span className="text-xs font-medium">Click to upload IPFS proof</span>
                </div>
              </div>

              <div className="pt-4 border-t border-paper-dark flex justify-end gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-slate hover:text-ink">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!formData.organization || !formData.role}
                  className="px-6 py-2 bg-teal disabled:bg-teal/50 hover:bg-teal-dark text-white-0 font-bold rounded-md transition-colors"
                >
                  Declare Affiliation
                </button>
              </div>
            </form>

            {/* Live Preview Panel */}
            <div className="bg-paper-dark/10 p-6 rounded-lg border border-paper-dark self-start sticky top-6">
              <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-slate mb-6">Live Preview</h3>
              <p className="text-sm text-slate mb-4">This is how your affiliation will appear as a pill on your posts:</p>
              
              <div className="p-4 bg-surface rounded-lg shadow-sm border border-paper-dark/50 flex justify-center">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-md font-mono text-[11px] font-medium border transition-colors",
                  formData.type === 'funding' 
                    ? "bg-terracotta/10 text-terracotta-dark border-terracotta/20"
                    : formData.type === 'ownership'
                      ? "bg-gold/10 text-gold-dark border-gold/20"
                      : "bg-sage/10 text-sage-dark border-sage/20"
                )}>
                  {formData.organization || "Organization Name"}
                  <span className="opacity-60 text-[10px] uppercase">
                    ({formData.type})
                  </span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-orange shadow-2xl rounded-xl max-w-md w-full p-6 text-center"
            >
              <div className="w-16 h-16 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4 text-orange">
                <Warning size={32} weight="fill" />
              </div>
              <h2 className="font-editorial font-bold text-2xl text-ink mb-2">Permanent Declaration</h2>
              <p className="font-sans text-sm text-slate mb-6 leading-relaxed">
                You are about to cryptographically bind this affiliation to your identity. This declaration will be permanently recorded on-chain and cannot be deleted, only marked as ended. It will be publicly visible on all your contributions.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2 rounded-md font-medium text-slate bg-paper-dark/20 hover:bg-paper-dark/30 transition-colors"
                >
                  Go Back
                </button>
                <button 
                  onClick={confirmSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-2 rounded-md font-bold text-white-0 bg-orange hover:bg-orange-dark transition-colors disabled:bg-orange/50"
                >
                  {isSubmitting ? "Declaring..." : "I Understand, Declare"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
