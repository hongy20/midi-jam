"use client";

import "@/shared/components/ui/8bit/styles/retro.css";

import type * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { Toggle as ShadcnToggle } from "@/shared/components/ui/toggle";
import { cn } from "@/shared/lib/utils";

const toggleVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
    variant: {
      default: "bg-transparent",
      outline: "hover:bg-accent hover:text-accent-foreground bg-transparent shadow-sm",
    },
    size: {
      default: "h-9 min-w-9 px-2",
      sm: "h-8 min-w-8 px-1.5",
      lg: "h-10 min-w-10 px-2.5",
    },
  },
  defaultVariants: {
    variant: "default",
    font: "retro",
    size: "default",
  },
});

export interface BitToggleProps
  extends
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

function Toggle({ children, font, ...props }: BitToggleProps) {
  const { variant, className } = props;

  return (
    <ShadcnToggle
      {...props}
      className={cn(
        "rounded-none active:translate-y-1 transition-transform relative border-none active:translate-x-1",
        "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        font !== "normal" && "retro",
        className,
      )}
    >
      {children}

      {variant === "outline" && (
        <>
          <div
            className="border-foreground dark:border-ring pointer-events-none absolute inset-0 -my-1.5 border-y-6"
            aria-hidden="true"
          />

          <div
            className="border-foreground dark:border-ring pointer-events-none absolute inset-0 -mx-1.5 border-x-6"
            aria-hidden="true"
          />
        </>
      )}
    </ShadcnToggle>
  );
}

export { Toggle, toggleVariants };
