import { isBlackKey } from "@/lib/device/piano";
import styles from "./background-lanes.module.css";

interface BackgroundLanesProps {
  notes: number[];
}

/**
 * Static lanes matching the piano keys.
 */
export function BackgroundLanes({ notes }: BackgroundLanesProps) {
  return (
    <div className={styles.container}>
      {notes.map((note) => (
        <div
          key={`lane-${note}`}
          className={`${styles.lane} ${styles[`note-${note}`]}`}
          data-black={isBlackKey(note)}
        />
      ))}
    </div>
  );
}
