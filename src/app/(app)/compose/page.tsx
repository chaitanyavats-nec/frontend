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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-ink">Publish</h1>
        <p className="font-editorial text-sm text-slate mt-1">
          Share information with full provenance and context.
        </p>
      </div>

      <div className="space-y-6">
        {/* Content Area */}
        <div className="bg-paper p-4 rounded-md border border-paper-dark focus-within:border-sage/50 transition-colors">
          <textarea
            className="w-full bg-transparent border-none focus:ring-0 resize-none font-editorial text-base text-ink placeholder:text-slate/50 min-h-[150px]"
            placeholder="What do you want to share?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Provenance Settings */}
        <div className="bg-paper-dark/20 p-5 rounded-md border border-paper-dark">
          <h2 className="font-mono text-sm text-ink mb-4">Provenance Declaration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="font-mono text-xs text-slate block mb-2">Claim Type</label>
              <div className="flex gap-2 flex-wrap">
                {(["original", "derived", "republished"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSourceType(type)}
                    className={cn(
                      "px-3 py-1.5 rounded-md font-mono text-xs capitalize transition-colors duration-150 border",
                      sourceType === type
                        ? "bg-sage text-paper border-sage"
                        : "bg-paper text-slate border-paper-dark hover:border-sage/30"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <p className="font-editorial text-xs text-slate mt-2">
                {sourceType === "original" && "You are the primary source or witness to this information."}
                {sourceType === "derived" && "This information is synthesized or analyzed from other sources."}
                {sourceType === "republished" && "This is a direct quote or repost of existing information."}
              </p>
            </div>

            {/* Citations block for derived/republished */}
            {sourceType !== "original" && (
              <div className="pt-2 border-t border-paper-dark">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-mono text-xs text-slate">Source Citations (Required)</label>
                  <button
                    onClick={addCitation}
                    className="flex items-center gap-1 font-mono text-xs text-sage hover:text-sage-dark"
                  >
                    <Plus size={14} /> Add Source
                  </button>
                </div>
                
                {citations.length === 0 ? (
                  <div className="p-4 rounded border border-dashed border-paper-dark text-center">
                    <p className="font-mono text-xs text-slate-light">
                      Non-original claims require at least one cited source.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {citations.map((cite, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="Source Title/Description"
                            className="w-full bg-paper border border-paper-dark rounded px-3 py-1.5 font-mono text-xs text-ink focus:outline-none focus:border-sage/50"
                            value={cite.title}
                            onChange={(e) => updateCitation(i, "title", e.target.value)}
                          />
                          <input
                            type="url"
                            placeholder="URL (optional)"
                            className="w-full bg-paper border border-paper-dark rounded px-3 py-1.5 font-mono text-xs text-ink focus:outline-none focus:border-sage/50"
                            value={cite.url}
                            onChange={(e) => updateCitation(i, "url", e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => removeCitation(i)}
                          className="p-1.5 rounded text-slate hover:text-terracotta hover:bg-terracotta-light/30 transition-colors"
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
        <div className="flex items-center justify-between pt-2">
          <p className="font-mono text-xs text-slate-light">
            All declarations are logged on-chain.
          </p>
          <Button
            className="flex items-center gap-2 px-6 py-2 bg-sage hover:bg-sage-dark text-paper font-mono text-sm rounded-md transition-colors"
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
