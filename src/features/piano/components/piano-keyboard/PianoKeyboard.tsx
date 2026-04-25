"use client";

import { memo, useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";

import {
  MIDI_NOTE_C4,
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
  PIANO_GRID_CLASS,
  PIANO_GRID_ITEM_CLASS,
} from "../../lib/constants";
import styles from "../../styles/piano-keyboard.module.css";

interface PianoKeyboardProps {
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/**
 * Static piano keys that register themselves to the parent's Ref Map.
 */
const PianoKeys = memo(
  ({ keyRefs }: { keyRefs: React.RefObject<Map<number, HTMLButtonElement> | null> }) => {
    const notes = Array.from(
      { length: PIANO_88_KEY_MAX - PIANO_88_KEY_MIN + 1 },
      (_, i) => PIANO_88_KEY_MIN + i,
    );

    return (
      <>
        {notes.map((note) => {
          const noteName = `${NOTE_NAMES[note % 12]}${Math.floor(note / 12) - 1}`;

          return (
            <button
              key={`key-${note}`}
              ref={(el) => {
                if (el) {
                  keyRefs.current?.set(note, el);
                } else {
                  keyRefs.current?.delete(note);
                }
              }}
              type="button"
              className={cn(styles.key, PIANO_GRID_ITEM_CLASS)}
              data-pitch={note}
              data-live="false"
              data-playback="false"
              aria-label={noteName}
              tabIndex={-1}
            >
              {note === MIDI_NOTE_C4 && <span className={styles.label}>C4</span>}
            </button>
          );
        })}
      </>
    );
  },
);

PianoKeys.displayName = "PianoKeys";

/**
 * A high-performance responsive visual representation of a piano keyboard.
 * Uses a stable DOM tree and imperative Ref updates for 60fps glow effects.
 */
export const PianoKeyboard = ({ liveNotes, playbackNotes }: PianoKeyboardProps) => {
  const keyRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

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
    <div className={cn(styles.container, PIANO_GRID_CLASS)} role="img" aria-label="Piano keyboard">
      <PianoKeys keyRefs={keyRefs} />
    </div>
  );
};
