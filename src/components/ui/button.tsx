import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-surface transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-teal text-paper hover:bg-teal-dark",
        destructive: "bg-orange text-paper hover:bg-orange/90",
        outline:
          "border border-paper-dark bg-surface hover:bg-paper-dark/50 hover:text-ink",
        secondary: "bg-paper-dark/50 text-ink hover:bg-paper-dark/80",
        ghost: "hover:bg-paper-dark/50 hover:text-ink",
        link: "text-teal underline-offset-4 hover:underline",
        teal: "border border-teal text-teal hover:bg-teal hover:text-paper",
        orange:
          "border border-orange text-orange hover:bg-orange hover:text-white-0",
        violet: "border border-violet text-violet hover:bg-violet hover:text-white-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
