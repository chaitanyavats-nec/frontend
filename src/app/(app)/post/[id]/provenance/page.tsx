"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Warning } from "phosphor-react";
import { ProvenanceFullChain } from "@/components/features/provenance/ProvenanceTag";
import { usePost } from "@/hooks/usePost";

export default function ProvenancePage() {
  const params = useParams();
  const [showProportionality, setShowProportionality] = useState(false);
  const { post, loading, error } = usePost(params.id as string);

  if (loading) {
    return <div className="py-20 text-center animate-pulse text-slate">Loading chain...</div>;
  }

  if (error || !post) {
    return (
      <div className="py-12 text-center">
        <p className="font-editorial text-base text-slate">Post not found.</p>
        <Link
          href="/home"
          className="inline-flex items-center gap-1 font-mono text-xs text-sage hover:text-sage-dark mt-4"
        >
          <ArrowLeft size={14} />
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto w-full pb-20">
      {/* Back navigation */}
      <Link
        href={`/post/${post.id}`}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-slate hover:text-ink mb-6 transition-colors duration-150"
      >
        <ArrowLeft size={14} />
        Back to post
      </Link>

      {/* Post preview */}
      <div className="mb-8 p-4 bg-paper-dark/40 rounded-md border border-paper-dark">
        <p className="font-editorial text-sm text-slate line-clamp-3">
          {post.body}
        </p>
        <span className="font-mono text-xs text-slate-light mt-2 block">
          by {post.author.display_name} · {new Date(post.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Full Provenance Chain (STATE 3) */}
      <ProvenanceFullChain post={post} />

      {/* Proportionality Toggle */}
      <div className="mt-12 pt-8 border-t border-paper-dark">
        <label className="flex items-start gap-4 cursor-pointer p-4 bg-surface rounded-lg hover:bg-paper-dark/20 transition-colors border border-paper-dark">
          <div className="relative inline-block w-10 mt-1 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="proportionality-toggle"
              checked={showProportionality}
              onChange={() => setShowProportionality(!showProportionality)}
              className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white-0 border-4 appearance-none cursor-pointer border-slate"
            />
            <label
              htmlFor="proportionality-toggle"
              className={`toggle-label display-block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${showProportionality ? "bg-teal" : "bg-slate/30"}`}
            ></label>
          </div>
          <div>
            <span className="block font-sans font-semibold text-ink text-sm">Overlay Proportionality Data</span>
            <span className="block font-sans text-xs text-slate mt-1">
              Compare topic coverage volume against the historical baseline to detect manufactured amplification.
            </span>
            {showProportionality && (
              <div className="mt-4 p-4 bg-paper-dark/10 rounded border border-paper-dark/50">
                <div className="flex items-center justify-between font-mono text-xs text-slate">
                  <span>Current Volume: 1.2M</span>
                  <span>Baseline: 400k</span>
                </div>
                <div className="w-full bg-paper-dark h-2 rounded-full mt-2 overflow-hidden flex">
                  <div className="bg-slate w-1/3" />
                  <div className="bg-orange/50 w-2/3 relative">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:10px_10px]" />
                  </div>
                </div>
                <p className="mt-2 text-xs font-sans text-orange font-medium flex items-center gap-1.5">
                  <Warning size={14} /> Elevated volume: 3x baseline expected.
                </p>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
