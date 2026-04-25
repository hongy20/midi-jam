import { useEffect, useState } from "react";

import { type MidiNoteGroup } from "@/shared/types/midi";

export interface NoteHighwayProps {
  groups: MidiNoteGroup[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  getCurrentTimeMs: () => number;
  noteClassName?: string;
  children?: React.ReactNode;
  speed: number;
}

import { LANE_SCROLL_DURATION_MS } from "../../lib/constants";
import { getVisibleSegmentIndexes } from "../../lib/utils";
import { NoteHighwaySegment } from "./NoteHighwaySegment";

export function NoteHighway({
  groups,
  scrollRef,
  getCurrentTimeMs,
  noteClassName,
  children,
  speed,
}: NoteHighwayProps) {
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
    <div
      className="bg-background/5 relative h-full w-full overflow-hidden"
      style={
        {
          "--lane-scroll-duration-ms": LANE_SCROLL_DURATION_MS,
          "--speed": speed,
        } as React.CSSProperties
      }
    >
      {children}

      <div ref={scrollRef} className="absolute inset-0 overflow-hidden">
        {renderIndexes.map((idx) => (
          <NoteHighwaySegment
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
