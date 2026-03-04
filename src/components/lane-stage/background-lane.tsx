import { isBlackKey } from "@/lib/device/piano";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./background-lane.module.css";

interface BackgroundLaneProps {
  notes: number[];
  inputDevice?: WebMidi.MIDIInput;
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
          className={`${styles.lane} ${gridStyles[`note-${note}`]}`}
          data-black={isBlackKey(note)}
        />
      ))}
    </div>
  );
}
