"use client";

import { StageProps } from "@/shared/types/stage";

/**
 * DrumStage is a placeholder for the future drum gameplay implementation.
 * It follows the same contract as PianoStage.
 */
export function DrumStage({ noteHighway }: StageProps) {
  return (
    <>
      <main className="flex h-full items-center justify-center">
        {noteHighway ? (
          noteHighway
        ) : (
          <div className="font-retro text-muted-foreground/50 text-xl tracking-wider">
            DRUM STAGE (NOT IMPLEMENTED)
          </div>
        )}
      </main>
      <footer className="border-foreground/5 h-[var(--footer-height,151px)] border-t" />
    </>
  );
}
