import type * as React from "react";
import { Card, CardContent } from "@/components/ui/8bit/card";
import { cn } from "@/lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  variant?: "small" | "large";
}

export function StatCard({
  label,
  value,
  variant = "small",
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "border-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] h-full transition-transform hover:scale-102",
        variant === "large"
          ? "border-primary bg-primary text-primary-foreground"
          : "border-foreground/20",
        className,
      )}
      {...props}
    >
      <CardContent className="p-6! flex flex-col items-center justify-center gap-2 h-full">
        <span
          className={cn(
            "retro text-[8px] uppercase tracking-[0.2em] opacity-60 text-center",
            variant === "large"
              ? "text-primary-foreground/60"
              : "text-foreground/40",
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            "retro leading-none text-center",
            variant === "large" ? "text-4xl!" : "text-xl!",
          )}
        >
          {value}
        </span>
      </CardContent>
    </Card>
  );
}
