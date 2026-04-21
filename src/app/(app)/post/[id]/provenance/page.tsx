"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { ProvenanceFullChain } from "@/components/features/provenance/ProvenanceTag";
import { usePost } from "@/hooks/usePost";

export default function ProvenancePage() {
  const params = useParams();
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
    <div>
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
    </div>
  );
}
