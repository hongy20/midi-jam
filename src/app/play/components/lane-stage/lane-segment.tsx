import { useLayoutEffect, useRef } from "react";
import { computeLaneSegmentAnimationDelay } from "@/features/midi-assets";
import { type MidiNoteGroup } from "@/shared/types/midi";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./lane-segment.module.css";

interface LaneSegmentProps {
  group: MidiNoteGroup;
  getCurrentTimeMs: () => number;
}

export function LaneSegment({ group, getCurrentTimeMs }: LaneSegmentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Phase-lock the CSS animation to the master clock at the exact moment this
  // element is inserted into the DOM. useLayoutEffect fires synchronously after
  // browser commit, giving the tightest possible time snapshot.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Capture the exact real-world time this component evaluates its phase lock
    const mountTimeReal = performance.now();
    const mountTimeMs = getCurrentTimeMs();

    // JS-computed delay calculates the exact master-timeline offset.
    // e.g., if we are exactly on time for groupStartMs, delayMs = -LANE_SCROLL_DURATION_MS
    const delayMs = computeLaneSegmentAnimationDelay(mountTimeMs, group.startMs);

    // Apply the delay variable for the CSS engine. The CSS `animation` property maps this
    // directly to the local timeline `delay`.
    el.style.setProperty("--anim-delay-raw", `${delayMs}`);

    // Use a RAF to synchronize with the exact vsync frame.
    // By explicitly setting `startTime` to the exact `mountTimeReal` used to compute
    // the CSS delay, we perfectly cancel out the T_vsync - T_mount error,
    // eliminating all sub-frame (vsync) polling gaps while maintaining the idle pre-roll time.
    const rafId = requestAnimationFrame(() => {
      const anims = el.getAnimations();
      for (const anim of anims) {
        // Explicitly anchoring to the performance.now() snapshot.
        anim.startTime = mountTimeReal;
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [getCurrentTimeMs, group.startMs]);
  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={
        {
          "--segment-duration-ms": group.durationMs,
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
        const topPercent = ((group.durationMs - relEndMs) / group.durationMs) * 100;
        const heightPercent = ((relEndMs - relStartMs) / group.durationMs) * 100;

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
