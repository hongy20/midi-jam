import "@/shared/components/ui/8bit/styles/retro.css";

import { cva } from "class-variance-authority";
import React from "react";

import { cn } from "@/shared/lib/utils";

const switchVariants = cva(
  "border-foreground dark:border-ring focus-visible:ring-foreground inline-flex h-10 w-20 shrink-0 cursor-pointer items-center border-8 transition-colors focus-visible:ring-4 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      checked: {
        true: "bg-primary",
        false: "bg-foreground/10",
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, ...props }, ref) => (
    <button
      type="button"
      className={cn(switchVariants({ checked }), className)}
      role="switch"
      aria-checked={checked}
      ref={ref}
      {...props}
    >
      <span
        className={cn(
          "border-foreground dark:border-ring bg-background pointer-events-none block h-4 w-4 border-4 transition-transform",
          checked ? "translate-x-10" : "translate-x-0",
        )}
      />
    </button>
  ),
);
Switch.displayName = "BitSwitch";

export { Switch };
