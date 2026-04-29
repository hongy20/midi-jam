"use client";

import { StageProps } from "@/shared/types/stage";

/**
 * DrumStage is a placeholder for the future drum gameplay implementation.
 * It follows the same contract as PianoStage.
 */
export function DrumStage({ highway }: StageProps) {
  return (
    <>
      <main className="row-start-2 flex h-full items-center justify-center">
        {highway ? (
          highway
        ) : (
          <div className="font-retro text-muted-foreground/50 text-xl tracking-wider">
            DRUM STAGE (NOT IMPLEMENTED)
          </div>
        )}
      </main>
      <footer className="border-foreground/5 row-start-3 h-(--footer-height) border-t" />
    </>
  );
}
