import { useEffect, useMemo, useState } from "react";
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

      {/* Debug: Visual Hit Zone (Matching IntersectionObserver rootMargin: -99% 0px 0px 0px) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1%",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          borderTop: "1px solid rgba(255, 0, 0, 0.4)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    </div>
  );
}
