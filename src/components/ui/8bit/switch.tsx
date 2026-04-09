import { cva } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

const switchVariants = cva(
  "inline-flex h-10 w-20 shrink-0 cursor-pointer items-center border-8 border-foreground dark:border-ring transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-foreground disabled:cursor-not-allowed disabled:opacity-50",
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
          "pointer-events-none block h-4 w-4 border-4 border-foreground dark:border-ring bg-background transition-transform",
          checked ? "translate-x-10" : "translate-x-0",
        )}
      />
    </button>
  ),
);
Switch.displayName = "BitSwitch";

export { Switch };
