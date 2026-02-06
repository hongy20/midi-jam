"use client";

import { useMemo } from "react";
import { isBlackKey } from "@/lib/device/piano";
import {
  MIDI_NOTE_C4,
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
} from "@/lib/midi/constant";
import styles from "./piano-keyboard.module.css";

interface PianoKeyboardProps {
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
  rangeStart?: number;
  rangeEnd?: number;
}

// 21 units per octave (3 units per white key, 2 per black key)
const OFFSETS = [0, 2, 3, 5, 6, 9, 11, 12, 14, 15, 17, 18];

const getNoteUnit = (note: number) => {
  const octave = Math.floor(note / 12);
  const semitone = note % 12;
  return octave * 21 + OFFSETS[semitone];
};

/**
 * A responsive visual representation of a piano keyboard.
 * Optimized via a pure CSS Grid with zero-math React rendering.
 * C4 label is positioned on top of the corresponding white key.
 */
export const PianoKeyboard = ({
  liveNotes,
  playbackNotes,
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: PianoKeyboardProps) => {
  const { visibleNotes, startUnit, visibleUnits } = useMemo(() => {
    const list = [];
    const minUnit = getNoteUnit(rangeStart);
    const maxUnit = getNoteUnit(rangeEnd) + (isBlackKey(rangeEnd) ? 2 : 3);

    for (let n = rangeStart; n <= rangeEnd; n++) {
      list.push(n);
    }
    return {
      visibleNotes: list,
      startUnit: minUnit,
      visibleUnits: maxUnit - minUnit,
    };
  }, [rangeStart, rangeEnd]);

  const getSource = (note: number) => {
    const isLive = liveNotes.has(note);
    const isPlayback = playbackNotes.has(note);
    if (isLive && isPlayback) return "both";
    if (isLive) return "live";
    if (isPlayback) return "playback";
    return "none";
  };

  return (
    <div className="flex flex-col w-full select-none">
      <div
        className={styles.container}
        style={
          {
            "--piano-start-unit": startUnit,
            "--piano-visible-units": visibleUnits,
          } as React.CSSProperties
        }
        role="img"
        aria-label={`Piano keyboard (${rangeStart} to ${rangeEnd})`}
      >
        {visibleNotes.map((note) => {
          const source = getSource(note);
          const active = source !== "none";
          const noteClass = styles[`note-${note}`];
          const isBlack = isBlackKey(note);

          return (
            <div key={note} className="contents">
              {/* Note Beam Effect */}
              <div
                className={`${styles.beam} ${noteClass}`}
                data-active={active}
              >
                <div className={styles.flare} data-source={source} />
                <div className={styles.beamLine} data-source={source} />
              </div>

              {/* Piano Key */}
              <button
                type="button"
                className={`${styles.key} ${noteClass}`}
                data-black={isBlack}
                aria-pressed={active}
                aria-label={`Note ${note} Key`}
                tabIndex={-1}
              >
                <div
                  className={styles.glow}
                  data-active={active}
                  data-source={source}
                />

                {/* C4 Label positioned on the key */}
                {!isBlack && note === MIDI_NOTE_C4 && (
                  <span className={styles.label}>C4</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
