import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  Card as ShadcnCard,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from "@/components/ui/card";

import "@/components/ui/8bit/styles/retro.css";

export const cardVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "retro",
    },
  },
  defaultVariants: {
    font: "retro",
  },
});

export interface BitCardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, BitCardProps>(
  ({ className, font, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-card text-card-foreground border-y-6 border-foreground dark:border-ring p-0!",
          className
        )}
      >
        <ShadcnCard
          {...props}
          className={cn(
            "rounded-none border-0 w-full! h-full flex flex-col bg-card text-card-foreground shadow-none",
            font !== "normal" && "retro",
            className
          )}
        />

        <div
          className={cn("absolute inset-0 border-x-6 -mx-1.5 border-inherit pointer-events-none")}
          aria-hidden="true"
        />
      </div>
    );
  }
);
Card.displayName = "BitCard";

const CardHeader = React.forwardRef<HTMLDivElement, BitCardProps>(
  ({ className, font, ...props }, ref) => (
    <ShadcnCardHeader
      ref={ref}
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "BitCardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, BitCardProps>(
  ({ className, font, ...props }, ref) => (
    <ShadcnCardTitle
      ref={ref}
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "BitCardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, BitCardProps>(
  ({ className, font, ...props }, ref) => (
    <ShadcnCardDescription
      ref={ref}
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "BitCardDescription";

const CardContent = React.forwardRef<HTMLDivElement, BitCardProps>(
  ({ className, font, ...props }, ref) => (
    <ShadcnCardContent
      ref={ref}
      className={cn("flex-1", font !== "normal" && "retro", className)}
      {...props}
    />
  )
);
CardContent.displayName = "BitCardContent";

const CardFooter = React.forwardRef<HTMLDivElement, BitCardProps>(
  ({ className, font, ...props }, ref) => (
    <ShadcnCardFooter
      ref={ref}
      data-slot="card-footer"
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "BitCardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
