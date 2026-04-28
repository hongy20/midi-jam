"use client";

import "@/shared/components/ui/8bit/styles/retro.css";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

export const progressVariants = cva("", {
  variants: {
    variant: {
      default: "",
      retro: "retro",
    },
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface BitProgressProps
  extends
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  className?: string;
  font?: VariantProps<typeof progressVariants>["font"];
  progressBg?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  BitProgressProps
>(({ className, font, variant, value, progressBg, ...props }, ref) => {
  // Extract height from className if present
  const heightMatch = className?.match(/h-(\d+|\[.*?\])/);
  const heightClass = heightMatch ? heightMatch[0] : "h-2";
  const isIndeterminate = value === null || value === undefined;

  return (
    <div className={cn("relative w-full", className)}>
      <ProgressPrimitive.Root
        ref={ref}
        data-slot="progress"
        className={cn(
          "bg-primary/20 relative w-full overflow-hidden",
          heightClass,
          font !== "normal" && "retro",
        )}
        value={value}
        {...props}
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full transition-all",
            variant === "retro" || isIndeterminate ? "flex w-full" : "w-full flex-1",
            variant !== "retro" && !isIndeterminate && (progressBg || "bg-primary"),
            isIndeterminate && "animate-scan-wrap",
          )}
          style={
            variant === "retro" || isIndeterminate
              ? undefined
              : { transform: `translateX(-${100 - (value || 0)}%)` }
          }
        >
          {variant === "retro" && !isIndeterminate && (
            <div className="flex h-full w-full">
              {Array.from({ length: 20 }).map((_, i) => {
                const filledSquares = Math.round(((value || 0) / 100) * 20);
                return (
                  <div
                    key={i}
                    className={cn(
                      "mx-[1px] h-full flex-1",
                      i < filledSquares ? progressBg || "bg-primary" : "bg-transparent",
                    )}
                  />
                );
              })}
            </div>
          )}
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>

      <div
        className="border-foreground dark:border-ring pointer-events-none absolute inset-0 -my-1 border-y-4"
        aria-hidden="true"
      />

      <div
        className="border-foreground dark:border-ring pointer-events-none absolute inset-0 -mx-1 border-x-4"
        aria-hidden="true"
      />
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
