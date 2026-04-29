import "../../styles/piano-layout.css";

import React, { useMemo } from "react";

import { StageProps } from "@/shared/types/stage";

import { PIANO_GRID_CLASS, PIANO_GRID_ITEM_CLASS } from "../../lib/constants";
import { getPianoLayoutUnits } from "../../lib/utils";
import { BackgroundLane } from "../background-lane/background-lane";
import { PianoKeyboard } from "../piano-keyboard/piano-keyboard";
/**
 * PianoStage encapsulates the full piano gameplay visualization.
 * It manages its own layout units and grid alignment.
 */
export function PianoStage({ notes, liveActiveNotes, playbackNotes, highway }: StageProps) {
  // Calculate dynamic layout range for consistent grid alignment
  const { startUnit, endUnit } = useMemo(() => getPianoLayoutUnits(notes), [notes]);

  return (
    <>
      <main
        style={
          {
            position: "relative",
            overflow: "hidden",
            gridRow: 2,
            "--start-unit": startUnit,
            "--end-unit": endUnit,
          } as React.CSSProperties
        }
      >
        {React.cloneElement(highway, {
          children: <BackgroundLane />,
          noteClassName: PIANO_GRID_ITEM_CLASS,
          containerClassName: PIANO_GRID_CLASS,
        } as React.HTMLAttributes<HTMLDivElement>)}
      </main>

      <footer
        style={
          {
            backgroundColor: "color-mix(in srgb, var(--background), transparent 50%)",
            borderTop: "1px solid color-mix(in srgb, var(--foreground), transparent 95%)",
            gridRow: 3,
            "--start-unit": startUnit,
            "--end-unit": endUnit,
          } as React.CSSProperties
        }
      >
        <PianoKeyboard liveNotes={liveActiveNotes} playbackNotes={playbackNotes} />
      </footer>
    </>
  );
}
