"use client";

import { memo, useEffect, useRef } from "react";
import { isBlackKey } from "@/lib/device/piano";
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
}

const NOTE_NAMES = [
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

/**
 * A high-performance responsive visual representation of a piano keyboard.
 * Uses a stable DOM tree and imperative Ref updates for 60fps glow effects.
 */
export const PianoKeyboard = memo(
  ({ liveNotes, playbackNotes }: PianoKeyboardProps) => {
    const keyRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

    // Generate the 88 notes once
    const notes = useRef<number[]>(
      Array.from(
        { length: PIANO_88_KEY_MAX - PIANO_88_KEY_MIN + 1 },
        (_, i) => PIANO_88_KEY_MIN + i,
      ),
    ).current;

    // Imperative sync: Update data attributes on key elements without re-rendering
    useEffect(() => {
      for (const [note, el] of keyRefs.current) {
        const isLive = liveNotes.has(note);
        const isPlayback = playbackNotes.has(note);

        // Update dataset for CSS attribute selectors
        if (el.dataset.live !== isLive.toString()) {
          el.dataset.live = isLive.toString();
        }
        if (el.dataset.playback !== isPlayback.toString()) {
          el.dataset.playback = isPlayback.toString();
        }
      }
    }, [liveNotes, playbackNotes]);

    return (
      <div className={styles.container} role="img" aria-label="Piano keyboard">
        {notes.map((note) => {
          const isBlack = isBlackKey(note);
          const noteClass = gridStyles[`note-${note}`];
          const noteName = `${NOTE_NAMES[note % 12]}${Math.floor(note / 12) - 1}`;

          return (
            <button
              key={`key-${note}`}
              ref={(el) => {
                if (el) {
                  keyRefs.current.set(note, el);
                } else {
                  keyRefs.current.delete(note);
                }
              }}
              type="button"
              className={`${styles.key} ${noteClass}`}
              data-black={isBlack}
              data-live="false"
              data-playback="false"
              aria-label={`${noteName} ${isBlack ? "Black" : "White"} Key`}
              tabIndex={-1}
            >
              {!isBlack && note === MIDI_NOTE_C4 && (
                <span className={styles.label}>C4</span>
              )}
            </button>
          );
        })}
      </div>
    );
  },
);

PianoKeyboard.displayName = "PianoKeyboard";
