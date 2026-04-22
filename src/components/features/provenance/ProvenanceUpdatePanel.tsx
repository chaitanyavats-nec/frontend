"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Check } from "phosphor-react";
import { submitProvenanceUpdate } from "@/app/actions/provenanceUpdates";

interface ProvenanceUpdatePanelProps {
  postId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const UPDATE_TYPES = [
  { id: "added_context", label: "Added context", desc: "Contribute a relevant statistic, follow-up, or background info." },
  { id: "incomplete_provenance", label: "Incomplete provenance", desc: "Provide missing source chain, affiliation, or funding details." },
  { id: "misleading_framing", label: "Misleading framing", desc: "Flag a title or summary that misrepresents the cited source." },
  { id: "undisclosed_funding", label: "Undisclosed funding/affiliation", desc: "Provide evidence of an undeclared financial relationship." }
] as const;

export function ProvenanceUpdatePanel({ postId, onClose, onSuccess }: ProvenanceUpdatePanelProps) {
  const [selectedType, setSelectedType] = useState<typeof UPDATE_TYPES[number]["id"]>("added_context");
  const [body, setBody] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const needsEvidence = selectedType === "misleading_framing" || selectedType === "undisclosed_funding";
  const hasEvidence = evidenceUrl.trim() !== "" || evidenceText.trim() !== "";
  const canSubmit = body.trim().length > 0 && body.length <= 800 && (!needsEvidence || (needsEvidence && hasEvidence));
  const requiresConfirm = selectedType === "misleading_framing" || selectedType === "undisclosed_funding";

  const handleSubmit = async () => {
    if (requiresConfirm && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitProvenanceUpdate({
        postId,
        updateType: selectedType,
        body,
        evidenceUrl: evidenceUrl || undefined,
        evidenceText: evidenceText || undefined,
      });

      if (res.error) {
        alert("Error: " + res.error);
        setIsSubmitting(false);
        return;
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit update");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-4 border border-paper-dark rounded-lg overflow-hidden bg-surface animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-paper-dark bg-paper/30">
        <h3 className="font-editorial text-base font-semibold text-ink">Contribute Context</h3>
        <button onClick={onClose} className="p-1 text-slate hover:text-ink transition-colors rounded-md hover:bg-paper-dark/50">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Type Selection */}
        <div className="space-y-2">
          <label className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold block">Update Type</label>
          <div className="flex flex-col gap-2">
            {UPDATE_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`text-left p-3.5 rounded-md border transition-all ${
                  selectedType === type.id
                    ? "border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/20 ring-1 ring-cyan-500/20 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-transparent"
                }`}
              >
                <div className={`font-sans text-[14px] font-bold mb-1 ${selectedType === type.id ? "text-cyan-700 dark:text-cyan-400" : "text-neutral-900 dark:text-neutral-50"}`}>
                  {type.label}
                </div>
                <div className="font-sans text-[13px] text-neutral-600 dark:text-neutral-400">{type.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Write Update */}
        <div className="space-y-2">
          <div className="flex justify-between items-end mb-1">
            <label className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold block">
              {selectedType === "misleading_framing" ? "Citation Challenge" : "Annotation Content"}
            </label>
            <span className={`text-[10px] font-mono ${body.length > 800 ? "text-red-500" : "text-neutral-400"}`}>
              {body.length} / 800
            </span>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={`Write your ${selectedType === "misleading_framing" ? "challenge" : "annotation"}...`}
            className="w-full bg-paper-raised border border-neutral-200 dark:border-neutral-700 rounded-md p-3.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 text-[14px] font-sans leading-relaxed text-neutral-900 dark:text-neutral-50 placeholder:text-neutral-400 min-h-[120px] resize-y"
          />
        </div>

        {/* Evidence */}
        <div className="space-y-2">
          <label className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold block flex items-center gap-2 mb-1">
            Attach Evidence
            {needsEvidence ? (
              <span className="text-[9px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-sm border border-red-200 dark:border-red-800">Required</span>
            ) : (
              <span className="text-[9px] bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded-sm">Optional</span>
            )}
          </label>
          <div className="space-y-3.5 p-4 border border-neutral-200 dark:border-neutral-700 rounded-md bg-paper-raised">
            <div>
              <label className="text-[12px] font-sans text-neutral-500 dark:text-neutral-400 block mb-1.5 text-center sm:text-left">Provide a link to a supporting source:</label>
              <input
                type="text"
                value={evidenceUrl}
                onChange={e => setEvidenceUrl(e.target.value)}
                placeholder="e.g., https://example.com/source"
                className="w-full bg-surface border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-2.5 text-[14px] font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-neutral-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-neutral-200 dark:border-neutral-700"></div>
              <div className="text-center text-[10px] text-neutral-400 font-mono font-semibold uppercase tracking-wider">OR</div>
              <div className="flex-1 border-t border-neutral-200 dark:border-neutral-700"></div>
            </div>
            <div>
              <label className="text-[12px] font-sans text-neutral-500 dark:text-neutral-400 block mb-1.5 text-center sm:text-left">Paste relevant excerpt:</label>
              <textarea
                value={evidenceText}
                onChange={e => setEvidenceText(e.target.value)}
                placeholder="Quote the relevant text directly..."
                className="w-full bg-surface border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-2.5 text-[14px] font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500 min-h-[80px] placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>

        {/* Preview State */}
        {isPreview && (
          <div className="p-4 border border-teal/30 bg-teal/5 rounded-md mt-4">
            <div className="mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-teal font-semibold">Preview</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-white-0 border shadow-sm">
                {UPDATE_TYPES.find(t => t.id === selectedType)?.label}
              </span>
              <div>
                <p className="text-sm font-editorial text-ink mt-0.5">{body}</p>
                {hasEvidence && (
                  <div className="mt-2 text-xs font-mono text-teal">
                    + Attached evidence
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-paper-dark">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs font-semibold text-slate hover:text-ink transition-colors"
          >
            {isPreview ? "Hide Preview" : "Show Preview"}
          </button>

          {showConfirm ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-terracotta font-medium max-w-[200px] text-right">
                This will be reviewed. Are you sure this evidence is accurate?
              </span>
              <Button
                size="sm"
                className="bg-terracotta hover:bg-[#b04035] text-white-0 px-4 h-8"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Confirm & Submit"}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              disabled={!canSubmit || isSubmitting}
              className="bg-teal text-white-0 px-6 h-8 rounded-md text-xs font-bold uppercase tracking-wider hover:bg-teal-dark"
              onClick={handleSubmit}
            >
              Submit Update
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
