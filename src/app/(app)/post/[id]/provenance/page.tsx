"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Warning } from "phosphor-react";
import { ProvenanceFullChain, updateTypeConfig } from "@/components/features/provenance/ProvenanceTag";
import { usePost } from "@/hooks/usePost";
import { cn } from "@/lib/utils";

export default function ProvenancePage() {
  const params = useParams();
  const router = useRouter();
  const [showProportionality, setShowProportionality] = useState(false);
  const { post, loading, error } = usePost(params.id as string);

  if (loading) {
    return (
      <div className="max-w-[680px] mx-auto py-20">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24" />
          <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
          <div className="h-60 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-[680px] mx-auto py-12 text-center">
        <div className="bg-paper-raised border border-[var(--border-subtle)] rounded-md p-8">
          <p className="font-sans text-sm text-neutral-500 mb-4">Post not found.</p>
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-cyan-600 hover:text-cyan-700"
          >
            <ArrowLeft size={14} />
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto w-full pb-20">
      {/* Back navigation */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 mb-6 transition-colors duration-150 py-1"
      >
        <ArrowLeft size={14} />
        Back to post
      </button>

      {/* Post preview */}
      <div className="mb-8 p-4 bg-paper-raised rounded-md border border-[var(--border-subtle)]">
        <p className="font-sans text-sm text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed">
          {post.body}
        </p>
        <span className="font-mono text-[10px] text-neutral-400 mt-2 block">
          by {post.author.display_name} · {new Date(post.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Full Provenance Chain (STATE 3) */}
      <ProvenanceFullChain post={post} />

      {/* Community Provenance Updates */}
      {post.provenance_updates && post.provenance_updates.length > 0 && (
        <div className="mt-10 pt-8 border-t border-[var(--border-subtle)]">
          <h2 className="eyebrow mb-6">Community provenance updates</h2>
          <div className="space-y-3">
            {post.provenance_updates.map((update) => (
              <div 
                key={update.id} 
                className={cn(
                  "p-4 rounded-md border transition-colors",
                  update.status === 'accepted' 
                    ? "bg-paper-raised border-cyan-200 dark:border-cyan-800/50 shadow-sm" 
                    : "bg-paper-raised border-[var(--border-subtle)]"
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border shrink-0", updateTypeConfig[update.update_type].classes)}>
                      {updateTypeConfig[update.update_type].label}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-400 truncate">
                      by <span className="font-semibold text-neutral-700 dark:text-neutral-200">{update.user?.display_name || "Unknown"}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest border",
                      update.status === 'pending' 
                        ? "text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20" 
                        : update.status === 'accepted' 
                        ? "text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-900/20" 
                        : "text-neutral-500 border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800"
                    )}>
                      {update.status}
                    </span>
                    <time className="font-mono text-[10px] text-neutral-400">
                      {new Date(update.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                  </div>
                </div>

                {/* Body */}
                <p className={cn("font-sans text-sm leading-relaxed", update.status === 'accepted' ? 'text-neutral-800 dark:text-neutral-200' : 'text-neutral-500 dark:text-neutral-400')}>
                  {update.body}
                </p>

                {/* Evidence */}
                {update.evidence_url && (
                  <div className="mt-3">
                    <a href={update.evidence_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-mono text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 underline underline-offset-2 truncate block max-w-full">
                      ↳ {update.evidence_url}
                    </a>
                  </div>
                )}
                {update.evidence_text && (
                  <div className="mt-2 p-2.5 bg-neutral-100 dark:bg-neutral-800 text-[12px] font-sans text-neutral-500 dark:text-neutral-400 border-l-2 border-neutral-300 dark:border-neutral-600 italic rounded-r-sm">
                    &ldquo;{update.evidence_text}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proportionality Toggle */}
      <div className="mt-10 pt-8 border-t border-[var(--border-subtle)]">
        <label className="flex items-start gap-4 cursor-pointer p-4 bg-paper-raised rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors border border-[var(--border-subtle)]">
          <div className="relative inline-block w-10 mt-1 align-middle select-none transition duration-200 ease-in shrink-0">
            <input
              type="checkbox"
              name="toggle"
              id="proportionality-toggle"
              checked={showProportionality}
              onChange={() => setShowProportionality(!showProportionality)}
              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-neutral-400"
            />
            <label
              htmlFor="proportionality-toggle"
              className={`toggle-label display-block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${showProportionality ? "bg-cyan-500" : "bg-neutral-300 dark:bg-neutral-600"}`}
            ></label>
          </div>
          <div className="min-w-0">
            <span className="block font-sans font-semibold text-neutral-800 dark:text-neutral-200 text-sm">Overlay Proportionality Data</span>
            <span className="block font-sans text-[12px] text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              Compare topic coverage volume against the historical baseline to detect manufactured amplification.
            </span>
            {showProportionality && (
              <div className="mt-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
                  <span>Current Volume: 1.2M</span>
                  <span>Baseline: 400k</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full mt-2 overflow-hidden flex">
                  <div className="bg-neutral-400 w-1/3" />
                  <div className="bg-yellow-500/50 w-2/3 relative">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_25%,rgba(255,255,255,0.15)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.15)_75%,rgba(255,255,255,0.15)_100%)] bg-[length:10px_10px]" />
                  </div>
                </div>
                <p className="mt-2 text-[11px] font-sans text-yellow-600 dark:text-yellow-400 font-medium flex items-center gap-1.5">
                  <Warning size={14} /> Elevated volume: 3× baseline expected.
                </p>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
