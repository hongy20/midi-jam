import { useLayoutEffect, useRef } from "react";
import { LANE_FALL_TIME_MS } from "@/lib/midi/constant";
import {
  computeLaneSegmentAnimationDelay,
  type SegmentGroup,
} from "@/lib/midi/lane-segment-utils";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./lane-segment.module.css";

interface LaneSegmentProps {
  group: SegmentGroup;
  getCurrentTimeMs: () => number;
  speed: number;
}

export function LaneSegment({
  group,
  getCurrentTimeMs,
  speed,
}: LaneSegmentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Phase-lock the CSS animation to the master clock at the exact moment this
  // element is inserted into the DOM. useLayoutEffect fires synchronously after
  // browser commit, giving the tightest possible time snapshot.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mountTimeMs = getCurrentTimeMs();
    const delay =
      computeLaneSegmentAnimationDelay(mountTimeMs, group.startMs) / speed;

    el.style.setProperty("--anim-delay", `${delay}ms`);
  }, [getCurrentTimeMs, group.startMs, speed]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={
        {
          "--segment-duration-ms": group.durationMs,
          "--fall-time-ms": LANE_FALL_TIME_MS,
          "--speed": speed,
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
