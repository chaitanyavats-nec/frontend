import Link from 'next/link';
import { Post } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatCircle, Link as LinkIcon, GitCommit } from 'phosphor-react';
import { ProvenanceTag } from '../provenance/ProvenanceTag';

interface FeedCardProps {
  post: Post;
  showProvenance?: boolean;
  isReply?: boolean;
}

export function FeedCard({ post, showProvenance = false, isReply = false }: FeedCardProps) {
  const getInitials = (name: string) => {
    return name?.substring(0, 2).toUpperCase() || '??';
  };

  const getRelativeTime = (dateString: string) => {
    const timestamp = new Date(dateString).getTime();
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    return `${Math.floor(diffInMonths / 12)}y ago`;
  };

  return (
    <div className="p-4 border border-x-0 sm:border-x border-border hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Link href={`/profile/${post.authorDid}`} className="shrink-0 pt-1">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={post.authorAvatarUrl} alt={post.authorDisplayName || ''} />
            <AvatarFallback>{getInitials(post.authorDisplayName)}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <Link 
                href={`/profile/${post.authorDid}`}
                className="font-semibold text-foreground hover:underline truncate"
              >
                {post.authorDisplayName}
              </Link>
              <span className="text-sm text-muted-foreground truncate">
                {post.authorDid.substring(0, 16)}...
              </span>
            </div>
            
            <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
              {getRelativeTime(post.timestamp)}
            </span>
          </div>

          {/* Main Content */}
          <div className="text-sm md:text-base text-foreground mb-3 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>

          {/* Topic Tags */}
          {post.topicTags && post.topicTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.topicTags.map((tag) => (
                <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Provenance and Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-border mt-3">
            <div>
              {post.provenance && (showProvenance || true) && (
                <ProvenanceTag 
                  provenance={post.provenance} 
                  postId={post.id} 
                  expanded={false} 
                />
              )}
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors text-sm">
                <ChatCircle size={16} />
                <span>{post.replyCount || 0}</span>
              </button>
              
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors text-sm">
                <GitCommit size={16} />
                <span className="sr-only">Derive</span>
              </button>

              <button className="flex items-center gap-1.5 hover:text-primary transition-colors text-sm">
                <LinkIcon size={16} />
                <span className="sr-only">Share Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
