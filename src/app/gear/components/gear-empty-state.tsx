"use client";

import { Button } from "@/components/ui/8bit/button";

interface GearEmptyStateProps {
  onBack: () => void;
}

export function GearEmptyState({ onBack }: GearEmptyStateProps) {
  return (
    <div className="text-center px-8">
      <h2 className="retro mb-6 font-bold text-2xl tracking-tight md:text-3xl text-foreground/60">
        No gear found.
      </h2>
      <p className="retro text-muted-foreground text-[10px] uppercase tracking-[0.3em] mb-12">
        Please connect a keyboard and refresh.
      </p>
      <div className="flex justify-center gap-4">
        <Button onClick={onBack} variant="secondary" className="px-8" font="retro">
          BACK
        </Button>
      </div>
    </div>
  );
}
