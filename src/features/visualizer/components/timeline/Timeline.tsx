import { useEffect, useState } from "react";

import { type MidiNoteGroup } from "@/shared/types/midi";

import { LANE_SCROLL_DURATION_MS } from "../../lib/constants";
import { getVisibleSegmentIndexes } from "../../lib/utils";
import { TimelineSegment } from "./TimelineSegment";

export interface TimelineProps {
  groups: MidiNoteGroup[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  getCurrentTimeMs: () => number;
  noteClassName?: string;
  children?: React.ReactNode;
}

export function Timeline({
  groups,
  scrollRef,
  getCurrentTimeMs,
  noteClassName,
  children,
}: TimelineProps) {
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
    <div className="bg-background/5 relative h-full w-full overflow-hidden">
      {children}

      <div ref={scrollRef} className="absolute inset-0 overflow-hidden">
        {renderIndexes.map((idx) => (
          <TimelineSegment
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
