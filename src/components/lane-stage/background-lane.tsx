import { isBlackKey } from "@/lib/device/piano";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./background-lane.module.css";

interface BackgroundLaneProps {
  pitches: number[];
  inputDevice: WebMidi.MIDIInput;
}

/**
 * Static lanes matching the piano keys.
 */
export function BackgroundLane({ pitches }: BackgroundLaneProps) {
  return (
    <div className={styles.container}>
      {pitches.map((pitch) => (
        <div
          key={`lane-${pitch}`}
          className={`${styles.lane} ${gridStyles[`note-${pitch}`]}`}
          data-black={isBlackKey(pitch)}
        />
      ))}
    </div>
  );
}
