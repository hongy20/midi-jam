"use client";

import {
  LANE_FALL_TIME_MS,
  LANE_SEGMENT_DURATION_MS,
} from "@/lib/midi/constant";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./lane-segment.module.css";

interface LaneSegmentProps {
  segmentIndex: number;
  spans: NoteSpan[];
  containerHeight: number;
  // Expose the div via a ref for imperative positioning from LaneStage
  innerRef: (el: HTMLDivElement | null) => void;
}

export function LaneSegment({
  segmentIndex,
  spans,
  containerHeight,
  innerRef,
}: LaneSegmentProps) {
  // Local height calc (same logic as before but used just for note layout)
  const segmentDurationMs = LANE_SEGMENT_DURATION_MS;
  const fallTimeMs = LANE_FALL_TIME_MS;
  const segmentHeightPx = containerHeight * (segmentDurationMs / fallTimeMs);

  return (
    <div
      ref={innerRef}
      className={styles.container}
      style={
        {
          "--segment-duration-ms": LANE_SEGMENT_DURATION_MS,
          "--fall-time-ms": LANE_FALL_TIME_MS,
          // Initial position way off-top to prevent "ghost" flashes
          transform: `translateY(${-segmentHeightPx}px)`,
        } as React.CSSProperties
      }
    >
      {spans.map((span) => {
        // Absolute time in master clock
        const startTimeMs = span.startTimeMs;
        const endTimeMs = span.startTimeMs + span.durationMs;

        // Relative to segment start
        const relStartMs =
          startTimeMs - segmentIndex * LANE_SEGMENT_DURATION_MS;
        const relEndMs = endTimeMs - segmentIndex * LANE_SEGMENT_DURATION_MS;

        // Proportional positioning within the segment
        // t=0 is at 100% (bottom), t=LANE_SEGMENT_DURATION_MS is at top.
        const topPercent =
          ((LANE_SEGMENT_DURATION_MS - relEndMs) / LANE_SEGMENT_DURATION_MS) *
          100;
        const heightPercent =
          ((relEndMs - relStartMs) / LANE_SEGMENT_DURATION_MS) * 100;

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
