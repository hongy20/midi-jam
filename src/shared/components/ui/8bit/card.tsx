import "@/shared/components/ui/8bit/styles/retro.css";

import { cva, type VariantProps } from "class-variance-authority";

import {
  Card as ShadcnCard,
  CardAction as ShadcnCardAction,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

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
  extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

function Card({ className, font, ...props }: BitCardProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground border-foreground dark:border-ring relative border-y-6 p-0!",
        className,
      )}
    >
      <ShadcnCard
        {...props}
        className={cn(
          "bg-card text-card-foreground flex h-full w-full! flex-col rounded-none border-0 shadow-none",
          font !== "normal" && "retro",
          className,
        )}
      />

      <div
        className={cn("pointer-events-none absolute inset-0 -mx-1.5 border-x-6 border-inherit")}
        aria-hidden="true"
      />
    </div>
  );
}

function CardHeader({ ...props }: BitCardProps) {
  const { className, font } = props;

  return <ShadcnCardHeader className={cn(font !== "normal" && "retro", className)} {...props} />;
}

function CardTitle({ ...props }: BitCardProps) {
  const { className, font } = props;

  return <ShadcnCardTitle className={cn(font !== "normal" && "retro", className)} {...props} />;
}

function CardDescription({ ...props }: BitCardProps) {
  const { className, font } = props;

  return (
    <ShadcnCardDescription className={cn(font !== "normal" && "retro", className)} {...props} />
  );
}

function CardAction({ ...props }: BitCardProps) {
  const { className, font } = props;

  return <ShadcnCardAction className={cn(font !== "normal" && "retro", className)} {...props} />;
}

function CardContent({ ...props }: BitCardProps) {
  const { className, font } = props;

  return (
    <ShadcnCardContent
      className={cn("flex-1", font !== "normal" && "retro", className)}
      {...props}
    />
  );
}

function CardFooter({ ...props }: BitCardProps) {
  const { className, font } = props;

  return (
    <ShadcnCardFooter
      data-slot="card-footer"
      className={cn(font !== "normal" && "retro", className)}
      {...props}
    />
  );
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
