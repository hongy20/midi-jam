import { useEffect, useMemo, useRef, useState } from "react";
import {
  LANE_SEGMENT_DURATION_MS,
  LEAD_IN_DEFAULT_MS,
  LEAD_OUT_DEFAULT_MS,
} from "@/lib/midi/constant";
import {
  filterSpansForSegment,
  getVisibleSegmentIndexes,
} from "@/lib/midi/lane-segment-utils";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { BackgroundLane } from "./background-lane";
import { LaneSegment } from "./lane-segment";

interface LaneStageProps {
  spans: NoteSpan[];
  originalDurationMs: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  inputDevice: WebMidi.MIDIInput;
  getCurrentTimeMs: () => number;
  isPaused: boolean;
  speed: number;
}

export function LaneStage({
  spans,
  originalDurationMs,
  scrollRef,
  getCurrentTimeMs,
  isPaused,
  speed,
}: LaneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalDurationMs =
    originalDurationMs + LEAD_IN_DEFAULT_MS + LEAD_OUT_DEFAULT_MS;

  // Track container height for animation math
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Windowing logic: update currentIndex on a loop to trigger mount/unmount of segments
  useEffect(() => {
    if (isPaused) return;

    let rafId: number;
    const update = () => {
      const time = getCurrentTimeMs();
      const newIndex = Math.floor(time / LANE_SEGMENT_DURATION_MS);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [currentIndex, isPaused, getCurrentTimeMs]);

  const visibleIndexes = useMemo(() => {
    return getVisibleSegmentIndexes(
      currentIndex * LANE_SEGMENT_DURATION_MS,
      totalDurationMs,
      LANE_SEGMENT_DURATION_MS,
    );
  }, [currentIndex, totalDurationMs]);

  // Unique set of indexes to render
  const renderIndexes = Array.from(new Set(visibleIndexes));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-background/5"
    >
      <BackgroundLane />

      <div
        ref={scrollRef}
        id="lane-scroll"
        className="absolute inset-0 overflow-hidden"
      >
        {containerHeight > 0 &&
          renderIndexes.map((idx) => (
            <LaneSegment
              key={idx}
              segmentIndex={idx}
              spans={filterSpansForSegment(
                spans,
                idx,
                LANE_SEGMENT_DURATION_MS,
              )}
              getMasterCurrentTimeMs={getCurrentTimeMs}
              isPaused={isPaused}
              speed={speed}
              containerHeight={containerHeight}
            />
          ))}
      </div>
    </div>
  );
}
