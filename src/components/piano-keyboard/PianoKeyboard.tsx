"use client";

import { memo, useMemo } from "react";
import { getPitchUnits, isBlackKey } from "@/lib/device/piano";
import {
  MIDI_NOTE_C4,
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
} from "@/lib/midi/constant";
import gridStyles from "./piano-grid.module.css";
import styles from "./piano-keyboard.module.css";

interface PianoKeyboardProps {
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
  rangeStart?: number;
  rangeEnd?: number;
}

/**
 * Static piano keys that only re-render when the range changes.
 * Memoized to prevent re-renders when active notes change.
 */
const PianoKeys = memo(({ pitches }: { pitches: number[] }) => {
  const PITCH_NAMES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  return (
    <>
      {pitches.map((pitch) => {
        const isBlack = isBlackKey(pitch);
        const pitchClass = gridStyles[`note-${pitch}`];
        const pitchName = `${PITCH_NAMES[pitch % 12]}${Math.floor(pitch / 12) - 1}`;

        return (
          <button
            key={`key-${pitch}`}
            type="button"
            className={`${styles.key} ${pitchClass}`}
            data-black={isBlack}
            aria-label={`${pitchName} ${isBlack ? "Black" : "White"} Key`}
            tabIndex={-1}
          >
            {!isBlack && pitch === MIDI_NOTE_C4 && (
              <span className={styles.label}>C4</span>
            )}
          </button>
        );
      })}
    </>
  );
});

PianoKeys.displayName = "PianoKeys";

/**
 * Dynamic glow effects that only render for active notes.
 */
const KeyGlows = ({
  liveNotes,
  playbackNotes,
  rangeStart,
  rangeEnd,
}: {
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
  rangeStart: number;
  rangeEnd: number;
}) => {
  const active = new Set([
    ...Array.from(liveNotes),
    ...Array.from(playbackNotes),
  ]);
  const activePitchesInRange = Array.from(active).filter(
    (n) => n >= rangeStart && n <= rangeEnd,
  );

  return (
    <>
      {activePitchesInRange.map((pitch) => {
        const isLive = liveNotes.has(pitch);
        const isPlayback = playbackNotes.has(pitch);
        const source =
          isLive && isPlayback ? "both" : isLive ? "live" : "playback";
        const isBlack = isBlackKey(pitch);
        const pitchClass = gridStyles[`note-${pitch}`];

        return (
          <div
            key={`glow-${pitch}`}
            className={`${styles.glow} ${pitchClass}`}
            data-active="true"
            data-black={isBlack}
            data-source={source}
          />
        );
      })}
    </>
  );
};

/**
 * A responsive visual representation of a piano keyboard.
 * Separates static key layout from dynamic visual feedback for high performance.
 */
export const PianoKeyboard = ({
  liveNotes,
  playbackNotes,
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: PianoKeyboardProps) => {
  const visiblePitches = useMemo(() => {
    const pitches = [];
    for (let p = rangeStart; p <= rangeEnd; p++) {
      pitches.push(p);
    }
    return pitches;
  }, [rangeStart, rangeEnd]);

  const units = getPitchUnits(rangeStart);
  const startUnit = units.start;
  const endUnit = getPitchUnits(rangeEnd).end;

  return (
    <div className="flex flex-col w-full h-full select-none relative z-50">
      <div
        className={styles.container}
        style={
          {
            "--piano-start-unit": startUnit,
            "--piano-end-unit": endUnit,
          } as React.CSSProperties
        }
        role="img"
        aria-label={`Piano keyboard (${rangeStart} to ${rangeEnd})`}
      >
        <PianoKeys pitches={visiblePitches} />
        <KeyGlows
          liveNotes={liveNotes}
          playbackNotes={playbackNotes}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
        />
      </div>
    </div>
  );
};
