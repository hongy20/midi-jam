"use client";

import { useEffect, useRef } from "react";
import {
  LANE_FALL_TIME_MS,
  LANE_SEGMENT_DURATION_MS,
  LEAD_IN_DEFAULT_MS,
} from "@/lib/midi/constant";
import { segmentAnimationCurrentTime } from "@/lib/midi/lane-segment-utils";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import gridStyles from "../piano-keyboard/piano-grid.module.css";
import styles from "./lane-segment.module.css";

interface LaneSegmentProps {
  segmentIndex: number;
  spans: NoteSpan[];
  getMasterCurrentTimeMs: () => number;
  isPaused: boolean;
  speed: number;
  containerHeight: number;
}

export function LaneSegment({
  segmentIndex,
  spans,
  getMasterCurrentTimeMs,
  isPaused,
  speed,
  containerHeight,
}: LaneSegmentProps) {
  const segmentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  // Constants for fall speed: 1 screen height per 3000ms
  const fallTimeMs = LANE_FALL_TIME_MS;
  const segmentDurationMs = LANE_SEGMENT_DURATION_MS;
  const segmentHeightPx = containerHeight * (segmentDurationMs / fallTimeMs);

  useEffect(() => {
    const element = segmentRef.current;
    if (!element || containerHeight <= 0) return;

    // The animation covers the entire travel:
    // From entering the top of the container to completely leaving the bottom.
    // EnterTop: Bottom of segment at Y=0 -> translateY = -segmentSize
    // LeaveBottom: Top of segment at Y=containerHeight -> translateY = containerHeight
    const keyframes = [
      { transform: `translateY(${-segmentHeightPx}px)` },
      { transform: `translateY(${containerHeight}px)` },
    ];

    // Total duration for this full travel: 10s for the segment itself + 3s for it to finish falling.
    const totalTravelTimeMs = segmentDurationMs + fallTimeMs;

    const animation = element.animate(keyframes, {
      duration: totalTravelTimeMs,
      fill: "both",
      easing: "linear",
    });

    // Map master time to animation time.
    // At masterTime = segmentStart, the bottom of segment should be at Y = containerHeight.
    // This occurs at animation.currentTime = fallTimeMs.
    const currentTimeMs = getMasterCurrentTimeMs();
    animation.currentTime = segmentAnimationCurrentTime(
      currentTimeMs,
      segmentIndex,
      segmentDurationMs,
    );
    animation.playbackRate = speed;

    if (isPaused) {
      animation.pause();
    } else {
      animation.play();
    }

    animationRef.current = animation;

    return () => {
      animation.cancel();
      animationRef.current = null;
    };
  }, [
    segmentIndex,
    containerHeight,
    segmentHeightPx,
    getMasterCurrentTimeMs,
    isPaused,
    speed,
    segmentDurationMs,
    fallTimeMs,
  ]);

  // Handle speed and pause changes without re-creating the animation
  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) return;

    animation.playbackRate = speed;

    if (isPaused) {
      if (animation.playState !== "paused") {
        animation.pause();
      }
    } else {
      if (
        animation.playState !== "running" &&
        animation.playState !== "finished"
      ) {
        animation.play();
      }
    }
  }, [isPaused, speed]);

  return (
    <div
      ref={segmentRef}
      className={styles.container}
      style={
        {
          "--segment-duration-ms": LANE_SEGMENT_DURATION_MS,
          // Initial position way off-top to prevent "ghost" flashes
          transform: `translateY(${-segmentHeightPx}px)`,
        } as React.CSSProperties
      }
    >
      {spans.map((span) => {
        // Absolute time in master clock
        const startTimeMs = span.startTime * 1000 + LEAD_IN_DEFAULT_MS;
        const endTimeMs =
          (span.startTime + span.duration) * 1000 + LEAD_IN_DEFAULT_MS;

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
