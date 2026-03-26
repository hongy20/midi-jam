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
}

export function LaneStage({
  groups,
  scrollRef,
  getCurrentTimeMs,
}: LaneStageProps) {
  const [renderIndexes, setRenderIndexes] = useState<number[]>(() =>
    getVisibleSegmentIndexes(
      getCurrentTimeMs(),
      groups,
      LANE_SCROLL_DURATION_MS,
    ),
  );

  // Poll current time to drive React-level mount/unmount decisions
  useEffect(() => {
    const interval = setInterval(() => {
      const timeMs = getCurrentTimeMs();
      const indexes = getVisibleSegmentIndexes(
        timeMs,
        groups,
        LANE_SCROLL_DURATION_MS,
      );
      setRenderIndexes((prev) => {
        if (prev.join() === indexes.join()) {
          return prev;
        }
        return indexes;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [getCurrentTimeMs, groups]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-background/5">
      <BackgroundLane />

      <div ref={scrollRef} className="absolute inset-0 overflow-hidden">
        {renderIndexes.map((idx) => (
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
