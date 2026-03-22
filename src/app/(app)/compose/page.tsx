"use client";

import { useState } from "react";
import { PaperPlaneRight, Plus } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ComposePage() {
  const [content, setContent] = useState("");
  const [sourceType, setSourceType] = useState<"original" | "derived" | "republished">("original");
  const [citations, setCitations] = useState<{ url: string; title: string }[]>([]);

  const addCitation = () => {
    setCitations([...citations, { url: "", title: "" }]);
  };

  const updateCitation = (index: number, field: "url" | "title", value: string) => {
    const newCitations = [...citations];
    newCitations[index][field] = value;
    setCitations(newCitations);
  };

  const removeCitation = (index: number) => {
    setCitations(citations.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="font-sans font-bold text-2xl tracking-tight text-ink">Publish</h1>
        <p className="font-sans text-sm text-slate mt-1">
          Share information with full provenance and context.
        </p>
      </div>

      <div className="space-y-6">
        {/* Content Area */}
        <div className="bg-surface p-5 rounded-lg border border-paper-dark focus-within:border-sage/50 transition-colors shadow-sm">
          <textarea
            className="w-full bg-transparent border-none focus:ring-0 resize-none font-sans text-base text-ink placeholder:text-slate/50 min-h-[150px]"
            placeholder="What do you want to share?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Provenance Settings */}
        <div className="bg-surface p-6 rounded-lg border border-paper-dark shadow-sm">
          <h2 className="font-sans font-semibold text-lg tracking-tight text-ink mb-5">Provenance Declaration</h2>
          
          <div className="space-y-6">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate block mb-3">Claim Type</label>
              <div className="flex gap-3 flex-wrap">
                {(["original", "derived", "republished"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSourceType(type)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-sans font-medium text-sm capitalize transition-colors duration-150 border",
                      sourceType === type
                        ? "bg-sage text-white-0 border-sage"
                        : "bg-paper text-slate border-paper-dark hover:border-sage/30 hover:bg-sage/5"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <p className="font-sans text-sm text-slate mt-3 leading-relaxed">
                {sourceType === "original" && "You are the primary source or witness to this information."}
                {sourceType === "derived" && "This information is synthesized or analyzed from other sources."}
                {sourceType === "republished" && "This is a direct quote or repost of existing information."}
              </p>
            </div>

            {/* Citations block for derived/republished */}
            {sourceType !== "original" && (
              <div className="pt-5 border-t border-paper-dark">
                <div className="flex items-center justify-between mb-4">
                  <label className="font-mono text-[11px] uppercase tracking-wider font-semibold text-slate">Source Citations (Required)</label>
                  <button
                    onClick={addCitation}
                    className="flex items-center gap-1.5 font-sans font-medium text-xs text-sage hover:text-sage-dark bg-sage/10 hover:bg-sage/20 px-2.5 py-1.5 rounded-md transition-colors"
                  >
                    <Plus size={14} /> Add Source
                  </button>
                </div>
                
                {citations.length === 0 ? (
                  <div className="p-6 rounded-lg border border-dashed border-paper-dark text-center bg-paper/50">
                    <p className="font-sans text-sm text-slate">
                      Non-original claims require at least one cited source.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {citations.map((cite, i) => (
                      <div key={i} className="flex gap-3 items-start bg-paper/50 p-4 rounded-lg border border-paper-dark">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            placeholder="Source Title/Description"
                            className="w-full bg-surface border border-paper-dark rounded-md px-3 py-2 font-sans text-sm text-ink focus:outline-none focus:border-sage/50"
                            value={cite.title}
                            onChange={(e) => updateCitation(i, "title", e.target.value)}
                          />
                          <input
                            type="url"
                            placeholder="URL (optional)"
                            className="w-full bg-surface border border-paper-dark rounded-md px-3 py-2 font-mono text-xs text-ink focus:outline-none focus:border-sage/50"
                            value={cite.url}
                            onChange={(e) => updateCitation(i, "url", e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => removeCitation(i)}
                          className="p-2 rounded-md text-slate hover:text-terracotta hover:bg-terracotta/10 transition-colors"
                          title="Remove source"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <p className="font-sans text-xs text-slate">
            All declarations are logged on-chain.
          </p>
          <Button
            className="flex items-center gap-2 px-8"
            disabled={!content || (sourceType !== "original" && citations.length === 0)}
          >
            <span>Publish</span>
            <PaperPlaneRight size={16} weight="fill" />
          </Button>
        </div>
      </div>
    </div>
  );
}
