"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDemoPlayback } from "@/hooks/use-demo-playback";
import { getNoteUnitOffset, isBlackKey } from "@/lib/device/piano";
import {
  getLaneHeight,
  getNoteLayout,
  LANE_PIXELS_PER_MS,
} from "@/lib/gameplay/lane-geometry";
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { BackgroundLanes } from "./background-lanes";

interface LaneStageProps {
  spans: NoteSpan[];
  totalDurationMs: number;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  demoMode: boolean;
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
  rangeStart?: number;
  rangeEnd?: number;
}

export function LaneStage({
  spans,
  totalDurationMs,
  scrollRef,
  demoMode,
  onNoteOn = () => { },
  onNoteOff = () => { },
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: LaneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { height: viewportHeight } = dimensions;
  const targetY = viewportHeight - 1; // Target line at the very bottom

  const laneHeight = useMemo(() => {
    if (viewportHeight === 0) return 0;
    return getLaneHeight(totalDurationMs, viewportHeight);
  }, [totalDurationMs, viewportHeight]);

  const maxScroll = totalDurationMs * LANE_PIXELS_PER_MS;

  useDemoPlayback({
    containerRef: scrollRef,
    demoMode,
    onNoteOn,
    onNoteOff,
  });

  const visibleNotes = useMemo(() => {
    const notes = [];
    for (let n = rangeStart; n <= rangeEnd; n++) {
      notes.push(n);
    }
    return notes;
  }, [rangeStart, rangeEnd]);

  const startUnit = getNoteUnitOffset(rangeStart);
  const endUnit = getNoteUnitOffset(rangeEnd) + (isBlackKey(rangeEnd) ? 2 : 3);
  const visibleUnits = endUnit - startUnit;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-background/5`}
      style={
        {
          "--piano-start-unit": startUnit,
          "--piano-visible-units": visibleUnits,
        } as React.CSSProperties
      }
    >
      <BackgroundLanes notes={visibleNotes} />

      <div
        ref={scrollRef}
        id="lane-scroll"
        className="absolute inset-0 overflow-hidden"
      >
        {/* Inner Lane */}
        <div className="relative w-full" style={{ height: `${laneHeight}px` }}>
          {spans.map((span) => {
            const { top, height } = getNoteLayout(
              span.startTime * 1000,
              (span.startTime + span.duration) * 1000,
              targetY,
              maxScroll,
            );

            return (
              <div
                key={span.id}
                data-pitch={span.note}
                data-note-id={span.id}
                className={`absolute rounded-sm border border-foreground/20 shadow-sm transition-opacity duration-300 ${span.isBlack
                  ? "bg-foreground/40 z-10"
                  : "bg-foreground/20 z-0"
                  }`}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  left: `calc((${getNoteUnitOffset(span.note)} - var(--piano-start-unit)) / var(--piano-visible-units) * 100%)`,
                  width: `calc(${span.isBlack ? 2 : 3} / var(--piano-visible-units) * 100%)`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Target Line (Fixed) */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-foreground/40 shadow-[0_0_10px_rgba(255,255,255,0.2)] z-20 pointer-events-none" />
    </div>
  );
}
