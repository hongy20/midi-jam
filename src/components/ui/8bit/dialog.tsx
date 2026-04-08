import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  Dialog as ShadcnDialog,
  DialogClose as ShadcnDialogClose,
  DialogContent as ShadcnDialogContent,
  DialogDescription as ShadcnDialogDescription,
  DialogFooter as ShadcnDialogFooter,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogTrigger as ShadcnDialogTrigger,
} from "@/components/ui/dialog";

import "@/components/ui/8bit/styles/retro.css";

const Dialog = ShadcnDialog;
const DialogTrigger = ShadcnDialogTrigger;
const DialogHeader = ShadcnDialogHeader;
const DialogDescription = ShadcnDialogDescription;
const DialogClose = ShadcnDialogClose;
const DialogFooter = ShadcnDialogFooter;

export const dialogContentVariants = cva("", {
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

export interface BitDialogProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof dialogContentVariants> {}

const DialogTitle = React.forwardRef<HTMLDivElement, BitDialogProps>(
  ({ className, font, ...props }, ref) => (
    <ShadcnDialogTitle
      ref={ref as any}
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  )
);
DialogTitle.displayName = "BitDialogTitle";

const DialogContent = React.forwardRef<HTMLDivElement, BitDialogProps>(
  ({ className, children, font, ...props }, ref) => {
    return (
      <ShadcnDialogContent
        ref={ref as any}
        className={cn(
          "bg-card rounded-none border-none",
          font !== "normal" && "retro",
          className
        )}
        {...props}
      >
        {children}

        <div
          className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 border-y-6 -my-1.5 border-foreground dark:border-ring pointer-events-none"
          aria-hidden="true"
        />
      </ShadcnDialogContent>
    );
  }
);
DialogContent.displayName = "BitDialogContent";

export {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogClose,
};
