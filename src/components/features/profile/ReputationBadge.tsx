import { cn } from "@/lib/utils";

export type LadderLevel = 'new' | 'contributor' | 'trusted' | 'established' | 'authority' | 'elder';

interface ReputationBadgeProps {
  level: LadderLevel;
  score: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LADDER_COLORS: Record<LadderLevel, { dot: string; text: string; bg: string; border: string }> = {
  new: { dot: "bg-slate", text: "text-slate", bg: "bg-slate-light/10", border: "border-slate-light/20" },
  contributor: { dot: "bg-sage-light", text: "text-sage", bg: "bg-sage-light/10", border: "border-sage-light/20" },
  trusted: { dot: "bg-sage", text: "text-sage-dark", bg: "bg-sage/10", border: "border-sage/20" },
  established: { dot: "bg-gold", text: "text-gold-dark", bg: "bg-gold/10", border: "border-gold/20" },
  authority: { dot: "bg-gold-dark", text: "text-gold-dark", bg: "bg-gold-dark/10", border: "border-gold-dark/20" },
  elder: { dot: "bg-terracotta", text: "text-terracotta", bg: "bg-terracotta/10", border: "border-terracotta/20" },
};

const SIZE_STYLES = {
  sm: { wrapper: "px-1.5 py-0.5 text-[9px]", dot: "w-1.5 h-1.5", score: "text-[10px]" },
  md: { wrapper: "px-2 py-0.5 text-[10px]", dot: "w-2 h-2", score: "text-[11px]" },
  lg: { wrapper: "px-2.5 py-1 text-xs", dot: "w-2.5 h-2.5", score: "text-sm" },
};

export function ReputationBadge({ level, score, showScore = true, size = 'md', className }: ReputationBadgeProps) {
  // Fallback for unexpected levels
  const normalizedLevel = (LADDER_COLORS[level] ? level : 'new') as LadderLevel;
  const colors = LADDER_COLORS[normalizedLevel];
  const sizes = SIZE_STYLES[size];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase tracking-widest border",
      colors.bg,
      colors.border,
      sizes.wrapper,
      className
    )}>
      <div className={cn("rounded-full shrink-0", colors.dot)} />
      <span className={colors.text}>{normalizedLevel}</span>
      {showScore && (
        <>
          <span className="opacity-30 mx-0.5">|</span>
          <span className={cn("font-bold text-ink", sizes.score)}>{score}</span>
        </>
      )}
    </div>
  );
}
