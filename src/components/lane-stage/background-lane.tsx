import { isBlackKey } from "@/lib/device/piano";
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./background-lane.module.css";

/**
 * Static lanes matching the piano keys.
 * Always renders the full 88-key range.
 */
export function BackgroundLane() {
  const notes = [];
  for (let n = PIANO_88_KEY_MIN; n <= PIANO_88_KEY_MAX; n++) {
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
