import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LANE_SCROLL_DURATION_MS } from "@/lib/midi/constant";
import {
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
  speed: number;
}

export function LaneStage({
  groups,
  scrollRef,
  getCurrentTimeMs,
  isPaused,
  speed,
}: LaneStageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);
  const loggedPairsRef = useRef<Set<string>>(new Set());

  // Manage visibility and hydration guard purely on the client.
  useEffect(() => {
    setIsMounted(true);

    let rafId: number;
    const updateVisibility = () => {
      const timeMs = getCurrentTimeMs();
      const indexes = getVisibleSegmentIndexes(
        timeMs,
        groups,
        LANE_SCROLL_DURATION_MS,
      );
      setVisibleIndexes(indexes);
      if (!isPaused) {
        rafId = requestAnimationFrame(updateVisibility);
      }
    };

    // Initial calculation on mount
    updateVisibility();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [groups, getCurrentTimeMs, isPaused]);

  // Refined vertical position logging for gap investigation
  useLayoutEffect(() => {
    if (!scrollRef.current || visibleIndexes.length < 2) return;

    const elements = Array.from(
      scrollRef.current.querySelectorAll("[data-group-index]"),
    ) as HTMLElement[];

    // Sort by group index to ensure pairwise comparison
    elements.sort(
      (a, b) => Number(a.dataset.groupIndex) - Number(b.dataset.groupIndex),
    );

    for (let i = 0; i < elements.length - 1; i++) {
      const el1 = elements[i];
      const el2 = elements[i + 1];
      const idx1 = el1.dataset.groupIndex;
      const idx2 = el2.dataset.groupIndex;
      const pairId = `${idx1}-${idx2}`;

      if (!loggedPairsRef.current.has(pairId)) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        console.log(
          `group ${idx1}, bottom: ${rect1.bottom.toFixed(2)}, top: ${rect1.top.toFixed(2)} && group ${idx2}, bottom: ${rect2.bottom.toFixed(2)}, top: ${rect2.top.toFixed(2)}, speed: ${speed}`,
        );
        loggedPairsRef.current.add(pairId);
      }
    }
  }, [visibleIndexes, scrollRef, speed]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-background/5">
      <BackgroundLane />

      <div ref={scrollRef} className="absolute inset-0 overflow-hidden">
        {isMounted &&
          visibleIndexes.map((idx) => (
            <LaneSegment
              key={idx}
              group={groups[idx]}
              getCurrentTimeMs={getCurrentTimeMs}
              speed={speed}
            />
          ))}
      </div>
    </div>
  );
}
