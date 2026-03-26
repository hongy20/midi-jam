import { useEffect, useLayoutEffect, useState } from "react";
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
  const [visibleIndexes, setVisibleIndexes] = useState<number[]>([]);

  // Manage visibility and hydration guard purely on the client.
  useEffect(() => {
    let rafId: number;
    const updateVisibility = () => {
      const timeMs = getCurrentTimeMs();
      const indexes = getVisibleSegmentIndexes(
        timeMs,
        groups,
        LANE_SCROLL_DURATION_MS,
      );
      setVisibleIndexes(indexes);
      rafId = requestAnimationFrame(updateVisibility);
    };

    // Initial calculation on mount
    updateVisibility();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [groups, getCurrentTimeMs]);

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

      const group1 = groups[Number(idx1)];
      const group2 = groups[Number(idx2)];

      // Log the temporal data for the groups being measured
      console.log(`[LaneStage] Measuring groups. Group ${idx1}: start=${group1.startMs}, duration=${group1.durationMs}. Group ${idx2}: start=${group2.startMs}, duration=${group2.durationMs}.`);
      console.log(`[LaneStage] Temporal Adjacency Check: group[${idx1}].endMs (${group1.startMs + group1.durationMs}) vs group[${idx2}].startMs (${group2.startMs})`);


      const rect1 = el1.getBoundingClientRect();
      const rect2 = el2.getBoundingClientRect();

      // Log with full precision
      console.log(
        `[LaneStage] Visuals for group ${idx1}: top=${rect1.top}, bottom=${rect1.bottom}, height=${rect1.height}`
      );
      console.log(
        `[LaneStage] Visuals for group ${idx2}: top=${rect2.top}, bottom=${rect2.bottom}, height=${rect2.height}`
      );
      console.log(
        `[LaneStage] GAP CHECK (rect1.top - rect2.bottom): [${rect1.top - rect2.bottom}]`
      );
    }
  }, [visibleIndexes, scrollRef]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-background/5">
      <BackgroundLane />

      <div ref={scrollRef} className="absolute inset-0 overflow-hidden">
        {visibleIndexes.map((idx) => (
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
