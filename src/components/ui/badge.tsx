import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-teal text-paper",
        secondary: "border-transparent bg-paper-dark text-ink",
        destructive: "border-transparent bg-orange text-paper",
        outline: "text-ink border-paper-dark",
        teal: "border-transparent bg-teal-light text-teal-dark",
        orange: "border-transparent bg-orange-light text-orange",
        violet: "border-transparent bg-violet-light text-violet",
        coordinated: "border-transparent bg-orange text-paper",
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
