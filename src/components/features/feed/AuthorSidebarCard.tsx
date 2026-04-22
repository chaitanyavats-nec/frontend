"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { PostWithProvenance } from "@/types";

interface AuthorSidebarCardProps {
  post: PostWithProvenance;
  topicPosts: PostWithProvenance[];
}

export function AuthorSidebarCard({ post, topicPosts }: AuthorSidebarCardProps) {
  const { author, author_affiliations } = post;
  
  const getInitials = (name?: string) => {
    return name?.substring(0, 2).toUpperCase() || '??';
  };

  return (
    <div className="space-y-6">
      {/* Author Card */}
      <div className="bg-surface rounded-lg border border-paper-dark p-5">
        <Link href={`/profile/${author.did}`} className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
          <Avatar className="h-12 w-12 border border-paper-dark">
            {author.avatar_url && (
              <AvatarImage src={author.avatar_url} alt={author.display_name} />
            )}
            <AvatarFallback>{getInitials(author.display_name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-sans font-semibold text-ink leading-tight">{author.display_name}</h3>
            <span className="font-mono text-xs text-slate truncate max-w-[150px] inline-block">
              {author.did?.substring(0, 16)}...
            </span>
          </div>
        </Link>
        
        {author.bio && (
          <p className="font-sans text-sm text-ink mb-4">{author.bio}</p>
        )}

        {author_affiliations && author_affiliations.length > 0 && (
          <div className="mb-6">
            <h4 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-slate mb-2">Affiliations</h4>
            <div className="flex flex-wrap gap-1.5">
              {author_affiliations.map(aff => (
                <span key={aff.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono border bg-paper-dark/10 border-paper-dark text-slate font-medium">
                  {aff.organization_name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-slate mb-2">Reputation</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1 text-slate">
                <span>Accuracy</span>
              </div>
              <div className="h-1.5 w-full bg-paper-dark rounded-full overflow-hidden">
                <div className="h-full bg-teal" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1 text-slate">
                <span>Longevity</span>
              </div>
              <div className="h-1.5 w-full bg-paper-dark rounded-full overflow-hidden">
                <div className="h-full bg-teal" style={{ width: '70%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-mono mb-1 text-slate">
                <span>Participation</span>
              </div>
              <div className="h-1.5 w-full bg-paper-dark rounded-full overflow-hidden">
                <div className="h-full bg-teal" style={{ width: '45%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {topicPosts && topicPosts.length > 0 && (
        <div className="bg-surface rounded-lg border border-paper-dark p-5">
          <h4 className="font-mono text-[10px] uppercase tracking-wider font-semibold text-slate mb-4">Related in Topic</h4>
          <div className="space-y-4">
            {topicPosts.map((relatedPost, i) => (
              <div key={relatedPost.id} className={cn("pb-4", i !== topicPosts.length - 1 && "border-b border-paper-dark")}>
                <p className="font-sans text-sm text-ink line-clamp-3 mb-2">{relatedPost.body}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    {relatedPost.author.avatar_url && (
                      <AvatarImage src={relatedPost.author.avatar_url} />
                    )}
                    <AvatarFallback className="text-[8px]">{getInitials(relatedPost.author.display_name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-mono text-[10px] text-slate">{relatedPost.author.display_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
