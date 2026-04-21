"use client";

import React, { useState } from "react";
import { 
  SettingsSection, 
  SettingItem, 
  SettingAction 
} from "@/components/features/settings/SettingsComponents";
import { CreditCard, History, ChartLine, ArrowSquareOut, Bank } from "phosphor-react";

export default function PaymentsPage() {
  const [contribution, setContribution] = useState(30);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SettingsSection 
        title="Payments & Contributions" 
        description="Manage your financial support for the Agora commons and track your earnings."
      >
        <div className="p-6 bg-teal/5 border border-teal/20 rounded-2xl space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold uppercase tracking-widest text-teal">Monthly Contribution</label>
              <span className="text-3xl font-display text-ink">₹{contribution}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="200" 
              step="10" 
              value={contribution} 
              onChange={(e) => setContribution(parseInt(e.target.value))}
              className="w-full h-2 bg-paper-dark rounded-lg appearance-none cursor-pointer accent-teal"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate uppercase tracking-tighter">
              <span>₹0 (Free)</span>
              <span>₹200 (Steward)</span>
            </div>
          </div>
          <p className="text-xs text-slate leading-relaxed">
            Your contributions fund the infrastructure and ensure no attention harvesting or advertisements 
            are ever needed. 70% goes to the creator pool, 30% to node maintenance.
          </p>
        </div>

        <SettingAction 
          label="Contribution History" 
          description="View and download your monthly contribution statements." 
          actionLabel="View History" 
          onClick={() => {}} 
        />

        <SettingItem label="Payment Method" description="Visa ending in 4242.">
          <button className="text-xs font-bold text-teal hover:underline">UPDATE</button>
        </SettingItem>

        <div className="p-4 bg-paper-dark/10 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-ink">
            <ChartLine size={18} className="text-teal" />
            <span className="text-xs font-bold uppercase tracking-wider">Creator Pool Earnings</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <p className="text-xs text-slate">Accrued this month (Quality-based)</p>
              <p className="text-xl font-display text-ink">₹412.50</p>
            </div>
            <button className="text-[10px] font-bold px-2 py-1 bg-surface border border-paper-dark rounded hover:border-teal transition-colors focus:ring-1 focus:ring-teal outline-none">
              WITHDRAW
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 border border-paper-dark/30 rounded-xl bg-violet/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bank size={20} className="text-violet" />
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-ink">Public Treasury Report</h3>
              <p className="text-xs text-slate">View the live distribution and health of the commons.</p>
            </div>
          </div>
          <ArrowSquareOut size={20} className="text-slate cursor-pointer hover:text-ink transition-colors" />
        </div>
      </SettingsSection>
      
      <div className="pb-12" />
    </div>
  );
}
