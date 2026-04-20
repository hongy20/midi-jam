import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN, PIANO_GRID_ITEM_CLASS } from "../../lib/constants";
import styles from "../../styles/background-lane.module.css";

/**
 * Static lanes matching the piano keys.
 * Always renders the full 88-key range.
 */
export function BackgroundLane() {
  const notes = Array.from(
    { length: PIANO_88_KEY_MAX - PIANO_88_KEY_MIN + 1 },
    (_, i) => PIANO_88_KEY_MIN + i,
  );

  return (
    <div className={styles.container}>
      {notes.map((note) => (
        <div
          key={`lane-${note}`}
          className={`${styles.lane} ${PIANO_GRID_ITEM_CLASS}`}
          data-pitch={note}
        />
      ))}
    </div>
  );
}
