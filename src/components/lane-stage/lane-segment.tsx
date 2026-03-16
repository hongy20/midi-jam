"use client";

import { useEffect, useRef } from "react";
import {
  LANE_SEGMENT_DURATION_MS,
  LEAD_IN_DEFAULT_MS,
} from "@/lib/midi/constant";
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

  useEffect(() => {
    const element = segmentRef.current;
    if (!element || containerHeight <= 0) return;

    // Segment duration in pixels: 1 screen height per 3000ms
    const segmentHeight = containerHeight * (LANE_SEGMENT_DURATION_MS / 3000);

    const keyframes = [
      { transform: `translateY(${containerHeight}px)` },
      { transform: `translateY(${-segmentHeight}px)` },
    ];

    const animation = element.animate(keyframes, {
      duration: LANE_SEGMENT_DURATION_MS,
      fill: "both",
      easing: "linear",
    });

    // Initialize state
    animation.playbackRate = speed;
    const initialTime =
      getMasterCurrentTimeMs() - segmentIndex * LANE_SEGMENT_DURATION_MS;
    animation.currentTime = initialTime;

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
  }, [segmentIndex, containerHeight, getMasterCurrentTimeMs, isPaused, speed]);

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
