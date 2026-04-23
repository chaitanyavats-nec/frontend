"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Scales, Note, Clock } from "phosphor-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGovernance } from "@/hooks/useGovernance";
import { cn } from "@/lib/utils";

export default function NewProposalPage() {
  const router = useRouter();
  const { createProposal, isCreating } = useGovernance();
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<"standard" | "constitutional">("standard");
  const [duration, setDuration] = useState(7); // Days

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + duration);

    try {
      await createProposal({
        title,
        body,
        type,
        deadline: deadline.toISOString(),
      });
    } catch (err) {
      console.error("Failed to create proposal:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <header className="mb-10">
        <Link
          href="/governance"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate hover:text-ink transition-colors duration-150 mb-6"
        >
          <ArrowLeft size={14} />
          Back to Hub
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-surface border border-paper-dark rounded-lg">
            <Note size={24} className="text-ink" />
          </div>
          <h1 className="font-sans font-bold text-3xl text-ink tracking-tight">Draft Proposal</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate">
            Proposal Title
          </label>
          <input
            autoFocus
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Upgrade Reputation Scoring Model"
            className="w-full bg-surface border border-paper-dark rounded-md px-4 py-3 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
          />
        </div>

        {/* Type Selection */}
        <div className="space-y-3">
          <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate">
            Policy Domain
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType("standard")}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
                type === "standard"
                  ? "bg-paper-dark/10 border-ink/20 shadow-inner"
                  : "bg-surface border-paper-dark hover:border-paper-darker"
              )}
            >
              <Note size={20} className={type === "standard" ? "text-ink" : "text-slate"} />
              <div>
                <div className="font-sans font-bold text-sm text-ink">Standard</div>
                <div className="text-[10px] text-slate font-medium">Core protocol parameter adjustments</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setType("constitutional")}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
                type === "constitutional"
                  ? "bg-paper-dark/10 border-gold/20 shadow-inner"
                  : "bg-surface border-paper-dark hover:border-paper-darker"
              )}
            >
              <Scales size={20} className={type === "constitutional" ? "text-gold" : "text-slate"} />
              <div>
                <div className="font-sans font-bold text-sm text-ink">Constitutional</div>
                <div className="text-[10px] text-slate font-medium">Fundamental policy & intent changes</div>
              </div>
            </button>
          </div>
        </div>

        {/* Body (Markdown) */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate">
              Submission Details
            </label>
            <span className="text-[10px] font-mono text-slate opacity-50">Supports basic markdown</span>
          </div>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="## Abstract\nProvide a summary of your proposed change...\n\n## Rationale\nWhy is this necessary for the network?"
            className="w-full bg-surface border border-paper-dark rounded-md px-4 py-4 font-sans text-sm leading-relaxed min-h-[300px] focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all resize-none"
          />
        </div>

        {/* Duration */}
        <div className="space-y-3">
          <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate flex items-center gap-1.5">
            <Clock size={14} /> Voting Period
          </label>
          <div className="flex gap-2">
            {[3, 7, 14].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={cn(
                  "px-4 py-2 rounded-md font-mono text-xs transition-all",
                  duration === d
                    ? "bg-ink text-white-0 shadow-lg"
                    : "bg-paper-dark/10 text-slate hover:bg-paper-dark/20"
                )}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={isCreating || !title || !body}
            className="w-full h-14 bg-sage hover:bg-sage-dark text-white-0 font-sans font-bold text-base shadow-xl disabled:opacity-30 transition-all"
          >
            {isCreating ? "Witnessing Transaction..." : "Commit Proposal"}
          </Button>
          <p className="text-center text-[10px] text-slate mt-4 uppercase tracking-widest font-mono opacity-60">
            Submission requires a minimum stake of 2,500 REPUTATION
          </p>
        </div>
      </form>
    </div>
  );
}
