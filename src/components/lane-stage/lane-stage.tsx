import { useEffect, useMemo, useRef, useState } from "react";
import { LANE_SEGMENT_DURATION_MS } from "@/lib/midi/constant";
import {
  computeSegmentTranslateY,
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
  getCurrentTimeMs: () => number;
  isPaused: boolean;
}

export function LaneStage({
  spans,
  originalDurationMs,
  scrollRef,
  getCurrentTimeMs,
  isPaused,
}: LaneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use individual refs for each visible segment to apply transforms imperatively
  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const totalDurationMs = originalDurationMs;

  // Track container height for positioning math
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

  // MASTER SYNC LOOP: Drive all segments from one place
  useEffect(() => {
    if (isPaused) return;

    let rafId: number;

    const update = () => {
      const timeMs = getCurrentTimeMs();

      // 1. Update window indexing (drivers React state change only when segment changes)
      const newIndex = Math.floor(timeMs / LANE_SEGMENT_DURATION_MS);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }

      // 2. Drive transforms for all CURRENTLY MOUNTED segments in the Map
      if (containerHeight > 0) {
        for (const [idx, element] of segmentRefs.current.entries()) {
          const ty = computeSegmentTranslateY(
            timeMs,
            idx,
            containerHeight,
            LANE_SEGMENT_DURATION_MS,
          );
          element.style.transform = `translateY(${ty}px)`;
        }
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [currentIndex, getCurrentTimeMs, containerHeight, isPaused]);

  const visibleIndexes = useMemo(() => {
    return getVisibleSegmentIndexes(
      currentIndex * LANE_SEGMENT_DURATION_MS,
      totalDurationMs,
      LANE_SEGMENT_DURATION_MS,
    );
  }, [currentIndex, totalDurationMs]);

  // Unique set of segments to keep in DOM
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
              containerHeight={containerHeight}
              innerRef={(el) => {
                if (el) {
                  segmentRefs.current.set(idx, el);
                } else {
                  segmentRefs.current.delete(idx);
                }
              }}
            />
          ))}
      </div>
    </div>
  );
}
