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

/**
 * A responsive visual representation of a piano keyboard.
 * Optimized via a pure CSS Grid with zero-math React rendering.
 * Alignment variables are provided by the parent container.
 */
export const PianoKeyboard = ({
  liveNotes,
  playbackNotes,
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: PianoKeyboardProps) => {
  const visibleNotes = useMemo(() => {
    const list = [];
    for (let n = rangeStart; n <= rangeEnd; n++) {
      list.push(n);
    }
    return list;
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
