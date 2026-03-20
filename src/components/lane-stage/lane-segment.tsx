import { useLayoutEffect, useRef } from "react";
import {
  computeLaneSegmentAnimationDelay,
  type SegmentGroup,
} from "@/lib/midi/lane-segment-utils";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./lane-segment.module.css";

interface LaneSegmentProps {
  group: SegmentGroup;
  getCurrentTimeMs: () => number;
  isPaused: boolean;
  speed: number;
}

export function LaneSegment({
  group,
  getCurrentTimeMs,
  isPaused,
  speed,
}: LaneSegmentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Phase-lock the CSS animation to the master clock at the exact moment this
  // element is inserted into the DOM.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mountTimeMs = getCurrentTimeMs();
    const delayMs = computeLaneSegmentAnimationDelay(
      mountTimeMs,
      group.startMs,
    );

    el.style.setProperty("--anim-delay-raw", `${delayMs}`);
  }, [getCurrentTimeMs, group.startMs]);

  const debugColor = [
    "rgba(255, 0, 0, 0.15)",
    "rgba(0, 255, 0, 0.15)",
    "rgba(0, 0, 255, 0.15)",
    "rgba(255, 255, 0, 0.15)",
    "rgba(255, 0, 255, 0.15)",
    "rgba(0, 255, 255, 0.15)",
  ][group.index % 6];

  return (
    <div
      ref={containerRef}
      className={styles.container}
      data-paused={isPaused}
      style={
        {
          "--segment-duration-ms": group.durationMs,
          backgroundColor: debugColor,
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
