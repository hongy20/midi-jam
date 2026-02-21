import { getNoteLayout } from "@/lib/gameplay/lane-geometry";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import gridStyles from "./background-lane.module.css";
import styles from "./track-lane.module.css";

interface TrackLaneProps {
  spans: NoteSpan[];
  laneHeight: number;
  targetY: number;
  maxScroll: number;
}

/**
 * Renders the extremely tall inner lane containing all note blocks for the track.
 * Horizontal positioning is handled by the shared CSS grid system.
 */
export function TrackLane({
  spans,
  laneHeight,
  targetY,
  maxScroll,
}: TrackLaneProps) {
  return (
    <div className={styles.container} style={{ height: `${laneHeight}px` }}>
      {spans.map((span) => {
        const { top, height } = getNoteLayout(
          span.startTime * 1000,
          (span.startTime + span.duration) * 1000,
          targetY,
          maxScroll,
        );

        const pitchClass = gridStyles[`note-${span.note}`];

        return (
          <div
            key={span.id}
            data-pitch={span.note}
            data-note-id={span.id}
            className={`${styles.note} ${pitchClass} ${
              span.isBlack ? styles.black : styles.white
            }`}
            style={{
              top: `${top}px`,
              height: `${height}px`,
            }}
          />
        );
      })}
    </div>
  );
}
