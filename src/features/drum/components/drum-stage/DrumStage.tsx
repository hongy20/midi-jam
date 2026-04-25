"use client";

import { InstrumentStageProps } from "@/shared/types/instrument";

/**
 * DrumStage is a placeholder for the future drum gameplay implementation.
 * It follows the same contract as PianoStage.
 */
export function DrumStage({ children }: InstrumentStageProps) {
  return (
    <>
      <main className="flex h-full items-center justify-center">
        {children || (
          <div className="font-retro text-muted-foreground/50 text-xl tracking-wider">
            DRUM STAGE (NOT IMPLEMENTED)
          </div>
        )}
      </main>
      <footer className="h-[var(--footer-height,151px)] border-t border-foreground/5" />
    </>
  );
}
