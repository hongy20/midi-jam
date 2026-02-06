"use client";

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
 * Static piano keys that only re-render when the range changes.
 */
const PianoKeys = ({ notes }: { notes: number[] }) => {
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

  return (
    <>
      {notes.map((note) => {
        const isBlack = isBlackKey(note);
        const noteClass = styles[`note-${note}`];
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
};

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
  const activeNotesInRange = Array.from(active).filter(
    (n) => n >= rangeStart && n <= rangeEnd,
  );

  return (
    <>
      {activeNotesInRange.map((note) => {
        const isLive = liveNotes.has(note);
        const isPlayback = playbackNotes.has(note);
        const source =
          isLive && isPlayback ? "both" : isLive ? "live" : "playback";
        const isBlack = isBlackKey(note);
        const noteClass = styles[`note-${note}`];

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
 * Separates static key layout from dynamic visual feedback for high performance.
 */
export const PianoKeyboard = ({
  liveNotes,
  playbackNotes,
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: PianoKeyboardProps) => {
  const visibleNotes = [];
  for (let n = rangeStart; n <= rangeEnd; n++) {
    visibleNotes.push(n);
  }

  return (
    <div className="flex flex-col w-full select-none relative z-50">
      <div
        className={styles.container}
        role="img"
        aria-label={`Piano keyboard (${rangeStart} to ${rangeEnd})`}
      >
        <PianoKeys notes={visibleNotes} />
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
