import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const badgeVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
    variant: {
      default: "border-primary bg-primary",
      destructive: "border-destructive bg-destructive",
      outline: "border-background bg-background",
      secondary: "border-secondary bg-secondary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BitBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BitBadgeProps>(
  ({ children, className = "", font, variant, ...props }, ref) => {
    const color = badgeVariants({ variant, font });

    const classes = className.split(" ");

    // visual classes for badge and sidebars
    const visualClasses = classes.filter(
      (c) =>
        c.startsWith("bg-") ||
        c.startsWith("border-") ||
        c.startsWith("text-") ||
        c.startsWith("rounded-"),
    );

    // Container should accept all non-visual utility classes (e.g., size, spacing, layout)
    const containerClasses = classes.filter(
      (c) =>
        !(
          c.startsWith("bg-") ||
          c.startsWith("border-") ||
          c.startsWith("text-") ||
          c.startsWith("rounded-")
        ),
    );

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-stretch", containerClasses)}
        {...props}
      >
        <ShadcnBadge
          className={cn(
            "h-full",
            "rounded-none",
            "w-full",
            font !== "normal" && "retro",
            visualClasses,
          )}
          /* biome-ignore lint/suspicious/noExplicitAny: variant alignment between shadcn and 8bitcn */
          variant={variant as any}
        >
          {children}
        </ShadcnBadge>

        {/* Left pixel bar */}
        <div
          className={cn(
            "-left-1.5 absolute inset-y-[4px] w-1.5",
            color,
            visualClasses,
          )}
        />
        {/* Right pixel bar */}
        <div
          className={cn(
            "-right-1.5 absolute inset-y-[4px] w-1.5",
            color,
            visualClasses,
          )}
        />
      </div>
    );
  },
);
Badge.displayName = "BitBadge";

export { Badge };
