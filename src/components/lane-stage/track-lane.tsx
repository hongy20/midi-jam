import { LEAD_IN_DEFAULT_MS, LEAD_OUT_DEFAULT_MS } from "@/lib/midi/constant";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import gridStyles from "./background-lane.module.css";
import styles from "./track-lane.module.css";

interface TrackLaneProps {
  spans: NoteSpan[];
  originalDurationMs: number;
}

/**
 * Renders the extremely tall inner lane containing all note blocks for the track.
 * Vertical positioning is now percentage-based relative to the total track duration
 * plus a lead-in/padding.
 * Total height is handled in CSS using variables.
 */
export function TrackLane({ spans, originalDurationMs }: TrackLaneProps) {
  // The lane represents total track time + lead-in/padding + lead-out
  const totalTrackMs =
    originalDurationMs + LEAD_IN_DEFAULT_MS + LEAD_OUT_DEFAULT_MS;

  return (
    <div
      id="track-lane"
      className={styles.container}
      style={{ "--total-duration-ms": totalTrackMs } as React.CSSProperties}
    >
      {spans.map((span) => {
        const startTimeMs = span.startTime * 1000 + LEAD_IN_DEFAULT_MS;
        const endTimeMs =
          (span.startTime + span.duration) * 1000 + LEAD_IN_DEFAULT_MS;

        // Proportional positioning: t=0 is at 100% (bottom), t=originalDurationMs is atリードout.
        // top% = (totalTrackMs - endTimeMs) / totalTrackMs * 100
        const topPercent = ((totalTrackMs - endTimeMs) / totalTrackMs) * 100;
        const heightPercent = ((endTimeMs - startTimeMs) / totalTrackMs) * 100;

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
              top: `${topPercent}%`,
              height: `${heightPercent}%`,
            }}
          />
        );
      })}
    </div>
  );
}
