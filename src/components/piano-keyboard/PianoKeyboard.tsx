"use client";

import { memo } from "react";
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

/**
 * Static piano keys that render once and stay mounted.
 * Visibility is handled by CSS overflow on the container.
 */
const PianoKeys = memo(() => {
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

  const notes = [];
  for (let n = PIANO_88_KEY_MIN; n <= PIANO_88_KEY_MAX; n++) {
    notes.push(n);
  }

  return (
    <>
      {notes.map((note) => {
        const isBlack = isBlackKey(note);
        const noteClass = gridStyles[`note-${note}`];
        const noteName = `${NOTE_NAMES[note % 12]}${Math.floor(note / 12) - 1}`;

        return (
          <button
            key={`key-${note}`}
            type="button"
            className={`${styles.key} ${noteClass}`}
            data-black={isBlack}
            aria-label={`${noteName} ${isBlack ? "Black" : "White"} Key`}
            tabIndex={-1}
          >
            {!isBlack && note === MIDI_NOTE_C4 && (
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
}: {
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
}) => {
  const active = Array.from(
    new Set([...Array.from(liveNotes), ...Array.from(playbackNotes)]),
  );

  return (
    <>
      {active.map((note) => {
        const isLive = liveNotes.has(note);
        const isPlayback = playbackNotes.has(note);
        const source =
          isLive && isPlayback ? "both" : isLive ? "live" : "playback";
        const isBlack = isBlackKey(note);
        const noteClass = gridStyles[`note-${note}`];

        return (
          <div
            key={`glow-${note}`}
            className={`${styles.glow} ${noteClass}`}
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
 * Visibility is controlled via CSS variables on the container.
 */
export const PianoKeyboard = ({
  liveNotes,
  playbackNotes,
}: PianoKeyboardProps) => {
  return (
    <div className="flex flex-col w-full h-full select-none relative z-50">
      <div className={styles.container} role="img" aria-label="Piano keyboard">
        <PianoKeys />
        <KeyGlows liveNotes={liveNotes} playbackNotes={playbackNotes} />
      </div>
    </div>
  );
};
