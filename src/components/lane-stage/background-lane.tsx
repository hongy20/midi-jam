import { isBlackKey } from "@/lib/device/piano";
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./background-lane.module.css";

interface BackgroundLaneProps {
  inputDevice: WebMidi.MIDIInput;
  rangeStart?: number;
  rangeEnd?: number;
}

/**
 * Static lanes matching the piano keys.
 * Always renders the full 88-key range.
 */
export function BackgroundLane({
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: BackgroundLaneProps) {
  const notes = [];
  for (let n = rangeStart; n <= rangeEnd; n++) {
    notes.push(n);
  }

  return (
    <div className={styles.container}>
      {notes.map((note) => (
        <div
          key={`lane-${note}`}
          className={`${styles.lane} ${gridStyles[`note-${note}`]}`}
          data-black={isBlackKey(note)}
        />
      ))}
    </div>
  );
}
