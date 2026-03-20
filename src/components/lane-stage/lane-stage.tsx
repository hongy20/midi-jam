import { useEffect, useState } from "react";
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
}

export function LaneStage({
  groups,
  scrollRef,
  getCurrentTimeMs,
  isPaused,
}: LaneStageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  // Manage visibility and hydration guard purely on the client.
  useEffect(() => {
    setIsMounted(true);

    const updateVisibility = () => {
      const timeMs = getCurrentTimeMs();
      const indexes = getVisibleSegmentIndexes(
        timeMs,
        groups,
        LANE_SCROLL_DURATION_MS,
      );
      setVisibleIndexes(indexes);
    };

    // Initial calculation on mount
    updateVisibility();

    if (isPaused) return;

    const interval = setInterval(updateVisibility, 250);
    return () => clearInterval(interval);
  }, [groups, getCurrentTimeMs, isPaused]);

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
            />
          ))}
      </div>
    </div>
  );
}
