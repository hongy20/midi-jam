"use client";

import { useMemo } from "react";

import { InstrumentStageProps } from "@/shared/types/instrument";

import { PIANO_GRID_ITEM_CLASS } from "../../lib/constants";
import { getPianoLayoutUnits } from "../../lib/piano";
import { BackgroundLane } from "../background-lane/BackgroundLane";
import { PianoKeyboard } from "../piano-keyboard/PianoKeyboard";
import styles from "./piano-stage.module.css";

/**
 * PianoStage encapsulates the full piano gameplay visualization.
 * It manages its own layout units and grid alignment.
 */
export function PianoStage({
  notes,
  liveActiveNotes,
  playbackNotes,
  children,
}: InstrumentStageProps) {
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
        {children}
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
