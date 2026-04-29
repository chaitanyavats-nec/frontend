"use client";

import { useReputationHistory } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ReputationHistoryProps {
  userId: string;
}

const EVENT_DESCRIPTIONS: Record<string, string> = {
  post_cited: "Your post was cited",
  flag_upheld: "Your flag was upheld by the moderation team",
  flag_rejected: "Your flag was not upheld",
  case_correct_vote: "You voted correctly in a moderation case",
  case_participation: "Participated in a moderation case",
  decay_applied: "Inactivity decay applied",
  age_milestone: "Account age milestone reached",
  total_updated: "Overall reputation recalculated",
};

const EVENT_COLORS: Record<string, string> = {
  post_cited: "bg-teal",
  flag_upheld: "bg-sage",
  flag_rejected: "bg-terracotta",
  case_correct_vote: "bg-sage",
  case_participation: "bg-slate",
  decay_applied: "bg-terracotta",
  age_milestone: "bg-gold",
  total_updated: "bg-ink",
};

export function ReputationHistory({ userId }: ReputationHistoryProps) {
  const { events, loading, error } = useReputationHistory(userId);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-12 bg-paper-dark/20 rounded-lg" />)}
    </div>;
  }

  if (error) {
    return <div className="text-sm text-terracotta">Failed to load history</div>;
  }

  if (events.length === 0) {
    return <div className="text-sm text-slate italic">No reputation events yet.</div>;
  }

  return (
    <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-paper-dark/30">
      {events.map((event) => {
        const isPositive = event.delta > 0;
        const colorClass = EVENT_COLORS[event.event_type] || "bg-slate";
        
        return (
          <div key={event.id} className="relative flex gap-4 pl-10 items-start">
            <div className={cn("absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 border-surface", colorClass)} />
            
            <div className="flex-1 bg-surface border border-paper-dark p-3 rounded-lg shadow-sm">
              <div className="flex justify-between items-start gap-4 mb-1">
                <span className="font-medium text-sm text-ink">
                  {EVENT_DESCRIPTIONS[event.event_type] || event.event_type}
                </span>
                <span className={cn(
                  "font-bold text-sm whitespace-nowrap",
                  isPositive ? "text-sage" : event.delta < 0 ? "text-terracotta" : "text-slate"
                )}>
                  {event.delta > 0 ? '+' : ''}{event.delta}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate capitalize">
                  {event.dimension_affected.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate opacity-70 font-mono">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
