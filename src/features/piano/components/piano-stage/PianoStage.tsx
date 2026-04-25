import React, { useMemo } from "react";

import { StageProps } from "@/shared/types/stage";

import { PIANO_GRID_CLASS, PIANO_GRID_ITEM_CLASS } from "../../lib/constants";
import { getPianoLayoutUnits } from "../../lib/utils";
import { BackgroundLane } from "../background-lane/BackgroundLane";
import { PianoKeyboard } from "../piano-keyboard/PianoKeyboard";
import styles from "./piano-stage.module.css";

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
        className={styles.main}
        style={
          {
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

      <footer className={styles.footer}>
        <div
          className={styles.inputWrapper}
          style={
            {
              "--start-unit": startUnit,
              "--end-unit": endUnit,
            } as React.CSSProperties
          }
        >
          <PianoKeyboard liveNotes={liveActiveNotes} playbackNotes={playbackNotes} />
        </div>
      </footer>
    </>
  );
}
