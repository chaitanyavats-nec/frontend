"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "phosphor-react";
import { ProvenanceFullChain } from "@/components/features/provenance/ProvenanceTag";
import { useMockData } from "@/hooks/useMockData";

export default function ProvenancePage() {
  const params = useParams();
  const { getPostById } = useMockData();
  const post = getPostById(params.id as string);

  if (!post) {
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
          {post.content}
        </p>
        <span className="font-mono text-xs text-slate-light mt-2 block">
          by {post.authorDisplayName} · {new Date(post.timestamp).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Full Provenance Chain (STATE 3) */}
      <ProvenanceFullChain provenance={post.provenance} />
    </div>
  );
}
