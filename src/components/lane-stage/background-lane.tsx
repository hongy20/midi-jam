import { isBlackKey } from "@/lib/device/piano";
import styles from "./background-lane.module.css";

interface BackgroundLaneProps {
  notes: number[];
}

/**
 * Static lanes matching the piano keys.
 */
export function BackgroundLane({ notes }: BackgroundLaneProps) {
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
