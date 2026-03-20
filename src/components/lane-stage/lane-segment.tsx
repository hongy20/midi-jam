import { useEffect, useLayoutEffect, useRef } from "react";
import { LANE_SCROLL_DURATION_MS } from "@/lib/midi/constant";
import type { SegmentGroup } from "@/lib/midi/lane-segment-utils";
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
  const animationRef = useRef<Animation | null>(null);

  // Phase-lock the WAAPI animation to the master clock at the exact moment this
  // element is inserted into the DOM.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // 1. Create the animation using the standard WAAPI syntax.
    // Keyframes match the old CSS @keyframes 'fall'.
    const animation = el.animate(
      [
        { transform: "translateY(var(--translate-y-from))" },
        { transform: "translateY(var(--translate-y-to))" },
      ],
      {
        duration: group.durationMs + LANE_SCROLL_DURATION_MS,
        easing: "linear",
        fill: "both",
      },
    );

    // 2. Set the initial phase based on the current master clock.
    const mountTimeMs = getCurrentTimeMs();
    animation.currentTime =
      mountTimeMs - group.startMs + LANE_SCROLL_DURATION_MS;
    animation.playbackRate = speed;

    animationRef.current = animation;

    return () => {
      animation.cancel();
      animationRef.current = null;
    };
  }, [getCurrentTimeMs, group.startMs, group.durationMs, speed]);

  // Keep playbackRate in sync with the global speed setting if it changes
  // while the segment is already mounted.
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.playbackRate = speed;
    }
  }, [speed]);

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
