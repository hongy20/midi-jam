"use client";

import { useMemo } from "react";

import { LaneStage } from "@/features/visualizer";
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
  groups,
  scrollRef,
  getCurrentTimeMs,
  liveActiveNotes,
  playbackNotes,
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
        <LaneStage
          groups={groups}
          scrollRef={scrollRef}
          getCurrentTimeMs={getCurrentTimeMs}
          noteClassName={PIANO_GRID_ITEM_CLASS}
        >
          <BackgroundLane />
        </LaneStage>
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
