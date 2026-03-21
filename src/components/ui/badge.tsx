import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-sage text-paper",
        secondary: "border-transparent bg-paper-dark text-ink",
        destructive: "border-transparent bg-terracotta text-paper",
        outline: "text-ink border-paper-dark",
        sage: "border-transparent bg-sage-light text-sage-dark",
        terracotta: "border-transparent bg-terracotta-light text-terracotta",
        gold: "border-transparent bg-gold-light text-gold",
        coordinated: "border-transparent bg-terracotta text-paper",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
