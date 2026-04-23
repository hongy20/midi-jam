import { useEffect, useState } from "react";

import { getVisibleSegmentIndexes, LANE_SCROLL_DURATION_MS } from "@/features/midi-assets";
import { type MidiNoteGroup } from "@/shared/types/midi";

import { LaneSegment } from "./lane-segment";

interface LaneStageProps {
  groups: MidiNoteGroup[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  getCurrentTimeMs: () => number;
  noteClassName?: string;
  children?: React.ReactNode;
}

export function LaneStage({
  groups,
  scrollRef,
  getCurrentTimeMs,
  noteClassName,
  children,
}: LaneStageProps) {
  const [renderIndexes, setRenderIndexes] = useState<number[]>(() =>
    getVisibleSegmentIndexes(getCurrentTimeMs(), groups, LANE_SCROLL_DURATION_MS),
  );

  // Poll current time to drive React-level mount/unmount decisions
  useEffect(() => {
    const interval = setInterval(() => {
      const timeMs = getCurrentTimeMs();
      const indexes = getVisibleSegmentIndexes(timeMs, groups, LANE_SCROLL_DURATION_MS);
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
      {children}

      <div ref={scrollRef} className="absolute inset-0 overflow-hidden">
        {renderIndexes.map((idx) => (
          <LaneSegment
            key={idx}
            group={groups[idx]}
            getCurrentTimeMs={getCurrentTimeMs}
            noteClassName={noteClassName}
          />
        ))}
      </div>
    </div>
  );
}
