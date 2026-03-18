import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeSegmentTranslateY,
  getVisibleSegmentIndexes,
  type SegmentGroup,
} from "@/lib/midi/lane-segment-utils";
import { BackgroundLane } from "./background-lane";
import { LaneSegment } from "./lane-segment";

interface LaneStageProps {
  groups: SegmentGroup[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  getCurrentTimeMs: () => number;
  isPaused: boolean;
}

export function LaneStage({
  groups,
  scrollRef,
  getCurrentTimeMs,
  isPaused,
}: LaneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Use individual refs for each visible segment to apply transforms imperatively
  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

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

      // Drive transforms for all CURRENTLY MOUNTED segments in the Map
      if (containerHeight > 0) {
        for (const [idx, element] of segmentRefs.current.entries()) {
          const group = groups[idx];
          if (!group) continue;

          const ty = computeSegmentTranslateY(
            timeMs,
            group.startMs,
            group.durationMs,
            containerHeight,
          );
          element.style.transform = `translateY(${ty}px)`;
        }
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [getCurrentTimeMs, containerHeight, isPaused, groups]);

  const [timeMs, setTimeMs] = useState(0);

  // Poll current time to drive React-level mount/unmount decisions
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setTimeMs(getCurrentTimeMs()), 250);
    return () => clearInterval(interval);
  }, [isPaused, getCurrentTimeMs]);

  const renderIndexes = useMemo(() => {
    return getVisibleSegmentIndexes(timeMs, groups);
  }, [timeMs, groups]);

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
              group={groups[idx]}
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
