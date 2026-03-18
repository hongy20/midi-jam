import { LANE_FALL_TIME_MS } from "@/lib/midi/constant";
import type { SegmentGroup } from "@/lib/midi/lane-segment-utils";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./lane-segment.module.css";

interface LaneSegmentProps {
  group: SegmentGroup;
  containerHeight: number;
  // Expose the div via a ref for imperative positioning from LaneStage
  innerRef: (el: HTMLDivElement | null) => void;
}

export function LaneSegment({
  group,
  containerHeight,
  innerRef,
}: LaneSegmentProps) {
  const segmentHeightPx =
    containerHeight * (group.durationMs / LANE_FALL_TIME_MS);

  return (
    <div
      ref={innerRef}
      className={styles.container}
      style={
        {
          "--segment-duration-ms": group.durationMs,
          "--fall-time-ms": LANE_FALL_TIME_MS,
          // Initial position way off-top to prevent "ghost" flashes
          transform: `translateY(${-segmentHeightPx}px)`,
        } as React.CSSProperties
      }
    >
      {group.spans.map((span) => {
        // Absolute time in master clock
        const startTimeMs = span.startTimeMs;
        const endTimeMs = span.startTimeMs + span.durationMs;

        // Relative to group start
        const relStartMs = startTimeMs - group.startMs;
        const relEndMs = endTimeMs - group.startMs;

        // Proportional positioning within the segment
        const topPercent =
          ((group.durationMs - relEndMs) / group.durationMs) * 100;
        const heightPercent =
          ((relEndMs - relStartMs) / group.durationMs) * 100;

        const pitchClass = gridStyles[`note-${span.note}`];

        return (
          <div
            key={span.id}
            data-pitch={span.note}
            data-note-id={span.id}
            className={`${styles.note} ${pitchClass}`}
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
